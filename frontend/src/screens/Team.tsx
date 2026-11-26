// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  Badge,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Avatar,
  Tabs,
  Stat,
  Empty,
} = UI;

const { Search, Check } = Icons;

// ─── PMS23 · My team (route: team) ──────────────────────────────────────────
// Serves US-014 (manager views reports' goals), US-008 (assign goals to reports),
// US-002 (role-based access limited to the reporting line).

const TODAY_ISO = "2026-11-05";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fmtDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const daysUntil = (iso) => {
  if (!iso) return null;
  const a = new Date(iso + "T00:00:00").getTime();
  const b = new Date(TODAY_ISO + "T00:00:00").getTime();
  return Math.round((a - b) / 86400000);
};

const MANAGER = {
  id: "u-1",
  name: "Priya Raghunathan",
  role: "Engineering Manager",
  email: "priya.raghunathan@northgate.io",
};

const HR_ADMIN = "Rosalind Okafor";

// users (manager_id = u-1 for every one of these)
const REPORTS = [
  {
    id: "u-2",
    name: "Marcus Ilyin",
    title: "Senior Platform Engineer",
    email: "marcus.ilyin@northgate.io",
    since: "2024-03-04",
    lastCheckIn: "2026-11-03",
  },
  {
    id: "u-3",
    name: "Saoirse Dunne",
    title: "Product Designer",
    email: "saoirse.dunne@northgate.io",
    since: "2023-09-18",
    lastCheckIn: "2026-10-30",
  },
  {
    id: "u-4",
    name: "Tobias Lindqvist",
    title: "Data Engineer",
    email: "tobias.lindqvist@northgate.io",
    since: "2025-01-13",
    lastCheckIn: "2026-10-28",
  },
  {
    id: "u-5",
    name: "Nadia Bremner",
    title: "Associate Engineer",
    email: "nadia.bremner@northgate.io",
    since: "2026-10-27",
    lastCheckIn: null,
  },
  {
    id: "u-6",
    name: "Hugo Pereira",
    title: "QA Lead",
    email: "hugo.pereira@northgate.io",
    since: "2022-06-01",
    lastCheckIn: "2026-11-02",
  },
  {
    id: "u-7",
    name: "Wren Adeyemi",
    title: "Infrastructure Engineer",
    email: "wren.adeyemi@northgate.io",
    since: "2025-08-11",
    lastCheckIn: "2026-09-30",
  },
];

// People who exist in the org but are NOT in this manager's line (AC-005 / AC-039)
const OUTSIDE_LINE = [
  { name: "Dana Whitfield", title: "Financial Analyst", manager: "Helena Vargas", dept: "Finance" },
  { name: "Helena Vargas", title: "Finance Director", manager: "Anita Shore", dept: "Finance" },
  {
    name: "Oluwaseun Bako",
    title: "Account Executive",
    manager: "Marco Ferretti",
    dept: "Revenue",
  },
  { name: "Jonas Kerr", title: "Support Lead", manager: "Marco Ferretti", dept: "Support" },
];

const OBJECTIVES = [
  { id: "o-1", title: "Platform reliability FY26", level: "company" },
  { id: "o-2", title: "PMS23 live for all staff by Q1", level: "company" },
  { id: "o-3", title: "Design system adoption", level: "manager" },
  { id: "o-4", title: "Cut operational toil by a third", level: "manager" },
];

