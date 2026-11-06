// Shared fixtures for the login/logout e2e suite (US-001-3).
//
// There is no API to create a user yet (`POST /employees` is still a stub --
// see backend/app/routers/employees.py), so the suite seeds known users
// straight into the real sandbox Postgres the running backend already talks
// to, via backend/tests/e2e_seed.py. That script upserts by email, so
// calling it from more than one spec file is safe.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = path.resolve(__dirname, "..", "..", "backend");
const PYTHON = path.join(BACKEND_DIR, ".venv", "bin", "python");
const SEED_SCRIPT = path.join(BACKEND_DIR, "tests", "e2e_seed.py");
const RESET_HELPER_SCRIPT = path.join(BACKEND_DIR, "tests", "e2e_reset_helper.py");

export function seedE2EUsers(): void {
  execFileSync(PYTHON, [SEED_SCRIPT], { cwd: BACKEND_DIR, stdio: "inherit" });
}

// Drives the real POST /auth/password-reset/request (see
// backend/tests/e2e_reset_helper.py) and returns the plaintext token the
// response itself never discloses -- there is no other way for the e2e
// suite to get one.
export function requestResetToken(email: string): string {
  const output = execFileSync(PYTHON, [RESET_HELPER_SCRIPT, "request", email], {
    cwd: BACKEND_DIR,
  });
  return output.toString().trim();
}

// Back-dates the given user's most recent reset token past its TTL.
export function expireLatestResetToken(email: string): void {
  execFileSync(PYTHON, [RESET_HELPER_SCRIPT, "expire", email], {
    cwd: BACKEND_DIR,
    stdio: "inherit",
  });
}

// Marks the given user's most recent reset token already spent.
export function markLatestResetTokenUsed(email: string): void {
  execFileSync(PYTHON, [RESET_HELPER_SCRIPT, "use", email], {
    cwd: BACKEND_DIR,
    stdio: "inherit",
  });
}

// Kept in sync by hand with backend/tests/e2e_seed.py -- both files exist only
// to give this suite known, stable fixtures.
export const E2E_PASSWORD = "Str0ng!PassE2E";

export const E2E_ROLE_USERS: Record<string, { email: string; homeRoute: string }> = {
  employee: { email: "e2e.employee@example.com", homeRoute: "/dashboard" },
  manager: { email: "e2e.manager@example.com", homeRoute: "/team" },
  hr_admin: { email: "e2e.hradmin@example.com", homeRoute: "/employees" },
  executive: { email: "e2e.executive@example.com", homeRoute: "/dashboard" },
};

export const E2E_DEACTIVATED_EMAIL = "e2e.deactivated@example.com";
