import uuid
import datetime
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, TIMESTAMP, ARRAY, TEXT
from sqlalchemy import Text
from app.db import Base

class DistributionRules(Base):
    __tablename__ = "distribution_rules"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id            = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"),
                                 nullable=False)
    team_size           = Column(Integer, nullable=False, default=3)
    max_per_institution = Column(Integer, default=1)
    required_skills     = Column(ARRAY(Text))
    balance_by          = Column(ARRAY(Text))
    exclusions          = Column(JSONB)
    created_at          = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)
