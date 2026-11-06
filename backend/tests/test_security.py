"""Proves the auth primitives actually work in this environment.

passlib 1.7.4 (its last release) is incompatible with bcrypt>=4.1 -- the
version this project's architecture requires -- in a way that makes every
hash/verify call raise before application code runs at all, not just a
warning. `app.security` patches around it; this test is what would catch a
dependency bump silently undoing that patch.
"""

from app.security import create_access_token, decode_access_token, hash_password, verify_password


def test_password_hash_round_trips() -> None:
    hashed = hash_password("correct horse battery staple")

    assert hashed != "correct horse battery staple"
    assert verify_password("correct horse battery staple", hashed)
    assert not verify_password("wrong password", hashed)


def test_access_token_round_trips_subject_and_role() -> None:
    token = create_access_token(subject="user-123", role="manager")

    payload = decode_access_token(token)

    assert payload["sub"] == "user-123"
    assert payload["role"] == "manager"
