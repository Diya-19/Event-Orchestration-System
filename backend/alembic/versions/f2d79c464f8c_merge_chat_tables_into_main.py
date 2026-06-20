"""merge chat tables into main

Revision ID: f2d79c464f8c
Revises: 6979982b0396, a1b2c3d4e5f6
Create Date: 2026-06-19 18:26:29.549597

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2d79c464f8c'
down_revision: Union[str, Sequence[str], None] = ('6979982b0396', 'a1b2c3d4e5f6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass