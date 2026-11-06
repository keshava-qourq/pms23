"""Confirms the full API surface the approved spec describes is mounted.

A router that imports cleanly but never gets passed to `app.include_router`
would still let `test_health.py` pass, so this checks the one thing that
test can't: that every endpoint path the approved API spec names actually
has a route.
"""

from fastapi.testclient import TestClient

SPEC_PATHS = {
    "/auth/login",
    "/auth/logout",
    "/auth/password-reset/request",
    "/auth/password-reset/confirm",
    "/employees",
    "/employees/{id}",
    "/employees/{id}/deactivate",
    "/employees/{id}/manager",
    "/employees/{id}/export",
    "/employees/{id}/personal-data",
    "/audit-log",
    "/goals",
    "/goals/{id}",
    "/goals/{id}/progress",
    "/goals/{id}/check-ins",
    "/objectives",
    "/dashboard/me",
    "/dashboard/team",
    "/analytics",
    "/praise",
    "/praise/received",
    "/notifications",
    "/notifications/{id}/read",
}


def test_every_spec_path_is_mounted(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    assert SPEC_PATHS <= set(response.json()["paths"])
