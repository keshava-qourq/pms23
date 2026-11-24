# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

Foundation: authentication and employee/reporting-line data model

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | Email/password login | 8 | backend-agent | — |
| ↳ US-001-T1 | Task | Implement login/logout endpoints | — | backend-agent | — |
| ↳ US-001-T2 | Task | Build sign-in screen | — | frontend-agent | — |
| US-004 | Story | HR creates and maintains employee records | 5 | backend-agent | — |
| US-005 | Story | Define and maintain reporting lines | 5 | backend-agent | US-004 |

## Sprint 2: Sprint 2

RBAC enforcement, password reset, sign-in cleanup, praise & recognition

Capacity: 20 points · Committed: 17

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-002 | Story | Role-based access to sensitive HR data | 8 | backend-agent | US-001 |
| ↳ US-002-T1 | Task | Implement role/permission checks across endpoints | — | backend-agent | — |
| ↳ US-002-T2 | Task | Implement manager reporting-line scoping | — | backend-agent | — |
| ↳ US-002-T3 | Task | Add RBAC boundary test suite | — | qa-agent | — |
| US-003 | Story | Password reset | 3 | backend-agent | US-001 |
| US-017 | Story | Remove role-permission description text from sign-in form | 1 | frontend-agent | US-001 |
| US-015 | Story | Give a praise/recognition note | 3 | backend-agent | US-001 |
| US-016 | Story | View praise received | 2 | frontend-agent | US-015 |

## Sprint 3: Sprint 3

Data protection tooling and SMART/OKR goal creation, assignment & cascading

Capacity: 20 points · Committed: 18

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-006 | Story | Data protection: export, delete and audit trail | 5 | security-agent | US-004 |
| US-007 | Story | Create a goal with SMART/OKR structure | 5 | backend-agent | US-001 |
| US-008 | Story | Manager sets goals for direct reports | 5 | backend-agent | US-005, US-007 |
| US-009 | Story | Optionally cascade a goal from a higher-level objective | 3 | backend-agent | US-007 |

## Sprint 4: Sprint 4

Goal progress tracking, check-ins and personal dashboard

Capacity: 20 points · Committed: 3

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-011 | Story | Record periodic check-ins on a goal | 3 | backend-agent | US-007 |

## Sprint 5: Sprint 5

Reminders/notifications and manager team dashboard

Capacity: 20 points · Committed: 13

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-012 | Story | Due-date and check-in reminders | 8 | integration-agent | US-010, US-011 |
| ↳ US-012-T1 | Task | Implement due-date/check-in reminder scheduler | — | integration-agent | — |
| ↳ US-012-T2 | Task | Wire SendGrid email dispatch with fallback logging | — | integration-agent | — |
| ↳ US-012-T3 | Task | Implement in-app notification endpoints | — | backend-agent | — |
| US-014 | Story | Manager views direct reports' goals | 5 | frontend-agent | US-005, US-010 |

## Sprint 6: Sprint 6

Capacity: 20 points · Committed: 10

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-010 | Story | Update goal progress by percentage or status | 5 | backend-agent | US-007 |
| US-013 | Story | Employee views personal goal dashboard | 5 | frontend-agent | US-010 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
