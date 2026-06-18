from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db import get_db
from app.auth import require_participant
from app.models.participant import Participant
from app.models.team_member import TeamMember
from app.models.notification import Notification

router = APIRouter()

@router.get("")
def get_notifications(
    db: Session = Depends(get_db),
    actor: dict = Depends(require_participant)
):
    participant_id = actor["participant_id"]
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
        
    tm = db.query(TeamMember).filter(TeamMember.participant_id == participant.id).first()
    team_id = tm.team_id if tm else None

    # Get notifications for the participant or their team
    filters = [Notification.participant_id == participant.id]
    if team_id:
        filters.append(Notification.team_id == team_id)

    notifications = db.query(Notification).filter(or_(*filters)).order_by(Notification.created_at.desc()).all()
    
    print(f"DEBUG GET /notifications: participant_id={participant.id}, team_id={team_id}")
    print(f"DEBUG GET /notifications query filters: {filters}")
    print("Notifications found:", len(notifications))
    
    return [
        {
            "id": str(n.id),
            "title": n.title,
            "message": n.message,
            "category": n.category,
            "notification_type": n.notification_type,
            "deadline": n.deadline.isoformat() if n.deadline else None,
            "action_label": n.action_label,
            "action_url": n.action_url,
            "link": n.link,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None
        }
        for n in notifications
    ]

@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    actor: dict = Depends(require_participant)
):
    participant_id = actor["participant_id"]
    participant = db.query(Participant).filter(Participant.id == participant_id).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
        
    tm = db.query(TeamMember).filter(TeamMember.participant_id == participant.id).first()
    team_id = tm.team_id if tm else None

    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    # Verify ownership
    if notification.participant_id and str(notification.participant_id) != str(participant.id):
        raise HTTPException(status_code=403, detail="Not authorized")
    if notification.team_id and str(notification.team_id) != str(team_id):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    notification.is_read = True
    db.commit()
    
    return {"is_read": True}