const INITIAL_GOALS = {
  "u-2": [
    {
      id: "G-118",
      title: "Cut p95 checkout API latency to 180 ms",
      target_metric: "p95 ≤ 180 ms (from 412 ms)",
      progress_type: "percent",
      progress_percent: 72,
      status: "In progress",
      due_date: "2026-12-19",
      check_in_interval_days: 14,
      parent: "o-1",
      lastCheckIn: "2026-11-03",
      checkInOverdue: false,
    },
    {
      id: "G-126",
      title: "Reduce Terraform drift alerts",
      target_metric: "Fewer than 5 open drift alerts",
      progress_type: "status",
      progress_percent: null,
      status: "Blocked",
      due_date: "2026-11-14",
      check_in_interval_days: 7,
      parent: "o-4",
      lastCheckIn: "2026-10-29",
      checkInOverdue: true,
    },
    {
      id: "G-131",
      title: "Mentor two engineers to L3 promotion",
      target_metric: "2 promotion packets submitted",
      progress_type: "percent",
      progress_percent: 40,
      status: "In progress",
      due_date: "2027-01-30",
      check_in_interval_days: 30,
      parent: null,
      lastCheckIn: "2026-10-21",
      checkInOverdue: false,
    },
    {
      id: "G-104",
      title: "Ship read-replica failover runbook",
      target_metric: "Signed off by two SREs",
      progress_type: "status",
      progress_percent: null,
      status: "Completed",
      due_date: "2026-10-31",
      completed_at: "2026-10-22",
      check_in_interval_days: 14,
      parent: "o-1",
      lastCheckIn: "2026-10-22",
      checkInOverdue: false,
    },
  ],
  "u-3": [
    {
      id: "G-109",
      title: "Redesign the goal check-in flow",
      target_metric: "Task success ≥ 90% in usability test",
      progress_type: "percent",
      progress_percent: 85,
      status: "In progress",
      due_date: "2026-11-07",
      check_in_interval_days: 7,
      parent: "o-2",
      lastCheckIn: "2026-10-30",
      checkInOverdue: false,
    },
    {
      id: "G-122",
      title: "Run six moderated research sessions",
      target_metric: "6 sessions + synthesis deck",
      progress_type: "percent",
      progress_percent: 50,
      status: "In progress",
      due_date: "2026-12-05",
      check_in_interval_days: 14,
      parent: null,
      lastCheckIn: "2026-10-24",
      checkInOverdue: false,
    },
    {
      id: "G-097",
      title: "Publish component library v2",
      target_metric: "28 components documented",
      progress_type: "percent",
      progress_percent: 100,
      status: "Completed",
      due_date: "2026-10-15",
      completed_at: "2026-09-30",
      check_in_interval_days: 14,
      parent: "o-3",
      lastCheckIn: "2026-09-30",
      checkInOverdue: false,
    },
  ],
  "u-4": [
    {
      id: "G-107",
      title: "Backfill the event warehouse to 2023",
      target_metric: "100% of 2023 partitions replayed",
      progress_type: "percent",
      progress_percent: 64,
      status: "In progress",
      due_date: "2026-12-01",
      check_in_interval_days: 14,
      parent: "o-1",
      lastCheckIn: "2026-10-28",
      checkInOverdue: false,
    },
    {
      id: "G-119",
      title: "dbt test coverage on core models",
      target_metric: "≥ 80% of models with tests",
      progress_type: "percent",
      progress_percent: 38,
      status: "In progress",
      due_date: "2026-11-20",
      check_in_interval_days: 7,
      parent: "o-4",
      lastCheckIn: "2026-10-09",
      checkInOverdue: true,
    },
    {
      id: "G-093",
      title: "Deprecate legacy ETL cron jobs",
      target_metric: "All 14 jobs migrated to Airflow",
      progress_type: "status",
      progress_percent: null,
      status: "Completed",
      due_date: "2026-10-09",
      completed_at: "2026-10-07",
      check_in_interval_days: 14,
      parent: "o-4",
      lastCheckIn: "2026-10-07",
      checkInOverdue: false,
    },
    {
      id: "G-136",
      title: "Write the data contract spec for product events",
      target_metric: "Spec reviewed by 3 teams",
      progress_type: "status",
      progress_percent: null,
      status: "Not started",
      due_date: "2027-02-02",
      check_in_interval_days: 30,
      parent: null,
      lastCheckIn: null,
      checkInOverdue: false,
    },
  ],
  "u-5": [],
  "u-6": [
    {
      id: "G-112",
      title: "Automate the billing regression suite",
      target_metric: "90% of suite automated",
      progress_type: "percent",
      progress_percent: 58,
      status: "In progress",
      due_date: "2026-10-30",
      check_in_interval_days: 14,
      parent: "o-2",
      lastCheckIn: "2026-11-02",
      checkInOverdue: false,
    },
    {
      id: "G-120",
      title: "Cut the flaky test rate",
      target_metric: "Flake rate under 1.5%",
      progress_type: "status",
      progress_percent: null,
      status: "In progress",
      due_date: "2026-11-21",
      check_in_interval_days: 7,
      parent: "o-1",
      lastCheckIn: "2026-10-31",
      checkInOverdue: false,
    },
    {
      id: "G-133",
      title: "Define the release readiness checklist",
      target_metric: "Checklist adopted by 4 squads",
      progress_type: "status",
      progress_percent: null,
      status: "Not started",
      due_date: "2027-01-15",
      check_in_interval_days: 30,
      parent: null,
      lastCheckIn: null,
      checkInOverdue: false,
    },
  ],
  "u-7": [
    {
      id: "G-115",
      title: "Migrate CI runners to ARM",
      target_metric: "100% of jobs on ARM",
      progress_type: "percent",
      progress_percent: 30,
      status: "In progress",
      due_date: "2026-12-12",
      check_in_interval_days: 14,
      parent: "o-4",
      lastCheckIn: "2026-09-30",
      checkInOverdue: true,
    },
    {
      id: "G-128",
      title: "Refresh the on-call handbook",
      target_metric: "Every rota role documented",
      progress_type: "status",
      progress_percent: null,
      status: "Not started",
      due_date: "2026-11-28",
      check_in_interval_days: 14,
      parent: null,
      lastCheckIn: null,
      checkInOverdue: false,
    },
  ],
};

const WARN = "#d9a85c"; // warning only — blocked, check-in overdue
const DANGER = "#d98b7e"; // error only — overdue, failed load
const HAIR = "rgba(255,255,255,0.11)";
const SURFACE = "rgba(255,255,255,0.028)";
const SURFACE_2 = "rgba(255,255,255,0.055)";

