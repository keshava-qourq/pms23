# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
117 tests · Passed 92 · Failed 0 · Skipped 0 · Not run 25

Acceptance criteria covered: 22/45 · passing: 7/45
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
| AC-044, AC-045 | [AC-044][AC-045] the description text is gone and sign-in still completes | E2E | Not run yet | `frontend/e2e/login.spec.ts` |
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

## Sprint 2

### US-002: Role-based access to sensitive HR data

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-004 | test_ac004_employee_cannot_read_another_employees_check_ins | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-004 | test_ac004_employee_cannot_read_or_write_another_employees_goal | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-004 | test_ac004_employee_cannot_see_another_employees_praise_in_their_own_received_list | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-005 | test_ac005_manager_denied_goal_outside_reporting_line | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-005 | test_ac005_manager_sees_own_direct_and_skip_level_report_goals | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_cannot_create_goal | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_cannot_update_goal | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_cannot_update_goal_progress | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-006 | test_ac006_executive_reads_analytics | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-007 | test_ac007_hr_admin_reads_any_employees_goals | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-007 | test_ac007_hr_admin_reads_any_employees_team_dashboard | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-007 | test_ac007_hr_admin_updates_any_employees_goal | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/analytics-None] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/dashboard/me-None] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/dashboard/team-None] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/employees/c910a1b5-b664-4a2a-b036-8e2b51a15b01/reports-None] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/goals-None] | Unit | Passed | `backend/tests/test_rbac.py` |
| AC-986 | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/goals/81f8eba2-38b3-41b0-b638-e17b3b6ac986/check-ins-None] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[get-/praise/received-None] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[patch-/goals/a70f1803-8741-4b04-998e-833323b35611/progress-json_body3] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[post-/goals-json_body1] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[post-/goals/c056c864-dd73-4929-a77d-9f4641a0134e/check-ins-json_body4] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[post-/praise-json_body11] | Unit | Passed | `backend/tests/test_rbac.py` |
| — | test_ac_every_protected_endpoint_requires_a_bearer_token[put-/goals/5d40dafa-d624-4c2f-abe0-221b51842203-json_body2] | Unit | Passed | `backend/tests/test_rbac.py` |

### US-003: Password reset

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_password_rule_accepts_compliant_password | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_missing_digit | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_missing_lowercase | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_missing_uppercase | Unit | Passed | `backend/tests/test_password_rules.py` |
| — | test_password_rule_rejects_too_short_password | Unit | Passed | `backend/tests/test_password_rules.py` |
| AC-008 | ForgotPassword > [AC-008] calls the request endpoint and shows the same confirmation for a registered email | Unit | Passed | `frontend/src/screens/ForgotPassword.test.tsx` |
| AC-008 | ForgotPassword > [AC-008] rejects submission with an empty email, with no network call | Unit | Passed | `frontend/src/screens/ForgotPassword.test.tsx` |
| AC-008 | ForgotPassword > [AC-008] shows the same confirmation message for an unregistered email | Unit | Passed | `frontend/src/screens/ForgotPassword.test.tsx` |
| AC-009 | ResetPassword > [AC-009] reads the token from the URL, calls confirm, and routes to login on success | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| AC-010 | ResetPassword > [AC-010] an expired or rejected token shows an inline error with a control to request a new link | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| — | ResetPassword > rejects submission when the two passwords do not match, with no network call | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| — | ResetPassword > shows an inline error, with no network call, when the URL carries no token | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| — | ResetPassword > validates password rules inline before submit, with no network call | Unit | Passed | `frontend/src/screens/ResetPassword.test.tsx` |
| AC-008 | test_ac008_registered_email_creates_token_row_and_sends_email | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-009 | test_ac009_valid_token_updates_password_and_allows_immediate_login | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-010 | test_ac010_already_used_token_rejected_and_password_unchanged | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-010 | test_ac010_expired_token_rejected_and_password_unchanged | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-010 | test_ac010_unknown_token_rejected_with_retry_message | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_nfr003_replay_of_already_confirmed_token_is_rejected | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_no_account_enumeration_identical_response_known_and_unknown_email | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_password_rule_violation_names_the_rule_without_leaking_token | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| — | test_response_never_contains_the_plaintext_token | Integration | Passed | `backend/tests/integration/test_password_reset.py` |
| AC-008 | [AC-008] an unregistered email shows the identical confirmation | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-008 | [AC-008] requests a reset link from the login page | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-009 | [AC-009] sets a new password from a valid link and signs in with it | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-010 | [AC-010] an already-used link is rejected and prompts to request a new link | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| AC-010 | [AC-010] an expired link is rejected and prompts to request a new link | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| — | [NFR-010] the forgot-password screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |
| — | [NFR-010] the reset-password screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/password-reset.spec.ts` |

### US-015: Give a praise/recognition note

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-040 | test_ac040_post_praise_persists_note_and_creates_notification | Unit | Passed | `backend/tests/test_praise.py` |
| AC-041 | test_ac041_empty_message_is_rejected_and_writes_no_row | Unit | Passed | `backend/tests/test_praise.py` |
| AC-041 | test_ac041_missing_message_field_is_rejected_and_writes_no_row | Unit | Passed | `backend/tests/test_praise.py` |
| AC-041 | test_ac041_missing_recipient_is_rejected_and_writes_no_row | Unit | Passed | `backend/tests/test_praise.py` |
| AC-042 | test_ac042_received_praise_ordered_newest_first | Unit | Passed | `backend/tests/test_praise.py` |
| AC-043 | test_ac043_received_praise_is_empty_list_for_user_with_none | Unit | Passed | `backend/tests/test_praise.py` |
| — | test_nfr001_one_user_cannot_read_anothers_received_praise | Unit | Passed | `backend/tests/test_praise.py` |
| AC-040 | [AC-040] sends a praise note and sees the confirmation | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| AC-041 | [AC-041] submitting with an empty message shows the prompt | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| AC-041 | [AC-041] submitting with no recipient chosen shows the prompt | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| AC-042, AC-043 | [AC-042][AC-043] a search with no matches shows the empty state | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |
| — | [NFR-010] the Praise screen is usable at a 360px mobile viewport | E2E | Not run yet | `frontend/e2e/praise.spec.ts` |

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
