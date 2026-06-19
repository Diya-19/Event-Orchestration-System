import uuid
import datetime
from sqlalchemy import Column, Text, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.db import Base

class TravelQuery(Base):
    __tablename__ = "travel_queries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    participant_id = Column(UUID(as_uuid=True), ForeignKey("participants.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    
    category = Column(Text, nullable=False)
    subject = Column(Text, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(Text, nullable=False, default="Submitted")
    
    conversation = Column(JSON, default=[])
    
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)