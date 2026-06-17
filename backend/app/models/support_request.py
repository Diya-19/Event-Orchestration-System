from sqlalchemy import Column, Integer, String, Text, Date, Time, DateTime, Boolean
from sqlalchemy.sql import func
from app.db import Base

class SupportRequest(Base):
    __tablename__ = "support_requests"

    id = Column(Integer, primary_key=True, index=True)

    issue_type = Column(String, nullable=False)
    priority = Column(String, nullable=False)

    conflict_date = Column(Date)
    duration = Column(String)

    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)

    description = Column(Text)

    attachment_url = Column(String, nullable=True)

    status = Column(String, default="Under Review")

    notify_admin = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())