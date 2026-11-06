"""Unit tests for the password-reset confirm request's password rules."""

import pytest
from pydantic import ValidationError

from app.schemas import PasswordResetConfirmRequest


def _errors_for(password: str) -> str:
    with pytest.raises(ValidationError) as exc_info:
        PasswordResetConfirmRequest(token="t", new_password=password)
    return str(exc_info.value)


def test_password_rule_rejects_too_short_password() -> None:
    assert "at least 8 characters" in _errors_for("Ab1")


def test_password_rule_rejects_missing_uppercase() -> None:
    assert "uppercase" in _errors_for("lowercase1")


def test_password_rule_rejects_missing_lowercase() -> None:
    assert "lowercase" in _errors_for("UPPERCASE1")


def test_password_rule_rejects_missing_digit() -> None:
    assert "digit" in _errors_for("NoDigitsHere")


def test_password_rule_accepts_compliant_password() -> None:
    request = PasswordResetConfirmRequest(token="t", new_password="GoodPass1")
    assert request.new_password == "GoodPass1"
