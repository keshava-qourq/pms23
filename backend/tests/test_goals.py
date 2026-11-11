"""Goal creation, validation, manager assignment and objective cascading
(US-007): POST /goals, PUT /goals/{id}, GET /goals.

AC-020 an employee creates a goal linked to themselves. AC-021 a missing
title or missing due_date each return 422 naming the field and persist no
row. AC-022 editing title, description, target_metric and due_date
persists. AC-023 a manager-created goal for a direct report appears in that
report's GET /goals with owner_id = report. AC-024 assigning a goal outside
the reporting line returns 403 and writes no row. AC-025 a goal linked to an
existing objective returns that parent; an unknown objective id returns 404.
AC-026 a goal with no parent objective saves and lists as standalone.

`GET /objectives` is still a stub (see backend/app/routers/objectives.py),
so objective rows are seeded directly into the test database rather than
through that endpoint -- `POST /goals`/`PUT /goals/{id}` read
`models.Objective` straight from the database, not through the stub route.
"""

import datetime
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password

PASSWORD = "correct horse battery staple"


def _create_user(
    db_session: Session,
    *,
    email: str,
    role: str = "employee",
    manager_id: uuid.UUID | None = None,
    name: str = "Test User",
) -> models.User:
    user = models.User(
        email=email,
        name=name,
        password_hash=hash_password(PASSWORD),
        role=role,
        is_active=True,
        manager_id=manager_id,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _login(client: TestClient, email: str) -> str:
    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _make_objective(db_session: Session, *, title: str = "Company objective") -> models.Objective:
    objective = models.Objective(title=title, level="company")
    db_session.add(objective)
    db_session.commit()
    db_session.refresh(objective)
    return objective


_GOAL_PAYLOAD = {
    "title": "Ship the feature",
    "target_metric": "Shipped to prod",
    "due_date": "2026-12-31",
    "progress_type": "percent",
}


# ============================================================================
# AC-020: an employee creates a goal linked to themselves
# ============================================================================


def test_ac020_employee_creates_a_goal_linked_to_themselves(
    client: TestClient, db_session: Session
) -> None:
    employee = _create_user(db_session, email="ac020-emp@example.com")
    token = _login(client, "ac020-emp@example.com")

    response = client.post("/goals", headers=_headers(token), json=dict(_GOAL_PAYLOAD))

    assert response.status_code == 201, response.text
    body = response.json()
    assert body["owner_id"] == str(employee.id)
    assert body["created_by"] == str(employee.id)
    assert body["title"] == "Ship the feature"
    row = db_session.query(models.Goal).filter_by(id=uuid.UUID(body["id"])).first()
    assert row is not None
    assert row.owner_id == employee.id


# ============================================================================
# AC-021: missing title / missing due_date each return 422 naming the field,
# and persist no row
# ============================================================================


def test_ac021_missing_title_returns_422_naming_the_field_and_persists_no_row(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac021a-emp@example.com")
    token = _login(client, "ac021a-emp@example.com")
    payload = dict(_GOAL_PAYLOAD)
    del payload["title"]

    response = client.post("/goals", headers=_headers(token), json=payload)

    assert response.status_code == 422, response.text
    fields = {err["loc"][-1] for err in response.json()["detail"]}
    assert "title" in fields
    assert db_session.query(models.Goal).count() == 0


def test_ac021_missing_due_date_returns_422_naming_the_field_and_persists_no_row(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac021b-emp@example.com")
    token = _login(client, "ac021b-emp@example.com")
    payload = dict(_GOAL_PAYLOAD)
    del payload["due_date"]

    response = client.post("/goals", headers=_headers(token), json=payload)

    assert response.status_code == 422, response.text
    fields = {err["loc"][-1] for err in response.json()["detail"]}
    assert "due_date" in fields
    assert db_session.query(models.Goal).count() == 0


# ============================================================================
# AC-022: editing title, description, target_metric and due_date persists
# ============================================================================


def test_ac022_edit_of_title_description_target_and_due_date_persists(
    client: TestClient, db_session: Session
) -> None:
    employee = _create_user(db_session, email="ac022-emp@example.com")
    token = _login(client, "ac022-emp@example.com")
    goal = models.Goal(
        owner_id=employee.id,
        created_by=employee.id,
        title="Original title",
        target_metric="Original metric",
        progress_type="percent",
        status="In progress",
        due_date=datetime.date(2026, 6, 1),
    )
    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)

    response = client.put(
        f"/goals/{goal.id}",
        headers=_headers(token),
        json={
            "title": "Updated title",
            "description": "Updated description",
            "target_metric": "Updated metric",
            "due_date": "2026-09-30",
        },
    )

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["title"] == "Updated title"
    assert body["description"] == "Updated description"
    assert body["target_metric"] == "Updated metric"
    assert body["due_date"] == "2026-09-30"

    db_session.refresh(goal)
    assert goal.title == "Updated title"
    assert goal.description == "Updated description"
    assert goal.target_metric == "Updated metric"
    assert goal.due_date == datetime.date(2026, 9, 30)


# ============================================================================
# AC-023: a manager-created goal for a direct report appears in that
# report's GET /goals with owner_id = report
# ============================================================================


def test_ac023_manager_created_goal_appears_in_reports_goals_with_owner_id(
    client: TestClient, db_session: Session
) -> None:
    manager = _create_user(db_session, email="ac023-mgr@example.com", role="manager")
    report = _create_user(
        db_session, email="ac023-report@example.com", manager_id=manager.id
    )
    manager_token = _login(client, "ac023-mgr@example.com")

    payload = dict(_GOAL_PAYLOAD)
    payload["owner_id"] = str(report.id)
    create = client.post("/goals", headers=_headers(manager_token), json=payload)
    assert create.status_code == 201, create.text
    assert create.json()["owner_id"] == str(report.id)

    report_token = _login(client, "ac023-report@example.com")
    goals = client.get("/goals", headers=_headers(report_token))

    assert goals.status_code == 200
    matches = [g for g in goals.json() if g["title"] == _GOAL_PAYLOAD["title"]]
    assert len(matches) == 1
    assert matches[0]["owner_id"] == str(report.id)


# ============================================================================
# AC-024: assignment outside the reporting line returns 403 and writes no row
# ============================================================================


def test_ac024_assignment_outside_reporting_line_returns_403_and_writes_no_row(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac024-mgr@example.com", role="manager")
    outsider = _create_user(db_session, email="ac024-outsider@example.com")
    manager_token = _login(client, "ac024-mgr@example.com")

    payload = dict(_GOAL_PAYLOAD)
    payload["owner_id"] = str(outsider.id)
    response = client.post("/goals", headers=_headers(manager_token), json=payload)

    assert response.status_code == 403, response.text
    assert db_session.query(models.Goal).count() == 0


# ============================================================================
# AC-025: goal links to an existing objective and the parent is returned;
# unknown objective id -> 404
# ============================================================================


def test_ac025_goal_links_to_existing_objective_and_parent_is_returned(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac025-emp@example.com")
    token = _login(client, "ac025-emp@example.com")
    objective = _make_objective(db_session, title="Grow revenue")

    payload = dict(_GOAL_PAYLOAD)
    payload["parent_objective_id"] = str(objective.id)
    response = client.post("/goals", headers=_headers(token), json=payload)

    assert response.status_code == 201, response.text
    assert response.json()["parent_objective_id"] == str(objective.id)


def test_ac025_unknown_objective_id_returns_404(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac025b-emp@example.com")
    token = _login(client, "ac025b-emp@example.com")

    payload = dict(_GOAL_PAYLOAD)
    payload["parent_objective_id"] = str(uuid.uuid4())
    response = client.post("/goals", headers=_headers(token), json=payload)

    assert response.status_code == 404, response.text
    assert db_session.query(models.Goal).count() == 0


def test_ac025_unknown_objective_id_on_update_returns_404(
    client: TestClient, db_session: Session
) -> None:
    employee = _create_user(db_session, email="ac025c-emp@example.com")
    token = _login(client, "ac025c-emp@example.com")
    goal = models.Goal(
        owner_id=employee.id,
        created_by=employee.id,
        title="A goal",
        target_metric="done",
        progress_type="percent",
        status="In progress",
        due_date=datetime.date(2026, 12, 31),
    )
    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)

    response = client.put(
        f"/goals/{goal.id}",
        headers=_headers(token),
        json={"parent_objective_id": str(uuid.uuid4())},
    )

    assert response.status_code == 404, response.text
    db_session.refresh(goal)
    assert goal.parent_objective_id is None


# ============================================================================
# AC-026: a goal with no parent objective saves and lists as standalone
# ============================================================================


def test_ac026_goal_with_no_parent_saves_and_lists_as_standalone(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac026-emp@example.com")
    token = _login(client, "ac026-emp@example.com")

    create = client.post("/goals", headers=_headers(token), json=dict(_GOAL_PAYLOAD))
    assert create.status_code == 201, create.text
    assert create.json()["parent_objective_id"] is None

    listed = client.get("/goals", headers=_headers(token))
    assert listed.status_code == 200
    matches = [g for g in listed.json() if g["title"] == _GOAL_PAYLOAD["title"]]
    assert len(matches) == 1
    assert matches[0]["parent_objective_id"] is None
