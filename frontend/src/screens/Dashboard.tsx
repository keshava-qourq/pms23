// Hand-written: the generated design mockup rendered sample data only and
// never called the backend. This wires the reminders panel to the real
// GET /notifications and PATCH /notifications/{id}/read endpoints per
// AC-034.
import * as React from "react";

import { apiFetch } from "@/lib/api";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  email_status?: string | null;
  created_at: string;
}

type Phase = "loading" | "ready" | "error";

export default function Screen() {
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [dismissError, setDismissError] = React.useState<string | null>(null);
  const [dismissingId, setDismissingId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setPhase("loading");
    apiFetch<Notification[]>("/notifications")
      .then((data) => {
        setNotifications(data);
        setPhase("ready");
      })
      .catch(() => {
        setPhase("error");
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const dismiss = async (id: string) => {
    setDismissError(null);
    setDismissingId(id);
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setDismissError("Couldn't dismiss that reminder. Try again.");
    } finally {
      setDismissingId(null);
    }
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-semibold">My goals</h1>

      <section aria-label="Reminders" className="mt-8">
        <h2 className="text-lg font-medium">Reminders</h2>

        {dismissError ? (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {dismissError}
          </p>
        ) : null}

        {phase === "loading" ? (
          <p className="mt-3 text-sm text-neutral-400">Loading your reminders…</p>
        ) : phase === "error" ? (
          <div className="mt-3">
            <p className="text-sm text-red-400">Couldn't load your reminders. Try again.</p>
            <button
              type="button"
              onClick={load}
              className="mt-2 rounded border border-neutral-600 px-3 py-1.5 text-sm"
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="mt-3">
            <p className="text-sm font-medium">No reminders right now</p>
            <p className="mt-1 text-sm text-neutral-400">
              When a due date comes close or a check-in slips past its cadence, the reminder
              appears here.
            </p>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between gap-4 border-b border-neutral-700 pb-3"
              >
                <div>
                  <p className="text-sm">{n.message}</p>
                  {!n.is_read ? (
                    <span className="mt-1 inline-block text-xs text-emerald-400">Unread</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  aria-label={`Dismiss reminder ${n.id}`}
                  disabled={dismissingId === n.id}
                  onClick={() => dismiss(n.id)}
                  className="rounded border border-neutral-600 px-3 py-1.5 text-sm disabled:opacity-60"
                >
                  {`Dismiss reminder ${n.id}`}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
