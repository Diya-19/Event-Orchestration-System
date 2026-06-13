import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.db import get_db
from app.auth import decode_token
from app.models import Evaluator, Team, TeamMember, Participant, Evaluation, ScoreAnomaly, Event

router = APIRouter()
_DEFAULT_WEIGHTS = {
        "innovation":   0.30,
    "execution":    0.30,
    "presentation": 0.20,
    "impact":       0.20,
}

def _resolve_evaluator(token: str, db: Session) -> Evaluator:
    """
    Validates evaluator portal JWT (from ?token= query param).
    sub must be 'evaluator:<uuid>'.
    """
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(401, "Invalid or expired evaluator link")
    sub = payload.get("sub", "")
    if not sub.startswith("evaluator:"):
        raise HTTPException(403, "Token is not an evaluator portal token")
    evaluator_id = uuid.UUID(sub.split(":", 1)[1])
    ev = db.get(Evaluator, evaluator_id)
    if not ev:
        raise HTTPException(404, "Evaluator not found")
    return ev
def _flag_anomaly_if_needed(
        db: Session,
    evaluation: Evaluation,
    dimension: str,
    score: float,
    threshold: float = 2.0,
):
    """
    Compares score against panel average for this dimension/team.
    Called inline after flush (before commit) so evaluation.id is assigned.
    """
    panel_scores = db.execute(
            select(Evaluation.scores)
        .join(Team, Evaluation.team_id == Team.id)
        .where(
                Evaluation.team_id == evaluation.team_id,
            Evaluation.id != evaluation.id,
        )
    ).scalars().all()
    dim_values = [
            float(s[dimension])
        for s in panel_scores
        if s and dimension in s
    ]
    if not dim_values:
        return  # No other evaluations yet — nothing to compare
    panel_avg = sum(dim_values) / len(dim_values)
    deviation = abs(score - panel_avg)
    if deviation > threshold:
        db.add(ScoreAnomaly(
            evaluation_id=evaluation.id,
            dimension=dimension,
            flagged_score=score,
            panel_average=panel_avg,
            deviation=deviation,
            status="pending",
        ))
@router.get("/assignments")
def get_assignments(
    token: str,
    db: Session = Depends(get_db),
):
    """
    Returns all teams the evaluator must score, with their assessment guide
    and any already-submitted scores.
    """
    evaluator = _resolve_evaluator(token, db)
    event = db.get(Event, evaluator.event_id)
    if not event:
        raise HTTPException(404, "Event not found")
    teams = db.execute(
        select(Team).where(Team.event_id == evaluator.event_id)
    ).scalars().all()
    result = []
    for team in teams:
        existing = db.execute(
            select(Evaluation).where(
                Evaluation.team_id == team.id,
                Evaluation.evaluator_id == evaluator.id,
            )
        ).scalar_one_or_none()
        members = db.execute(
            select(TeamMember).where(TeamMember.team_id == team.id)
        ).scalars().all()
        member_names = []
        for m in members:
            p = db.get(Participant, m.participant_id)
            if p:
                member_names.append(p.name)
        result.append({
            "team_id": str(team.id),
            "team_name": team.name,
            "challenge": team.challenge,
            "members": member_names,
            "assessment_guide": existing.assessment_guide if existing else None,
            "submitted": existing is not None,
            "submitted_at": existing.submitted_at.isoformat() if existing and existing.submitted_at else None,
            "scores": existing.scores if existing else None,
            "overall": float(existing.overall) if existing and existing.overall else None,
        })
    return {
        "evaluator": {"id": str(evaluator.id), "name": evaluator.name, "expertise": evaluator.expertise},
        "event": {"name": event.name, "current_stage": event.current_stage},
        "assignments": result,
    }
@router.post("/scores/{team_id}", status_code=201)
def submit_scores(
    team_id: uuid.UUID,
    token: str,
    body: dict,
    db: Session = Depends(get_db),
):
    """
    body: { scores: { innovation, execution, presentation, impact }, notes?: str }
    Weighted overall = sum(score * weight) for each dimension.
    Flags anomalies inline before commit.
    """
    evaluator = _resolve_evaluator(token, db)
    team = db.get(Team, team_id)
    if not team or team.event_id != evaluator.event_id:
        raise HTTPException(404, "Team not found")
    existing = db.execute(
        select(Evaluation).where(
            Evaluation.team_id == team_id,
            Evaluation.evaluator_id == evaluator.id,
        )
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(409, "Scores already submitted for this team. Contact the committee to request a change.")
    scores = body.get("scores", {})
    required_dims = list(_DEFAULT_WEIGHTS.keys())
    for dim in required_dims:
        val = scores.get(dim)
        if val is None:
            raise HTTPException(422, f"Missing score for dimension '{dim}'")
        if not (1 <= float(val) <= 10):
            raise HTTPException(422, f"Score for '{dim}' must be between 1 and 10")
    event = db.get(Event, evaluator.event_id)
    weights = (event.config or {}).get("score_weights", _DEFAULT_WEIGHTS) if event else _DEFAULT_WEIGHTS
    overall = sum(float(scores[d]) * weights.get(d, 0.25) for d in required_dims)
    evaluation = Evaluation(
        team_id=team_id,
        evaluator_id=evaluator.id,
        scores={d: float(scores[d]) for d in required_dims},
        overall=round(overall, 2),
        submitted_at=datetime.datetime.utcnow(),
        notes=body.get("notes"),
    )
    db.add(evaluation)
    db.flush()  # Assigns evaluation.id before anomaly check
    for dim in required_dims:
        _flag_anomaly_if_needed(db, evaluation, dim, float(scores[dim]))
    db.commit()
    return {
        "message": "Scores submitted successfully",
        "overall": float(evaluation.overall),
        "team_id": str(team_id),
    }
    
@router.get("/scores/{team_id}")
def get_submitted_scores(
    team_id: uuid.UUID,
    token: str,
    db: Session = Depends(get_db),
):
    evaluator = _resolve_evaluator(token, db)
    evaluation = db.execute(
        select(Evaluation).where(
            Evaluation.team_id == team_id,
            Evaluation.evaluator_id == evaluator.id,
        )
    ).scalar_one_or_none()
    if not evaluation:
        raise HTTPException(404, "No submission found for this team")
    return {
        "team_id": str(team_id),
        "scores": evaluation.scores,
        "overall": float(evaluation.overall) if evaluation.overall else None,
        "notes": evaluation.notes,
        "submitted_at": evaluation.submitted_at.isoformat() if evaluation.submitted_at else None,
    }
