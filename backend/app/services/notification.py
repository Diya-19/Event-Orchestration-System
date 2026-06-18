from sqlalchemy.orm import Session
from app.models.notification import Notification
from typing import Optional
import datetime

class NotificationService:
    @staticmethod
    def create(
        db: Session,
        title: str,
        message: str,
        category: str,
        notification_type: str,
        participant_id: Optional[str] = None,
        team_id: Optional[str] = None,
        deadline: Optional[datetime.datetime] = None,
        action_label: Optional[str] = None,
        action_url: Optional[str] = None,
        link: Optional[str] = None
    ) -> Notification:
        notification = Notification(
            participant_id=participant_id,
            team_id=team_id,
            title=title,
            message=message,
            category=category,
            notification_type=notification_type,
            deadline=deadline,
            action_label=action_label,
            action_url=action_url,
            link=link
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
