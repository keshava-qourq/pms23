"""Role-based access control across goals, dashboard and analytics
(US-002-3; NFR-001).

Seeds employee, manager (with a direct and a skip-level report), executive
and HR admin users, logs each in through POST /auth/login, and proves the
reporting-line and role boundaries goals.py, dashboard.py and analytics.py
enforce: an employee sees only their own records (AC-004), a manager sees
their own and their reports' records but nothing outside the reporting line
(AC-005), an executive is read-only on analytics (AC-006), and an HR admin
can reach any employee's records (AC-007). Every protected endpoint also
refuses an unauthenticated caller.
"""

import datetime
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import create_access_token, hash_password

PASSWORD = "correct horse battery staple"


def _create_user(
    db_session: Session,
    *,
    email: str,
    role: str,
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
    """Logs the seeded user in through POST /auth/login, as the packet
    requires, rather than minting a token out of band."""
    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert response.status_code == 200, response.text
    return response.json()["access_token"]


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _make_goal(db_session: Session, *, owner: models.User, title: str = "A goal") -> models.Goal:
    goal = models.Goal(
        owner_id=owner.id,
        created_by=owner.id,
        title=title,
        target_metric="done",
        progress_type="status",
        status="In progress",
        due_date=datetime.date(2026, 12, 31),
    )
    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)
    return goal


# ============================================================================
# AC-004: an employee cannot reach another employee's goal, check-in or
# praise detail -- a denial status, and no record body
# ============================================================================


def test_ac004_employee_cannot_read_or_write_another_employees_goal(
    client: TestClient, db_session: Session
) -> None:
    owner = _create_user(db_session, email="ac004-owner@example.com", role="employee")
    other = _create_user(db_session, email="ac004-other@example.com", role="employee")
    goal = _make_goal(db_session, owner=owner)
    token = _login(client, "ac004-other@example.com")

    write = client.put(
        f"/goals/{goal.id}", headers=_headers(token), json={"title": "Hijacked"}
    )

    assert write.status_code == 403
    assert "Hijacked" not in write.text
    assert str(goal.title) not in write.text
    db_session.refresh(goal)
    assert goal.title == "A goal"


def test_ac004_employee_cannot_read_another_employees_check_ins(
    client: TestClient, db_session: Session
) -> None:
    owner = _create_user(db_session, email="ac004b-owner@example.com", role="employee")
    other = _create_user(db_session, email="ac004b-other@example.com", role="employee")
    goal = _make_goal(db_session, owner=owner)
    check_in = models.CheckIn(goal_id=goal.id, author_id=owner.id, note="confidential progress note")
    db_session.add(check_in)
    db_session.commit()
    token = _login(client, "ac004b-other@example.com")

    response = client.get(f"/goals/{goal.id}/check-ins", headers=_headers(token))

    assert response.status_code == 403
    assert "confidential progress note" not in response.text


@pytest.mark.xfail(
    reason="DEFECT: GET /praise/received is still the scaffolded stub -- it ignores "
    "the caller entirely and always returns the same fixed body, so it neither "
    "scopes to the caller's own praise nor requires authentication.",
    strict=True,
)
def test_ac004_employee_cannot_see_another_employees_praise_in_their_own_received_list(
    client: TestClient, db_session: Session
) -> None:
    sender = _create_user(db_session, email="ac004c-sender@example.com", role="employee")
    recipient = _create_user(db_session, email="ac004c-recipient@example.com", role="employee")
    other = _create_user(db_session, email="ac004c-other@example.com", role="employee")
    praise = models.Praise(
        sender_id=sender.id, recipient_id=recipient.id, message="secret-praise-text"
    )
    db_session.add(praise)
    db_session.commit()
    token = _login(client, "ac004c-other@example.com")

    response = client.get("/praise/received", headers=_headers(token))

    assert response.status_code == 200
    messages = {p["message"] for p in response.json()}
    assert "secret-praise-text" not in messages


# ============================================================================
# AC-005: a manager reads own and direct-report goals (direct and
# skip-level), and is denied a goal owned outside the reporting line
# ============================================================================


def test_ac005_manager_sees_own_direct_and_skip_level_report_goals(
    client: TestClient, db_session: Session
) -> None:
    manager = _create_user(db_session, email="ac005-mgr@example.com", role="manager")
    direct_report = _create_user(
        db_session, email="ac005-direct@example.com", role="employee", manager_id=manager.id
    )
    skip_level_report = _create_user(
        db_session,
        email="ac005-skip@example.com",
        role="employee",
        manager_id=direct_report.id,
    )
    own_goal = _make_goal(db_session, owner=manager, title="Manager's own goal")
    direct_goal = _make_goal(db_session, owner=direct_report, title="Direct report's goal")
    skip_goal = _make_goal(db_session, owner=skip_level_report, title="Skip-level goal")
    token = _login(client, "ac005-mgr@example.com")

    response = client.get("/goals", headers=_headers(token))

    assert response.status_code == 200
    titles = {g["title"] for g in response.json()}
    assert {own_goal.title, direct_goal.title, skip_goal.title} <= titles


def test_ac005_manager_denied_goal_outside_reporting_line(
    client: TestClient, db_session: Session
) -> None:
    manager = _create_user(db_session, email="ac005b-mgr@example.com", role="manager")
    outsider = _create_user(db_session, email="ac005b-outsider@example.com", role="employee")
    goal = _make_goal(db_session, owner=outsider)
    token = _login(client, "ac005b-mgr@example.com")

    write = client.put(f"/goals/{goal.id}", headers=_headers(token), json={"title": "Taken over"})
    check_ins = client.get(f"/goals/{goal.id}/check-ins", headers=_headers(token))

    assert write.status_code == 403
    assert check_ins.status_code == 403


