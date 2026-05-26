import uuid

import datetime

from sqlalchemy import Column, Text, ForeignKey, Numeric

from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP

from app.db import Base


class ScoreAnomaly(Base):

    __tablename__ = "score_anomalies"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    team_id       = Column(

        UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False

    )

    evaluator_id  = Column(UUID(as_uuid=True), ForeignKey("evaluators.id"))

    flagged_score = Column(Numeric(4, 2), nullable=False)

    panel_average = Column(Numeric(4, 2), nullable=False)

    deviation     = Column(Numeric(4, 2), nullable=False)

    status        = Column(Text, nullable=False, default="pending")

    # status values: pending | resolved | dismissed

    resolved_by   = Column(Text)

    resolved_at   = Column(TIMESTAMP(timezone=True))

    created_at    = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
