"""initial schema: users, objectives, goals, check_ins, praise, notifications,
password_reset_tokens, audit_log

Revision ID: 0001
Revises:
Create Date: 2026-11-06

Additive only, as every migration here must be: this is the first one, so it
creates the full schema the approved data model names. The application's
lifespan no longer runs `Base.metadata.create_all`; this migration (run with
`alembic upgrade head`) is now the only thing that creates these tables.
"""

import sqlalchemy as sa

from alembic import op
from app.models import GUID

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", sa.String(32), nullable=False),
        sa.Column("manager_id", GUID(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("anonymised_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )
    # NFR-009: email and id are indexed -- id via the primary key above, email
    # explicitly here (and uniquely, since login looks a user up by it).
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "objectives",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("level", sa.String(32), nullable=False),
        sa.Column("owner_id", GUID(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )

    op.create_table(
        "goals",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("owner_id", GUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_by", GUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("parent_objective_id", GUID(), sa.ForeignKey("objectives.id"), nullable=True),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("target_metric", sa.String(300), nullable=False),
        sa.Column("progress_type", sa.String(16), nullable=False),
        sa.Column("progress_percent", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(32), nullable=False, server_default="Not started"),
        sa.Column("check_in_interval_days", sa.Integer(), nullable=True),
        sa.Column("due_date", sa.Date(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )

    op.create_table(
        "check_ins",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("goal_id", GUID(), sa.ForeignKey("goals.id"), nullable=False),
        sa.Column("author_id", GUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )

    op.create_table(
        "praise",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("sender_id", GUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("recipient_id", GUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )

    op.create_table(
        "notifications",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("user_id", GUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("type", sa.String(32), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("email_status", sa.String(16), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )

    op.create_table(
        "password_reset_tokens",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("user_id", GUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("token_hash", sa.String(255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )

    op.create_table(
        "audit_log",
        sa.Column("id", GUID(), primary_key=True),
        sa.Column("actor_id", GUID(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("entity_type", sa.String(64), nullable=False),
        sa.Column("entity_id", GUID(), nullable=False),
        sa.Column("action", sa.String(64), nullable=False),
        sa.Column("changes", sa.JSON(), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()
        ),
    )


def downgrade() -> None:
    op.drop_table("audit_log")
    op.drop_table("password_reset_tokens")
    op.drop_table("notifications")
    op.drop_table("praise")
    op.drop_table("check_ins")
    op.drop_table("goals")
    op.drop_table("objectives")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
