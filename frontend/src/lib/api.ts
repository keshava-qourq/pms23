/// <reference types="vite/client" />
// Without the reference above, `import.meta.env` is not typed and `tsc --noEmit` fails --
// which `vite build` does not catch, because it tree-shakes this module out when no screen
// imports it yet.
//
// Where the generated API lives.
//
// Set at build time: the platform bakes the deployed API URL into the frontend build. The
// fallback is the local backend so a bare `npm run dev` still points somewhere real.
//
// The generated screens do NOT use this yet -- they render seeded sample data, exactly as
// they were approved. This is the seam to replace that with real calls, one screen at a
// time.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// The shared bearer the deployed API expects (its SECRET_KEY). The platform bakes the
// same value into both sides at deploy time, so authenticated calls work out of the box.
export const API_SECRET_KEY: string = import.meta.env.VITE_API_SECRET_KEY ?? "";

// The frontend and the API are on different origins once deployed, so a login flow
// cannot rely on a cookie coming back (a browser drops a cross-origin cookie unless every
// attribute is exactly right, and that keeps getting stricter regardless). A ticket that
// implements login reads `/auth/login`'s token from its response body and calls
// `setSessionToken` with it; apiFetch then sends it as the bearer on every later call,
// ahead of the shared secret.
const SESSION_TOKEN_KEY = "session_token";

export function getSessionToken(): string | null {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string): void {
  try {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode, quota): the session just won't persist.
  }
}

export function clearSessionToken(): void {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // Nothing to clear if storage was never reachable.
  }
}

// US-012.3: the goal owner's in-app reminders (AC-032/AC-034). `email_status`
// mirrors AC-033 — "failed" means the reminder still exists even though the
// email leg of it could not be sent (the email credential was not configured).
export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  email_status: string | null;
  created_at: string;
}

// Thrown by apiFetch on a non-2xx response. Carries the HTTP status so a
// screen can tell "access denied" (403) apart from any other failure without
// parsing the message text.
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const bearer = getSessionToken() ?? API_SECRET_KEY;
  // Join with exactly one slash: API_BASE_URL is baked with a trailing slash (the API
  // sits behind a /apps/<slug>/ path prefix) and paths start with "/", so a naive
  // concat yields "...//auth/me", which a path-prefix proxy need not route.
  const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${init?.method ?? "GET"} ${path} failed: ${response.status}`,
    );
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

// GET /notifications — the caller's in-app notifications, newest handled by
// the server; the dashboard renders them as it receives them.
export function listNotifications(): Promise<AppNotification[]> {
  return apiFetch<AppNotification[]>("/notifications");
}

// PATCH /notifications/{id}/read — marks/dismisses one in-app notification as read.
export function markNotificationRead(id: string): Promise<AppNotification> {
  return apiFetch<AppNotification>(`/notifications/${id}/read`, { method: "PATCH" });
}

// US-014: the manager's team dashboard (AC-038/AC-039) — each direct
// report together with their goals and progress, as a cached aggregate.
export interface TeamDashboardGoal {
  id: string;
  title: string;
  progress_type: "percent" | "status";
  progress_percent: number | null;
  status: string;
  due_date: string;
}

export interface TeamDashboardReport {
  id: string;
  name: string;
  email: string;
  goals: TeamDashboardGoal[];
}

export interface TeamDashboardResponse {
  reports: TeamDashboardReport[];
}

// GET /dashboard/team — the caller's direct reports; a request naming an
// `employeeId` outside the caller's reporting line fails with a 403 (surfaced
// to callers as an ApiError whose `status` is 403).
export function getTeamDashboard(employeeId?: string): Promise<TeamDashboardResponse> {
  const query = employeeId ? `?employee_id=${encodeURIComponent(employeeId)}` : "";
  return apiFetch<TeamDashboardResponse>(`/dashboard/team${query}`);
}