export default function Screen() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("u-2");
  const [tab, setTab] = React.useState("all");
  const [goalsByUser, setGoalsByUser] = React.useState(INITIAL_GOALS);
  const [tobiasState, setTobiasState] = React.useState("error"); // error | loading | ready
  const [formOpen, setFormOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    assignee: "u-2",
    title: "",
    description: "",
    target_metric: "",
    progress_type: "percent",
    parent_objective_id: "",
    due_date: "",
    check_in_interval_days: "14",
  });
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [newGoalId, setNewGoalId] = React.useState(null);
  const [sync, setSync] = React.useState({ busy: false, label: "4 minutes ago" });
  const [accessRequested, setAccessRequested] = React.useState(null);

  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const after = (ms, fn) => {
    timers.current.push(setTimeout(fn, ms));
  };

  // ── derived ──────────────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();
  const matches = (r) => r.name.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
  const visibleReports = q ? REPORTS.filter(matches) : REPORTS;
  const outsideHit =
    q && visibleReports.length === 0
      ? OUTSIDE_LINE.find(
          (p) => p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q),
        )
      : null;
  const noResults = q && visibleReports.length === 0 && !outsideHit;

  const selected = REPORTS.find((r) => r.id === selectedId) || REPORTS[0];
  const selectedGoals = goalsByUser[selected.id] || [];
  const tobiasBlocked = selected.id === "u-4" && tobiasState !== "ready";

  const goalsFor = (id) => (id === "u-4" && tobiasState !== "ready" ? [] : goalsByUser[id] || []);
  const needsAttention = (g) =>
    g.status !== "Completed" &&
    (g.status === "Blocked" || g.checkInOverdue || daysUntil(g.due_date) < 0);

  const allLoaded = REPORTS.flatMap((r) => goalsFor(r.id));
  const inFlight = allLoaded.filter((g) => g.status === "In progress").length;
  const attention = allLoaded.filter(needsAttention).length;
  const completed = allLoaded.filter((g) => g.status === "Completed").length;

  const filteredGoals = selectedGoals.filter((g) =>
    tab === "all"
      ? true
      : tab === "attention"
        ? needsAttention(g)
        : tab === "open"
          ? g.status !== "Completed"
          : g.status === "Completed",
  );

  const tabs = [
    { key: "all", label: `All · ${selectedGoals.length}` },
    {
      key: "open",
      label: `Open · ${selectedGoals.filter((g) => g.status !== "Completed").length}`,
    },
    { key: "attention", label: `Needs attention · ${selectedGoals.filter(needsAttention).length}` },
    {
      key: "done",
      label: `Completed · ${selectedGoals.filter((g) => g.status === "Completed").length}`,
    },
  ];

  // ── actions ──────────────────────────────────────────────────────────────
  const openForm = (id) => {
    setForm((f) => ({ ...f, assignee: id || selected.id }));
    setErrors({});
    setFormOpen(true);
  };

  const refresh = () => {
    setSync({ busy: true, label: sync.label });
    after(700, () => setSync({ busy: false, label: "just now" }));
  };

  const retryTobias = () => {
    setTobiasState("loading");
    after(900, () => setTobiasState("ready"));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "Give the goal a title your report will recognise.";
    if (!form.due_date) errs.due_date = "A due date is required so progress can be tracked.";
    if (!form.assignee) errs.assignee = "Choose someone from your reporting line.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    after(750, () => {
      const id = "G-" + (140 + Object.values(goalsByUser).flat().length - 15);
      const goal = {
        id,
        title: form.title.trim(),
        description: form.description.trim(),
        target_metric: form.target_metric.trim() || "Target to be agreed at first check-in",
        progress_type: form.progress_type,
        progress_percent: form.progress_type === "percent" ? 0 : null,
        status: "Not started",
        due_date: form.due_date,
        check_in_interval_days: Number(form.check_in_interval_days),
        parent: form.parent_objective_id || null,
        lastCheckIn: null,
        checkInOverdue: false,
      };
      const who = REPORTS.find((r) => r.id === form.assignee);
      setGoalsByUser((prev) => ({
        ...prev,
        [form.assignee]: [goal, ...(prev[form.assignee] || [])],
      }));
      if (form.assignee === "u-4") setTobiasState("ready");
      setSelectedId(form.assignee);
      setTab("all");
      setNewGoalId(id);
      setSubmitting(false);
      setFormOpen(false);
      setToast({ id, title: goal.title, name: who ? who.name : "" });
      setForm({
        assignee: form.assignee,
        title: "",
        description: "",
        target_metric: "",
        progress_type: "percent",
        parent_objective_id: "",
        due_date: "",
        check_in_interval_days: "14",
      });
    });
  };

  // ── small pieces ─────────────────────────────────────────────────────────
  const label = (extra = "") => `text-[11px] uppercase tracking-[0.16em] ${extra}`;

  const panelStyle = {
    backgroundColor: SURFACE,
    border: `1px solid ${HAIR}`,
    borderRadius: brand.radius,
  };

  const StatusTag = ({ status }) => {
    const map = {
      Completed: { c: brand.accentColor, Icon: Icons.CheckCircle },
      "In progress": { c: brand.primaryColor, Icon: Icons.Clock },
      "Not started": { c: brand.neutralColor, Icon: Icons.Calendar },
      Blocked: { c: WARN, Icon: Icons.AlertCircle },
    };
    const { c, Icon } = map[status] || map["Not started"];
    return (
      <Badge
        className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium whitespace-nowrap"
        style={{
          color: c,
          backgroundColor: "transparent",
          border: `1px solid ${c}55`,
          borderRadius: brand.radius,
        }}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {status}
      </Badge>
    );
  };

  const Flag = ({ tone, children }) => (
    <span
      className="inline-flex items-center gap-1 text-[12px] font-medium"
      style={{ color: tone }}
    >
      <Icons.AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </span>
  );

  const Bar = ({ value }) => (
    <div
      className="h-[3px] w-24 overflow-hidden rounded-full"
      style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      aria-hidden="true"
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          backgroundColor: brand.accentColor,
          transition: "width .5s ease",
        }}
      />
    </div>
  );

  const fieldStyle = {
    backgroundColor: "rgba(0,0,0,0.25)",
    border: `1px solid ${HAIR}`,
    color: brand.primaryColor,
    borderRadius: brand.radius,
    colorScheme: "dark",
  };

  const ghostBtn = {
    backgroundColor: "transparent",
    border: `1px solid ${HAIR}`,
    color: brand.primaryColor,
    borderRadius: brand.radius,
  };

  const primaryBtn = {
    backgroundColor: brand.accentColor,
    color: brand.backgroundColor,
    border: `1px solid ${brand.accentColor}`,
    borderRadius: brand.radius,
    fontWeight: 600,
  };

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-full px-5 py-8 sm:px-8 lg:px-10"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
        "--v-accent": brand.accentColor,
      }}
    >
      <style>{`
        .v-focus:focus-visible { outline: 2px solid var(--v-accent); outline-offset: 2px; }
        .v-row { animation: vRowIn .34s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes vRowIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .v-panel { animation: vPanelIn .26s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes vPanelIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        .v-skel { animation: vPulse 1.4s ease-in-out infinite; }
        @keyframes vPulse { 0%,100% { opacity: .35; } 50% { opacity: .75; } }
        .v-rowhover:hover { background-color: rgba(255,255,255,0.035); }
        @media (prefers-reduced-motion: reduce) {
          .v-row, .v-panel, .v-skel { animation: none !important; }
        }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <header className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className={label()} style={{ color: brand.accentColor }}>
              Reporting line — {MANAGER.name}
            </p>
            <h1
              className="mt-3 text-[34px] leading-[1.15] sm:text-[40px]"
              style={{ fontFamily: brand.fontHeading, letterSpacing: "-0.01em" }}
            >
              My team
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: brand.neutralColor }}>
              Six people report to you. You can open and assign goals for them — anyone outside your
              line stays closed, including to you.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-2 text-[12px]"
              style={{ color: brand.neutralColor }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: sync.busy ? WARN : brand.accentColor }}
                aria-hidden="true"
              />
              {sync.busy ? "Syncing team goals…" : `Synced ${sync.label}`}
            </span>
            <Button
              type="button"
              onClick={refresh}
              disabled={sync.busy}
              className="v-focus inline-flex h-11 items-center gap-2 px-4 text-[13px] disabled:opacity-50"
              style={ghostBtn}
            >
              <Icons.Clock className="h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
            <Button
              type="button"
              onClick={() => navigate("dashboard")}
              className="v-focus inline-flex h-11 items-center gap-2 px-4 text-[13px]"
              style={{ ...ghostBtn, borderColor: "transparent", color: brand.neutralColor }}
            >
              My own goals
              <Icons.ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* ── Team band ──────────────────────────────────────────────────── */}
        <h2 className="sr-only">Team summary</h2>
        <div
          className="mt-8 grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4"
          style={{ backgroundColor: HAIR, border: `1px solid ${HAIR}`, borderRadius: brand.radius }}
        >
          {[
            { label: "Direct reports", value: "6", hint: "All assigned by HR" },
            {
              label: "Goals in flight",
              value: String(inFlight),
              hint: tobiasState === "ready" ? "Across 5 people" : "1 report not loaded",
            },
            {
              label: "Need attention",
              value: String(attention),
              hint: "Overdue, blocked or stale",
            },
            { label: "Completed this cycle", value: String(completed), hint: "Q4 FY26 to date" },
          ].map((s) => (
            <Stat
              key={s.label}
              label={s.label}
              value={s.value}
              hint={s.hint}
              className="px-5 py-5"
            />
          ))}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto mt-8 max-w-[1180px] lg:flex lg:items-start lg:gap-8">
        {/* Roster rail */}
        <aside className="lg:w-[292px] lg:shrink-0">
          <div style={panelStyle} className="p-5">
            <h2 className="text-[19px]" style={{ fontFamily: brand.fontHeading }}>
              Direct reports
            </h2>

            <div className="mt-4">
              <Label
                htmlFor="team-search"
                className={label("block")}
                style={{ color: brand.neutralColor }}
              >
                Find someone
              </Label>
              <div className="relative mt-2">
                <Icons.Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: brand.neutralColor }}
                  aria-hidden="true"
                />
                <Input
                  id="team-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Name or job title"
                  className="v-focus h-11 w-full pl-9 pr-3 text-[14px] placeholder:opacity-60"
                  style={fieldStyle}
                />
              </div>
              <p className="mt-2 text-[12px]" style={{ color: brand.neutralColor }}>
                {q
                  ? `${visibleReports.length} of 6 in your line match`
                  : "Searching your reporting line only"}
              </p>
            </div>

            <div className="my-4" style={{ borderTop: `1px solid ${HAIR}` }} />

            {visibleReports.length > 0 ? (
              <ul className="space-y-1">
                {visibleReports.map((r) => {
                  const gs = goalsFor(r.id);
                  const att = gs.filter(needsAttention).length;
                  const pct = gs.filter((g) => g.progress_type === "percent");
                  const avg = pct.length
                    ? Math.round(pct.reduce((a, g) => a + g.progress_percent, 0) / pct.length)
                    : null;
                  const isSel = r.id === selected.id && !outsideHit && !noResults;
                  const unloaded = r.id === "u-4" && tobiasState === "error";
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(r.id);
                          setTab("all");
                          setToast(null);
                        }}
                        aria-current={isSel ? "true" : undefined}
                        className="v-focus v-rowhover flex w-full items-center gap-3 px-3 py-3 text-left"
                        style={{
                          borderRadius: brand.radius,
                          backgroundColor: isSel ? SURFACE_2 : "transparent",
                          boxShadow: isSel ? `inset 2px 0 0 ${brand.accentColor}` : "none",
                          transition: "background-color .18s ease",
                        }}
                      >
                        <Avatar name={r.name} className="h-9 w-9 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium">{r.name}</span>
                          <span
                            className="block truncate text-[12px]"
                            style={{ color: brand.neutralColor }}
                          >
                            {r.title}
                          </span>
                          <span className="mt-1.5 flex items-center gap-2">
                            {unloaded ? (
                              <span className="text-[11px]" style={{ color: DANGER }}>
                                Not loaded
                              </span>
                            ) : gs.length === 0 ? (
                              <span className="text-[11px]" style={{ color: brand.neutralColor }}>
                                No goals yet
                              </span>
                            ) : (
                              <>
                                {avg !== null && <Bar value={avg} />}
                                <span
                                  className="text-[11px]"
                                  style={{
                                    color: brand.neutralColor,
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  {gs.length} {gs.length === 1 ? "goal" : "goals"}
                                  {att > 0 ? ` · ${att} flagged` : ""}
                                </span>
                              </>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p
                className="px-1 py-3 text-[13px] leading-relaxed"
                style={{ color: brand.neutralColor }}
              >
                Nobody in your line matches “{query.trim()}”.
              </p>
            )}

            <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${HAIR}` }}>
              <p className="text-[12px] leading-relaxed" style={{ color: brand.neutralColor }}>
                Reporting lines are maintained by HR. If someone is missing, ask {HR_ADMIN} to
                update the structure in People admin.
              </p>
            </div>
          </div>
        </aside>

        {/* Detail column */}
        <main className="mt-6 min-w-0 flex-1 lg:mt-0">
          {outsideHit ? (
            /* ── Permission denied (AC-005 / AC-039) ───────────────────── */
            <section style={panelStyle} className="v-panel p-7 sm:p-9">
              <span
                className="inline-flex h-11 w-11 items-center justify-center"
                style={{ borderRadius: brand.radius, border: `1px solid ${WARN}55`, color: WARN }}
              >
                <Icons.AlertCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-[26px]" style={{ fontFamily: brand.fontHeading }}>
                Outside your reporting line
              </h2>
              <p
                className="mt-3 max-w-prose text-[15px] leading-relaxed"
                style={{ color: brand.neutralColor }}
              >
                <span style={{ color: brand.primaryColor }}>{outsideHit.name}</span> —{" "}
                {outsideHit.title}, {outsideHit.dept} — reports to {outsideHit.manager}. Goals,
                progress and check-ins are visible to the goal owner, their own manager, HR admins
                and nobody else.
              </p>
              <p
                className="mt-3 max-w-prose text-[15px] leading-relaxed"
                style={{ color: brand.neutralColor }}
              >
                If {outsideHit.name.split(" ")[0]} should report to you, {HR_ADMIN} (HR admin) can
                move the line. Access follows the line the moment it changes.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => setQuery("")}
                  className="v-focus inline-flex h-11 items-center gap-2 px-5 text-[14px]"
                  style={primaryBtn}
                >
                  <Icons.ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to my six reports
                </Button>
                <Button
                  type="button"
                  onClick={() => setAccessRequested(outsideHit.name)}
                  disabled={accessRequested === outsideHit.name}
                  className="v-focus inline-flex h-11 items-center gap-2 px-5 text-[14px] disabled:opacity-50"
                  style={ghostBtn}
                >
                  <Icons.Users className="h-4 w-4" aria-hidden="true" />
                  Ask {HR_ADMIN.split(" ")[0]} to review the line
                </Button>
              </div>

              {accessRequested === outsideHit.name && (
                <p
                  className="v-panel mt-4 inline-flex items-center gap-2 text-[13px]"
                  style={{ color: brand.accentColor }}
                  role="status"
                >
                  <Icons.Check className="h-4 w-4" aria-hidden="true" />
                  Request sent to {HR_ADMIN} on {fmtDate(TODAY_ISO)}. She'll confirm by email.
                </p>
              )}
            </section>
          ) : noResults ? (
            /* ── Empty: no results ─────────────────────────────────────── */
            <section style={panelStyle} className="p-7">
              <Empty
                title={`No match for “${query.trim()}”`}
                description="Search covers the six people who report to you — try a first name, a surname or a job title such as “QA Lead”."
                action={
                  <Button
                    type="button"
                    onClick={() => setQuery("")}
                    className="v-focus inline-flex h-11 items-center gap-2 px-5 text-[14px]"
                    style={primaryBtn}
                  >
                    Clear search
                  </Button>
                }
              />
            </section>
          ) : (
            <section style={panelStyle} className="overflow-hidden">
              {/* Report header */}
              <div className="flex flex-wrap items-start justify-between gap-5 p-6 sm:p-7">
                <div className="flex min-w-0 items-start gap-4">
                  <Avatar name={selected.name} className="h-14 w-14 shrink-0" />
                  <div className="min-w-0">
                    <h2
                      className="text-[26px] leading-tight"
                      style={{ fontFamily: brand.fontHeading }}
                    >
                      {selected.name}
                    </h2>
                    <p className="mt-1 text-[14px]" style={{ color: brand.neutralColor }}>
                      {selected.title} · {selected.email}
                    </p>
                    <p
                      className="mt-2 text-[12px]"
                      style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
                    >
                      Reports to you since {fmtDate(selected.since)} ·{" "}
                      {selected.lastCheckIn
                        ? `last check-in ${fmtDate(selected.lastCheckIn)}`
                        : "no check-ins yet"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate("praise")}
                    className="v-focus inline-flex h-11 items-center gap-2 px-4 text-[13px]"
                    style={{ ...ghostBtn, borderColor: "transparent", color: brand.neutralColor }}
                  >
                    Send praise
                  </Button>
                  <Button
                    type="button"
                    onClick={() => openForm(selected.id)}
                    aria-expanded={formOpen}
                    className="v-focus inline-flex h-12 items-center gap-2 px-5 text-[14px]"
                    style={primaryBtn}
                  >
                    <Icons.Plus className="h-4 w-4" aria-hidden="true" />
                    Assign a goal to {selected.name.split(" ")[0]}
                  </Button>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${HAIR}` }} />

              {/* Success banner */}
              {toast && (
                <div
                  className="v-panel m-6 flex items-start gap-3 p-4 sm:mx-7"
                  role="status"
                  style={{
                    borderRadius: brand.radius,
                    border: `1px solid ${brand.accentColor}55`,
                    backgroundColor: "rgba(143,174,139,0.08)",
                  }}
                >
                  <Icons.CheckCircle
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: brand.accentColor }}
                    aria-hidden="true"
                  />
                  <p className="flex-1 text-[14px] leading-relaxed">
                    <span style={{ color: brand.accentColor, fontVariantNumeric: "tabular-nums" }}>
                      {toast.id}
                    </span>{" "}
                    “{toast.title}” is now on {toast.name}'s dashboard, attributed to{" "}
                    {toast.name.split(" ")[0]}. An in-app notification has been sent.
                  </p>
                  <button
                    type="button"
                    onClick={() => setToast(null)}
                    aria-label="Dismiss confirmation"
                    className="v-focus -m-1 p-1"
                    style={{ borderRadius: brand.radius, color: brand.neutralColor }}
                  >
                    <Icons.X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Assign form */}
              {formOpen && (
                <form
                  onSubmit={submit}
                  className="v-panel m-6 p-6 sm:mx-7"
                  style={{
                    borderRadius: brand.radius,
                    border: `1px solid ${HAIR}`,
                    backgroundColor: "rgba(0,0,0,0.18)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[20px]" style={{ fontFamily: brand.fontHeading }}>
                        Assign a goal
                      </h3>
                      <p
                        className="mt-1.5 max-w-prose text-[13px] leading-relaxed"
                        style={{ color: brand.neutralColor }}
                      >
                        It appears on your report's dashboard immediately, owned by them and created
                        by you. Only people in your reporting line can be chosen.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormOpen(false);
                        setErrors({});
                      }}
                      aria-label="Close the assign goal form"
                      className="v-focus -m-1 p-1"
                      style={{ borderRadius: brand.radius, color: brand.neutralColor }}
                    >
                      <Icons.X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  {Object.keys(errors).length > 0 && (
                    <div
                      role="alert"
                      className="v-panel mt-5 p-4"
                      style={{
                        borderRadius: brand.radius,
                        border: `1px solid ${DANGER}66`,
                        backgroundColor: "rgba(217,139,126,0.08)",
                      }}
                    >
                      <p className="text-[13px] font-medium" style={{ color: DANGER }}>
                        The goal wasn't saved — two fields are required and your text has been kept.
                      </p>
                      <ul
                        className="mt-2 list-inside list-disc space-y-1 text-[13px]"
                        style={{ color: brand.neutralColor }}
                      >
                        {Object.entries(errors).map(([k, v]) => (
                          <li key={k}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label
                        htmlFor="g-title"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Goal title <span style={{ color: brand.accentColor }}>· required</span>
                      </Label>
                      <Input
                        id="g-title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Reduce deploy rollback rate to under 2%"
                        aria-invalid={errors.title ? "true" : undefined}
                        aria-describedby={errors.title ? "g-title-err" : undefined}
                        className="v-focus mt-2 h-11 w-full px-3 text-[14px]"
                        style={{ ...fieldStyle, borderColor: errors.title ? DANGER : HAIR }}
                      />
                      {errors.title && (
                        <p
                          id="g-title-err"
                          className="mt-1.5 text-[12px]"
                          style={{ color: DANGER }}
                        >
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <Label
                        htmlFor="g-desc"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Description
                      </Label>
                      <Textarea
                        id="g-desc"
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Why this matters and what good looks like by the due date."
                        className="v-focus mt-2 w-full px-3 py-2.5 text-[14px]"
                        style={fieldStyle}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="g-assignee"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Assign to <span style={{ color: brand.accentColor }}>· required</span>
                      </Label>
                      <Select
                        id="g-assignee"
                        value={form.assignee}
                        onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                        className="v-focus mt-2 h-11 w-full px-3 text-[14px]"
                        style={fieldStyle}
                      >
                        <optgroup label="Your direct reports">
                          {REPORTS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} — {r.title}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Outside your line — not permitted">
                          {OUTSIDE_LINE.slice(0, 2).map((p) => (
                            <option key={p.name} value="" disabled>
                              {p.name} — reports to {p.manager}
                            </option>
                          ))}
                        </optgroup>
                      </Select>
                      <p className="mt-1.5 text-[12px]" style={{ color: brand.neutralColor }}>
                        People outside your line are listed but cannot be selected.
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor="g-due"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Due date <span style={{ color: brand.accentColor }}>· required</span>
                      </Label>
                      <Input
                        id="g-due"
                        type="date"
                        value={form.due_date}
                        onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                        aria-invalid={errors.due_date ? "true" : undefined}
                        aria-describedby={errors.due_date ? "g-due-err" : undefined}
                        className="v-focus mt-2 h-11 w-full px-3 text-[14px]"
                        style={{ ...fieldStyle, borderColor: errors.due_date ? DANGER : HAIR }}
                      />
                      {errors.due_date && (
                        <p id="g-due-err" className="mt-1.5 text-[12px]" style={{ color: DANGER }}>
                          {errors.due_date}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label
                        htmlFor="g-metric"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Measurable target
                      </Label>
                      <Input
                        id="g-metric"
                        value={form.target_metric}
                        onChange={(e) => setForm({ ...form, target_metric: e.target.value })}
                        placeholder="Rollback rate ≤ 2% over 30 days"
                        className="v-focus mt-2 h-11 w-full px-3 text-[14px]"
                        style={fieldStyle}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="g-type"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Tracked by
                      </Label>
                      <Select
                        id="g-type"
                        value={form.progress_type}
                        onChange={(e) => setForm({ ...form, progress_type: e.target.value })}
                        className="v-focus mt-2 h-11 w-full px-3 text-[14px]"
                        style={fieldStyle}
                      >
                        <option value="percent">Percentage complete</option>
                        <option value="status">Status</option>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="g-parent"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Parent objective
                      </Label>
                      <Select
                        id="g-parent"
                        value={form.parent_objective_id}
                        onChange={(e) => setForm({ ...form, parent_objective_id: e.target.value })}
                        className="v-focus mt-2 h-11 w-full px-3 text-[14px]"
                        style={fieldStyle}
                      >
                        <option value="">No parent — standalone goal</option>
                        {OBJECTIVES.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.title} ({o.level})
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="g-interval"
                        className={label("block")}
                        style={{ color: brand.neutralColor }}
                      >
                        Check-in every
                      </Label>
                      <Select
                        id="g-interval"
                        value={form.check_in_interval_days}
                        onChange={(e) =>
                          setForm({ ...form, check_in_interval_days: e.target.value })
                        }
                        className="v-focus mt-2 h-11 w-full px-3 text-[14px]"
                        style={fieldStyle}
                      >
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="v-focus inline-flex h-12 items-center gap-2 px-6 text-[14px] disabled:opacity-60"
                      style={primaryBtn}
                    >
                      {submitting ? (
                        <>
                          <Icons.Clock className="h-4 w-4 v-skel" aria-hidden="true" />
                          Assigning…
                        </>
                      ) : (
                        <>
                          <Icons.Check className="h-4 w-4" aria-hidden="true" />
                          Assign goal
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setFormOpen(false);
                        setErrors({});
                      }}
                      className="v-focus inline-flex h-12 items-center px-5 text-[14px]"
                      style={ghostBtn}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Goals */}
              <div className="px-6 pb-7 sm:px-7">
                {tobiasBlocked ? (
                  tobiasState === "loading" ? (
                    <div className="py-8" role="status" aria-live="polite">
                      <p className="text-[13px]" style={{ color: brand.neutralColor }}>
                        Loading {selected.name.split(" ")[0]}'s goals…
                      </p>
                      <div className="mt-5 space-y-3">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="v-skel h-12"
                            style={{
                              borderRadius: brand.radius,
                              backgroundColor: SURFACE_2,
                              animationDelay: `${i * 0.12}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8">
                      <span
                        className="inline-flex h-11 w-11 items-center justify-center"
                        style={{
                          borderRadius: brand.radius,
                          border: `1px solid ${DANGER}55`,
                          color: DANGER,
                        }}
                      >
                        <Icons.AlertCircle className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-[20px]" style={{ fontFamily: brand.fontHeading }}>
                        {selected.name.split(" ")[0]}'s goals didn't load
                      </h3>
                      <p
                        className="mt-2 max-w-prose text-[14px] leading-relaxed"
                        style={{ color: brand.neutralColor }}
                      >
                        The goals service stopped answering after 10 seconds. Nothing has been lost
                        — his four goals and their check-ins are still stored. The team figures
                        above exclude him until this loads.
                      </p>
                      <Button
                        type="button"
                        onClick={retryTobias}
                        className="v-focus mt-6 inline-flex h-11 items-center gap-2 px-5 text-[14px]"
                        style={primaryBtn}
                      >
                        Try loading again
                      </Button>
                    </div>
                  )
                ) : selectedGoals.length === 0 ? (
                  <div className="py-6">
                    <Empty
                      title={`No goals for ${selected.name.split(" ")[0]} yet`}
                      description={`${selected.name.split(" ")[0]} joined on ${fmtDate(selected.since)}. Assign a first goal so there's something on the dashboard from week one — a 30-day onboarding objective works well.`}
                      action={
                        <Button
                          type="button"
                          onClick={() => openForm(selected.id)}
                          className="v-focus inline-flex h-11 items-center gap-2 px-5 text-[14px]"
                          style={primaryBtn}
                        >
                          <Icons.Plus className="h-4 w-4" aria-hidden="true" />
                          Assign the first goal
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="sr-only">Goals owned by {selected.name}</h3>
                    <Tabs tabs={tabs} active={tab} onChange={setTab} className="mb-5" />

                    {filteredGoals.length === 0 ? (
                      <div className="py-4">
                        <Empty
                          title={
                            tab === "done"
                              ? "Nothing completed in this cycle yet"
                              : "Nothing flagged right now"
                          }
                          description={
                            tab === "done"
                              ? `${selected.name.split(" ")[0]} has ${selectedGoals.filter((g) => g.status !== "Completed").length} open goals. Completed goals appear here with the date they were finished.`
                              : `Every goal is on schedule, unblocked and checked in on time. Flags appear here the moment a check-in is missed or a due date passes.`
                          }
                          action={
                            <Button
                              type="button"
                              onClick={() => setTab("all")}
                              className="v-focus inline-flex h-11 items-center px-5 text-[14px]"
                              style={ghostBtn}
                            >
                              Show all goals
                            </Button>
                          }
                        />
                      </div>
                    ) : (
                      <div className="-mx-1 overflow-x-auto">
                        <Table
                          className="w-full min-w-[720px] text-left"
                          style={{ fontVariantNumeric: "tabular-nums", borderCollapse: "collapse" }}
                        >
                          <THead>
                            <TR style={{ borderBottom: `1px solid ${HAIR}` }}>
                              {["Goal", "Progress", "Status", "Due", "Check-in", ""].map((h, i) => (
                                <TH
                                  key={h || i}
                                  scope="col"
                                  className={label("px-3 pb-3 font-normal")}
                                  style={{ color: brand.neutralColor }}
                                >
                                  {h || <span className="sr-only">Open goal</span>}
                                </TH>
                              ))}
                            </TR>
                          </THead>
                          <TBody>
                            {filteredGoals.map((g) => {
                              const d = daysUntil(g.due_date);
                              const overdue = g.status !== "Completed" && d < 0;
                              const soon = g.status !== "Completed" && d >= 0 && d <= 7;
                              const parent = OBJECTIVES.find((o) => o.id === g.parent);
                              return (
                                <TR
                                  key={g.id}
                                  className={`v-rowhover ${g.id === newGoalId ? "v-row" : ""}`}
                                  style={{ borderBottom: `1px solid ${HAIR}` }}
                                >
                                  <TD className="px-3 py-4 align-top">
                                    <button
                                      type="button"
                                      onClick={() => navigate("goal-detail")}
                                      className="v-focus text-left"
                                      style={{ borderRadius: brand.radius }}
                                    >
                                      <span
                                        className="block text-[11px] tracking-[0.14em]"
                                        style={{ color: brand.accentColor }}
                                      >
                                        {g.id}
                                      </span>
                                      <span
                                        className="mt-1 block text-[15px] font-medium leading-snug"
                                        style={{ color: brand.primaryColor }}
                                      >
                                        {g.title}
                                      </span>
                                    </button>
                                    <span
                                      className="mt-1.5 block text-[12.5px] leading-relaxed"
                                      style={{ color: brand.neutralColor }}
                                    >
                                      {g.target_metric}
                                      {parent && (
                                        <>
                                          {" "}
                                          · contributes to{" "}
                                          <span style={{ color: brand.primaryColor }}>
                                            {parent.title}
                                          </span>
                                        </>
                                      )}
                                    </span>
                                  </TD>

                                  <TD className="px-3 py-4 align-top">
                                    {g.progress_type === "percent" ? (
                                      <span className="block">
                                        <span
                                          className="text-[15px]"
                                          style={{ color: brand.primaryColor }}
                                        >
                                          {g.progress_percent}%
                                        </span>
                                        <span className="mt-2 block">
                                          <Bar value={g.progress_percent} />
                                        </span>
                                      </span>
                                    ) : (
                                      <span
                                        className="text-[13px]"
                                        style={{ color: brand.neutralColor }}
                                      >
                                        Status-tracked
                                      </span>
                                    )}
                                  </TD>

                                  <TD className="px-3 py-4 align-top">
                                    <StatusTag status={g.status} />
                                  </TD>

                                  <TD className="px-3 py-4 align-top">
                                    <span className="block text-[13.5px]">
                                      {fmtDate(g.due_date)}
                                    </span>
                                    <span className="mt-1 block">
                                      {overdue ? (
                                        <Flag tone={DANGER}>Overdue by {Math.abs(d)} days</Flag>
                                      ) : soon ? (
                                        <Flag tone={WARN}>
                                          Due in {d === 0 ? "today" : `${d} days`}
                                        </Flag>
                                      ) : g.status === "Completed" ? (
                                        <span
                                          className="text-[12px]"
                                          style={{ color: brand.neutralColor }}
                                        >
                                          Completed {fmtDate(g.completed_at)}
                                        </span>
                                      ) : (
                                        <span
                                          className="text-[12px]"
                                          style={{ color: brand.neutralColor }}
                                        >
                                          In {d} days
                                        </span>
                                      )}
                                    </span>
                                  </TD>

                                  <TD className="px-3 py-4 align-top">
                                    <span
                                      className="block text-[13.5px]"
                                      style={{ color: brand.neutralColor }}
                                    >
                                      {g.lastCheckIn ? fmtDate(g.lastCheckIn) : "None yet"}
                                    </span>
                                    <span className="mt-1 block">
                                      {g.checkInOverdue ? (
                                        <Flag tone={WARN}>Check-in overdue</Flag>
                                      ) : (
                                        <span
                                          className="text-[12px]"
                                          style={{ color: brand.neutralColor }}
                                        >
                                          Every {g.check_in_interval_days} days
                                        </span>
                                      )}
                                    </span>
                                  </TD>

                                  <TD className="px-3 py-4 align-top text-right">
                                    <Button
                                      type="button"
                                      onClick={() => navigate("goal-detail")}
                                      className="v-focus inline-flex h-10 items-center gap-1.5 px-3 text-[13px]"
                                      style={{
                                        ...ghostBtn,
                                        borderColor: "transparent",
                                        color: brand.neutralColor,
                                      }}
                                    >
                                      Open
                                      <Icons.ChevronRight className="h-4 w-4" aria-hidden="true" />
                                      <span className="sr-only">goal {g.id}</span>
                                    </Button>
                                  </TD>
                                </TR>
                              );
                            })}
                          </TBody>
                        </Table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          )}

          <p
            className="mt-5 px-1 text-[12px] leading-relaxed"
            style={{ color: brand.neutralColor }}
          >
            You are seeing this team because PMS23 matches each goal's owner against your reporting
            line. Access is logged.
          </p>
        </main>
      </div>
    </div>
  );
}
