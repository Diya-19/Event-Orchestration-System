import uuid

import datetime

from sqlalchemy import Column, Text, ForeignKey

from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP

from app.db import Base

    
class Communication(Base):
    __tablename__ = "communications"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id       = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    stage          = Column(Text, nullable=False)
    recipient_type = Column(Text, nullable=False)
    subject        = Column(Text, nullable=False)
    body_template  = Column(Text, nullable=False)
    approval_id    = Column(UUID(as_uuid=True), ForeignKey("approval_requests.id"))
    scheduled_for  = Column(TIMESTAMP(timezone=True), nullable=True) 
    status         = Column(Text, nullable=False, default="draft")
    # UPDATED status values: draft | pending_approval | approved | scheduled | sent
    created_at     = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)


class CommunicationLog(Base):

    __tablename__ = "communication_logs"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    communication_id    = Column(UUID(as_uuid=True), ForeignKey("communications.id"))

    recipient_email     = Column(Text, nullable=False)

    recipient_name      = Column(Text)

    personalized_body   = Column(Text)          # rendered template for this recipient

    sendgrid_message_id = Column(Text)

    status              = Column(Text, nullable=False, default="queued")

    # status values: queued | sent | delivered | failed

    sent_at             = Column(TIMESTAMP(timezone=True))

    error               = Column(Text)

    created_at          = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
