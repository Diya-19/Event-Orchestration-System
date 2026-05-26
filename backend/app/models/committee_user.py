import uuid
import datetime
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.sql import func
from app.db import Base

class CommitteeUser(Base):
    __tablename__ = "committee_users"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name            = Column(Text, nullable=False)
    email           = Column(Text, unique=True, nullable=False)
    hashed_password = Column(Text, nullable=False)
    created_at      = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
