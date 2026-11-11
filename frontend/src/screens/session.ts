// Minimal persisted record of who is signed in, alongside the bearer token
// `apiFetch` already sends. Login's response body carries {id, name, email,
// role}; this is the seam that keeps it around so other screens (the goal
// form's owner picker, in particular) can tell a manager from an employee
// without a dedicated "/auth/me" endpoint.
const SESSION_USER_KEY = "session_user";

export type Role = "employee" | "manager" | "hr_admin" | "executive";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export function getSessionUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSessionUser(user: SessionUser): void {
  try {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable: the session just won't persist.
  }
}
