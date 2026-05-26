import datetime
from sqlalchemy import Column, BigInteger, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP
from app.db import Base

class ActivityLog(Base):
    __tablename__ = "activity_log"

    id         = Column(BigInteger, primary_key=True, autoincrement=True)
    event_id   = Column(UUID(as_uuid=True), ForeignKey("events.id"))
    actor      = Column(Text, nullable=False)   # 'system' | 'committee' | 'evaluator:<id>'
    action     = Column(Text, nullable=False)
    details    = Column(JSONB)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
