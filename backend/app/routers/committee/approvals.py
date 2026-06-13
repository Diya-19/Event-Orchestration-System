import uuid

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from sqlalchemy import select

from app.db import get_db

from app.auth import require_committee

from app.models import ApprovalRequest, ActivityLog

from app.tasks.communication_tasks import draft_and_send_emails_task
from app.tasks.event_workflow_tasks import send_welcome_emails_task, send_progression_invitations_task, publish_results_task

router = APIRouter()

_DOWNSTREAM_LABEL = {

    "team_formation":          "Team formation approved — welcome emails queued",

    "communication_send":      "Communication approved — delivery queued",

    "results_publish":         "Results publication approved — leaderboard unlocked",

    "progression_invitations": "Progression invitations approved — emails queued",

    "anomaly_resolution":      "Anomaly resolution approved",

}

_DOWNSTREAM_TASKS = {
    "team_formation":          send_welcome_emails_task,
    "communication_send":      draft_and_send_emails_task,
    "progression_invitations": send_progression_invitations_task,
    "results_publish":         publish_results_task,
}

def _serialize(a: ApprovalRequest) -> dict:

    return {

        "id": str(a.id),

        "event_id": str(a.event_id),

        "type": a.type,

        "payload": a.payload,

        "status": a.status,

        "approved_by": a.approved_by,

        "decision_at": a.decision_at.isoformat() if a.decision_at else None,

        "notes": a.notes,

        "created_at": a.created_at.isoformat(),

    }


def _get_pending(db: Session, event_id: uuid.UUID) -> list[ApprovalRequest]:

    return db.execute(

        select(ApprovalRequest)

        .where(ApprovalRequest.event_id == event_id, ApprovalRequest.status == "pending")

        .order_by(ApprovalRequest.created_at)

    ).scalars().all()


@router.get("/")

def list_approvals(

    event_id: uuid.UUID,

    status: Optional[str] = None,

    db: Session = Depends(get_db),

    _: dict = Depends(require_committee),

):

    q = select(ApprovalRequest).where(ApprovalRequest.event_id == event_id)

    if status:

        q = q.where(ApprovalRequest.status == status)

    rows = db.execute(q.order_by(ApprovalRequest.created_at.desc())).scalars().all()

    return [_serialize(r) for r in rows]


@router.get("/{approval_id}")

def get_approval(

    event_id: uuid.UUID,

    approval_id: uuid.UUID,

    db: Session = Depends(get_db),

    _: dict = Depends(require_committee),

):

    a = db.get(ApprovalRequest, approval_id)

    if not a or a.event_id != event_id:

        raise HTTPException(404, "Approval not found")

    return _serialize(a)


@router.post("/{approval_id}/approve")

def approve(

    event_id: uuid.UUID,

    approval_id: uuid.UUID,

    body: dict = {},

    db: Session = Depends(get_db),

    actor: dict = Depends(require_committee),

):

    import datetime

    a = db.get(ApprovalRequest, approval_id)

    if not a or a.event_id != event_id:

        raise HTTPException(404, "Approval not found")

    if a.status != "pending":

        raise HTTPException(400, f"Approval already '{a.status}'")

    a.status = "approved"

    a.approved_by = actor["sub"]

    a.decision_at = datetime.datetime.utcnow()

    a.notes = body.get("notes")

    task_fn = _DOWNSTREAM_TASKS.get(a.type)

    if task_fn:

        task_fn.delay(str(event_id), str(approval_id))

    db.add(ActivityLog(

        event_id=event_id,

        actor=actor["sub"],

        action="approval_approved",

        details={"approval_id": str(approval_id), "type": a.type},

    ))

    db.commit()

    return {"message": _DOWNSTREAM_LABEL.get(a.type, "Approved"), "approval": _serialize(a)}


@router.post("/{approval_id}/reject")

def reject(

    event_id: uuid.UUID,

    approval_id: uuid.UUID,

    body: dict,

    db: Session = Depends(get_db),

    actor: dict = Depends(require_committee),

):

    import datetime

    a = db.get(ApprovalRequest, approval_id)

    if not a or a.event_id != event_id:

        raise HTTPException(404, "Approval not found")

    if a.status != "pending":

        raise HTTPException(400, f"Approval already '{a.status}'")

    if not body.get("notes"):

        raise HTTPException(422, "Rejection notes are required")

    a.status = "rejected"

    a.approved_by = actor["sub"]

    a.decision_at = datetime.datetime.utcnow()

    a.notes = body["notes"]

    db.add(ActivityLog(

        event_id=event_id,

        actor=actor["sub"],

        action="approval_rejected",

        details={"approval_id": str(approval_id), "type": a.type, "notes": a.notes},

    ))

    db.commit()

    return {"message": "Rejected", "approval": _serialize(a)}
