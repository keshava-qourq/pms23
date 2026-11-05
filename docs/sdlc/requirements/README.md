# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-SCOPE · draft · source: requirements:scope-summary

Defines the lightweight delivery scope for requirements version 1: what PMS23 will and will not build in this release.

In scope: goal creation with SMART/OKR structure; goal progress tracking by percentage or status; goal due dates and periodic check-ins; personal dashboard of an employee's own goals; manual employee records and reporting-line entry by HR; praise and recognition notes. Out of scope (explicitly excluded from design/build): native mobile apps (iOS/Android); payroll/compensation processing; learning/training management; recruitment/ATS; HRIS or SSO directory integration in the first release.

### REQ-TECHSTACK · approved · source: requirements:technology-stack

Product owner approved an exact technology stack and three runtime services; no substitutions are permitted.

Stack: Backend FastAPI 0.115 (chosen for clear expression of RBAC, configurable review cycles, cascading goals and audit trail with built-in request validation); Cloud AWS (dependable hosting, backups, access controls, single-jurisdiction data residency, managed PostgreSQL); Database PostgreSQL 16 (highly relational HR/goal data, reliable aggregate queries for dashboards, row-level control and auditability); Frontend React 19 (four interaction-heavy surfaces: goal trackers, multi-step review forms, feedback threads, analytics dashboards). Runtime services: SendGrid (SaaS email, env var SENDGRID_API_KEY) for deadline/reminder emails; Redis (container redis:7-alpine) used both as a background job queue for batched/scheduled reminders and as a cache for analytics dashboard aggregates. Required API keys/env vars: REDIS_URL, SENDGRID_API_KEY.

### REQ-EPIC-001 · draft · source: requirements:EPIC-001

Foundation epic: email/password login and four-role (employee, manager, HR admin, executive) role-based access control, underpinning every other capability.

US-001 (critical) Email/password login: correct credentials authenticate and route to a role-appropriate home screen (AC-001); incorrect password or unknown email is denied with one generic error that doesn't reveal which field was wrong (AC-002); logging out ends the session and requires re-login (AC-003). US-002 (critical) Role-based access: employees cannot open another employee's goals/praise (AC-004); managers see their own and their direct reports' records only, not others outside their line (AC-005); executives get read-only analytics access and cannot edit individual records (AC-006); HR admins can view and manage records org-wide (AC-007). US-003 (medium) Password reset: a time-limited reset link is emailed on request (AC-008); setting a new password via a valid, unexpired link updates the account (AC-009); an expired or already-used link is rejected with a prompt to request a new one (AC-010).

**Related:** US-001, US-002, US-003, AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-008, AC-009, AC-010, NFR-001, NFR-002, NFR-003

- ⚠ ASSUMPTION (unverified): the four roles -- employee, manager, HR admin, executive/leadership read-only -- are assumed from confirmed understanding, not independently verified.
- ⚠ ASSUMPTION (unverified): email/password authentication only -- no SSO or HRIS directory sync in the first release.
- ⚠ ASSUMPTION (unverified): no payment, billing or subscription functionality exists; intentionally out of scope for this internal tool.

### REQ-EPIC-002 · draft · source: requirements:EPIC-002

HR admins manually create and maintain employee records and the reporting-line structure, with export/delete/audit-trail handling of personal data, since there is no HRIS/SSO sync in this release.

US-004 (critical) HR creates/maintains employee records: creating a record with name, email, role saves it and enables goal/reporting-line assignment (AC-011); edits to details are stored and reflected app-wide (AC-012); deactivating a departed employee blocks login while retaining historical goals/praise for reporting (AC-013). US-005 (critical) Reporting lines: assigning a manager makes the employee a direct report (AC-014); reassigning updates the line and removes the previous manager's access (AC-015); an assignment that would create a reporting cycle is blocked with an error (AC-016). US-006 (medium) Data protection: export produces a file of an individual's personal and performance data (AC-017); approved deletion removes/anonymises identifying data and is recorded in the audit trail (AC-018); the audit trail shows who changed what and when for record/reporting-line changes (AC-019).

**Related:** US-004, US-005, US-006, AC-011, AC-012, AC-013, AC-014, AC-015, AC-016, AC-017, AC-018, AC-019, NFR-004, NFR-005

- ⚠ ASSUMPTION (unverified): performance/employee data is treated as sensitive HR data under a single jurisdiction with GDPR-style practices (access control, retention, export/delete on request) and an audit trail, because the operating region was not specified.

