import uuid

import datetime

from sqlalchemy import Column, Text, ForeignKey, UniqueConstraint

from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP

from app.db import Base


class Evaluator(Base):

    __tablename__ = "evaluators"

    __table_args__ = (UniqueConstraint("event_id", "email"),)

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    event_id     = Column(

        UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False

    )

    name         = Column(Text, nullable=False)

    email        = Column(Text, nullable=False)
    
    phone_number = Column(Text, nullable=True)
    organization = Column(Text, nullable=True)
    expertise    = Column(Text, nullable=True)

    access_token = Column(Text, unique=True)  # signed JWT embedded in evaluation-request email

    created_at   = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
