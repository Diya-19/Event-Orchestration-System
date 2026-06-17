import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.auth import require_committee
from app.db import get_db
from app.models import (
    Event,
    Participant,
    Team,
    Evaluation,
    Submission,
    ApprovalRequest,
    ScoreAnomaly,
    Communication,
    ActivityLog,
)

router = APIRouter()

PIPELINE_STAGES = [
    "setup",
    "registration_open",
    "registration_closed",
    "teams_pending",
    "teams_approved",
    "challenge_assigned",
    "evaluation_open",
    "scores_consolidated",
    "results_published",
    "completed",
]


def _stage_status(current: str, stage: str) -> str:
    try:
        ci = PIPELINE_STAGES.index(current)
        si = PIPELINE_STAGES.index(stage)
    except ValueError:
        return "pending"

    if si < ci:
        return "completed"
    if si == ci:
        return "active"
    return "pending"


@router.get("/dashboard")
def dashboard_snapshot(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    event = db.get(Event, event_id)

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    pipeline = [
        {
            "stage": stage,
            "status": _stage_status(event.current_stage, stage),
        }
        for stage in PIPELINE_STAGES
    ]

    pending_approvals = db.execute(
        select(func.count(ApprovalRequest.id)).where(
            ApprovalRequest.event_id == event_id,
            ApprovalRequest.status == "pending",
        )
    ).scalar()

    open_anomalies = db.execute(
    select(func.count(ScoreAnomaly.id))
    .join(Team, ScoreAnomaly.team_id == Team.id)
    .where(
        Team.event_id == event_id,
        ScoreAnomaly.status == "pending"
    )
    ).scalar()

    total_teams = db.execute(
        select(func.count(Team.id))
        .where(Team.event_id == event_id)
    ).scalar()

    registered_participants = db.execute(
        select(func.count(Participant.id))
        .where(Participant.event_id == event_id)
    ).scalar()

    submission_count = db.execute(
        select(func.count(Submission.id))
        .where(Submission.event_id == event_id)
    ).scalar()

    evaluation_count = db.execute(
        select(func.count(Evaluation.id))
        .join(Team, Evaluation.team_id == Team.id)
        .where(Team.event_id == event_id)
    ).scalar()

    teams_evaluated = db.execute(
        select(func.count(func.distinct(Evaluation.team_id)))
        .join(Team, Evaluation.team_id == Team.id)
        .where(Team.event_id == event_id)
    ).scalar()

    top_teams = db.execute(
        select(Team)
        .where(
            Team.event_id == event_id,
            Team.rank.isnot(None),
        )
        .order_by(Team.rank)
        .limit(5)
    ).scalars().all()

    return {
        "event": {
            "name": event.name,
            "current_stage": event.current_stage,
        },
        "total_teams": total_teams,
        "registered_participants": registered_participants,
        "submissions": submission_count,
        "evaluations_completed": evaluation_count,
        "pipeline": pipeline,
        "pending_approvals": pending_approvals,
        "anomalies_open": open_anomalies,
        "evaluation_progress": {
            "submitted": teams_evaluated,
            "total": total_teams,
        },
        "leaderboard_preview": [
            {
                "id": str(team.id),
                "name": team.name,
                "rank": team.rank,
                "final_score": (
                    float(team.final_score)
                    if team.final_score
                    else None
                ),
            }
            for team in top_teams
        ],
    }