# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### PLAN-001 · approved · source: plan:PMS23

PMS23's development plan is approved at version 1. It organizes the full backlog (6 epics, 16 stories, several sub-tasks) into 5 sprints of 20-point capacity each, progressing from auth/people-data foundations through RBAC, data protection, goal management, reminders, and praise/recognition.

Plan status: approved, version 1. Five sprints defined, each with a stated goal and capacity=20: Sprint 1 (auth + employee records/reporting lines), Sprint 2 (RBAC, password recovery, praise notes), Sprint 3 (HR data-protection tooling + goal creation/cascading), Sprint 4 (goal progress updates, check-ins, personal dashboard), Sprint 5 (reminders + manager team-goals view). Backlog items are listed with story points and an assigned role per story/task, grouped under 6 epics (EPIC-001 through EPIC-006) covering US-001 through US-016.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006

- ⚠ No development progress, ticket status (in-progress/done), code artifacts, or completion dates were provided for any sprint or item -- only the plan/backlog structure is available.
- ⚠ Items carry points and roles but are not explicitly tagged with a sprint number in the input; sprint-to-item associations in this documentation are inferred from each sprint's goal text, not stated directly.
- ⚠ US-016 (View praise received) is not mentioned in any sprint goal text, so its sprint assignment is unconfirmed even though it sits under the Praise & Recognition epic alongside US-015 which is named in Sprint 2's goal.

### SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 goal: stand up authentication and the organisation's people data -- login/logout and HR-managed employee records with reporting lines. Capacity: 20 points.

Goal: 'Stand up authentication and the organisation's people data: login/logout and HR-managed employee records with reporting lines.' Capacity=20. Inferred in-scope stories based on goal wording: US-001 (Email/password login, 8pts), US-004 (HR creates/maintains employee records, 5pts), US-005 (Define/maintain reporting lines, 5pts) -- totaling 18 of 20 points.

**Related:** US-001, US-004, US-005

- ⚠ Sprint-to-item mapping is inferred from the goal description, not explicitly stated by the input.
- ⚠ No record of whether Sprint 1 was executed, partially completed, or carried over.

### SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 goal: enforce role-based access control, enable password recovery, and ship praise/recognition notes. Capacity: 20 points.

Goal: 'Enforce role-based access control, enable password recovery, and ship praise/recognition notes.' Capacity=20. Inferred in-scope stories: US-002 (Role-based access to sensitive HR data, 8pts), US-003 (Password reset, 3pts), US-015 (Give a praise/recognition note, 3pts) -- totaling 14 of 20 points.

**Related:** US-002, US-003, US-015

- ⚠ Sprint-to-item mapping is inferred from the goal description, not explicitly stated by the input.
- ⚠ US-016 (View praise received) is thematically related but not named in this sprint's goal -- its sprint is unconfirmed.
- ⚠ No record of execution/completion status for this sprint.

### SPRINT-3 · approved · source: plan:Sprint 3

Sprint 3 goal: deliver HR data-protection tooling and core goal creation/assignment, including optional cascading to objectives. Capacity: 20 points.

Goal: 'Deliver HR data-protection tooling and core goal creation/assignment, including optional cascading to objectives.' Capacity=20. Inferred in-scope stories: US-006 (Data protection: export, delete, audit trail, 5pts), US-007 (Create a SMART/OKR goal, 5pts), US-008 (Manager sets goals for direct reports, 5pts), US-009 (Optionally cascade a goal, 3pts) -- totaling 18 of 20 points.

**Related:** US-006, US-007, US-008, US-009

- ⚠ Sprint-to-item mapping is inferred from the goal description, not explicitly stated by the input.
- ⚠ No record of execution/completion status for this sprint.

### SPRINT-4 · approved · source: plan:Sprint 4

Sprint 4 goal: enable goal progress updates, check-ins, and the employee's personal goal dashboard. Capacity: 20 points.

Goal: 'Enable goal progress updates, check-ins, and the employee's personal goal dashboard.' Capacity=20. Inferred in-scope stories: US-010 (Update goal progress by % or status, 5pts), US-011 (Record periodic check-ins, 3pts), US-013 (Employee views personal goal dashboard, 5pts) -- totaling 13 of 20 points.

**Related:** US-010, US-011, US-013

- ⚠ Sprint-to-item mapping is inferred from the goal description, not explicitly stated by the input.
- ⚠ No record of execution/completion status for this sprint.

### SPRINT-5 · approved · source: plan:Sprint 5

Sprint 5 goal: deliver due-date/check-in reminders and the manager's team goals view. Capacity: 20 points.

