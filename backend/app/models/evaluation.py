import uuid

import datetime

from sqlalchemy import Column, Text, ForeignKey, Numeric, UniqueConstraint

from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP

from app.db import Base


class Evaluation(Base):

    __tablename__ = "evaluations"

    __table_args__ = (UniqueConstraint("team_id", "evaluator_id"),)

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    team_id          = Column(

        UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False

    )

    evaluator_id     = Column(

        UUID(as_uuid=True), ForeignKey("evaluators.id", ondelete="CASCADE"), nullable=False

    )

    scores           = Column(JSONB, nullable=False)

    # e.g. {"innovation": 8, "execution": 7, "presentation": 9, "impact": 6}

    overall          = Column(Numeric(4, 2))   # weighted composite

    comments         = Column(Text)

    submitted_at     = Column(TIMESTAMP(timezone=True))

    assessment_guide = Column(Text)            # LLM-generated per team + evaluator pair
