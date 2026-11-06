"""reporting-line and audit-log indexes

Revision ID: 0002
Revises: 0001
Create Date: 2026-11-06

Additive only: indexes to keep manager-chain walks and audit-log filtering
fast at 1,000 employees (NFR-009), no column or table changes.
"""

from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index("ix_users_manager_id", "users", ["manager_id"])
    op.create_index("ix_audit_log_entity_type", "audit_log", ["entity_type"])
    op.create_index("ix_audit_log_created_at", "audit_log", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_audit_log_created_at", table_name="audit_log")
    op.drop_index("ix_audit_log_entity_type", table_name="audit_log")
    op.drop_index("ix_users_manager_id", table_name="users")
