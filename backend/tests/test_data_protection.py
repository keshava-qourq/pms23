"""Data export, anonymising deletion and the audit trail (US-006):
GET /employees/{id}/export, DELETE /employees/{id}/personal-data, and
GET /audit-log.

AC-017 export returns an attachment with the employee's own personal, goal
and check-in data. AC-018 deletion anonymises name/email, sets
anonymised_at, keeps goals, blocks login with the old email, and writes an
audit row with action 'personal_data_deleted' and the actor id. AC-019
audit entries carry actor_name/action/changes/created_at, are newest first,
and entity/date filters narrow the result. RBAC: employee, manager and
executive all get 403 on export, delete and /audit-log.
"""

import datetime
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import create_access_token, hash_password

PASSWORD = "Correct-Horse-Battery-Staple1"


def _create_user(
    db_session: Session,
    *,
    email: str,
    role: str,
    is_active: bool = True,
    name: str = "Test User",
) -> models.User:
    user = models.User(
        email=email,
        name=name,
        password_hash=hash_password(PASSWORD),
        role=role,
        is_active=is_active,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def _headers(user: models.User) -> dict:
    token = create_access_token(subject=str(user.id), role=user.role)
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
# AC-017: export returns 200, an attachment filename, and the employee's
# personal, goal and check-in data
# ============================================================================


def test_ac017_export_returns_attachment_with_personal_goal_and_checkin_data(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="hr-ac017@example.com", role="hr_admin")
    employee = _create_user(
        db_session, email="export-me@example.com", role="employee", name="Export Me"
    )
    goal = _make_goal(db_session, owner=employee, title="Export goal")
    check_in = models.CheckIn(goal_id=goal.id, author_id=employee.id, note="export check-in note")
    db_session.add(check_in)
    db_session.commit()

    response = client.get(f"/employees/{employee.id}/export", headers=_headers(hr_admin))

    assert response.status_code == 200, response.text
    assert response.headers["content-type"].startswith("application/json")
    disposition = response.headers.get("content-disposition", "")
    assert "attachment" in disposition
    assert f"employee-{employee.id}.json" in disposition

    body = response.json()
    assert body["employee"]["email"] == "export-me@example.com"
    assert body["employee"]["name"] == "Export Me"
    goal_titles = {g["title"] for g in body["goals"]}
    assert "Export goal" in goal_titles
    check_in_notes = {c["note"] for c in body["check_ins"]}
    assert "export check-in note" in check_in_notes


@pytest.mark.parametrize("role", ["employee", "manager", "executive"])
def test_rbac_export_is_hr_admin_only(client: TestClient, db_session: Session, role: str) -> None:
    caller = _create_user(db_session, email=f"export-caller-{role}@example.com", role=role)
    employee = _create_user(db_session, email=f"export-target-{role}@example.com", role="employee")

    response = client.get(f"/employees/{employee.id}/export", headers=_headers(caller))

    assert response.status_code == 403


# ============================================================================
# AC-018: deletion returns 204, name/email anonymised, anonymised_at set,
# goals survive, login with the old email fails, and an audit row with
# action 'personal_data_deleted' and the actor id exists
# ============================================================================


def test_ac018_personal_data_deletion_anonymises_and_writes_audit_row(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(db_session, email="hr-ac018@example.com", role="hr_admin")
    employee = _create_user(
        db_session, email="delete-me@example.com", role="employee", name="Delete Me"
    )
    goal = _make_goal(db_session, owner=employee, title="Surviving goal")
    original_email = employee.email

    response = client.delete(
        f"/employees/{employee.id}/personal-data",
        headers=_headers(hr_admin),
        json={"reason": "Approved GDPR erasure request DPR-0099"},
    )

    assert response.status_code == 204, response.text
    db_session.refresh(employee)
    assert employee.name != "Delete Me"
    assert employee.email != original_email
    assert employee.anonymised_at is not None

    assert db_session.query(models.Goal).filter_by(id=goal.id).count() == 1

    login = client.post("/auth/login", json={"email": original_email, "password": PASSWORD})
    assert login.status_code == 401

    audit = client.get("/audit-log", headers=_headers(hr_admin))
    assert audit.status_code == 200
    matches = [
        e
        for e in audit.json()
        if e["entity_id"] == str(employee.id) and e["action"] == "personal_data_deleted"
    ]
    assert len(matches) == 1
    assert matches[0]["actor_id"] == str(hr_admin.id)


def test_ac018_missing_reason_returns_422(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac018b@example.com", role="hr_admin")
    employee = _create_user(db_session, email="no-reason@example.com", role="employee")

    response = client.delete(
        f"/employees/{employee.id}/personal-data", headers=_headers(hr_admin), json={}
    )

    assert response.status_code == 422


def test_ac018_unknown_employee_id_returns_404(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac018c@example.com", role="hr_admin")

    response = client.delete(
        f"/employees/{uuid.uuid4()}/personal-data",
        headers=_headers(hr_admin),
        json={"reason": "no such employee"},
    )

    assert response.status_code == 404


@pytest.mark.parametrize("role", ["employee", "manager", "executive"])
def test_rbac_delete_personal_data_is_hr_admin_only(
    client: TestClient, db_session: Session, role: str
) -> None:
    caller = _create_user(db_session, email=f"delete-caller-{role}@example.com", role=role)
    employee = _create_user(db_session, email=f"delete-target-{role}@example.com", role="employee")

    response = client.delete(
        f"/employees/{employee.id}/personal-data",
        headers=_headers(caller),
        json={"reason": "should be forbidden"},
    )

    assert response.status_code == 403


# ============================================================================
# AC-019: audit entries carry actor_name/action/changes/created_at, ordered
# newest first, and entity/date filters narrow the result
# ============================================================================


def test_ac019_audit_entries_exist_for_employee_update_and_manager_change(
    client: TestClient, db_session: Session
) -> None:
    hr_admin = _create_user(
        db_session, email="hr-ac019@example.com", role="hr_admin", name="HR Admin Person"
    )
    manager = _create_user(db_session, email="mgr-ac019@example.com", role="manager")
    employee = _create_user(db_session, email="emp-ac019@example.com", role="employee")

    update = client.put(
        f"/employees/{employee.id}",
        headers=_headers(hr_admin),
        json={"name": "Updated Name"},
    )
    assert update.status_code == 200

    reassign = client.put(
        f"/employees/{employee.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(manager.id)},
    )
    assert reassign.status_code == 200

    response = client.get("/audit-log", headers=_headers(hr_admin))
    assert response.status_code == 200
    entries = response.json()

    update_entries = [
        e for e in entries if e["entity_id"] == str(employee.id) and e["action"] == "updated"
    ]
    manager_entries = [
        e
        for e in entries
        if e["entity_id"] == str(employee.id) and e["action"] == "manager_changed"
    ]
    assert len(update_entries) == 1
    assert len(manager_entries) == 1
    for entry in (update_entries[0], manager_entries[0]):
        assert entry["actor_name"] == "HR Admin Person"
        assert entry["changes"] is not None
        assert entry["created_at"]

    # newest first
    timestamps = [e["created_at"] for e in entries]
    assert timestamps == sorted(timestamps, reverse=True)


def test_ac019_entity_filter_narrows_result(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac019b@example.com", role="hr_admin")
    manager = _create_user(db_session, email="mgr-ac019b@example.com", role="manager")
    employee = _create_user(db_session, email="emp-ac019b@example.com", role="employee")

    client.put(
        f"/employees/{employee.id}/manager",
        headers=_headers(hr_admin),
        json={"manager_id": str(manager.id)},
    )

    response = client.get(
        "/audit-log", headers=_headers(hr_admin), params={"entity": "reporting_line"}
    )

    assert response.status_code == 200
    entries = response.json()
    assert len(entries) >= 1
    assert all(e["action"] == "manager_changed" for e in entries)


def test_ac019_date_filter_narrows_result(client: TestClient, db_session: Session) -> None:
    hr_admin = _create_user(db_session, email="hr-ac019c@example.com", role="hr_admin")
    employee = _create_user(db_session, email="emp-ac019c@example.com", role="employee")

    client.put(
        f"/employees/{employee.id}",
        headers=_headers(hr_admin),
        json={"name": "Dated Update"},
    )

    future_date = (datetime.date.today() + datetime.timedelta(days=1)).isoformat()
    response = client.get(
        "/audit-log", headers=_headers(hr_admin), params={"from": future_date}
    )

    assert response.status_code == 200
    entries = response.json()
    assert not any(e["entity_id"] == str(employee.id) for e in entries)


@pytest.mark.parametrize("role", ["employee", "manager", "executive"])
def test_rbac_audit_log_is_hr_admin_only(client: TestClient, db_session: Session, role: str) -> None:
    caller = _create_user(db_session, email=f"audit-caller2-{role}@example.com", role=role)

    response = client.get("/audit-log", headers=_headers(caller))

    assert response.status_code == 403