### REQ-EPIC-003 · draft · source: requirements:EPIC-003

Employees and managers create SMART/OKR-style goals, optionally cascaded from higher-level manager or company objectives.

US-007 (critical) Create a goal: a goal with title, description, measurable target and due date is saved and linked to its creator (AC-020); a missing required field (e.g. title, due date) blocks saving and prompts completion (AC-021); existing goal details can be edited (AC-022). US-008 (high) Manager sets goals for direct reports: a manager-created goal assigned to a direct report appears on that report's list attributed to them (AC-023); assigning to someone outside the manager's reporting line is not permitted (AC-024). US-009 (medium) Optional cascading: linking a goal to a manager/company objective shows the parent objective on the goal (AC-025); a goal left unlinked still saves as a valid standalone goal (AC-026).

**Related:** US-007, US-008, US-009, AC-020, AC-021, AC-022, AC-023, AC-024, AC-025, AC-026

- ⚠ ASSUMPTION (unverified): a SMART/OKR-style structure (specific, measurable, with target and timeframe) is assumed from confirmed understanding; cascading is optional, not mandatory.

### REQ-EPIC-004 · draft · source: requirements:EPIC-004

Goal owners keep goals current via percentage or status progress, dated check-in notes, and email/in-app reminders for due dates and overdue check-ins.

US-010 (high) Update progress: percentage-based goals accept a value 0-100 (AC-027); status-based goals accept values such as Not started/In progress/Completed/Blocked (AC-028); reaching 100% or Completed marks the goal complete and records a completion date (AC-029). US-011 (medium) Check-ins: a dated, authored check-in note is saved and shown in the goal's check-in history (AC-030); multiple check-ins display in chronological order (AC-031). US-012 (medium) Reminders: when a due date nears or a check-in is overdue, the reminder schedule sends an email and in-app notification (AC-032); if the email credential is not configured, the in-app notification is still created and the email failure is logged (AC-033); unread in-app notifications can be viewed and dismissed (AC-034).

**Related:** US-010, US-011, US-012, AC-027, AC-028, AC-029, AC-030, AC-031, AC-032, AC-033, AC-034, NFR-007

- ⚠ ASSUMPTION (unverified): progress may be expressed as percentage or status, with a configurable per-goal check-in cadence.
- ⚠ ASSUMPTION (unverified): email reminders require a provisioned email-sending credential (e.g. SendGrid/SMTP API key); in-app notifications are provided regardless.

### REQ-EPIC-005 · draft · source: requirements:EPIC-005

Employees get a personal dashboard of their own goals; managers get a team view of direct reports' goals, both constrained by role-based access.

US-013 (high) Personal dashboard: shows the employee's goals with progress and due dates (AC-035); overdue or soon-due goals are highlighted (AC-036); an empty state invites goal creation when none exist (AC-037). US-014 (medium) Manager team view: shows each direct report's goals and progress (AC-038); attempting to view an employee outside the manager's reporting line is denied (AC-039).

**Related:** US-013, US-014, AC-035, AC-036, AC-037, AC-038, AC-039, NFR-001, NFR-008

### REQ-EPIC-006 · draft · source: requirements:EPIC-006

Lightweight continuous recognition: any user can send a praise note to a colleague, and employees can view praise they have received.

US-015 (medium) Send praise: a note naming a recipient and message is saved and the recipient is notified in-app (AC-040); an empty recipient or message blocks saving and prompts completion (AC-041). US-016 (low) View praise received: notes display with message and sender, most recent first (AC-042); an empty state is shown when no praise has been received (AC-043). Peer/360 feedback, 1:1 notes and structured reviews are explicitly out of scope for this MVP.

**Related:** US-015, US-016, AC-040, AC-041, AC-042, AC-043

### REQ-NFR-SET · draft · source: requirements:non-functional-requirements

Ten non-functional requirements covering security, compliance, privacy, availability, performance, scalability and device compatibility for the whole system.

NFR-001 (security) role-based access restricts data visibility by role, denying out-of-role access -- applies to US-002, US-008, US-013, US-014, US-016. NFR-002 (security) login failures show one generic, non-revealing error -- US-001. NFR-003 (security) password reset links are time-limited and single-use -- US-003. NFR-004 (security) audit trail records who changed employee records/reporting lines and when -- US-005, US-006. NFR-005 (compliance) GDPR-style export/delete-or-anonymise on request, retaining historical goals/praise for reporting -- US-006. NFR-006 (privacy) single-jurisdiction data residency for sensitive HR data -- whole system. NFR-007 (availability) in-app notifications still fire and email failures are logged if the email credential/service fails -- US-012. NFR-008 (performance) dashboards/team views stay responsive via cached aggregates during the appraisal period -- US-013, US-014. NFR-009 (scalability) supports a mid-size organisation, target ~200-1000 employees -- whole system. NFR-010 (compatibility) responsive, mobile-friendly web app across common devices/browsers, no native apps -- whole system.

