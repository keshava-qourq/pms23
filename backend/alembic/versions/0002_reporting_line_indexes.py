"""audit-log indexes

Revision ID: 0002b
Revises: 0002a
Create Date: 2026-11-06

Additive only: indexes to keep audit-log filtering fast at 1,000 employees
(NFR-009). The matching index for manager_id is created by 0002a
(0002_index_manager_id.py); this migration no longer duplicates it.
"""

from alembic import op

revision = "0002b"
down_revision = "0002a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index("ix_audit_log_entity_type", "audit_log", ["entity_type"])
    op.create_index("ix_audit_log_created_at", "audit_log", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_audit_log_created_at", table_name="audit_log")
    op.drop_index("ix_audit_log_entity_type", table_name="audit_log")
