<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-11-05

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Django REST Framework
- Express

## Decision Outcome

Chosen option: FastAPI 0.115, because Expresses RBAC, configurable goal/check-in rules and the audit trail clearly, with Pydantic request validation enforcing permission and form checks before data is written.

## Consequences

Background scheduling is not built in, so a separate arq worker process is introduced for reminders.
<!-- sdlc:auto:end adr -->