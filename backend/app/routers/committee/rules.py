from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.db import get_db
from app.models.distribution_rules import EventTeamSettings
from app.models.distribution_rules import CustomRule
from app.routers.auth import get_current_committee_user

router = APIRouter()

# --- PYDANTIC SCHEMAS ---

class TeamSettingsPayload(BaseModel):
    min_team_size: int
    max_team_size: int
    max_per_institution: int

class CustomRulePayload(BaseModel):
    title: str
    category: str
    description: str

class CustomRuleResponse(CustomRulePayload):
    id: UUID
    updated_at: datetime # Simplification for frontend

    class Config:
        orm_mode = True

# --- TEAM SETTINGS APIs ---

@router.get("/{event_id}/team-settings")
def get_team_settings(event_id: UUID, db: Session = Depends(get_db)):
    settings = db.query(EventTeamSettings).filter(EventTeamSettings.event_id == event_id).first()
    if not settings:
        return {"min_team_size": 2, "max_team_size": 4, "max_per_institution": 2}
    return settings

@router.put("/{event_id}/team-settings")
def update_team_settings(event_id: UUID, body: TeamSettingsPayload, db: Session = Depends(get_db)):
    settings = db.query(EventTeamSettings).filter(EventTeamSettings.event_id == event_id).first()
    if settings:
        settings.min_team_size = body.min_team_size
        settings.max_team_size = body.max_team_size
        settings.max_per_institution = body.max_per_institution
    else:
        settings = EventTeamSettings(event_id=event_id, **body.model_dump())
        db.add(settings)
    
    db.commit()
    db.refresh(settings)
    return settings

# --- CUSTOM RULES APIs ---

@router.get("/{event_id}/rules", response_model=List[CustomRuleResponse])
def get_rules(event_id: UUID, db: Session = Depends(get_db)):
    return db.query(CustomRule).filter(CustomRule.event_id == event_id).order_by(CustomRule.updated_at.desc()).all()

@router.post("/{event_id}/rules", response_model=CustomRuleResponse)
def create_rule(event_id: UUID, body: CustomRulePayload, db: Session = Depends(get_db)):
    rule = CustomRule(event_id=event_id, **body.model_dump())
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule

@router.put("/{event_id}/rules/{rule_id}", response_model=CustomRuleResponse)
def update_rule(event_id: UUID, rule_id: UUID, body: CustomRulePayload, db: Session = Depends(get_db)):
    rule = db.query(CustomRule).filter(CustomRule.id == rule_id, CustomRule.event_id == event_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    rule.title = body.title
    rule.category = body.category
    rule.description = body.description
    db.commit()
    db.refresh(rule)
    return rule

@router.delete("/{event_id}/rules/{rule_id}")
def delete_rule(event_id: UUID, rule_id: UUID, db: Session = Depends(get_db)):
    rule = db.query(CustomRule).filter(CustomRule.id == rule_id, CustomRule.event_id == event_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    db.delete(rule)
    db.commit()
    return {"detail": "Deleted"}