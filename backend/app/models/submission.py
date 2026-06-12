import uuid
import datetime
from sqlalchemy import Column, Text, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.db import Base

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), unique=True, nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    
    github_link = Column(Text, nullable=True)
    project_description = Column(Text, nullable=True)
    presentation_url = Column(Text, nullable=True)
    demo_video_url = Column(Text, nullable=True)
    
    status = Column(String, default="DRAFT") # DRAFT, IN_PROGRESS, READY, SUBMITTED
    participant_notes = Column(Text, nullable=True)
    
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
