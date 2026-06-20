"""add chat tables

Revision ID: a1b2c3d4e5f6
Revises: 87901e3a8af8
Create Date: 2026-06-19 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'a1b2c3d4e5f6'
down_revision = '87901e3a8af8'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'chat_rooms',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('event_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('events.id', ondelete='CASCADE'), nullable=False),
        sa.Column('room_type', sa.Text(), nullable=False, server_default='channel'),
        sa.Column('name', sa.Text(), nullable=True),
        sa.Column('icon', sa.Text(), nullable=True),
        sa.Column('team_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('teams.id', ondelete='CASCADE'), nullable=True),
        sa.Column('created_at', postgresql.TIMESTAMP(timezone=True),
                  server_default=sa.func.now()),
    )
    op.create_index('ix_chat_rooms_event_id', 'chat_rooms', ['event_id'])
    op.create_index('ix_chat_rooms_team_id', 'chat_rooms', ['team_id'])

    op.create_table(
        'chat_room_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('room_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('chat_rooms.id', ondelete='CASCADE'), nullable=False),
        sa.Column('participant_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('participants.id', ondelete='CASCADE'), nullable=False),
        sa.UniqueConstraint('room_id', 'participant_id', name='uq_chat_room_members'),
    )
    op.create_index('ix_chat_room_members_participant_id', 'chat_room_members', ['participant_id'])

    op.create_table(
        'chat_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('room_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('chat_rooms.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sender_id', postgresql.UUID(as_uuid=True),
                  sa.ForeignKey('participants.id', ondelete='SET NULL'), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(timezone=True),
                  server_default=sa.func.now()),
    )
    op.create_index('ix_chat_messages_room_id', 'chat_messages', ['room_id'])
    op.create_index('ix_chat_messages_created_at', 'chat_messages', ['created_at'])


def downgrade():
    op.drop_table('chat_messages')
    op.drop_table('chat_room_members')
    op.drop_table('chat_rooms')