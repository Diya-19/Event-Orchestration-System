from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

from app.db import get_db
from app.models.event import Event
from app.models.committee_user import CommitteeUser
from app.auth import require_committee

router = APIRouter()


class EventCreate(BaseModel):
    name: str
    format: str = "hackathon"
    config: Optional[dict] = None

class EventConfigPatch(BaseModel):
    config: dict


@router.post("", status_code=status.HTTP_201_CREATED)
def create_event(
    body: EventCreate,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(require_committee),
):
    event = Event(name=body.name, format=body.format, config=body.config)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("")
def list_events(
    db: Session = Depends(get_db),
    _: dict = Depends(require_committee),
):
    events = db.query(Event).order_by(Event.created_at.desc()).all()
    return {"events": events}


@router.get("/{event_id}")
def get_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(require_committee),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.patch("/{event_id}/config")
def update_config(
    event_id: UUID,
    body: EventConfigPatch,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(require_committee),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.config = body.config
    db.commit()
    db.refresh(event)
    return event
