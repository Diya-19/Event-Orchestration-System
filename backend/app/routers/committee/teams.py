import uuid
import random
from collections import defaultdict
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.db import get_db
from app.auth import require_committee
from app.models import Team, TeamMember, Participant, Event, ActivityLog, EventTeamSettings
from pydantic import BaseModel

router = APIRouter()

def _serialize_team(team: Team, db: Session) -> dict:
    members = db.execute(select(TeamMember).where(TeamMember.team_id == team.id)).scalars().all()
    return {
        "id": str(team.id),
        "event_id": str(team.event_id),
        "name": team.name,
        "challenge": team.challenge,
        "rationale": team.rationale,
        "final_score": float(team.final_score) if team.final_score else None,
        "rank": team.rank,
        "status": team.status,
        "created_at": team.created_at.isoformat(),
        "members": _resolve_members(members, db),
    }

def _resolve_members(members: list[TeamMember], db: Session) -> list[dict]:
    result = []
    for m in members:
        p = db.get(Participant, m.participant_id)
        if p:
            result.append({
                "participant_id": str(m.participant_id),
                "name": p.name,
                "email": p.email,
                "skills": p.skills or [],
                "role": m.role,
            })
    return result


# --- 1. GENERATE TEAMS (WITH MATCHING ALGORITHM) ---

@router.post("/generate", status_code=202)
def trigger_team_generation(
    event_id: uuid.UUID,
    method: str = "random",
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")

    existing = db.execute(select(Team).where(Team.event_id == event_id)).scalars().first()
    if existing:
        raise HTTPException(409, "Teams already generated. Clear them first.")

    if method == "ai":
        # Future LLM implementation
        # generate_teams_task.delay(str(event_id))
        return {"message": "AI Team generation queued"}

    elif method == "random":
        # --- SIMPLE MATCHING ALGORITHM ---
        settings = db.execute(select(EventTeamSettings).where(EventTeamSettings.event_id == event_id)).scalar_one_or_none()
        team_size = settings.team_size if settings else 4
        max_inst = settings.max_per_institution if settings else 2

        participants = db.execute(select(Participant).where(Participant.event_id == event_id)).scalars().all()
        unassigned = list(participants)
        random.shuffle(unassigned)

        team_number = 1
        while unassigned:
            team_members = []
            inst_counts = defaultdict(int)

            # Try to build a valid team
            for _ in range(team_size):
                valid_p = None
                for i, p in enumerate(unassigned):
                    inst = p.institution or "Unknown"
                    if inst_counts[inst] < max_inst:
                        valid_p = unassigned.pop(i)
                        break
                
                # Fallback: if we can't respect max_inst, just take the next available to ensure no one is left behind
                if not valid_p and unassigned:
                    valid_p = unassigned.pop(0)

                if valid_p:
                    team_members.append(valid_p)
                    inst_counts[valid_p.institution or "Unknown"] += 1

                if not unassigned:
                    break
            
            if team_members:
                team = Team(event_id=event_id, name=f"Team {team_number}", status="draft")
                db.add(team)
                db.flush() # Get team ID immediately
                
                for p in team_members:
                    tm = TeamMember(team_id=team.id, participant_id=p.id, role="member")
                    db.add(tm)
                
                team_number += 1
                
        db.commit()
        return {"message": "Random teams generated successfully"}


# --- 2. LIST TEAMS ---

@router.get("/")
def list_teams(
    event_id: uuid.UUID,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    q = select(Team).where(Team.event_id == event_id)
    if status:
        q = q.where(Team.status == status)
    teams = db.execute(q.order_by(Team.name)).scalars().all()
    return [_serialize_team(t, db) for t in teams]


# --- 3. FORMATION SUMMARY ---

@router.get("/summary")
def get_formation_summary(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    total_participants = db.execute(select(func.count(Participant.id)).where(Participant.event_id == event_id)).scalar()
    total_teams = db.execute(select(func.count(Team.id)).where(Team.event_id == event_id)).scalar()
    
    latest_team = db.execute(select(Team).where(Team.event_id == event_id).order_by(Team.created_at.desc())).scalars().first()
    
    settings = db.execute(select(EventTeamSettings).where(EventTeamSettings.event_id == event_id)).scalar_one_or_none()
    target_size = settings.team_size if settings else 4

    return {
        "total_participants": total_participants or 0,
        "total_teams": total_teams or 0,
        "target_team_size": target_size,
        "generated_on": latest_team.created_at.isoformat() if latest_team else None
    }


# --- 4. APPROVE TEAMS ---

class ApproveTeamsPayload(BaseModel):
    team_ids: list[str]

@router.post("/approve")
def approve_teams(
    event_id: uuid.UUID,
    body: ApproveTeamsPayload,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    if not body.team_ids:
        raise HTTPException(400, "No team IDs provided")

    # Fetch only the draft teams that match the provided IDs
    teams = db.execute(
        select(Team).where(
            Team.event_id == event_id,
            Team.status == "draft",
            Team.id.in_(body.team_ids)
        )
    ).scalars().all()
    
    if not teams:
        raise HTTPException(400, "No valid draft teams found to approve")
    
    for team in teams:
        team.status = "approved"
    
    db.commit()
    return {"message": f"{len(teams)} teams approved"}


# --- 5. CLEAR ALL TEAMS ---

@router.delete("/")
def clear_all_teams(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    teams = db.execute(select(Team).where(Team.event_id == event_id)).scalars().all()
    for team in teams:
        db.delete(team)
    
    db.commit()
    return {"message": "All teams cleared successfully"}