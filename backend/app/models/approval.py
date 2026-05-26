import uuid

import datetime

from sqlalchemy import Column, Text, ForeignKey

from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP

from app.db import Base


class ApprovalRequest(Base):

    __tablename__ = "approval_requests"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    event_id    = Column(

        UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False

    )

    type        = Column(Text, nullable=False)

    # type values: team_formation | communication_send | results_publish

    #              progression_invitations | anomaly_resolution

    payload     = Column(JSONB)   # snapshot of what needs approval

    status      = Column(Text, nullable=False, default="pending")

    # status values: pending | approved | rejected

    approved_by = Column(Text)

    decision_at = Column(TIMESTAMP(timezone=True))

    notes       = Column(Text)

    created_at  = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
