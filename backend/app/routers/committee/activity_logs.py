import datetime
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, and_, or_, cast
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import TEXT

from app.db import get_db
from app.auth import require_committee
from app.models import (
    ActivityLog, Participant, Submission, Evaluation, ApprovalRequest, Event,
    ScoreAnomaly, Team,
)

router = APIRouter()

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_MODULE_KEYWORDS: list[tuple[str, list[str]]] = [
    ("Submission",        ["upload", "submit", "submission", "file"]),
    ("Evaluation",        ["evaluat", "score", "feedback"]),
    ("Conflict Request",  ["conflict", "conflict_request"]),
    ("Announcement",      ["announcement", "publish", "result"]),
    ("Team",              ["team", "member", "invite"]),
]

def _infer_module(action: str) -> str:
    lower = action.lower()
    for module, keywords in _MODULE_KEYWORDS:
        if any(kw in lower for kw in keywords):
            return module
    return "Other"

def _clean_uuid_name(name: str) -> str:
    """Forcefully cleans any UUID string that sneaks through from the database JSON."""
    if not name: 
        return name
    if name.startswith("committee:"):
        return f"Admin #{name.split(':')[1][:8]}"
    if name.startswith("evaluator:"):
        return f"Judge #{name.split(':')[1][:8]}"
    if name == "committee":
        return "Admin"
    return name

def _actor_role(actor: str) -> str:
    if actor == "system":
        return "System"
    if actor.startswith("committee"):
        return "Administrator"
    if actor.startswith("evaluator:"):
        return "Judge"
    return "Participant"

def _actor_display(actor: str, db: Session) -> str:
    """Return a human-readable name for the actor."""
    if actor == "system":
        return "System"
    if actor.startswith("committee"):
        return f"Admin #{actor.split(':')[1][:8]}" if ":" in actor else "Admin"
    if actor.startswith("evaluator:"):
        return f"Judge #{actor.split(':')[1][:8]}"
    if actor.startswith("participant:"):
        raw_id = actor.split(":", 1)[1]
        try:
            p = db.get(Participant, uuid.UUID(raw_id))
            return p.name if p else f"User #{raw_id[:8]}"
        except ValueError:
            return f"User #{raw_id[:8]}"
    return actor

def _serialize_log(log: ActivityLog, db: Session) -> dict:
    details: dict = log.details or {}
    module = details.get("module") or _infer_module(log.action)
    team_name = details.get("team_name", "")
    status = details.get("status", "Completed")

    # 1. Pull the raw name, checking JSON details first, then falling back to actor column
    raw_user = details.get("user_name") or _actor_display(log.actor, db)
    
    # 2. Force it to be clean (scrubbing out the ugly UUID)
    clean_user = _clean_uuid_name(raw_user)

    # 3. Force the role to match the clean user 
    role = _actor_role(log.actor)
    if "Admin" in clean_user:
        role = "Administrator"
    elif "Judge" in clean_user:
        role = "Judge"

    return {
        "id": log.id,
        "time": log.created_at.strftime("%I:%M %p"),
        "date": log.created_at.strftime("%d %b %Y"),
        "created_at": log.created_at.isoformat(),
        "actor": log.actor,
        "user": clean_user,
        "role": role,
        "action": log.action,
        "activity": details.get("activity_label") or log.action.replace("_", " ").capitalize(),
        "team": team_name,
        "module": module,
        "details": details.get("description", ""),
        "status": status,
    }

def _actor_type_filter(actor_type: str):
    """Return a SQLAlchemy WHERE clause fragment for actor_type."""
    at = actor_type.lower()
    if at == "system":
        return ActivityLog.actor == "system"
    if at == "committee":
        return ActivityLog.actor.like("committee%")
    if at == "evaluator":
        return ActivityLog.actor.like("evaluator:%")
    if at == "participant":
        return ActivityLog.actor.like("participant:%")
    return None

# ---------------------------------------------------------------------------
# 1. GET /activity-logs  — paginated list with filters
# ---------------------------------------------------------------------------

