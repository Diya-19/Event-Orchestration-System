import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from datetime import datetime

from app.db import get_db
from app.auth import require_committee
from app.models import Communication, CommunicationLog, Event, ActivityLog, ApprovalRequest
from app.services.llm_service import draft_communication_template
from app.tasks.communication_tasks import draft_and_send_emails_task 

router = APIRouter()

@router.get("/stats")
def get_communication_stats(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee)
):
    # 1. Count high-level statuses from the main Communication table
    comm_stats = db.execute(
        select(Communication.status, func.count(Communication.id))
        .where(Communication.event_id == event_id)
        .group_by(Communication.status)
    ).all()
    
    # 2. Count granular delivery logs (Sent/Failed)
    log_stats = db.execute(
        select(CommunicationLog.status, func.count(CommunicationLog.id))
        .join(Communication, CommunicationLog.communication_id == Communication.id)
        .where(Communication.event_id == event_id)
        .group_by(CommunicationLog.status)
    ).all()
    
    stats = {"sent": 0, "queued": 0, "failed": 0, "scheduled": 0}

    # Map Communication status to "Queued/Scheduled"
    for status, count in comm_stats:
        if status == "pending_approval":
            stats["queued"] += count  # Show as Pending/Queued
        if status == "scheduled":
            stats["scheduled"] += count

    # Map individual logs to "Sent/Failed"
    for status, count in log_stats:
        if status == "sent":
            stats["sent"] += count
        if status in ("failed", "error"):
            stats["failed"] += count
            
    return stats


@router.get("/")
def list_communications(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee)
):
    """Populates the Recent Communications table."""
    comms = db.execute(
        select(Communication)
        .where(Communication.event_id == event_id)
        .order_by(Communication.created_at.desc())
    ).scalars().all()
    
    result = []
    for c in comms:
        # Get recipient count
        recipient_count = db.execute(
            select(func.count(CommunicationLog.id))
            .where(CommunicationLog.communication_id == c.id)
        ).scalar()
        
        result.append({
            "id": str(c.id),
            "subject": c.subject,
            "stage": c.stage,
            "audience": c.recipient_type,
            "status": c.status.replace("_", " ").title(),
            "recipients": recipient_count or 0,
            "created_at": c.created_at.isoformat()
        })
    return result


@router.post("/draft")
def draft_communication(
    event_id: uuid.UUID,
    body: dict,
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee)
):
    """Calls Gemini to draft an email and saves it as a draft in the DB."""
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")
        
    stage = body.get("stage", event.current_stage)
    recipient_type = body.get("recipient_type")
    subject = body.get("subject", f"Update regarding {event.name}")
    custom_context = body.get("context", "")

    # 1. Generate Template via Gemini
    template = draft_communication_template(
        event_name=event.name,
        stage=stage,
        recipient_type=recipient_type,
        custom_context=custom_context
    )

    # 2. Save Draft to DB
    comm = Communication(
        event_id=event_id,
        stage=stage,
        recipient_type=recipient_type,
        subject=subject,
        body_template=template,
        status="draft"
    )
    db.add(comm)
    
    db.add(ActivityLog(
        event_id=event_id, actor=actor["sub"], action="communication_drafted",
        details={"audience": recipient_type, "stage": stage}
    ))
    
    db.commit()
    db.refresh(comm)
    
    return {
        "id": str(comm.id),
        "template": comm.body_template,
        "message": "Draft generated successfully."
    }


@router.post("/{comm_id}/send", status_code=202)
def send_communication(
    event_id: uuid.UUID,
    comm_id: uuid.UUID,
    body: dict, # Allows frontend to send final edits before dispatch
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee)
):
    """Approves the draft and triggers Celery dispatch."""
    comm = db.get(Communication, comm_id)
    if not comm or comm.event_id != event_id:
        raise HTTPException(404, "Communication not found")
        
    if comm.status != "draft":
        raise HTTPException(400, "Only drafts can be sent")

    # Save any final frontend edits to the template
    if "final_template" in body:
        comm.body_template = body["final_template"]

    comm.status = "approved" 
    
    # Trigger Celery Background Task (Box 4 of Architecture)
    draft_and_send_emails_task.delay(str(comm.id))

    db.add(ActivityLog(
        event_id=event_id, actor=actor["sub"], action="emails_queued",
        details={"communication_id": str(comm.id)}
    ))
    
    db.commit()
    return {"message": "Communication queued for dispatch"}

@router.post("/{comm_id}/dispatch", status_code=202)
def dispatch_communication(
    event_id: uuid.UUID,
    comm_id: uuid.UUID,
    body: dict, 
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee)
):
    """
    body expects: 
    { 
      "final_template": "Hello {{name}}...", 
      "scheduled_for": "2025-05-12T09:00:00Z" (optional),
      "bypass_approval": false (optional admin override)
    }
    """
    comm = db.get(Communication, comm_id)
    if not comm or comm.event_id != event_id:
        raise HTTPException(404, "Communication not found")
        
    if comm.status not in ("draft", "rejected"):
        raise HTTPException(400, f"Cannot dispatch communication in '{comm.status}' state.")

    # 1. Save final template edits
    if "final_template" in body:
        comm.body_template = body["final_template"]

    # 2. Handle Scheduling
    scheduled_str = body.get("scheduled_for")
    if scheduled_str:
        comm.scheduled_for = datetime.fromisoformat(scheduled_str.replace("Z", "+00:00"))
    else:
        comm.scheduled_for = datetime.now(timezone.utc)

    # 3. The Approval Gate Logic
    # (Assuming event settings dictate approval requirements. Defaulting to True for safety.)
    event = db.get(Event, event_id)
    requires_approval = getattr(event, 'require_comm_approval', True) 
    
    # If the user is a super-admin or explicitly bypassing
    if body.get("bypass_approval") is True:
        requires_approval = False

    if requires_approval:
        # Create an approval request using your actual schema columns!
        approval = ApprovalRequest(
            event_id=event_id,
            type="communication_send",  # This perfectly matches your _DOWNSTREAM_TASKS dictionary!
            payload={"communication_id": str(comm.id)},
            status="pending"
        )
        db.add(approval)
        db.flush() # Get the new approval.id
        
        comm.approval_id = approval.id
        comm.status = "pending_approval"
        
        db.add(ActivityLog(
            event_id=event_id, actor=actor["sub"], action="communication_approval_requested",
            details={"communication_id": str(comm.id), "approval_id": str(approval.id)}
        ))
        db.commit()
        return {"message": "Communication submitted for committee approval", "status": "pending_approval"}
        
    else:
        # Direct Dispatch (No Approval Needed)
        now = datetime.now(timezone.utc)
        
        if comm.scheduled_for > now:
            comm.status = "scheduled"
            # Use Celery's 'eta' to hold the task until the scheduled time
            draft_and_send_emails_task.apply_async((str(comm.id),), eta=comm.scheduled_for)
        else:
            comm.status = "approved"
            draft_and_send_emails_task.delay(str(comm.id))

        db.add(ActivityLog(
            event_id=event_id, actor=actor["sub"], action="emails_queued",
            details={"communication_id": str(comm.id), "scheduled_for": comm.scheduled_for.isoformat()}
        ))
        db.commit()
        return {"message": "Communication queued for dispatch", "status": comm.status}