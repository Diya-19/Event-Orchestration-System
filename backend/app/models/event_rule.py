import uuid
import datetime
from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.db import Base

class EventRule(Base):
    __tablename__ = "event_rules"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id    = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    title       = Column(Text, nullable=False)
    category    = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    created_at  = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
    updated_at  = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow,
                         onupdate=datetime.datetime.utcnow)
