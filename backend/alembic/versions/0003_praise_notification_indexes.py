"""index praise.recipient_id and notifications.user_id

Revision ID: 0003
Revises: 0002b
Create Date: 2026-11-06

Additive only: NFR-009 asks GET /praise/received to stay responsive and
bounded (paginated) at 1,000 employees. That query filters praise by
recipient_id and notifications by user_id, so both get the matching index,
the same pattern 0002a used for users.manager_id.
"""

from alembic import op

revision = "0003"
down_revision = "0002b"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index("ix_praise_recipient_id", "praise", ["recipient_id"])
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_notifications_user_id", table_name="notifications")
    op.drop_index("ix_praise_recipient_id", table_name="praise")