@router.get("")
def list_activity_logs(
    event_id: uuid.UUID,
    search: Optional[str] = Query(None),
    actor_type: Optional[str] = Query(None, description="system | committee | evaluator | participant"),
    module: Optional[str] = Query(None),
    date_from: Optional[datetime.date] = Query(None),
    date_to: Optional[datetime.date] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    q = select(ActivityLog).where(ActivityLog.event_id == event_id)

    if search:
        term = f"%{search.lower()}%"
        q = q.where(
            or_(
                ActivityLog.actor.ilike(term),
                ActivityLog.action.ilike(term),
                cast(ActivityLog.details, TEXT).ilike(term),
            )
        )

    if actor_type:
        clause = _actor_type_filter(actor_type)
        if clause is not None:
            q = q.where(clause)

    if module:
        # module is stored in details->>'module' or inferred; filter by action keywords
        keywords = next(
            (kws for m, kws in _MODULE_KEYWORDS if m.lower() == module.lower()), []
        )
        if keywords:
            q = q.where(
                or_(*(ActivityLog.action.ilike(f"%{kw}%") for kw in keywords))
            )

    if date_from:
        q = q.where(ActivityLog.created_at >= datetime.datetime.combine(date_from, datetime.time.min))
    if date_to:
        q = q.where(ActivityLog.created_at <= datetime.datetime.combine(date_to, datetime.time.max))

    total = db.execute(select(func.count()).select_from(q.subquery())).scalar_one()

    logs = (
        db.execute(q.order_by(ActivityLog.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
        .scalars()
        .all()
    )

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": max(1, (total + page_size - 1) // page_size),
        "items": [_serialize_log(log, db) for log in logs],
    }

# ---------------------------------------------------------------------------
# 2. GET /activity-logs/stats  — stat cards with 7-day trend
# ---------------------------------------------------------------------------

def _pct_change(current: int, previous: int) -> Optional[float]:
    if previous == 0:
        return None  # no comparison baseline
    return round((current - previous) / previous * 100, 1)

@router.get("/stats")
def activity_stats(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    now = datetime.datetime.utcnow()
    week_start = now - datetime.timedelta(days=7)
    prev_start  = now - datetime.timedelta(days=14)

    # --- totals (all time) ---
    total_participants = db.execute(
        select(func.count(Participant.id)).where(Participant.event_id == event_id)
    ).scalar_one()

    submissions_received = db.execute(
        select(func.count(Submission.id)).where(Submission.event_id == event_id)
    ).scalar_one()

    evaluations_completed = db.execute(
        select(func.count(Evaluation.id))
        .join(Team, Evaluation.team_id == Team.id)
        .where(and_(Team.event_id == event_id, Evaluation.submitted_at.isnot(None)))
    ).scalar_one()

    pending_requests = db.execute(
        select(func.count(ApprovalRequest.id)).where(
            and_(ApprovalRequest.event_id == event_id, ApprovalRequest.status == "pending")
        )
    ).scalar_one()

    # --- last 7 days (for trend) ---
    participants_this_week = db.execute(
        select(func.count(Participant.id)).where(
            and_(Participant.event_id == event_id, Participant.created_at >= week_start)
        )
    ).scalar_one()

    participants_prev_week = db.execute(
        select(func.count(Participant.id)).where(
            and_(
                Participant.event_id == event_id,
                Participant.created_at >= prev_start,
                Participant.created_at < week_start,
            )
        )
    ).scalar_one()

    submissions_this_week = db.execute(
        select(func.count(Submission.id)).where(
            and_(Submission.event_id == event_id, Submission.created_at >= week_start)
        )
    ).scalar_one()

    submissions_prev_week = db.execute(
        select(func.count(Submission.id)).where(
            and_(
                Submission.event_id == event_id,
                Submission.created_at >= prev_start,
                Submission.created_at < week_start,
            )
        )
    ).scalar_one()

    evals_this_week = db.execute(
        select(func.count(Evaluation.id))
        .join(Team, Evaluation.team_id == Team.id)
        .where(
            and_(
                Team.event_id == event_id,
                Evaluation.submitted_at.isnot(None),
                Evaluation.submitted_at >= week_start,
            )
        )
    ).scalar_one()

    evals_prev_week = db.execute(
        select(func.count(Evaluation.id))
        .join(Team, Evaluation.team_id == Team.id)
        .where(
            and_(
                Team.event_id == event_id,
                Evaluation.submitted_at.isnot(None),
                Evaluation.submitted_at >= prev_start,
                Evaluation.submitted_at < week_start,
            )
        )
    ).scalar_one()

    pending_this_week = db.execute(
        select(func.count(ApprovalRequest.id)).where(
            and_(
                ApprovalRequest.event_id == event_id,
                ApprovalRequest.status == "pending",
                ApprovalRequest.created_at >= week_start,
            )
        )
    ).scalar_one()

    pending_prev_week = db.execute(
        select(func.count(ApprovalRequest.id)).where(
            and_(
                ApprovalRequest.event_id == event_id,
                ApprovalRequest.status == "pending",
                ApprovalRequest.created_at >= prev_start,
                ApprovalRequest.created_at < week_start,
            )
        )
    ).scalar_one()

    return {
        "total_participants":          total_participants,
        "submissions_received":        submissions_received,
        "evaluations_completed":       evaluations_completed,
        "pending_requests":            pending_requests,
        "participants_change_pct":     _pct_change(participants_this_week,  participants_prev_week),
        "submissions_change_pct":      _pct_change(submissions_this_week,   submissions_prev_week),
        "evaluations_change_pct":      _pct_change(evals_this_week,         evals_prev_week),
        "pending_requests_change_pct": _pct_change(pending_this_week,       pending_prev_week),
    }

# ---------------------------------------------------------------------------
# 3. GET /activity-logs/summary  — today's module breakdown (donut chart)
# ---------------------------------------------------------------------------

@router.get("/summary")
def activity_summary(
    event_id: uuid.UUID,
    date: Optional[datetime.date] = Query(None, description="Defaults to today (UTC)"),
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    target = date or datetime.date.today()
    day_start = datetime.datetime.combine(target, datetime.time.min)
    day_end = datetime.datetime.combine(target, datetime.time.max)

    logs = db.execute(
        select(ActivityLog).where(
            and_(
                ActivityLog.event_id == event_id,
                ActivityLog.created_at >= day_start,
                ActivityLog.created_at <= day_end,
            )
        )
    ).scalars().all()

    counts: dict[str, int] = {}
    for log in logs:
        module = (log.details or {}).get("module") or _infer_module(log.action)
        counts[module] = counts.get(module, 0) + 1

    total = len(logs)
    breakdown = [
        {
            "module": m,
            "count": c,
            "percentage": round(c / total * 100, 1) if total else 0,
        }
        for m, c in sorted(counts.items(), key=lambda x: -x[1])
    ]

    return {
        "date": target.isoformat(),
        "total": total,
        "breakdown": breakdown,
    }

# ---------------------------------------------------------------------------
# 4. GET /activity-logs/recent-submissions  — sidebar panel
# ---------------------------------------------------------------------------

@router.get("/recent-submissions")
def recent_submissions(
    event_id: uuid.UUID,
    limit: int = Query(5, ge=1, le=50),
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    submission_keywords = [kw for m, kws in _MODULE_KEYWORDS if m == "Submission" for kw in kws]
    q = (
        select(ActivityLog)
        .where(
            and_(
                ActivityLog.event_id == event_id,
                or_(*(ActivityLog.action.ilike(f"%{kw}%") for kw in submission_keywords)),
            )
        )
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
    )

    logs = db.execute(q).scalars().all()

    return [
        {
            "id": log.id,
            "team": (log.details or {}).get("team_name", ""),
            "file": (log.details or {}).get("file_name") or log.action.replace("_", " ").capitalize(),
            "time": log.created_at.strftime("%I:%M %p"),
            "created_at": log.created_at.isoformat(),
        }
        for log in logs
    ]

# ---------------------------------------------------------------------------
# 5. GET /activity-logs/pending-reviews  — sidebar pending counts
# ---------------------------------------------------------------------------

@router.get("/pending-reviews")
def pending_reviews(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    # Score anomalies flagged but not yet resolved
    score_anomalies = db.execute(
        select(func.count(ScoreAnomaly.id))
        .join(Team, ScoreAnomaly.team_id == Team.id)
        .where(
            and_(
                Team.event_id == event_id,
                ScoreAnomaly.status == "pending",
            )
        )
    ).scalar_one()

    # Pending team-formation approval requests
    team_approvals = db.execute(
        select(func.count(ApprovalRequest.id)).where(
            and_(
                ApprovalRequest.event_id == event_id,
                ApprovalRequest.type == "team_formation",
                ApprovalRequest.status == "pending",
            )
        )
    ).scalar_one()

    # Pending communication send approval requests
    communication_approvals = db.execute(
        select(func.count(ApprovalRequest.id)).where(
            and_(
                ApprovalRequest.event_id == event_id,
                ApprovalRequest.type == "communication_send",
                ApprovalRequest.status == "pending",
            )
        )
    ).scalar_one()

    # Evaluations assigned but not yet submitted (submitted_at IS NULL)
    pending_evaluations = db.execute(
        select(func.count(Evaluation.id))
        .join(Team, Evaluation.team_id == Team.id)
        .where(
            and_(
                Team.event_id == event_id,
                Evaluation.submitted_at.is_(None),
            )
        )
    ).scalar_one()

    return {
        "score_anomalies": score_anomalies,
        "team_approvals": team_approvals,
        "communication_approvals": communication_approvals,
        "pending_evaluations": pending_evaluations,
    }