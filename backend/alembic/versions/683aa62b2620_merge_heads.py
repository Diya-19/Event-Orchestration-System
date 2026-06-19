"""merge_heads

Revision ID: 683aa62b2620
Revises: 0720b3287108, a540d9d926fe
Create Date: 2026-06-19 01:31:17.049251

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '683aa62b2620'
down_revision: Union[str, Sequence[str], None] = ('0720b3287108', 'a540d9d926fe')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
