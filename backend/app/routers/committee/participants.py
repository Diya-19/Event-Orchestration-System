import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.db import get_db
from app.models.participant import Participant
from app.models.event import Event
from app.models.activity_log import ActivityLog
from app.models.committee_user import CommitteeUser
from app.routers.auth import get_current_committee_user

router = APIRouter()

_REQUIRED_COLS = {"name", "email"}
_OPTIONAL_COLS = {"institution", "skills", "experience"}


@router.post("/{event_id}/participants/upload")
def upload_participants(
    event_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: CommitteeUser = Depends(get_current_committee_user),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.current_stage != "intake":
        raise HTTPException(status_code=409, detail="Participant upload only allowed during intake stage")

    content = file.file.read().decode("utf-8")
    reader = csv.DictReader(io.StringIO(content))

    if not _REQUIRED_COLS.issubset(set(reader.fieldnames or [])):
        raise HTTPException(status_code=422, detail=f"CSV must have columns: {_REQUIRED_COLS}")

    loaded, skipped, errors = 0, 0, []

    for i, row in enumerate(reader, start=2):
        if not row.get("email") or not row.get("name"):
            errors.append({"row": i, "reason": "missing name or email"})
            continue

        existing = (
            db.query(Participant)
            .filter(Participant.event_id == event_id, Participant.email == row["email"])
            .first()
        )
        if existing:
            skipped += 1
            continue

        skills_raw = row.get("skills", "")
        skills = [s.strip() for s in skills_raw.split(",") if s.strip()] if skills_raw else []

        known = _REQUIRED_COLS | _OPTIONAL_COLS
        extra = {k: v for k, v in row.items() if k not in known and v}

        participant = Participant(
            event_id=event_id,
            name=row["name"].strip(),
            email=row["email"].strip().lower(),
            institution=row.get("institution") or None,
            skills=skills or None,
            experience=row.get("experience") or None,
            metadata_=extra or None,
        )
        db.add(participant)
        loaded += 1

    db.commit()

    db.add(ActivityLog(
        event_id=event_id,
        actor=f"committee",
        action="participants_uploaded",
        details={"loaded": loaded, "skipped": skipped, "errors": len(errors)},
    ))
    db.commit()

    return {"loaded": loaded, "skipped": skipped, "errors": errors}


@router.get("/{event_id}/participants")
def list_participants(
    event_id: UUID,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(get_current_committee_user),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    participants = db.query(Participant).filter(Participant.event_id == event_id).all()
    return {"total": len(participants), "participants": participants}


@router.delete("/{event_id}/participants/{participant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_participant(
    event_id: UUID,
    participant_id: UUID,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(get_current_committee_user),
):
    p = db.query(Participant).filter(
        Participant.id == participant_id, Participant.event_id == event_id
    ).first()
    if not p:
        raise HTTPException(status_code=404, detail="Participant not found")
    db.delete(p)
    db.commit()
