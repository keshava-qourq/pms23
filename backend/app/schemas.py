"""Pydantic request and response models.

One pair per entity in the approved data model, plus the placeholder every
generated route returns until it has been implemented. These are the typed
shapes a real handler will eventually accept and return; the stub routes in
`app.routers` do not use the *Read models yet -- every one of them answers
with `StubResponse` -- but the request bodies they declare do, so the
OpenAPI document the frontend is built against already carries the shape
the approved API spec agreed on.
"""

import uuid
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Role = Literal["employee", "manager", "hr_admin", "executive"]
ProgressType = Literal["percent", "status"]
GoalStatus = Literal["Not started", "In progress", "Completed", "Blocked"]


class StubResponse(BaseModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


# ---- auth -------------------------------------------------------------------


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginUser(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: Role


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: LoginUser
    home_route: str


class PasswordResetRequest(BaseModel):
    email: str


class PasswordResetConfirmRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def _password_rules(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in value):
            raise ValueError("Password must contain an uppercase letter")
        if not any(c.islower() for c in value):
            raise ValueError("Password must contain a lowercase letter")
        if not any(c.isdigit() for c in value):
            raise ValueError("Password must contain a digit")
        return value


# ---- employees (users) --------------------------------------------------------


class EmployeeCreate(BaseModel):
    name: str
    email: str
    role: Role
    manager_id: uuid.UUID | None = None


class EmployeeUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    role: Role | None = None


class ManagerAssignment(BaseModel):
    manager_id: uuid.UUID


class PersonalDataDeleteRequest(BaseModel):
    reason: str


class EmployeeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    role: Role
    manager_id: uuid.UUID | None = None
    is_active: bool
    anonymised_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


# ---- objectives ---------------------------------------------------------------


class ObjectiveRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str | None = None
    level: str
    owner_id: uuid.UUID | None = None
    created_at: datetime


# ---- goals ----------------------------------------------------------------


class GoalCreate(BaseModel):
    title: str
    description: str | None = None
    target_metric: str
    due_date: date
    progress_type: ProgressType
    owner_id: uuid.UUID | None = None
    parent_objective_id: uuid.UUID | None = None


class GoalUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    target_metric: str | None = None
    due_date: date | None = None
    parent_objective_id: uuid.UUID | None = None


class GoalProgressUpdate(BaseModel):
    progress_percent: int | None = Field(default=None, ge=0, le=100)
    status: GoalStatus | None = None


class GoalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID
    created_by: uuid.UUID
    parent_objective_id: uuid.UUID | None = None
    title: str
    description: str | None = None
    target_metric: str
    progress_type: ProgressType
    progress_percent: int | None = None
    status: GoalStatus
    check_in_interval_days: int | None = None
    due_date: date
    completed_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


# ---- check-ins ------------------------------------------------------------


class CheckInCreate(BaseModel):
    note: str


class CheckInRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    goal_id: uuid.UUID
    author_id: uuid.UUID
    note: str
    created_at: datetime


# ---- praise -----------------------------------------------------------------


class PraiseCreate(BaseModel):
    recipient_id: uuid.UUID
    message: str

    @field_validator("message")
    @classmethod
    def _message_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Message must not be empty")
        return value


class PraiseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    sender_id: uuid.UUID
    recipient_id: uuid.UUID
    message: str
    created_at: datetime


# ---- notifications ------------------------------------------------------------


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    type: str
    message: str
    is_read: bool
    email_status: str | None = None
    created_at: datetime


# ---- audit log ----------------------------------------------------------------


class AuditLogEntry(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    actor_id: uuid.UUID | None = None
    actor_name: str | None = None
    entity_type: str
    entity_id: uuid.UUID
    action: str
    changes: dict | None = None
    created_at: datetime
