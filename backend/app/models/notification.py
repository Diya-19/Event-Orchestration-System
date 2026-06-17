import uuid
import datetime
from sqlalchemy import Column, Text, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.db import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Targeting
    participant_id = Column(UUID(as_uuid=True), ForeignKey("participants.id", ondelete="CASCADE"), nullable=True)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=True)
    
    # Content
    title = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    category = Column(Text, nullable=False)
    notification_type = Column(Text, nullable=False) # travel | accommodation | reimbursement | event | announcement | urgent
    
    # Optional metadata
    deadline = Column(TIMESTAMP(timezone=True), nullable=True)
    action_label = Column(Text, nullable=True)
    action_url = Column(Text, nullable=True)
    link = Column(Text, nullable=True)
    
    # State
    is_read = Column(Boolean, default=False)
    
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
