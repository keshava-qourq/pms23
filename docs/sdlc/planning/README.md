# Planning

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### EPIC-001 · approved · source: planning:EPIC-001

Foundation for the internal performance management tool: email/password login and four-role access control (employee, manager, HR admin, executive) so sensitive HR data is only visible to authorised people.

Underpins every other capability in the system. Assumptions stated in input: four roles (employee, manager, HR admin, executive/leadership read-only analytics) assumed from confirmed understanding, not independently verified; email/password authentication only, no SSO or HRIS directory sync in first release; no payment, billing or subscription functionality exists, as this is an internal single-organisation tool and such capability is intentionally absent.

**Related:** US-001, US-002, US-003, US-017

### EPIC-002 · approved · source: planning:EPIC-002

HR admins manually create and maintain employee accounts and the organisation's reporting structure inside the app, since there is no HRIS or SSO sync in the first release, including basic data-protection handling of these records.

Assumption stated in input: performance/employee data is treated as sensitive HR data; a single jurisdiction with GDPR-style practices (access control, retention, export/delete on request) and an audit trail is assumed because the region was not specified.

**Related:** US-004, US-005, US-006

### EPIC-003 · approved · source: planning:EPIC-003

Employees and managers create goals with a SMART/OKR-style structure, optionally cascaded from company or manager objectives.

Assumption stated in input: a SMART/OKR-style goal structure (specific, measurable, with a target and timeframe) is assumed from the confirmed understanding. Cascading from higher-level objectives is optional, not mandatory.

**Related:** US-007, US-008, US-009

### EPIC-004 · approved · source: planning:EPIC-004

Goals are kept up to date through percentage or status progress, due dates, and periodic check-ins, with reminders so updates actually happen.

Assumptions stated in input: progress may be expressed as a percentage or a status value; periodic check-in cadence is assumed and configurable per goal; email reminders require an email-sending service and credential (e.g. SendGrid/SMTP API key, placeholder: <email-service-api-key>) to be provisioned; in-app notifications are also provided as a fallback channel.

**Related:** US-010, US-011, US-012

### EPIC-005 · approved · source: planning:EPIC-005

Each employee has a personal dashboard summarising their own goals, progress and upcoming due dates; managers can view the goals of their direct reports consistent with role-based access.

No additional assumptions stated for this epic beyond those already recorded under EPIC-001 (RBAC) which this epic depends on.

**Related:** US-013, US-014

### EPIC-006 · approved · source: planning:EPIC-006

Lightweight continuous feedback: employees and managers can give praise/recognition notes to colleagues, visible to the recipient.

Input explicitly notes peer/360 feedback, 1:1 notes and structured reviews are out of scope for this MVP.

**Related:** US-015, US-016

### SPRINT-1 · draft · source: planning:Sprint 1

Sprint 1 goal: Foundation: authentication and employee/reporting-line data model. Capacity: 20 points.

Plan version 1 (status: generated, not yet marked approved). Goal text names authentication and the employee/reporting-line data model, which corresponds to EPIC-001 (login, US-001) and EPIC-002 (employee records and reporting lines, US-004/US-005); this mapping is inferred from the sprint goal wording, as the input does not explicitly assign individual plan items to specific sprints.

**Related:** EPIC-001, EPIC-002, US-001, US-004, US-005

### SPRINT-2 · draft · source: planning:Sprint 2

Sprint 2 goal: RBAC enforcement, password reset, sign-in cleanup, praise & recognition. Capacity: 20 points.

Plan version 1 (status: generated). Goal text maps to US-002 (RBAC enforcement), US-003 (password reset), US-017 (sign-in cleanup), and EPIC-006 (praise & recognition, US-015/US-016); mapping inferred from sprint goal wording since items are not explicitly assigned to sprints in the input.

**Related:** US-002, US-003, US-017, EPIC-006, US-015, US-016

### SPRINT-3 · draft · source: planning:Sprint 3

Sprint 3 goal: Data protection tooling and SMART/OKR goal creation, assignment & cascading. Capacity: 20 points.

Plan version 1 (status: generated). Goal text maps to US-006 (data protection: export, delete, audit trail) and EPIC-003 (goal creation/assignment/cascading: US-007, US-008, US-009); mapping inferred from sprint goal wording since items are not explicitly assigned to sprints in the input.

**Related:** US-006, US-007, US-008, US-009

### SPRINT-4 · draft · source: planning:Sprint 4

Sprint 4 goal: Goal progress tracking, check-ins and personal dashboard. Capacity: 20 points.

Plan version 1 (status: generated). Goal text maps to US-010 (progress tracking), US-011 (check-ins), and US-013 (personal dashboard); mapping inferred from sprint goal wording since items are not explicitly assigned to sprints in the input.

**Related:** US-010, US-011, US-013

### SPRINT-5 · draft · source: planning:Sprint 5

Sprint 5 goal: Reminders/notifications and manager team dashboard. Capacity: 20 points.

Plan version 1 (status: generated). Goal text maps to US-012 (due-date/check-in reminders and in-app notifications) and US-014 (manager view of direct reports' goals); mapping inferred from sprint goal wording since items are not explicitly assigned to sprints in the input.

**Related:** US-012, US-014

### SPRINT-6 · draft · source: planning:Sprint 6

Sprint 6 has no goal specified in the generated plan. Capacity: 20 points.

Plan version 1 (status: generated). Input lists this sprint with goal=(none); no basis given to associate it with specific epics or stories.
<!-- sdlc:auto:end narrative -->
