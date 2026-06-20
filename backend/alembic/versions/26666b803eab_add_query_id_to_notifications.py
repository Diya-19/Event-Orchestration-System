"""Add query_id to notifications

Revision ID: 26666b803eab
Revises: 3e1638910415
Create Date: 2026-06-19 23:24:29.552848

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '26666b803eab'
down_revision: Union[str, Sequence[str], None] = '3e1638910415'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('notifications', sa.Column('query_id', sa.UUID(), nullable=True))
    op.create_foreign_key(None, 'notifications', 'travel_queries', ['query_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    op.drop_constraint(None, 'notifications', type_='foreignkey')
    op.drop_column('notifications', 'query_id')
