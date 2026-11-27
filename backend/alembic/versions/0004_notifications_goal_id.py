"""add notifications.goal_id

Revision ID: 0004
Revises: 0003
Create Date: 2026-11-27

Additive only: the Notification model links a notification to the goal it
concerns (`goal_id`, nullable, FK to goals.id) but no prior migration created
the column, so the shared test database and the live one never got it. This
adds it to match app/models.py.
"""

import sqlalchemy as sa

from alembic import op
from app.models import GUID

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "notifications",
        sa.Column("goal_id", GUID(), sa.ForeignKey("goals.id"), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("notifications", "goal_id")