Goal: 'Deliver due-date/check-in reminders and the manager's team goals view.' Capacity=20. Inferred in-scope stories: US-012 (Due-date and check-in reminders, 8pts, with tasks US-012-T1 scheduled reminder job/devops-agent, US-012-T2 SendGrid integration with failure logging/integration-agent, US-012-T3 in-app notification list + read/dismiss endpoints/backend-agent), US-014 (Manager views direct reports' goals, 5pts) -- totaling 13 of 20 points.

**Related:** US-012, US-014

- ⚠ Sprint-to-item mapping is inferred from the goal description, not explicitly stated by the input.
- ⚠ No record of execution/completion status for this sprint.

### EPIC-001 · approved · source: plan:EPIC-001

Epic covering access, authentication, and role-based access control: login/logout, RBAC enforcement, and password reset.

EPIC-001 'Access, Authentication & Role-Based Access Control' (no points/role -- organizational container). Contains: US-001 Email/password login (8pts, backend-agent) with tasks US-001-T1 login/logout endpoints with credential verification and session issuance (backend-agent), US-001-T2 login page with generic error messaging (frontend-agent), US-001-T3 role-based post-login redirect (frontend-agent); US-002 Role-based access to sensitive HR data (8pts, backend-agent) with tasks US-002-T1 role-based authorization dependency for FastAPI routes (backend-agent), US-002-T2 manager-scoped data filtering based on reporting line (backend-agent), US-002-T3 enforce read-only executive access across edit endpoints (backend-agent); US-003 Password reset (3pts, backend-agent, no sub-tasks listed).

**Related:** US-001, US-002, US-003

### EPIC-002 · approved · source: plan:EPIC-002

Epic covering employee records and reporting-line management, plus HR data-protection tooling.

EPIC-002 'Employee Records & Reporting-Line Management' (no points/role -- organizational container). Contains: US-004 HR creates and maintains employee records (5pts, backend-agent, no sub-tasks listed); US-005 Define and maintain reporting lines (5pts, backend-agent, no sub-tasks listed); US-006 Data protection: export, delete and audit trail (5pts, security-agent, no sub-tasks listed).

**Related:** US-004, US-005, US-006

- ⚠ None of US-004, US-005, US-006 have sub-tasks broken out in the plan, unlike other stories -- unclear if that work is undecomposed or simply not captured.

### EPIC-003 · approved · source: plan:EPIC-003

Epic covering goal setting using SMART/OKR structure, including manager-assigned goals and optional cascading.

EPIC-003 'Goal Setting (SMART/OKR)' (no points/role -- organizational container). Contains: US-007 Create a goal with SMART/OKR structure (5pts, backend-agent); US-008 Manager sets goals for direct reports (5pts, backend-agent); US-009 Optionally cascade a goal from a higher-level objective (3pts, backend-agent). No sub-tasks listed for any of these three stories.

**Related:** US-007, US-008, US-009

- ⚠ No sub-task breakdown provided for US-007, US-008, or US-009.

### EPIC-004 · approved · source: plan:EPIC-004

Epic covering goal progress tracking, due dates, check-ins, and reminder notifications.

EPIC-004 'Goal Progress Tracking, Due Dates & Check-ins' (no points/role -- organizational container). Contains: US-010 Update goal progress by percentage or status (5pts, backend-agent, no sub-tasks); US-011 Record periodic check-ins on a goal (3pts, backend-agent, no sub-tasks); US-012 Due-date and check-in reminders (8pts, integration-agent) with tasks US-012-T1 scheduled reminder job for due dates/overdue check-ins (devops-agent), US-012-T2 SendGrid email integration with failure logging (integration-agent), US-012-T3 in-app notification list with read/dismiss endpoints (backend-agent).

**Related:** US-010, US-011, US-012

### EPIC-005 · approved · source: plan:EPIC-005

Epic covering the personal and team-level goal dashboards for employees and managers.

EPIC-005 'Personal Goal Dashboard' (no points/role -- organizational container). Contains: US-013 Employee views personal goal dashboard (5pts, frontend-agent, no sub-tasks); US-014 Manager views direct reports' goals (5pts, frontend-agent, no sub-tasks).

**Related:** US-013, US-014

- ⚠ No sub-task breakdown provided for US-013 or US-014.

### EPIC-006 · approved · source: plan:EPIC-006

Epic covering praise and recognition notes between colleagues.

EPIC-006 'Praise & Recognition' (no points/role -- organizational container). Contains: US-015 Give a praise/recognition note (3pts, backend-agent, no sub-tasks); US-016 View praise received (2pts, frontend-agent, no sub-tasks).

**Related:** US-015, US-016

- ⚠ No sub-task breakdown provided for US-015 or US-016.
- ⚠ US-016 is not referenced by name in any sprint goal, so its sprint timing is unconfirmed (see PLAN-001 and SPRINT-2 gaps).
<!-- sdlc:auto:end narrative -->
