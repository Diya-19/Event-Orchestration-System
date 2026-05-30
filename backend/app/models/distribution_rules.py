import uuid
import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.db import Base

class EventTeamSettings(Base):
    """1-to-1 relationship with Event. Stores scalar configuration."""
    __tablename__ = "event_team_settings"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id            = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), unique=True, nullable=False)
    team_size           = Column(Integer, nullable=False, default=3)
    max_per_institution = Column(Integer, default=2)
    min_per_institution = Column(Integer, default=1)
    updated_at          = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class CustomRule(Base):
    """1-to-Many relationship with Event. Stores individual rules."""
    __tablename__ = "custom_rules"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id    = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    title       = Column(String, nullable=False)
    category    = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    updated_at  = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
