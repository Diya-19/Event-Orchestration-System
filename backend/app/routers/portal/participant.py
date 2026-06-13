import uuid

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from sqlalchemy import select

from app.db import get_db

from app.auth import decode_token

from app.models import Participant, Team, TeamMember, Event, ActivityLog

router = APIRouter()


def _resolve_participant(token: str, db: Session) -> Participant:

    """

    Validates portal JWT (from ?token= query param, passed as Bearer).

    sub must be 'participant:<uuid>'.

    """

    try:

        payload = decode_token(token)

    except Exception:

        raise HTTPException(401, "Invalid or expired portal link")

    sub = payload.get("sub", "")

    if not sub.startswith("participant:"):

        raise HTTPException(403, "Token is not a participant portal token")

    participant_id = uuid.UUID(sub.split(":", 1)[1])

    p = db.get(Participant, participant_id)

    if not p:

        raise HTTPException(404, "Participant not found")

    return p


@router.get("/status")

def participant_status(

    token: str,

    db: Session = Depends(get_db),

):

    """

    Query param: ?token=<jwt>

    Returns participant info, team assignment, event pipeline stage.

    """

    participant = _resolve_participant(token, db)

    membership = db.execute(

        select(TeamMember).where(TeamMember.participant_id == participant.id)

    ).scalar_one_or_none()

    team_data = None

    event_data = None

    if membership:

        team = db.get(Team, membership.team_id)

        if team:

            event = db.get(Event, team.event_id)

            team_data = {

                "id": str(team.id),

                "name": team.name,

                "challenge": team.challenge,

                "status": team.status,

            }

            if event:

                event_data = {

                    "name": event.name,

                    "current_stage": event.current_stage,

                    "config": event.config,

                }

    return {

        "participant": {

            "id": str(participant.id),

            "name": participant.name,

            "email": participant.email,

            "skills": participant.skills or [],

            "registration_status": participant.registration_status,

        },

        "team": team_data,

        "event": event_data,

    }


@router.post("/progression/confirm")

def confirm_progression(

    token: str,

    db: Session = Depends(get_db),

):

    """

    Participant confirms they want to progress to the next round.

    Only valid in stage 'completed'.

    """

    participant = _resolve_participant(token, db)

    membership = db.execute(

        select(TeamMember).where(TeamMember.participant_id == participant.id)

    ).scalar_one_or_none()

    if not membership:

        raise HTTPException(400, "You are not assigned to a team")

    team = db.get(Team, membership.team_id)

    if not team:

        raise HTTPException(404, "Team not found")

    event = db.get(Event, team.event_id)

    if not event or event.current_stage != "completed":

        raise HTTPException(400, "Progression confirmation is only available after results are published")

    db.add(ActivityLog(

        event_id=team.event_id,

        actor=f"participant:{participant.id}",

        action="progression_confirmed",

        details={"participant_id": str(participant.id), "team_id": str(team.id)},

    ))

    db.commit()

    return {"message": "Progression confirmed. You will be contacted with next steps."}
