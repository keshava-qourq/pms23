// Shared fixtures for the e2e suites (US-001-3 and others).
//
// There is no API that creates a user with a known password (`POST
// /employees` always mints a random one -- see
// backend/app/routers/employees.py) and no API that discloses a password
// reset token (by design, AC-008/NFR-003), so this writes those rows
// directly through the Postgres driver against the real sandbox database
// named by DATABASE_URL -- never a mock, never SQLite. A spec (and anything
// it imports, this file included) never shells out to run a command or a
// script: this calls a library, the same way the backend itself talks to
// Postgres, it never spawns `python` or anything else as a child process.
//
// Every write here is idempotent (upsert by email, update-in-place by id),
// so calling these from more than one spec file, or more than once, is safe.
import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";
import { Pool } from "pg";

// SQLAlchemy's URL names its driver dialect (`postgresql+psycopg://...`), a
// suffix `pg` does not understand; trim it to the plain `postgresql://` `pg` expects.
function nodePgConnectionString(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set: the sandbox provides it for every run.");
  }
  return raw.replace(/^postgresql\+[a-z0-9_]+:\/\//, "postgresql://");
}

let pool: Pool | null = null;
function db(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: nodePgConnectionString() });
  }
  return pool;
}

export const E2E_PASSWORD = "Str0ng!PassE2E";

export const E2E_ROLE_USERS: Record<string, { email: string; homeRoute: string }> = {
  employee: { email: "e2e.employee@example.com", homeRoute: "/dashboard" },
  manager: { email: "e2e.manager@example.com", homeRoute: "/team" },
  hr_admin: { email: "e2e.hradmin@example.com", homeRoute: "/employees" },
  executive: { email: "e2e.executive@example.com", homeRoute: "/dashboard" },
};

export const E2E_DEACTIVATED_EMAIL = "e2e.deactivated@example.com";

// Kept in sync by hand with the role/active flags each spec relies on.
const E2E_USERS: Array<{ email: string; name: string; role: string; isActive: boolean }> = [
  {
    email: E2E_ROLE_USERS.employee.email,
    name: "E2E Employee",
    role: "employee",
    isActive: true,
  },
  { email: E2E_ROLE_USERS.manager.email, name: "E2E Manager", role: "manager", isActive: true },
  {
    email: E2E_ROLE_USERS.hr_admin.email,
    name: "E2E HR Admin",
    role: "hr_admin",
    isActive: true,
  },
  {
    email: E2E_ROLE_USERS.executive.email,
    name: "E2E Executive",
    role: "executive",
    isActive: true,
  },
  { email: E2E_DEACTIVATED_EMAIL, name: "E2E Deactivated", role: "employee", isActive: false },
];

export async function seedE2EUsers(): Promise<void> {
  const passwordHash = await bcrypt.hash(E2E_PASSWORD, 10);
  const client = db();
  for (const user of E2E_USERS) {
    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE
         SET name = EXCLUDED.name,
             password_hash = EXCLUDED.password_hash,
             role = EXCLUDED.role,
             is_active = EXCLUDED.is_active`,
      [randomUUID(), user.name, user.email, passwordHash, user.role, user.isActive],
    );
  }
}

async function userIdByEmail(email: string): Promise<string> {
  const result = await db().query<{ id: string }>("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error(`no such user: ${email}`);
  }
  return result.rows[0].id;
}

// Issues a reset token row of the same shape
// `POST /auth/password-reset/request` issues, for a user this suite already
// seeded. AC-008/NFR-003 mean no API response -- real or mocked -- ever
// discloses the plaintext token, so this is the one place it has to be
// minted rather than read back from a call this suite makes.
export async function requestResetToken(email: string): Promise<string> {
  const userId = await userIdByEmail(email);
  const token = randomUUID() + randomUUID();
  const tokenHash = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await db().query(
    `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [randomUUID(), userId, tokenHash, expiresAt],
  );
  return token;
}

async function latestTokenId(email: string): Promise<string> {
  const userId = await userIdByEmail(email);
  const result = await db().query<{ id: string }>(
    `SELECT id FROM password_reset_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [userId],
  );
  if (result.rows.length === 0) {
    throw new Error(`no reset token row for ${email}`);
  }
  return result.rows[0].id;
}

// AC-010/NFR-003: back-dates the user's latest token past its TTL.
export async function expireLatestResetToken(email: string): Promise<void> {
  const id = await latestTokenId(email);
  await db().query("UPDATE password_reset_tokens SET expires_at = $2 WHERE id = $1", [
    id,
    new Date(Date.now() - 60 * 1000),
  ]);
}

// AC-010/NFR-003: marks the user's latest token already spent.
export async function markLatestResetTokenUsed(email: string): Promise<void> {
  const id = await latestTokenId(email);
  await db().query("UPDATE password_reset_tokens SET used_at = now() WHERE id = $1", [id]);
}
