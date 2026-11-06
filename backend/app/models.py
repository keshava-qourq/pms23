"""SQLAlchemy models.

One table per entity in the approved data model (see
docs/sdlc/architecture/data-model.md). Columns and foreign keys only -- no
`relationship()` graphs, no query helpers -- because deciding how a goal is
fetched with its check-ins, or how a dashboard aggregates across a reporting
line, is the feature work of the development sprint, not this scaffold.
`Base` is bound to the engine in app.database, and app.main imports this
module before it creates the schema.
"""

import uuid

from sqlalchemy import (
    CHAR,
    JSON,
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    TypeDecorator,
    func,
)
from sqlalchemy.dialects.postgresql import UUID as PGUUID

from app.database import Base

__all__ = [
    "AuditLog",
    "Base",
    "CheckIn",
    "Goal",
    "Notification",
    "Objective",
    "PasswordResetToken",
    "Praise",
    "User",
]


class GUID(TypeDecorator):
    """A UUID column that stores as native `uuid` on Postgres and as
    `CHAR(36)` text everywhere else -- the standard SQLAlchemy recipe for a
    cross-dialect UUID, so the same model runs against the deployed Postgres
    and against a test's throwaway in-memory SQLite.
    """

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PGUUID(as_uuid=True))
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == "postgresql":
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid.UUID):
            return value
        return uuid.UUID(str(value))


def _uuid_pk() -> Column:
    return Column(GUID(), primary_key=True, default=uuid.uuid4)


class User(Base):
    __tablename__ = "users"

    id = _uuid_pk()
    name = Column(String(200), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    # "employee" | "manager" | "hr_admin" | "executive" -- not a DB enum, so
    # adding a role never needs a migration.
    role = Column(String(32), nullable=False)
    manager_id = Column(GUID(), ForeignKey("users.id"), nullable=True, index=True)
    is_active = Column(Boolean, nullable=False, default=True)
    anonymised_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )


class Objective(Base):
    __tablename__ = "objectives"

    id = _uuid_pk()
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    level = Column(String(32), nullable=False)
    owner_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Goal(Base):
    __tablename__ = "goals"

    id = _uuid_pk()
    owner_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    created_by = Column(GUID(), ForeignKey("users.id"), nullable=False)
    parent_objective_id = Column(GUID(), ForeignKey("objectives.id"), nullable=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    target_metric = Column(String(300), nullable=False)
    # "percent" | "status" -- which of progress_percent / status is authoritative.
    progress_type = Column(String(16), nullable=False)
    progress_percent = Column(Integer, nullable=True)
    status = Column(String(32), nullable=False, default="Not started")
    check_in_interval_days = Column(Integer, nullable=True)
    due_date = Column(Date, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )


class CheckIn(Base):
    __tablename__ = "check_ins"

    id = _uuid_pk()
    goal_id = Column(GUID(), ForeignKey("goals.id"), nullable=False)
    author_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Praise(Base):
    __tablename__ = "praise"

    id = _uuid_pk()
    sender_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    recipient_id = Column(GUID(), ForeignKey("users.id"), nullable=False, index=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"

    id = _uuid_pk()
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(32), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    # Set by the worker once it has tried SendGrid: "sent" | "failed" | null
    # before it has tried. A failed send never blocks the in-app notification
    # above, which is why the two live on the same row rather than failing
    # the whole write together.
    email_status = Column(String(16), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = _uuid_pk()
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    # Only the hash is stored -- the emailed token itself is never persisted,
    # so a leaked database row cannot be replayed as a reset link.
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = _uuid_pk()
    actor_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    entity_type = Column(String(64), nullable=False, index=True)
    entity_id = Column(GUID(), nullable=False)
    action = Column(String(64), nullable=False)
    changes = Column(JSON, nullable=True)
    created_at = Column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
