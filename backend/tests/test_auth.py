"""Login, logout and the no-disclosure contract `POST /auth/login` promises.

Covers the US-001-1 contract: a successful login returns a token and the
correct role home route; a wrong password and an unknown email return
byte-identical 401 bodies (NFR-002); a deactivated user cannot log in even
with the right password; and a token `POST /auth/logout` has denylisted no
longer works on a protected endpoint.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import models
from app.security import hash_password

PASSWORD = "correct horse battery staple"

ROLE_HOME_ROUTES = {
    "employee": "/dashboard",
    "manager": "/team",
    "hr_admin": "/employees",
    "executive": "/dashboard",
}


def _create_user(
    db_session: Session, *, email: str, role: str, is_active: bool = True, password: str = PASSWORD
) -> models.User:
    user = models.User(
        email=email,
        name="Test User",
        password_hash=hash_password(password),
        role=role,
        is_active=is_active,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


# ---- AC: successful login returns a token and the role's home route -------


@pytest.mark.parametrize("role,home_route", list(ROLE_HOME_ROUTES.items()))
def test_login_returns_token_and_role_home_route(
    client: TestClient, db_session: Session, role: str, home_route: str
) -> None:
    email = f"{role}@example.com"
    _create_user(db_session, email=email, role=role)

    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})

    assert response.status_code == 200
    body = response.json()
    assert body["access_token"]
    assert body["user"]["role"] == role
    assert body["user"]["email"] == email
    assert body["home_route"] == home_route


# ---- AC: wrong password and unknown email are indistinguishable -----------


def test_wrong_password_and_unknown_email_return_byte_identical_401_bodies(
    client: TestClient, db_session: Session
) -> None:
    email = "known-user@example.com"
    _create_user(db_session, email=email, role="employee")

    wrong_password = client.post("/auth/login", json={"email": email, "password": "not-it"})
    unknown_email = client.post(
        "/auth/login", json={"email": "nobody-here@example.com", "password": PASSWORD}
    )

    assert wrong_password.status_code == 401
    assert unknown_email.status_code == 401
    assert wrong_password.content == unknown_email.content


# ---- AC: a deactivated user cannot log in, even with the right password ---


def test_deactivated_user_cannot_log_in(client: TestClient, db_session: Session) -> None:
    email = "deactivated@example.com"
    _create_user(db_session, email=email, role="employee", is_active=False)
    baseline = client.post(
        "/auth/login", json={"email": "nobody-here@example.com", "password": PASSWORD}
    )

    response = client.post("/auth/login", json={"email": email, "password": PASSWORD})

    assert response.status_code == 401
    # Same generic body as an unknown email: deactivation is never disclosed either.
    assert response.content == baseline.content


# ---- AC: logout denylists the token; it no longer works afterwards --------


def test_logout_makes_token_unusable_on_protected_endpoint(
    client: TestClient, db_session: Session
) -> None:
    email = "logout-user@example.com"
    _create_user(db_session, email=email, role="employee")
    login = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    first_logout = client.post("/auth/logout", headers=headers)
    second_logout = client.post("/auth/logout", headers=headers)

    assert first_logout.status_code == 204
    assert second_logout.status_code == 401


# ---- AC: no password hash or plaintext password ever leaves the API -------


def test_no_password_hash_or_plaintext_in_login_and_logout_responses(
    client: TestClient, db_session: Session
) -> None:
    email = "leak-check@example.com"
    user = _create_user(db_session, email=email, role="employee")

    responses = [
        client.post("/auth/login", json={"email": email, "password": PASSWORD}),
        client.post("/auth/login", json={"email": email, "password": "wrong-password"}),
        client.post("/auth/login", json={"email": "unknown@example.com", "password": PASSWORD}),
    ]
    token = responses[0].json()["access_token"]
    responses.append(client.post("/auth/logout", headers={"Authorization": f"Bearer {token}"}))

    for response in responses:
        body_text = response.text
        assert PASSWORD not in body_text
        assert user.password_hash not in body_text
        assert "$2b$" not in body_text  # bcrypt hash marker, in case a different hash sneaks in
