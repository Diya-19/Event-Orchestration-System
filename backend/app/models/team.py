import uuid

import datetime

from sqlalchemy import Column, Text, ForeignKey, Numeric, Integer, Boolean

from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP

from app.db import Base


class Team(Base):

    __tablename__ = "teams"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    event_id    = Column(

        UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False

    )

    name        = Column(Text, nullable=False)

    challenge   = Column(Text)

    rationale   = Column(Text)               # LLM-generated grouping rationale

    final_score = Column(Numeric(5, 2))      # computed after evaluation

    rank        = Column(Integer)

    status      = Column(Text, nullable=False, default="draft")

    # status values: draft | approved | active | evaluated
    
    is_qualified_round_3 = Column(Boolean, nullable=False, default=False)

    created_at  = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
