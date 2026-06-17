"""create support requests table

Revision ID: a540d9d926fe
Revises: a8ee84700b14
Create Date: 2026-06-15 20:23:07.807585

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a540d9d926fe'
down_revision: Union[str, Sequence[str], None] = 'a8ee84700b14'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "support_requests",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("issue_type", sa.String(), nullable=False),
        sa.Column("priority", sa.String(), nullable=False),
        sa.Column("conflict_date", sa.Date(), nullable=True),
        sa.Column("duration", sa.String(), nullable=True),
        sa.Column("start_time", sa.Time(), nullable=True),
        sa.Column("end_time", sa.Time(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("attachment_url", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("notify_admin", sa.Boolean(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("support_requests")