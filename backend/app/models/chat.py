import uuid
import datetime
from sqlalchemy import Column, Text, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from app.db import Base


class ChatRoom(Base):
    __tablename__ = "chat_rooms"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id   = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    # "channel" for team-wide rooms, "dm" for direct messages
    room_type  = Column(Text, nullable=False, default="channel")
    name       = Column(Text)                                          # e.g. "General", null for DMs
    icon       = Column(Text)                                          # emoji icon for channels
    team_id    = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)


class ChatRoomMember(Base):
    __tablename__ = "chat_room_members"
    __table_args__ = (UniqueConstraint("room_id", "participant_id"),)

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id        = Column(UUID(as_uuid=True), ForeignKey("chat_rooms.id", ondelete="CASCADE"), nullable=False)
    participant_id = Column(UUID(as_uuid=True), ForeignKey("participants.id", ondelete="CASCADE"), nullable=False)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id    = Column(UUID(as_uuid=True), ForeignKey("chat_rooms.id", ondelete="CASCADE"), nullable=False)
    sender_id  = Column(UUID(as_uuid=True), ForeignKey("participants.id", ondelete="SET NULL"), nullable=True)
    content    = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.datetime.utcnow)