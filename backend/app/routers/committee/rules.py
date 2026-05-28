from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from uuid import UUID

from app.db import get_db
from app.models.distribution_rules import DistributionRules
from app.models.event import Event
from app.models.committee_user import CommitteeUser
from app.routers.auth import get_current_committee_user

router = APIRouter()


class RulesPayload(BaseModel):
    team_size: int = 3
    max_per_institution: Optional[int] = 1
    required_skills: Optional[list[str]] = None
    balance_by: Optional[list[str]] = None
    exclusions: Optional[dict] = None


@router.put("/{event_id}/rules")
def upsert_rules(
    event_id: UUID,
    body: RulesPayload,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(get_current_committee_user),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    rules = db.query(DistributionRules).filter(DistributionRules.event_id == event_id).first()

    if rules:
        rules.team_size = body.team_size
        rules.max_per_institution = body.max_per_institution
        rules.required_skills = body.required_skills
        rules.balance_by = body.balance_by
        rules.exclusions = body.exclusions
    else:
        rules = DistributionRules(event_id=event_id, **body.model_dump())
        db.add(rules)

    db.commit()
    db.refresh(rules)
    return rules


@router.get("/{event_id}/rules")
def get_rules(
    event_id: UUID,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(get_current_committee_user),
):
    rules = db.query(DistributionRules).filter(DistributionRules.event_id == event_id).first()
    if not rules:
        raise HTTPException(status_code=404, detail="No rules configured yet")
    return rules
