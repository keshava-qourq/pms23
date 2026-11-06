# PMS23 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
performance management system

**Documentation version:** v4
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 16 entries |
| [Development](development/README.md) | 5 entries |
| [Testing](testing/README.md) | 0 entries |
| [Deployment](deployment/README.md) | 0 entries |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 5 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 27 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 51 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 16 requirements |
| [Changelog](CHANGELOG.md) | 4 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- ASSUMPTION (unverified): the four roles -- employee, manager, HR admin, executive/leadership read-only -- are assumed from confirmed understanding, not independently verified.
- ASSUMPTION (unverified): email/password authentication only -- no SSO or HRIS directory sync in the first release.
- ASSUMPTION (unverified): no payment, billing or subscription functionality exists; intentionally out of scope for this internal tool.
- ASSUMPTION (unverified): performance/employee data is treated as sensitive HR data under a single jurisdiction with GDPR-style practices (access control, retention, export/delete on request) and an audit trail, because the operating region was not specified.
- ASSUMPTION (unverified): a SMART/OKR-style structure (specific, measurable, with target and timeframe) is assumed from confirmed understanding; cascading is optional, not mandatory.
- ASSUMPTION (unverified): progress may be expressed as percentage or status, with a configurable per-goal check-in cadence.
- ASSUMPTION (unverified): email reminders require a provisioned email-sending credential (e.g. SendGrid/SMTP API key); in-app notifications are provided regardless.
- NFR-005/NFR-006 GDPR-style compliance and single-jurisdiction residency are both based on an unverified assumption (region unspecified) -- needs confirmation of actual operating jurisdiction and applicable data-protection regime before architecture/design relies on it.

### Architecture

- No named approver or approval date recorded for this architecture version.
- Input does not map architecture elements to specific requirement IDs (US-001..US-016), so traceability from architecture back to requirements cannot be established beyond general inference.
- Input does not clarify whether cache and queue are the same Redis instance/cluster or physically separate ElastiCache deployments.

### Development

- No confirmation in the input of which sub-tasks (T1/T2/T3) were individually completed vs. the story as a whole -- only the parent story's delivered status and a single commit were given.
- No further detail provided on what employee-record fields or validations were implemented -- only story-level delivered status is recorded.
- US-004 and US-005 share the exact same commit hash; input does not clarify whether this is one combined commit delivering both stories or a data-entry duplication -- flagging for confirmation.
- Conflict: run status='completed' but 13 of 16 planned stories have no ticket/commit record -- needs confirmation of whether these are still in progress, were deferred, or the status field is inaccurate.
- No tickets recorded for US-002 (role-based HR data access), US-003 (password reset), US-006 (data protection export/delete/audit), US-007/US-008/US-009 (goal creation/assignment/cascade), US-010/US-011 (progress/check-ins), US-012 and tasks (reminders), US-013/US-014 (dashboards), US-015/US-016 (praise/recognition).
<!-- sdlc:auto:end open-gaps -->
