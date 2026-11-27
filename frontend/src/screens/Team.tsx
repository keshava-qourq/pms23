// Hand-written: the generated design mockup rendered sample data only and
// never called the backend. This wires the team view to the real
// GET /dashboard/team endpoint per AC-038 (list each direct report's goals
// and progress) and AC-039 (deny access to an employee outside the
// manager's reporting line).
import * as React from "react";

import { apiFetch } from "@/lib/api";
import { useNavigate } from "@/lib/navigate";

interface TeamGoal {
  id: string;
  title: string;
  progress_type: string;
  progress_percent: number | null;
  status: string;
  due_date: string;
}

interface TeamReport {
  id: string;
  name: string;
  email: string;
  goals: TeamGoal[];
}

interface TeamResponse {
  reports: TeamReport[];
}

type Phase = "loading" | "ready" | "error" | "forbidden";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDueDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `Due ${d} ${MONTHS[m - 1]} ${y}`;
}

// apiFetch throws `Error("${method} ${path} failed: ${status}")` on a
// non-2xx response; this pulls the status back out so a 403 (outside the
// reporting line) can be told apart from any other failure without
// touching api.ts.
function statusFromError(err: unknown): string {
  const message = err instanceof Error ? err.message : "";
  const match = message.match(/(\d{3})\s*$/);
  return match ? match[1] : "";
}

export default function Screen() {
  const navigate = useNavigate();
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [reports, setReports] = React.useState<TeamReport[]>([]);

  const load = React.useCallback(() => {
    setPhase("loading");
    apiFetch<TeamResponse>("/dashboard/team")
      .then((data) => {
        setReports(data.reports ?? []);
        setPhase("ready");
      })
      .catch((err: unknown) => {
        setPhase(statusFromError(err) === "403" ? "forbidden" : "error");
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  if (phase === "loading") {
    return (
      <div className="px-6 py-8">
        <p role="status">Loading your team…</p>
      </div>
    );
  }

  if (phase === "forbidden") {
    return (
      <div className="px-6 py-8">
        <p role="alert">
          You cannot view the goals of an employee outside your reporting line.
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="px-6 py-8">
        <p role="alert">Couldn't load your team. Nothing has been lost — try again.</p>
        <button type="button" onClick={load} className="mt-4">
          Retry
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="px-6 py-8">
        <h1>No direct reports yet</h1>
        <p>Employees HR assigns to you will appear here with their goals and progress.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <h1>My team</h1>
      <ul className="mt-6 space-y-6">
        {reports.map((r) => (
          <li key={r.id}>
            <h2>{r.name}</h2>
            <p>{r.email}</p>
            {r.goals.length === 0 ? (
              <div className="mt-2">
                <p>No goals yet</p>
                <p>{r.name} has no goals assigned yet.</p>
              </div>
            ) : (
              <ul className="mt-2 space-y-3">
                {r.goals.map((g) => (
                  <li key={g.id}>
                    <button type="button" onClick={() => navigate("goal-detail")}>
                      {g.title}
                    </button>
                    <p>{g.status}</p>
                    {g.progress_type === "percent" && g.progress_percent != null && (
                      <p>{g.progress_percent}%</p>
                    )}
                    <p>{formatDueDate(g.due_date)}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
