import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.db import get_db
from app.models.event_rule import EventRule

router = APIRouter(tags=["Event Rules"])

class EventRuleCreate(BaseModel):
    title: str
    category: str
    description: str

class EventRuleResponse(EventRuleCreate):
    id: uuid.UUID
    event_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

@router.get("/{event_id}/rules", response_model=List[EventRuleResponse])
def get_event_rules(event_id: uuid.UUID, db: Session = Depends(get_db)):
    rules = db.query(EventRule).filter(EventRule.event_id == event_id).all()
    return rules

@router.post("/{event_id}/rules", response_model=EventRuleResponse)
def create_event_rule(event_id: uuid.UUID, rule_data: EventRuleCreate, db: Session = Depends(get_db)):
    new_rule = EventRule(
        event_id=event_id,
        title=rule_data.title,
        category=rule_data.category,
        description=rule_data.description
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    return new_rule

@router.put("/rules/{rule_id}", response_model=EventRuleResponse)
def update_event_rule(rule_id: uuid.UUID, rule_data: EventRuleCreate, db: Session = Depends(get_db)):
    rule = db.query(EventRule).filter(EventRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    rule.title = rule_data.title
    rule.category = rule_data.category
    rule.description = rule_data.description
    
    db.commit()
    db.refresh(rule)
    return rule

@router.delete("/rules/{rule_id}")
def delete_event_rule(rule_id: uuid.UUID, db: Session = Depends(get_db)):
    rule = db.query(EventRule).filter(EventRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    db.delete(rule)
    db.commit()
    return {"status": "success", "message": "Rule deleted successfully"}