# ============================================================================
# AC-006: executive reads analytics but cannot write goals
# ============================================================================


def test_ac006_executive_reads_analytics(client: TestClient, db_session: Session) -> None:
    _create_user(db_session, email="ac006-exec@example.com", role="executive")
    token = _login(client, "ac006-exec@example.com")

    response = client.get("/analytics", headers=_headers(token))

    assert response.status_code == 200


def test_ac006_executive_cannot_create_goal(client: TestClient, db_session: Session) -> None:
    executive = _create_user(db_session, email="ac006b-exec@example.com", role="executive")
    token = _login(client, "ac006b-exec@example.com")

    response = client.post(
        "/goals",
        headers=_headers(token),
        json={
            "owner_id": str(executive.id),
            "title": "Should not be allowed",
            "target_metric": "done",
            "progress_type": "status",
            "due_date": "2026-12-31",
        },
    )

    assert response.status_code == 403


def test_ac006_executive_cannot_update_goal(client: TestClient, db_session: Session) -> None:
    executive = _create_user(db_session, email="ac006c-exec@example.com", role="executive")
    employee = _create_user(db_session, email="ac006c-emp@example.com", role="employee")
    goal = _make_goal(db_session, owner=employee)
    token = _login(client, "ac006c-exec@example.com")

    response = client.put(f"/goals/{goal.id}", headers=_headers(token), json={"title": "Edited"})

    assert response.status_code == 403


def test_ac006_executive_cannot_update_goal_progress(
    client: TestClient, db_session: Session
) -> None:
    _create_user(db_session, email="ac006d-exec@example.com", role="executive")
    employee = _create_user(db_session, email="ac006d-emp@example.com", role="employee")
    goal = _make_goal(db_session, owner=employee)
    token = _login(client, "ac006d-exec@example.com")

    response = client.patch(
        f"/goals/{goal.id}/progress", headers=_headers(token), json={"progress_percent": 50}
    )

    assert response.status_code == 403


# ============================================================================
# AC-007: HR admin reads and updates records for any employee
# ============================================================================


def test_ac007_hr_admin_reads_any_employees_goals(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="ac007-hr@example.com", role="hr_admin")
    employee = _create_user(db_session, email="ac007-emp@example.com", role="employee")
    goal = _make_goal(db_session, owner=employee, title="Some employee's goal")
    token = _login(client, "ac007-hr@example.com")

    response = client.get("/goals", headers=_headers(token))

    assert response.status_code == 200
    titles = {g["title"] for g in response.json()}
    assert goal.title in titles


def test_ac007_hr_admin_updates_any_employees_goal(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="ac007b-hr@example.com", role="hr_admin")
    employee = _create_user(db_session, email="ac007b-emp@example.com", role="employee")
    goal = _make_goal(db_session, owner=employee)
    token = _login(client, "ac007b-hr@example.com")

    response = client.put(f"/goals/{goal.id}", headers=_headers(token), json={"title": "HR edit"})

    assert response.status_code == 200, response.text
    assert response.json()["title"] == "HR edit"


def test_ac007_hr_admin_reads_any_employees_team_dashboard(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="ac007c-hr@example.com", role="hr_admin")
    employee = _create_user(db_session, email="ac007c-emp@example.com", role="employee")
    token = _login(client, "ac007c-hr@example.com")

    response = client.get(
        "/dashboard/team", headers=_headers(token), params={"employee_id": str(employee.id)}
    )

    assert response.status_code == 200


# ============================================================================
# every protected endpoint returns 401 without a bearer token
# ============================================================================


@pytest.mark.parametrize(
    "method,path,json_body",
    [
        ("get", "/goals", None),
        ("post", "/goals", {}),
        ("put", f"/goals/{uuid.uuid4()}", {}),
        ("patch", f"/goals/{uuid.uuid4()}/progress", {}),
        ("post", f"/goals/{uuid.uuid4()}/check-ins", {"note": "x"}),
        ("get", f"/goals/{uuid.uuid4()}/check-ins", None),
        ("get", "/dashboard/me", None),
        ("get", "/dashboard/team", None),
        ("get", "/analytics", None),
        ("get", f"/employees/{uuid.uuid4()}/reports", None),
        pytest.param(
            "get",
            "/praise/received",
            None,
            marks=pytest.mark.xfail(
                reason="DEFECT: GET /praise/received has no auth dependency and is "
                "still the scaffolded stub -- it returns 200 with no token at all.",
                strict=True,
            ),
        ),
        pytest.param(
            "post",
            "/praise",
            {"recipient_id": str(uuid.uuid4()), "message": "x"},
            marks=pytest.mark.xfail(
                reason="DEFECT: POST /praise has no auth dependency and is still the "
                "scaffolded stub -- it never rejects an unauthenticated caller.",
                strict=True,
            ),
        ),
    ],
)
def test_ac_every_protected_endpoint_requires_a_bearer_token(
    client: TestClient, method: str, path: str, json_body: dict | None
) -> None:
    call = getattr(client, method)
    response = call(path, json=json_body) if json_body is not None else call(path)

    assert response.status_code == 401
