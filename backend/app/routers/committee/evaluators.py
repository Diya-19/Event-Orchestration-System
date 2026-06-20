import uuid
import secrets
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db import get_db
from app.auth import require_committee
from app.models import Evaluator, Evaluation, Team, Event, ActivityLog
from app.websocket_manager import manager
from app.tasks.communication_tasks import notify_evaluators_task

router = APIRouter()

@router.post("", status_code=201)
async def add_evaluators(
    event_id: uuid.UUID,
    body: dict = Body(...), # Tells FastAPI to expect a JSON payload
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee),
):
    """
    body: { "evaluators": [{ "name": "...", "email": "...", "expertise": "..." }] }
    Idempotent — skips duplicates by (event_id, email).
    """
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")

    added = []
    skipped = []

    for ev in body.get("evaluators", []):
        # Check for duplicates
        existing = db.execute(
            select(Evaluator).where(
                Evaluator.event_id == event_id,
                Evaluator.email == ev["email"],
            )
        ).scalar_one_or_none()

        if existing:
            skipped.append(ev["email"])
            continue

        # Generate access token and insert
        token = secrets.token_urlsafe(32)
        row = Evaluator(
            event_id=event_id,
            name=ev["name"],
            email=ev["email"],
            phone_number=ev.get("phone_number"), 
            organization=ev.get("organization"), 
            expertise=ev.get("expertise"),      
            access_token=token,
        )
        db.add(row)
        added.append(ev["email"])

    db.add(ActivityLog(
        event_id=event_id,
        actor=actor["sub"],
        action="evaluators_added",
        details={"added": added, "skipped": skipped},
    ))
    
    db.commit()
    await manager.broadcast_to_event(str(event_id), {"event": "EVALUATOR_ADDED", "message": "Refresh your data!"})
    return {"added": added, "skipped": skipped}


@router.get("")
def list_evaluators(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee),
):
    evaluators = db.execute(
        select(Evaluator).where(Evaluator.event_id == event_id)
    ).scalars().all()
    
    teams = db.execute(
        select(Team).where(Team.event_id == event_id)
    ).scalars().all()
    
    total_teams = len(teams)
    team_ids = [t.id for t in teams]
    result = []

    for ev in evaluators:
        if not team_ids:
            submissions = []
        else:   
            submissions = db.execute(
                select(Evaluation).where(
                    Evaluation.evaluator_id == ev.id,
                    Evaluation.team_id.in_(team_ids),
                )
        ).scalars().all()
        
        submitted_ids = {str(e.team_id) for e in submissions}

        result.append({
            "id": str(ev.id),
            "name": ev.name,
            "email": ev.email,
            "phone_number": ev.phone_number,
            "organization": ev.organization,
            "expertise": ev.expertise,
            "submission_status": {
                str(t.id): ("submitted" if str(t.id) in submitted_ids else "pending")
                for t in teams
            },
            "completed_evaluations": len(submitted_ids), # Explicitly count completed
            "total_assigned": total_teams,               # Explicitly state total
            "created_at": ev.created_at.isoformat() if ev.created_at else None,
        })
        
    return {
        "total_teams": total_teams,
        "evaluators": result
    }


@router.post("/notify")
def notify_evaluators(
    event_id: uuid.UUID,
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(404, "Event not found")

    # If your Event model doesn't have 'current_stage' yet, comment this check out for now!
    # if event.current_stage != "challenge_assigned":
    #     raise HTTPException(400, "Evaluators can only be notified once challenges are assigned")

    evaluators = db.execute(
        select(Evaluator).where(Evaluator.event_id == event_id)
    ).scalars().all()

    if not evaluators:
        raise HTTPException(400, "No evaluators added yet")

    notify_evaluators_task.delay(str(event_id))

    db.add(ActivityLog(
        event_id=event_id,
        actor=actor["sub"],
        action="evaluators_notified",
        details={"count": len(evaluators)},
    ))
    
    db.commit()
    return {"message": f"Notification queued for {len(evaluators)} evaluator(s)"}

@router.put("/{evaluator_id}")
def update_evaluator(
    event_id: uuid.UUID,
    evaluator_id: uuid.UUID,
    body: dict = Body(...),
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee),
):
    # 1. Find the existing evaluator
    evaluator = db.execute(
        select(Evaluator).where(
            Evaluator.id == evaluator_id,
            Evaluator.event_id == event_id
        )
    ).scalar_one_or_none()

    if not evaluator:
        raise HTTPException(404, "Evaluator not found")

    # 2. Check for email collision (if they change the email to one that already exists)
    new_email = body.get("email")
    if new_email and new_email != evaluator.email:
        existing = db.execute(
            select(Evaluator).where(
                Evaluator.event_id == event_id,
                Evaluator.email == new_email
            )
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(400, "Another evaluator with this email already exists")
        evaluator.email = new_email

    # 3. Update the fields
    if "name" in body: evaluator.name = body["name"]
    if "phone_number" in body: evaluator.phone_number = body["phone_number"]
    if "organization" in body: evaluator.organization = body["organization"]
    if "expertise" in body: evaluator.expertise = body["expertise"]

    # 4. Log the action
    db.add(ActivityLog(
        event_id=event_id,
        actor=actor["sub"],
        action="evaluator_updated",
        details={"evaluator_id": str(evaluator_id)},
    ))

    db.commit()
    return {"message": "Evaluator updated successfully"}

@router.delete("/{evaluator_id}")
def delete_evaluator(
    event_id: uuid.UUID,
    evaluator_id: uuid.UUID,
    db: Session = Depends(get_db),
    actor: dict = Depends(require_committee),
):
    # 1. Find the evaluator to ensure they exist and belong to this event
    evaluator = db.execute(
        select(Evaluator).where(
            Evaluator.id == evaluator_id,
            Evaluator.event_id == event_id
        )
    ).scalar_one_or_none()

    if not evaluator:
        raise HTTPException(404, "Evaluator not found")

    # 2. Delete the record
    db.delete(evaluator)

    # 3. Log the action
    db.add(ActivityLog(
        event_id=event_id,
        actor=actor["sub"],
        action="evaluator_deleted",
        details={"evaluator_id": str(evaluator_id), "email": evaluator.email},
    ))

    db.commit()
    return {"message": "Evaluator deleted successfully"}