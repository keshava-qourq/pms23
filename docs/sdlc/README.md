# PMS23 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
performance management system

**Documentation version:** v6
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 16 entries |
| [Development](development/README.md) | 11 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 0 entries |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 5 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 27 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 116 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 16 requirements |
| [Changelog](CHANGELOG.md) | 6 versions |
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

- No delivery/ticket status reported for US-001, US-004, or US-005 despite the development run being marked 'completed'.
- No delivery/ticket status reported for US-006, US-007, US-008, or US-009 despite the development run being marked 'completed'.
- No delivery/ticket status reported for US-010, US-011, or US-013 despite the development run being marked 'completed'.
- No delivery/ticket status reported for US-012 or US-014 despite the development run being marked 'completed'.
- Input does not confirm per-sub-task completion (US-002-T1, US-002-T2, US-002-T3) separately from the parent story.
- Same commit hash is listed for US-015 and US-016; confirm whether this is intentional (combined commit) or a reporting duplication.
- Discrepancy: run-level status says 'completed' while 12 of 16 planned stories (and all sub-tasks) have no delivery evidence -- needs confirmation of whether they were completed outside reported tickets, descoped, or omitted from reporting.

### Testing

- No ticket or requirement linkage provided, so traceability from this result to specific user stories (US-001..US-016) cannot be confirmed.
- No breakdown of what the 5 checks actually verify (functionality, test type, or components covered).
- No date/timestamp recorded for when this run occurred.
- No broader test plan, test case list, or coverage report has been supplied for this phase beyond this single aggregate result.
<!-- sdlc:auto:end open-gaps -->
