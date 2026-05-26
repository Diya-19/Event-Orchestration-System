import uuid

from fastapi import APIRouter, Depends, HTTPException, Query

from sqlalchemy.orm import Session

from sqlalchemy import select, func

from app.db import get_db

from app.auth import require_committee

from app.models import (

    Event, Participant, Team, Evaluation, ApprovalRequest,

    ScoreAnomaly, Communication, ActivityLog,

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

        raise HTTPException(404, "Event not found")

    pipeline = [

        {"stage": s, "status": _stage_status(event.current_stage, s)}

        for s in PIPELINE_STAGES

    ]

    pending_approvals = db.execute(

        select(func.count(ApprovalRequest.id)).where(

            ApprovalRequest.event_id == event_id,

            ApprovalRequest.status == "pending",

        )

    ).scalar()

    open_anomalies = db.execute(

        select(func.count(ScoreAnomaly.id))

        .join(Evaluation, ScoreAnomaly.evaluation_id == Evaluation.id)

        .join(Team, Evaluation.team_id == Team.id)

        .where(Team.event_id == event_id, ScoreAnomaly.status == "pending")

    ).scalar()

    total_teams = db.execute(

        select(func.count(Team.id)).where(Team.event_id == event_id)

    ).scalar()

    teams_evaluated = db.execute(

        select(func.count(func.distinct(Evaluation.team_id)))

        .join(Team, Evaluation.team_id == Team.id)

        .where(Team.event_id == event_id)

    ).scalar()

    top_teams = db.execute(

        select(Team)

        .where(Team.event_id == event_id, Team.rank.isnot(None))

        .order_by(Team.rank)

        .limit(5)

    ).scalars().all()

    return {

        "event": {"name": event.name, "current_stage": event.current_stage},

        "pipeline": pipeline,

        "pending_approvals": pending_approvals,

        "anomalies_open": open_anomalies,

        "evaluation_progress": {"submitted": teams_evaluated, "total": total_teams},

        "leaderboard_preview": [

            {

                "id": str(t.id),

                "name": t.name,

                "rank": t.rank,

                "final_score": float(t.final_score) if t.final_score else None,

            }

            for t in top_teams

        ],

    }


@router.get("/leaderboard")

def leaderboard(

    event_id: uuid.UUID,

    db: Session = Depends(get_db),

    _: dict = Depends(require_committee),

):

    teams = db.execute(

        select(Team)

        .where(Team.event_id == event_id, Team.rank.isnot(None))

        .order_by(Team.rank)

    ).scalars().all()

    result = []

    for team in teams:

        evals = db.execute(

            select(Evaluation).where(Evaluation.team_id == team.id)

        ).scalars().all()

        # Aggregate per-dimension means across all evaluators

        dim_totals: dict[str, list[float]] = {}

        for ev in evals:

            for dim, score in (ev.scores or {}).items():

                dim_totals.setdefault(dim, []).append(float(score))

        score_breakdown = {dim: round(sum(v) / len(v), 2) for dim, v in dim_totals.items()}

        result.append({

            "id": str(team.id),

            "name": team.name,

            "challenge": team.challenge,

            "rank": team.rank,

            "final_score": float(team.final_score) if team.final_score else None,

            "score_breakdown": score_breakdown,

            "evaluator_count": len(evals),

        })

    return result


@router.get("/activity")

def activity_log(

    event_id: uuid.UUID,

    page: int = Query(1, ge=1),

    per_page: int = Query(25, ge=1, le=100),

    db: Session = Depends(get_db),

    _: dict = Depends(require_committee),

):

    offset = (page - 1) * per_page

    total = db.execute(

        select(func.count(ActivityLog.id)).where(ActivityLog.event_id == event_id)

    ).scalar()

    rows = db.execute(

        select(ActivityLog)

        .where(ActivityLog.event_id == event_id)

        .order_by(ActivityLog.created_at.desc())

        .offset(offset)

        .limit(per_page)

    ).scalars().all()

    return {

        "total": total,

        "page": page,

        "per_page": per_page,

        "items": [

            {

                "id": str(r.id),

                "actor": r.actor,

                "action": r.action,

                "details": r.details,

                "created_at": r.created_at.isoformat(),

            }

            for r in rows

        ],}
