import uuid

from sqlalchemy import Column, Text, ForeignKey, UniqueConstraint

from sqlalchemy.dialects.postgresql import UUID

from app.db import Base


class TeamMember(Base):

    __tablename__ = "team_members"

    __table_args__ = (UniqueConstraint("team_id", "participant_id"),)

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    team_id        = Column(

        UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False

    )

    participant_id = Column(

        UUID(as_uuid=True), ForeignKey("participants.id", ondelete="CASCADE"), nullable=False

    )

    role           = Column(Text, nullable=False, default="member")  # lead | member
