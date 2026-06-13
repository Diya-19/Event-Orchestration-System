import uuid
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.db import get_db
from app.auth import require_committee
from app.models import Evaluation, ScoreAnomaly, Team, Evaluator, Event, ActivityLog
from app.tasks.consolidate_scores_task import consolidate_scores_task
from app.websocket_manager import manager

router = APIRouter()

@router.get("/")
def list_scores(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    total_evaluators = db.execute(
        select(func.count(Evaluator.id)).where(Evaluator.event_id == event_id)
    ).scalar() or 0

    teams = db.execute(select(Team).where(Team.event_id == event_id)).scalars().all()
    result = []

    for team in teams:
        evals = db.execute(
            select(Evaluation).where(Evaluation.team_id == team.id)
        ).scalars().all()

        evaluations_list = [
            {
                "evaluator_id": str(e.evaluator_id),
                "overall": float(e.overall) if e.overall else None,
                "scores": e.scores,
                "submitted_at": e.submitted_at.isoformat() if e.submitted_at else None,
            }
            for e in evals
        ]

        while len(evaluations_list) < total_evaluators:
            evaluations_list.append({
                "evaluator_id": "",
                "overall": None,
                "scores": {},
                "submitted_at": None
            })

        result.append({
            "team_id": str(team.id),
            "team_name": team.name,
            "challenge": team.challenge,
            "evaluations": evaluations_list,
            "final_score": float(team.final_score) if team.final_score else None,
            "rank": team.rank,
        })

    return result


@router.get("/anomalies")
def list_anomalies(
    event_id: uuid.UUID,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    q = (
        select(ScoreAnomaly)
        .join(Evaluation, ScoreAnomaly.evaluation_id == Evaluation.id)
        .join(Team, Evaluation.team_id == Team.id)
        .where(Team.event_id == event_id)
    )

    if status:
        q = q.where(ScoreAnomaly.status == status)

    anomalies = db.execute(q.order_by(ScoreAnomaly.created_at.desc())).scalars().all()

    return [
        {
            "id": str(a.id),
            "evaluation_id": str(a.evaluation_id),
            "dimension": a.dimension,
            "flagged_score": float(a.flagged_score),
            "panel_average": float(a.panel_average),
            "deviation": float(a.deviation),
            "status": a.status,
            "resolution": a.resolution,
            "created_at": a.created_at.isoformat(),
        }
        for a in anomalies
    ]


@router.post("/anomalies/{anomaly_id}/resolve")
def resolve_anomaly(
    event_id: uuid.UUID,
    anomaly_id: uuid.UUID,
    body: dict,
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee),
):
    anomaly = db.get(ScoreAnomaly, anomaly_id)
    if not anomaly:
        raise HTTPException(404, "Anomaly not found")

    if anomaly.status != "pending":
        raise HTTPException(400, "Anomaly already resolved")

    action = body.get("action")
    if action not in ("keep", "override", "re_evaluate"):
        raise HTTPException(422, "action must be 'keep', 'override', or 're_evaluate'")

    if action == "override":
        override_val = body.get("override_value")
        if override_val is None:
            raise HTTPException(422, "override_value required for override action")

        evaluation = db.get(Evaluation, anomaly.evaluation_id)
        if evaluation:
            if anomaly.dimension == "overall":
                evaluation.overall = float(override_val)
            else:
                scores = dict(evaluation.scores or {})
                scores[anomaly.dimension] = float(override_val)
                evaluation.scores = scores

    anomaly.status = "resolved"
    anomaly.resolution = action
    anomaly.resolved_by = actor["sub"] 
    anomaly.resolved_at = datetime.datetime.utcnow()

    db.add(ActivityLog(
        event_id=event_id,
        actor=actor["sub"],
        action="anomaly_resolved",
        details={"anomaly_id": str(anomaly_id), "action": action},
    ))

    db.commit()
    return {"message": f"Anomaly resolved via '{action}'", "anomaly_id": str(anomaly_id)}


@router.post("/consolidate")
def consolidate_scores(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")

    pending_anomalies = db.execute(
        select(func.count(ScoreAnomaly.id))
        .join(Evaluation, ScoreAnomaly.evaluation_id == Evaluation.id)
        .join(Team, Evaluation.team_id == Team.id)
        .where(Team.event_id == event_id, ScoreAnomaly.status == "pending")
    ).scalar()

    if pending_anomalies > 0:
        raise HTTPException(
            400,
            f"Cannot consolidate: {pending_anomalies} unresolved score anomaly(ies) exist. "
            "Resolve all anomalies before consolidating.",
        )

    consolidate_scores_task.delay(str(event_id))

    db.add(ActivityLog(
        event_id=event_id,
        actor=actor["sub"],
        action="scores_consolidation_queued",
        details={},
    ))

    db.commit()
    return {"message": "Score consolidation queued", "event_id": str(event_id)}

@router.get("/leaderboard")
def get_leaderboard(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    # Fetch teams that have a calculated final score, ordered by rank (1st to last)
    teams = db.execute(
        select(Team)
        .where(Team.event_id == event_id, Team.final_score.isnot(None))
        .order_by(Team.rank.asc())
    ).scalars().all()

    return [
        {
            "team_id": str(t.id),
            "team_name": t.name,
            "final_score": float(t.final_score),
            "rank": t.rank,
        }
        for t in teams
    ]
    
@router.post("/broadcast-consolidation")
async def trigger_consolidation_broadcast(event_id: uuid.UUID):
    """
    Internal webhook called by Celery to trigger the websocket broadcast 
    from the main FastAPI memory space.
    """
    await manager.broadcast_to_event(
        str(event_id), 
        {"event": "SCORES_CONSOLIDATED", "message": "Leaderboard is ready!"}
    )
    return {"status": "broadcast_sent"}