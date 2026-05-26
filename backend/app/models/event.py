import uuid
import datetime
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP
from app.db import Base

class Event(Base):
    __tablename__ = "events"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name          = Column(Text, nullable=False)
    format        = Column(Text, nullable=False, default="hackathon")
    current_stage = Column(Text, nullable=False, default="intake")
    config        = Column(JSONB)
    created_at    = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
    updated_at    = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow,
                           onupdate=datetime.datetime.utcnow)