**Related:** US-002, US-008, US-013, US-014, US-016, US-001, US-003, US-005, US-006, US-012

- ⚠ NFR-005/NFR-006 GDPR-style compliance and single-jurisdiction residency are both based on an unverified assumption (region unspecified) -- needs confirmation of actual operating jurisdiction and applicable data-protection regime before architecture/design relies on it.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-05

**Capabilities in scope:** Goal creation with SMART/OKR structure, Goal progress tracking by percentage or status, Goal due dates and periodic check-ins, Personal dashboard of an employee's own goals, Manual employee records and reporting-line entry by HR, Praise and recognition notes

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The heart of this system is business rules, not heavy computation: role-based access to sensitive HR data (employees see only their own and their reports'), configurable review cycles, cascading goals, and an audit trail. FastAPI lets a small team express these rules and APIs clearly and quickly, with built-in request validation that helps enforce the configurable forms and permission checks you need before the cycle opens. |
| cloud | AWS | This is an internal tool holding sensitive HR data for one organisation, so you need dependable hosting, backups, access controls and data-residency options in a single jurisdiction. AWS covers all of that with managed PostgreSQL and standard web hosting, and its breadth means you won't hit a wall as usage grows across the appraisal cycle. |
| database | PostgreSQL | Your data is highly relational — employees, reporting lines, goals cascaded from objectives, review cycles, forms, ratings and feedback all reference each other — and the analytics dashboards need reliable aggregate queries across the org. PostgreSQL enforces these relationships, handles the reporting queries well at your scale, and gives you the row-level control and auditability expected of sensitive HR data. |
| frontend | React | Your product is a responsive web app with four distinct, interaction-heavy surfaces — goal trackers with progress bars and cascading, multi-step review forms with configurable fields and rating scales, feedback threads, and analytics dashboards for executives. React handles this kind of stateful, form-driven UI well and makes the dashboards and configurable review forms practical to build quickly before your appraisal cycle. It also gives you the widest pool of developers, which matters for a tight deadline. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Access, Authentication & Role-Based Access Control

Foundation for the internal performance management tool: email/password login and four-role access control (employee, manager, HR admin, executive). This underpins every other capability so that sensitive HR data is only visible to authorised people. ASSUMPTION: four roles (employee, manager, HR admin, executive/leadership read-only analytics) are assumed from the confirmed understanding, not independently verified. ASSUMPTION: email/password authentication only — no SSO or HRIS directory sync in the first release. ASSUMPTION: no payment, billing or subscription functionality exists, as this is an internal single-organisation tool; that capability makes no sense here and is intentionally absent.

### US-001: Email/password login

**Priority:** critical

> As a registered user (employee, manager, HR admin or executive), I want to log in with my email address and password, so that I can access the performance management tool securely.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | I am an active user with a valid email and password | I submit correct credentials on the login page | I am authenticated and taken to my role-appropriate home screen |
| AC-002 | I am on the login page | I submit an incorrect password or an unknown email | I am denied access and shown a generic error message that does not reveal which field was wrong |
| AC-003 | I am logged in | I choose to log out | my session is ended and I must log in again to continue |

### US-002: Role-based access to sensitive HR data

**Priority:** critical

> As a security-conscious organisation, I want each user to see only the data permitted for their role, so that sensitive performance data is protected from unauthorised access.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | I am logged in as an employee | I try to open another employee's goals or praise detail that is not mine | access is denied |
| AC-005 | I am logged in as a manager | I view goals data | I can see my own records and those of my direct reports, but not employees outside my reporting line |
| AC-006 | I am logged in as an executive/leadership user | I access the application | I have read-only access to analytics-level views and cannot edit individual employee records or goals |
| AC-007 | I am logged in as an HR admin | I access employee and org data | I can view and manage records across the organisation |

### US-003: Password reset

**Priority:** medium

> As a user who has forgotten my password, I want to reset my password via my email address, so that I can regain access without contacting IT.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | I am on the login page and have forgotten my password | I request a reset for my registered email | a time-limited reset link is sent to that email address |
| AC-009 | I have received a valid, unexpired reset link | I set a new password meeting the password rules | my password is updated and I can log in with it |
| AC-010 | I have a reset link that has expired or already been used | I open it | it is rejected and I am prompted to request a new one |

## EPIC-002: Employee Records & Reporting-Line Management

HR admins manually create and maintain employee accounts and the organisation's reporting structure inside the app, since there is no HRIS or SSO sync in the first release. Includes basic data-protection handling of these records. ASSUMPTION: performance/employee data is treated as sensitive HR data; a single jurisdiction with GDPR-style practices (access control, retention, export/delete on request) and an audit trail is assumed because the region was not specified.

### US-004: HR creates and maintains employee records

**Priority:** critical

> As a HR admin, I want to create and edit employee records manually, so that the organisation's people are represented in the system without an HRIS integration.

| ID | Given | When | Then |
|---|---|---|---|
| AC-011 | I am an HR admin | I create an employee record with name, email and role | the record is saved and the employee can be assigned goals and a reporting line |
| AC-012 | an employee record exists | I edit its details (e.g. name, email, role) and save | the updated details are stored and reflected across the application |
| AC-013 | an employee has left the organisation | I deactivate their record | they can no longer log in but their historical goals and praise remain for reporting |

### US-005: Define and maintain reporting lines

**Priority:** critical

> As a HR admin, I want to assign each employee a manager and build the org/reporting structure, so that managers see the right reports and access control works correctly.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | two employee records exist | I set one employee's manager to another | the first appears as a direct report of the second |
| AC-015 | an employee already has a manager | I reassign them to a different manager | the reporting line updates and the previous manager loses access to that employee's data |
| AC-016 | I attempt to set a reporting line | the assignment would create a cycle (e.g. A reports to B and B reports to A) | the system prevents the change and shows an error |

### US-006: Data protection: export, delete and audit trail

**Priority:** medium

> As a HR admin responsible for data protection, I want to export or delete an individual's personal data and see an audit trail of record changes, so that the organisation can honour data-protection obligations.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | an employee record exists | I request an export of that person's data | the system produces a file containing their personal and performance data |
| AC-018 | a valid data-deletion request is approved | I delete an employee's personal data | their identifying data is removed or anonymised and the action is recorded in the audit trail |
| AC-019 | changes are made to employee records or reporting lines | I view the audit trail | I can see who changed what and when. ASSUMPTION: GDPR-style retention/export/delete is assumed as region was unspecified. |

## EPIC-003: Goal Setting (SMART/OKR)

Employees and managers create goals with a SMART/OKR-style structure, optionally cascaded from company or manager objectives. ASSUMPTION: a SMART/OKR-style goal structure (specific, measurable, with a target and timeframe) is assumed from the confirmed understanding. Cascading from higher-level objectives is optional, not mandatory.

### US-007: Create a goal with SMART/OKR structure

**Priority:** critical

> As a employee, I want to create a goal with a clear title, description, measurable target and timeframe, so that my objectives are well defined and trackable.

| ID | Given | When | Then |
|---|---|---|---|
| AC-020 | I am logged in as an employee | I create a goal with a title, description, measurable target/metric and a due date | the goal is saved and linked to me |
| AC-021 | I am creating a goal | I omit a required field such as title or due date | the goal is not saved and I am prompted to complete the missing field |
| AC-022 | I have created a goal | I edit its title, description, target or due date | the changes are saved |

### US-008: Manager sets goals for direct reports

**Priority:** high

> As a manager, I want to create or assign goals for my direct reports, so that team objectives are aligned and visible.

| ID | Given | When | Then |
|---|---|---|---|
| AC-023 | I am a manager with direct reports | I create a goal and assign it to one of my reports | the goal appears on that report's goal list attributed to them |
| AC-024 | I am a manager | I attempt to assign a goal to an employee who is not my direct report | the action is not permitted |

### US-009: Optionally cascade a goal from a higher-level objective

**Priority:** medium

> As a employee or manager, I want to optionally link my goal to a manager or company objective, so that individual goals show how they contribute to broader objectives.

| ID | Given | When | Then |
|---|---|---|---|
| AC-025 | a higher-level (manager or company) objective exists | I create or edit a goal and link it to that objective | the goal shows its parent objective |
| AC-026 | I am creating a goal | I choose not to link it to any parent objective | the goal is still saved as a valid standalone goal |

## EPIC-004: Goal Progress Tracking, Due Dates & Check-ins

Goals are kept up to date through percentage or status progress, due dates, and periodic check-ins, with reminders so updates actually happen. ASSUMPTION: progress may be expressed as a percentage or a status value; periodic check-in cadence is assumed and configurable per goal. ASSUMPTION: email reminders require an email-sending service and credential (e.g. SendGrid/SMTP API key) to be provisioned; in-app notifications are also provided.

### US-010: Update goal progress by percentage or status

**Priority:** high

> As a goal owner, I want to update my goal's progress as a percentage or a status, so that my progress is current and visible.

| ID | Given | When | Then |
|---|---|---|---|
| AC-027 | I own a goal that uses percentage progress | I set its completion to a value between 0 and 100 | the new percentage is saved and displayed |
| AC-028 | I own a goal that uses status progress | I change its status (e.g. Not started, In progress, Completed, Blocked) | the new status is saved and displayed |
| AC-029 | I set a goal's progress to 100% or Completed | I save it | the goal is marked complete and its completion date is recorded |

### US-011: Record periodic check-ins on a goal

**Priority:** medium

> As a goal owner, I want to add dated check-in notes against a goal, so that there is an ongoing record of progress and blockers.

| ID | Given | When | Then |
|---|---|---|---|
| AC-030 | I own a goal | I add a check-in note | the note is saved with its date and author and shown in the goal's check-in history |
| AC-031 | a goal has multiple check-ins | I view the goal | I see the check-ins in chronological order |

### US-012: Due-date and check-in reminders

**Priority:** medium

> As a goal owner, I want to be reminded by email and in-app notification of upcoming due dates and overdue check-ins, so that I keep my goals up to date.

| ID | Given | When | Then |
|---|---|---|---|
| AC-032 | a goal's due date is approaching or a check-in is overdue | the reminder schedule runs | I receive an email and an in-app notification prompting me to update the goal |
| AC-033 | the email-sending service credential is not configured | a reminder is due | the in-app notification is still created and the email failure is logged. ASSUMPTION: an email service (e.g. SendGrid/SMTP) credential must be provisioned for emails to send. |
| AC-034 | I have an unread in-app notification | I open my notifications | I can see and dismiss it |

## EPIC-005: Personal Goal Dashboard

Each employee has a personal dashboard summarising their own goals, progress and upcoming due dates; managers can view the goals of their direct reports consistent with role-based access.

### US-013: Employee views personal goal dashboard

**Priority:** high

> As a employee, I want a dashboard of my own goals with their progress and due dates, so that I can see at a glance where I stand.

| ID | Given | When | Then |
|---|---|---|---|
| AC-035 | I am logged in as an employee with goals | I open my dashboard | I see my goals with their progress (percentage or status) and due dates |
| AC-036 | I have goals that are overdue or due soon | I view my dashboard | those goals are highlighted or clearly flagged |
| AC-037 | I have no goals | I open my dashboard | I see an empty state inviting me to create a goal |

### US-014: Manager views direct reports' goals

**Priority:** medium

> As a manager, I want to view the goals and progress of my direct reports, so that I can support and track my team.

| ID | Given | When | Then |
|---|---|---|---|
| AC-038 | I am a manager with direct reports who have goals | I open my team view | I see each direct report's goals and their progress |
| AC-039 | I am a manager | I attempt to view goals of an employee outside my reporting line | access is denied |

## EPIC-006: Praise & Recognition

Lightweight continuous feedback: employees and managers can give praise/recognition notes to colleagues, visible to the recipient. (Peer/360 feedback, 1:1 notes and structured reviews are out of scope for this MVP.)

### US-015: Give a praise/recognition note

**Priority:** medium

> As a employee or manager, I want to send a praise note to a colleague, so that good work is recognised.

| ID | Given | When | Then |
|---|---|---|---|
| AC-040 | I am logged in | I create a praise note naming a recipient and a message | the praise is saved and the recipient is notified in-app |
| AC-041 | I am writing a praise note | I leave the recipient or message empty | the praise is not saved and I am prompted to complete it |

### US-016: View praise received

**Priority:** low

> As a employee, I want to see the praise I have received, so that I feel recognised and can reference it later.

| ID | Given | When | Then |
|---|---|---|---|
| AC-042 | I have received praise notes | I open my praise/recognition view | I see each note with its message and sender, most recent first |
| AC-043 | I have received no praise | I open my praise view | I see an empty state |
<!-- sdlc:auto:end epics -->
