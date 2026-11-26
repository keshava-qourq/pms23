import * as React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { ApiError, getTeamDashboard } from "@/lib/api";
import type { TeamDashboardGoal, TeamDashboardReport } from "@/lib/api";

const { Button, Badge, Avatar, Empty } = UI;

// US-014: a manager's team view — each direct report's goals and progress
// (AC-038), read from the cached GET /dashboard/team aggregate. A request
// naming someone outside the caller's reporting line is denied (AC-039);
// this screen only ever asks for its own team, but still renders that
// denial plainly if the server ever answers with it.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return iso;
  const [y, m, d] = parts;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

type Phase = "loading" | "ready" | "forbidden" | "error";

export const FORBIDDEN_MESSAGE =
  "You cannot view the goals of an employee outside your reporting line.";
export const LOAD_ERROR_MESSAGE = "We couldn’t load your team just now. Try again.";

const HAIR = "rgba(255,255,255,0.11)";
const SURFACE = "rgba(255,255,255,0.028)";

const STATUS_TONE: Record<string, { color: string; icon: string }> = {
  Completed: { color: brand.accentColor, icon: "CheckCircle" },
  "In progress": { color: brand.primaryColor, icon: "Clock" },
  "Not started": { color: brand.neutralColor, icon: "Calendar" },
  Blocked: { color: "#d9a85c", icon: "AlertCircle" },
};

function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE["Not started"];
  const Icon = Icons[tone.icon];
  return (
    <Badge
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium whitespace-nowrap"
      style={{
        color: tone.color,
        backgroundColor: "transparent",
        border: `1px solid ${tone.color}55`,
        borderRadius: brand.radius,
      }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {status}
    </Badge>
  );
}

function GoalRow({ goal }: { goal: TeamDashboardGoal }) {
  return (
    <li
      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
      style={{ borderTop: `1px solid ${HAIR}` }}
    >
      <span className="min-w-0 flex-1 truncate text-[14px]">{goal.title}</span>
      <span className="flex items-center gap-3">
        {goal.progress_type === "percent" ? (
          <span
            className="text-[12px] [font-variant-numeric:tabular-nums]"
            style={{ color: brand.neutralColor }}
          >
            {goal.progress_percent ?? 0}%
          </span>
        ) : null}
        <StatusBadge status={goal.status} />
        <span className="text-[12px]" style={{ color: brand.neutralColor }}>
          Due {fmtDate(goal.due_date)}
        </span>
      </span>
    </li>
  );
}

function ReportCard({ report }: { report: TeamDashboardReport }) {
  return (
    <section
      className="overflow-hidden"
      style={{ border: `1px solid ${HAIR}`, borderRadius: brand.radius, backgroundColor: SURFACE }}
    >
      <header className="flex items-center gap-3 px-4 py-4">
        <Avatar name={report.name} className="h-9 w-9 shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium">{report.name}</span>
          <span className="block truncate text-[12px]" style={{ color: brand.neutralColor }}>
            {report.email}
          </span>
        </span>
      </header>
      {report.goals.length === 0 ? (
        <div style={{ borderTop: `1px solid ${HAIR}` }}>
          <Empty title="No goals yet" description={`${report.name} has no goals assigned yet.`} />
        </div>
      ) : (
        <ul>
          {report.goals.map((goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Screen() {
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [reports, setReports] = React.useState<TeamDashboardReport[]>([]);

  const load = React.useCallback(() => {
    setPhase("loading");
    getTeamDashboard()
      .then((data) => {
        setReports(data.reports);
        setPhase("ready");
      })
      .catch((err: unknown) => {
        setPhase(err instanceof ApiError && err.status === 403 ? "forbidden" : "error");
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <div
      className="min-h-full px-5 py-8 sm:px-8 lg:px-10"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
      }}
    >
      <header className="mx-auto max-w-[900px]">
        <h1
          className="text-[34px] leading-[1.15] sm:text-[40px]"
          style={{ fontFamily: brand.fontHeading, letterSpacing: "-0.01em" }}
        >
          My team
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: brand.neutralColor }}>
          Each direct report, with their goals and progress.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-[900px] space-y-4">
        {phase === "loading" ? (
          <p role="status" className="text-[14px]" style={{ color: brand.neutralColor }}>
            Loading your team…
          </p>
        ) : phase === "forbidden" ? (
          <p
            role="alert"
            className="px-4 py-4 text-[14px] leading-relaxed"
            style={{ border: `1px solid ${HAIR}`, borderRadius: brand.radius }}
          >
            {FORBIDDEN_MESSAGE}
          </p>
        ) : phase === "error" ? (
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
            style={{ border: `1px solid ${HAIR}`, borderRadius: brand.radius }}
          >
            <p role="alert" className="text-[14px] leading-relaxed">
              {LOAD_ERROR_MESSAGE}
            </p>
            <Button type="button" onClick={load} className="h-10 px-4 text-[13px]">
              Retry
            </Button>
          </div>
        ) : reports.length === 0 ? (
          <Empty
            title="No direct reports yet"
            description="Employees HR assigns to you will appear here with their goals and progress."
          />
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
