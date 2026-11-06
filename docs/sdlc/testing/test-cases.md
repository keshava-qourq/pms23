# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
51 tests · Passed 39 · Failed 0 · Skipped 0 · Not run 12

Acceptance criteria covered: 9/43 · passing: 3/43
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Email/password login

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_deactivated_user_cannot_log_in | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[employee-/dashboard] | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[executive-/dashboard] | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[hr_admin-/employees] | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_login_returns_token_and_role_home_route[manager-/team] | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_logout_makes_token_unusable_on_protected_endpoint | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_no_password_hash_or_plaintext_in_login_and_logout_responses | Unit | Passed | `backend/tests/test_auth.py` |
| — | test_wrong_password_and_unknown_email_return_byte_identical_401_bodies | Unit | Passed | `backend/tests/test_auth.py` |
| — | App > lets an authenticated session reach /dashboard and shows a Sign out control | Unit | Passed | `frontend/src/App.test.tsx` |
| — | App > opens on Sign in, with no menu around it | Unit | Passed | `frontend/src/App.test.tsx` |
| — | App > redirects unauthenticated access to /dashboard back to the login screen | Unit | Passed | `frontend/src/App.test.tsx` |
| AC-001 | Login > [AC-001] rejects submission when a required field is empty, with no network call | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-001 | Login > [AC-001] shows a loading state while the request is in flight | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-001 | Login > [AC-001] submits credentials, stores the token, and routes an employee to dashboard | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-002 | Login > [AC-002] a 401 renders one generic error in the role=alert region | Unit | Passed | `frontend/src/screens/Login.test.tsx` |
| AC-002 | [AC-002] a deactivated account's correct password shows the same generic error | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| AC-002 | [AC-002] an unknown email shows the same generic error message | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| AC-002 | [AC-002] wrong password shows the single generic error message | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| AC-003 | [AC-003] signing out then reloading requires signing in again | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
| — | [NFR-010] the login screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/login.spec.ts` |

### US-004: HR creates and maintains employee records

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-011 | test_ac011_duplicate_email_returns_409 | Unit | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_hr_admin_creates_employee | Unit | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_non_hr_admin_cannot_create_employee[employee] | Unit | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_non_hr_admin_cannot_create_employee[executive] | Unit | Passed | `backend/tests/test_employees.py` |
| AC-011 | test_ac011_non_hr_admin_cannot_create_employee[manager] | Unit | Passed | `backend/tests/test_employees.py` |
| AC-012 | test_ac012_edit_reflects_in_response_and_store | Unit | Passed | `backend/tests/test_employees.py` |
| AC-012 | test_ac012_non_hr_admin_cannot_edit_employee | Unit | Passed | `backend/tests/test_employees.py` |
| AC-013 | test_ac013_deactivate_blocks_login | Unit | Passed | `backend/tests/test_employees.py` |
| AC-013 | test_ac013_deactivation_preserves_goals_praise_and_history | Unit | Passed | `backend/tests/test_employees.py` |
| AC-013 | test_ac013_non_hr_admin_cannot_deactivate | Unit | Passed | `backend/tests/test_employees.py` |
| AC-014 | test_ac014_direct_report_appears_in_manager_reports | Unit | Passed | `backend/tests/test_employees.py` |
| AC-015 | test_ac015_reassignment_revokes_previous_manager_access | Unit | Passed | `backend/tests/test_employees.py` |
| AC-016 | test_ac016_rejects_self_assignment | Unit | Passed | `backend/tests/test_employees.py` |
| AC-016 | test_ac016_rejects_three_node_cycle | Unit | Passed | `backend/tests/test_employees.py` |
| AC-016 | test_ac016_rejects_two_node_cycle | Unit | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_audit_log_is_hr_admin_only[employee] | Unit | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_audit_log_is_hr_admin_only[executive] | Unit | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_audit_log_is_hr_admin_only[manager] | Unit | Passed | `backend/tests/test_employees.py` |
| — | test_nfr004_manager_change_produces_audit_row | Unit | Passed | `backend/tests/test_employees.py` |
| AC-011 | [AC-011] creates an employee record | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-011 | [AC-011] duplicate email is rejected with an inline error | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-012 | [AC-012] editing a record reflects the change | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-013 | [AC-013] deactivating an employee marks them inactive | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| AC-016 | [AC-016] a reporting-line cycle is rejected inline | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |
| — | [NFR-010] the Employees screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/employees.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_health_reports_ok | Unit | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Unit | Passed | `backend/tests/test_health.py` |
| — | test_every_spec_path_is_mounted | Unit | Passed | `backend/tests/test_routes.py` |
| — | test_access_token_round_trips_subject_and_role | Unit | Passed | `backend/tests/test_security.py` |
| — | test_password_hash_round_trips | Unit | Passed | `backend/tests/test_security.py` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
