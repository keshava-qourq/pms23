"""index users.manager_id

Revision ID: 0002
Revises: 0001
Create Date: 2026-11-06

Additive only: NFR-009 asks GET /employees to stay responsive at 1,000
employees, and reporting-line lookups filter by manager_id. email is already
indexed (uniquely) by 0001; this adds the matching index for manager_id.
"""

from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index("ix_users_manager_id", "users", ["manager_id"])


def downgrade() -> None:
    op.drop_index("ix_users_manager_id", table_name="users")
