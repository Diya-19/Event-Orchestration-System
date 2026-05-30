from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from uuid import UUID
import datetime

from app.db import get_db
from app.models.distribution_rules import DistributionRules
from app.models.event import Event
from app.models.committee_user import CommitteeUser
from app.auth import require_committee

router = APIRouter()

# --- Pydantic Schemas ---

class DistributionRulesBase(BaseModel):
    team_size: int = 3
    min_team_size: int = 1
    max_per_institution: int = 1
    required_skills: Optional[List[str]] = []
    balance_by: Optional[List[str]] = []
    exclusions: Optional[Dict[str, Any]] = {}
    custom_rules: Optional[Dict[str, Any]] = {}

class DistributionRulesCreate(DistributionRulesBase):
    pass

class DistributionRulesUpdate(DistributionRulesBase):
    team_size: Optional[int] = None
    min_team_size: Optional[int] = None
    max_per_institution: Optional[int] = None

class DistributionRulesResponse(DistributionRulesBase):
    id: UUID
    event_id: UUID
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


# --- APIs ---

@router.post("/{event_id}/distribution_rules", response_model=DistributionRulesResponse, status_code=status.HTTP_201_CREATED)
def create_distribution_rules(
    event_id: UUID,
    body: DistributionRulesCreate,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(require_committee),
):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check if rules already exist for this event
    existing = db.query(DistributionRules).filter(DistributionRules.event_id == event_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Distribution rules already exist for this event. Use PUT/PATCH to update.")

    rules = DistributionRules(
        event_id=event_id,
        team_size=body.team_size,
        min_team_size=body.min_team_size,
        max_per_institution=body.max_per_institution,
        required_skills=body.required_skills,
        balance_by=body.balance_by,
        exclusions=body.exclusions,
        custom_rules=body.custom_rules
    )
    db.add(rules)
    db.commit()
    db.refresh(rules)
    return rules


@router.get("/{event_id}/distribution_rules", response_model=DistributionRulesResponse)
def get_distribution_rules(
    event_id: UUID,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(require_committee),
):
    rules = db.query(DistributionRules).filter(DistributionRules.event_id == event_id).first()
    if not rules:
        raise HTTPException(status_code=404, detail="Distribution rules not found for this event")
    return rules


@router.put("/{event_id}/distribution_rules", response_model=DistributionRulesResponse)
def update_distribution_rules(
    event_id: UUID,
    body: DistributionRulesUpdate,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(require_committee),
):
    rules = db.query(DistributionRules).filter(DistributionRules.event_id == event_id).first()
    if not rules:
        raise HTTPException(status_code=404, detail="Distribution rules not found for this event")

    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(rules, key, value)
    
    db.commit()
    db.refresh(rules)
    return rules


@router.delete("/{event_id}/distribution_rules", status_code=status.HTTP_204_NO_CONTENT)
def delete_distribution_rules(
    event_id: UUID,
    db: Session = Depends(get_db),
    _: CommitteeUser = Depends(require_committee),
):
    rules = db.query(DistributionRules).filter(DistributionRules.event_id == event_id).first()
    if not rules:
        raise HTTPException(status_code=404, detail="Distribution rules not found for this event")
    
    db.delete(rules)
    db.commit()
    return None
