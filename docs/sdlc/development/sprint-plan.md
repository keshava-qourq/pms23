# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Stand up authentication and the organisation's people data: login/logout and HR-managed employee records with reporting lines.

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Email/password login | 8 | backend-agent | — |
| ↳ US-001-T1 | Task | Implement login/logout endpoints with credential verification and session issuance | — | backend-agent | — |
| ↳ US-001-T2 | Task | Build login page with generic error messaging | — | frontend-agent | — |
| ↳ US-001-T3 | Task | Implement role-based post-login redirect | — | frontend-agent | — |
| US-004 | Story | HR creates and maintains employee records | 5 | backend-agent | — |
| US-005 | Story | Define and maintain reporting lines | 5 | backend-agent | US-004 |

## Sprint 2: Sprint 2

Enforce role-based access control, enable password recovery, and ship praise/recognition notes.

Capacity: 20 points · Committed: 17

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-002 | Story | Role-based access to sensitive HR data | 8 | backend-agent | US-001, US-005 |
| ↳ US-002-T1 | Task | Implement role-based authorization dependency for FastAPI routes | — | backend-agent | — |
| ↳ US-002-T2 | Task | Add manager-scoped data filtering based on reporting line | — | backend-agent | — |
| ↳ US-002-T3 | Task | Enforce read-only executive access across edit endpoints | — | backend-agent | — |
| US-003 | Story | Password reset | 3 | backend-agent | US-001 |
| US-015 | Story | Give a praise/recognition note | 3 | backend-agent | US-001 |
| US-016 | Story | View praise received | 2 | frontend-agent | US-015 |
| US-017 | Story | Remove role-permission description text from sign-in form | 1 | frontend-agent | — |

## Sprint 3: Sprint 3

Deliver HR data-protection tooling and core goal creation/assignment, including optional cascading to objectives.

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-006 | Story | Data protection: export, delete and audit trail | 5 | security-agent | US-004, US-005 |
| US-007 | Story | Create a goal with SMART/OKR structure | 5 | backend-agent | US-001, US-002 |
| US-008 | Story | Manager sets goals for direct reports | 5 | backend-agent | US-005, US-007 |
| US-009 | Story | Optionally cascade a goal from a higher-level objective | 3 | backend-agent | US-007 |

## Sprint 4: Sprint 4

Enable goal progress updates, check-ins, and the employee's personal goal dashboard.

Capacity: 20 points · Committed: 13

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-010 | Story | Update goal progress by percentage or status | 5 | backend-agent | US-007 |
| US-011 | Story | Record periodic check-ins on a goal | 3 | backend-agent | US-007 |
| US-013 | Story | Employee views personal goal dashboard | 5 | frontend-agent | US-007, US-010 |

## Sprint 5: Sprint 5

Deliver due-date/check-in reminders and the manager's team goals view.

Capacity: 20 points · Committed: 13

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-012 | Story | Due-date and check-in reminders | 8 | integration-agent | US-010, US-011 |
| ↳ US-012-T1 | Task | Implement scheduled reminder job for due dates and overdue check-ins | — | devops-agent | — |
| ↳ US-012-T2 | Task | Integrate SendGrid email sending with failure logging | — | integration-agent | — |
| ↳ US-012-T3 | Task | Implement in-app notification list and read/dismiss endpoints | — | backend-agent | — |
| US-014 | Story | Manager views direct reports' goals | 5 | frontend-agent | US-005, US-013 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
