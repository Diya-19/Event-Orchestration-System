import uuid
import datetime
from sqlalchemy import Column, Text, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP, ARRAY
from app.db import Base

class Participant(Base):
    __tablename__ = "participants"
    __table_args__ = (UniqueConstraint("event_id", "email"),)

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id     = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"),
                          nullable=False)
    name         = Column(Text, nullable=False)
    email        = Column(Text, nullable=False)
    institution  = Column(Text)
    skills       = Column(ARRAY(Text))
    experience   = Column(Text)
    metadata_    = Column("metadata", JSONB)
    portal_token = Column(Text, unique=True)
    created_at   = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
