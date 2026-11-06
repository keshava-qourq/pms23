// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
 
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Label,
  Select,
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

const SURFACE = "#1b2722";
const SURFACE_2 = "#213029";
const LINE = "rgba(233,237,233,0.11)";
const LINE_STRONG = "rgba(233,237,233,0.22)";

const GOAL_REF = "GL-2048";

const OBJECTIVES = [
  { id: "", title: "No parent objective — standalone goal", meta: "" },
  { id: "OBJ-07", title: "Support experience customers recommend", meta: "Company · FY26" },
  { id: "OBJ-12", title: "Halve time-to-resolution across Tier-1", meta: "Company · FY26" },
  {
    id: "OBJ-21",
    title: "Round-the-clock coverage for Support Ops",
    meta: "Manager · Dilan Okonkwo",
  },
  { id: "OBJ-30", title: "Lift CSAT to 4.6 by year end", meta: "Manager · Dilan Okonkwo" },
];

const DIRECT_REPORTS = [
  { id: "u-14", name: "Priya Raghunathan", title: "Support Operations Lead" },
  { id: "u-19", name: "Tomás Esquivel", title: "Tier-1 Shift Manager" },
  { id: "u-23", name: "Hanne Lindqvist", title: "Knowledge & Macros" },
  { id: "u-27", name: "Ade Balogun", title: "Support Analyst" },
];

const OTHER_PEOPLE = [
  { id: "u-31", name: "Marguerite Fontaine", title: "Finance · reports to Claire Mbeki" },
  { id: "u-08", name: "Ivan Petrov", title: "Platform Engineering · reports to Noor Haddad" },
];

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "blocked", label: "Blocked" },
];

const INITIAL_CHECK_INS = [
  {
    id: "ci-1",
    date: "14 Aug 2026",
    sort: 20260814,
    author: "Dilan Okonkwo",
    note: "Baseline agreed with the Tier-1 leads: median first response was 5h 40m across July. Starting point locked, no changes to scope.",
  },
  {
    id: "ci-2",
    date: "28 Aug 2026",
    sort: 20260828,
    author: "Priya Raghunathan",
    note: "Macros rewritten for the top 12 ticket reasons. Early read on those reasons only: 4h 10m.",
  },
  {
    id: "ci-3",
    date: "11 Sep 2026",
    sort: 20260911,
    author: "Priya Raghunathan",
    note: "Routing moved onto the new skills matrix. Overnight queue is the remaining drag — nothing lands before 07:00 CET.",
  },
  {
    id: "ci-4",
    date: "25 Sep 2026",
    sort: 20260925,
    author: "Priya Raghunathan",
    note: "Blocked on headcount for the 06:00 shift, raised with Dilan. Median holding at 3h 25m.",
  },
  {
    id: "ci-5",
    date: "09 Oct 2026",
    sort: 20261009,
    author: "Dilan Okonkwo",
    note: "Two early-shift hires signed, both start 2 Nov. Treating this as unblocked from today.",
  },
  {
    id: "ci-6",
    date: "23 Oct 2026",
    sort: 20261023,
    author: "Priya Raghunathan",
    note: "3h 02m median last week. Expect the early shift to take another 40 minutes out by mid-December.",
  },
];

const INITIAL_PROGRESS_HISTORY = [
  { id: "p-5", date: "23 Oct 2026", from: 48, to: 62, by: "Priya Raghunathan" },
  { id: "p-4", date: "25 Sep 2026", from: 40, to: 48, by: "Priya Raghunathan" },
  { id: "p-3", date: "11 Sep 2026", from: 25, to: 40, by: "Priya Raghunathan" },
  { id: "p-2", date: "28 Aug 2026", from: 10, to: 25, by: "Priya Raghunathan" },
  { id: "p-1", date: "14 Aug 2026", from: null, to: 10, by: "Dilan Okonkwo" },
];

const INITIAL_FORM = {
  title: "Cut median first-response time on Tier-1 tickets to under 2 hours",
  description:
    "Rework macros, routing and shift cover so a customer raising a Tier-1 ticket hears back inside two hours, measured across the whole week rather than business hours only.",
  target_metric:
    "Median first response ≤ 2h 00m across all Tier-1 tickets, measured weekly (baseline 5h 40m, July 2026)",
  due_date: "2026-12-31",
  check_in_interval_days: "14",
  parent_objective_id: "OBJ-21",
  owner_id: "u-14",
};

const DIRECT_REPORT_IDS = DIRECT_REPORTS.map((p) => p.id);
const ALL_PEOPLE = DIRECT_REPORTS.concat(OTHER_PEOPLE);
const personName = (id) => (ALL_PEOPLE.find((p) => p.id === id) || { name: "Unassigned" }).name;
const statusLabel = (v) => (STATUS_OPTIONS.find((s) => s.value === v) || STATUS_OPTIONS[0]).label;
const prettyDate = (iso) => {
  if (!iso) return "—";
  const months = [
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
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return parts[2].replace(/^0/, "") + " " + months[Number(parts[1]) - 1] + " " + parts[0];
};

export default function Screen() {
  const navigate = useNavigate();
  const [phase, setPhase] = React.useState("loading");
  const [tab, setTab] = React.useState("details");

  const [form, setForm] = React.useState(INITIAL_FORM);
  const [savedForm, setSavedForm] = React.useState(INITIAL_FORM);
  const [errors, setErrors] = React.useState({});
  const [saveState, setSaveState] = React.useState("idle");
  const [savedAt, setSavedAt] = React.useState("5 Nov 2026 · 09:41");

  const [progressType, setProgressType] = React.useState("percent");
  const [committedPercent, setCommittedPercent] = React.useState(62);
  const [draftPercent, setDraftPercent] = React.useState(62);
  const [committedStatus, setCommittedStatus] = React.useState("in_progress");
  const [draftStatus, setDraftStatus] = React.useState("in_progress");
  const [completedAt, setCompletedAt] = React.useState(null);
  const [progressState, setProgressState] = React.useState("idle");
  const [history, setHistory] = React.useState(INITIAL_PROGRESS_HISTORY);

  const [checkIns, setCheckIns] = React.useState(INITIAL_CHECK_INS);
  const [note, setNote] = React.useState("");
  const [noteError, setNoteError] = React.useState("");
  const [noteState, setNoteState] = React.useState("idle");
  const [query, setQuery] = React.useState("");
  const [order, setOrder] = React.useState("asc");

  const timers = React.useRef([]);
  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };
  React.useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 620);
    const activeTimers = timers.current;
    return () => {
      clearTimeout(t);
      activeTimers.forEach(clearTimeout);
    };
  }, []);

  const assigneeDenied = !DIRECT_REPORT_IDS.includes(form.owner_id);
  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);
  const progressDirty =
    progressType === "percent"
      ? draftPercent !== committedPercent
      : draftStatus !== committedStatus;
  const willComplete =
    (progressType === "percent" && draftPercent === 100) ||
    (progressType === "status" && draftStatus === "completed");
  const currentStatus =
    progressType === "percent"
      ? committedPercent === 100
        ? "completed"
        : committedPercent === 0
          ? "not_started"
          : "in_progress"
      : committedStatus;

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaveState("idle");
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const onSaveDetails = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = "A goal needs a title before it can be saved.";
    if (!form.due_date) next.due_date = "Give this goal a due date so check-ins can be scheduled.";
    setErrors(next);
    if (Object.keys(next).length || assigneeDenied) {
      setSaveState("idle");
      return;
    }
    setSaveState("saving");
    later(() => {
      setSavedForm(form);
      setSavedAt("5 Nov 2026 · 14:22");
      setSaveState("saved");
    }, 700);
  };

  const onSaveProgress = () => {
    setProgressState("saving");
    later(() => {
      if (progressType === "percent") {
        setHistory((h) => [
          {
            id: "p-" + (h.length + 6),
            date: "5 Nov 2026",
            from: committedPercent,
            to: draftPercent,
            by: "Dilan Okonkwo",
            fresh: true,
          },
          ...h,
        ]);
        setCommittedPercent(draftPercent);
        setCompletedAt(draftPercent === 100 ? "5 Nov 2026" : null);
      } else {
        setCommittedStatus(draftStatus);
        setCompletedAt(draftStatus === "completed" ? "5 Nov 2026" : null);
      }
      setProgressState("saved");
      setSavedAt("5 Nov 2026 · 14:22");
    }, 520);
  };

  const onAddCheckIn = (event) => {
    event.preventDefault();
    if (!note.trim()) {
      setNoteError("Write a line or two first — an empty check-in tells Priya nothing.");
      return;
    }
    setNoteError("");
    setNoteState("saving");
    later(() => {
      setCheckIns((list) =>
        list.concat([
          {
            id: "ci-" + (list.length + 1),
            date: "5 Nov 2026",
            sort: 20261105,
            author: "Dilan Okonkwo",
            note: note.trim(),
            fresh: true,
          },
        ]),
      );
      setNote("");
      setNoteState("saved");
    }, 500);
  };

  const filtered = checkIns
    .filter((c) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return c.note.toLowerCase().includes(q) || c.author.toLowerCase().includes(q);
    })
    .sort((a, b) => (order === "asc" ? a.sort - b.sort : b.sort - a.sort));

  const panel = {
    backgroundColor: SURFACE,
    border: "1px solid " + LINE,
    borderRadius: brand.radius,
  };
  const fieldStyle = {
    backgroundColor: brand.backgroundColor,
    border: "1px solid " + LINE,
    borderRadius: brand.radius,
    color: brand.primaryColor,
    fontFamily: brand.fontBody,
  };
  const labelStyle = {
    color: brand.neutralColor,
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontFamily: brand.fontBody,
  };
  const headingFont = { fontFamily: brand.fontHeading };

  const statusChip = (value) => {
    const completed = value === "completed";
    const blocked = value === "blocked";
    return (
      <span
        className="inline-flex items-center gap-2 px-3 py-1 text-[12px]"
        style={{
          borderRadius: 999,
          border: "1px solid " + (completed ? brand.accentColor : LINE_STRONG),
          backgroundColor: completed
            ? brand.accentColor
            : value === "in_progress"
              ? brand.accentColor + "1f"
              : "transparent",
          color: completed
            ? brand.backgroundColor
            : value === "in_progress"
              ? brand.accentColor
              : brand.neutralColor,
          fontFamily: brand.fontBody,
        }}
      >
        {completed ? <Icons.Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {blocked ? <Icons.AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {statusLabel(value)}
      </span>
    );
  };

  return (
    <div
      className="min-h-full px-6 py-8 lg:px-10"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
      }}
    >
      <style>{`
        .v-focus:focus-visible { outline: 2px solid ${brand.accentColor}; outline-offset: 2px; }
        .v-enter { animation: vEnter .34s ease-out both; }
        @keyframes vEnter { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .v-skel { animation: vPulse 1.7s ease-in-out infinite; }
        @keyframes vPulse { 0%,100% { opacity:.28 } 50% { opacity:.6 } }
        .v-bar { transition: width .4s cubic-bezier(.3,.8,.4,1); }
        .v-range { accent-color: ${brand.accentColor}; }
        @media (prefers-reduced-motion: reduce) {
          .v-enter, .v-skel { animation: none; }
          .v-bar { transition: none; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1180px]">
        <button
          type="button"
          onClick={() => navigate("dashboard")}
          className="v-focus inline-flex items-center gap-2 text-[13px] mb-6 hover:opacity-100 opacity-80 transition-opacity"
          style={{ color: brand.neutralColor, borderRadius: brand.radius }}
        >
          <Icons.ArrowLeft className="h-4 w-4" aria-hidden="true" />
          My goals dashboard
        </button>

        {phase === "loading" ? (
          <div aria-live="polite">
            <p style={labelStyle} className="mb-3">
              Opening goal {GOAL_REF}
            </p>
            <div
              className="v-skel h-9 w-3/4 mb-8"
              style={{ backgroundColor: SURFACE_2, borderRadius: brand.radius }}
            />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="v-skel h-[420px]" style={{ ...panel }} />
              <div className="v-skel h-[280px]" style={{ ...panel }} />
            </div>
            <p className="mt-6 text-[13px]" style={{ color: brand.neutralColor }}>
              Fetching the SMART fields, progress history and check-ins for this goal.
            </p>
          </div>
        ) : (
          <React.Fragment>
            {/* ---------------- Header ---------------- */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="text-[12px] tracking-[0.2em]"
                  style={{ color: brand.accentColor, fontVariantNumeric: "tabular-nums" }}
                >
                  GOAL {GOAL_REF}
                </span>
                <span aria-hidden="true" style={{ color: LINE_STRONG }}>
                  /
                </span>
                {statusChip(currentStatus)}
                <span
                  className="inline-flex items-center gap-2 text-[12px] px-3 py-1"
                  style={{
                    border: "1px solid " + LINE,
                    borderRadius: 999,
                    color: brand.neutralColor,
                  }}
                >
                  <Icons.Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Check-in due 6 Nov
                </span>
                {dirty || progressDirty ? (
                  <span
                    className="v-enter inline-flex items-center gap-2 text-[12px] px-3 py-1"
                    style={{
                      border: "1px dashed " + LINE_STRONG,
                      borderRadius: 999,
                      color: brand.neutralColor,
                    }}
                  >
                    Unsaved edits — not yet sent to the server
                  </span>
                ) : (
                  <span
                    className="text-[12px]"
                    style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
                  >
                    Synced {savedAt}
                  </span>
                )}
              </div>

              <h1
                className="text-[34px] lg:text-[40px] leading-[1.15] max-w-[22ch]"
                style={{ ...headingFont, color: brand.primaryColor }}
              >
                {savedForm.title || "Untitled goal"}
              </h1>

              <div
                className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px]"
                style={{ color: brand.neutralColor }}
              >
                <span className="inline-flex items-center gap-2">
                  <Avatar name={personName(savedForm.owner_id)} className="h-7 w-7" />
                  <span style={{ color: brand.primaryColor }}>
                    {personName(savedForm.owner_id)}
                  </span>
                  <span>owns this goal</span>
                </span>
                <span
                  className="inline-flex items-center gap-2"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  <Icons.Calendar className="h-4 w-4" aria-hidden="true" />
                  Due {prettyDate(savedForm.due_date)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Icons.FileText className="h-4 w-4" aria-hidden="true" />
                  {savedForm.parent_objective_id
                    ? (OBJECTIVES.find((o) => o.id === savedForm.parent_objective_id) || {}).title
                    : "Standalone goal — no parent objective"}
                </span>
              </div>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
              <div className="min-w-0">
                {/* ---------------- Progress: the focal panel ---------------- */}
                <section
                  aria-labelledby="progress-heading"
                  className="p-6 lg:p-8 mb-8"
                  style={panel}
                >
                  <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div>
                      <h2
                        id="progress-heading"
                        className="text-[24px] leading-tight"
                        style={headingFont}
                      >
                        Progress
                      </h2>
                      <p className="mt-1 text-[13px]" style={{ color: brand.neutralColor }}>
                        Track this goal by percentage or by status — one or the other, not both.
                      </p>
                    </div>
                    <div
                      role="group"
                      aria-label="Progress type"
                      className="flex"
                      style={{ border: "1px solid " + LINE, borderRadius: brand.radius }}
                    >
                      {[
                        { key: "percent", label: "Percentage" },
                        { key: "status", label: "Status" },
                      ].map((opt) => {
                        const on = progressType === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => {
                              setProgressType(opt.key);
                              setProgressState("idle");
                            }}
                            className="v-focus px-4 py-2 text-[13px] transition-colors"
                            style={{
                              backgroundColor: on ? brand.accentColor : "transparent",
                              color: on ? brand.backgroundColor : brand.neutralColor,
                              borderRadius: brand.radius,
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8">
                    {progressType === "percent" ? (
                      <div>
                        <div className="flex items-end gap-5 flex-wrap">
                          <span
                            className="leading-none"
                            style={{
                              ...headingFont,
                              fontSize: 64,
                              color: brand.accentColor,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {draftPercent}
                            <span style={{ fontSize: 28 }}>%</span>
                          </span>
                          <div className="pb-2 text-[13px]" style={{ color: brand.neutralColor }}>
                            {draftPercent !== committedPercent ? (
                              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                                Saved value {committedPercent}% — not yet committed
                              </span>
                            ) : (
                              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                                Last change 23 Oct 2026, 48% → 62%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 h-[3px] w-full" style={{ backgroundColor: LINE }}>
                          <div
                            className="v-bar h-full"
                            style={{
                              width: draftPercent + "%",
                              backgroundColor: brand.accentColor,
                            }}
                          />
                        </div>

                        <div className="mt-6 flex flex-wrap items-end gap-6">
                          <div className="flex-1 min-w-[240px]">
                            <Label htmlFor="progress-range" style={labelStyle}>
                              Completion slider
                            </Label>
                            <input
                              id="progress-range"
                              type="range"
                              min="0"
                              max="100"
                              step="1"
                              className="v-range v-focus w-full mt-3"
                              value={draftPercent}
                              onChange={(e) => {
                                setDraftPercent(Number(e.target.value));
                                setProgressState("idle");
                              }}
                              aria-describedby="progress-hint"
                            />
                          </div>
                          <div className="w-[120px]">
                            <Label htmlFor="progress-number" style={labelStyle}>
                              Exact value
                            </Label>
                            <Input
                              id="progress-number"
                              type="number"
                              min="0"
                              max="100"
                              className="v-focus mt-3 w-full px-3 py-2"
                              style={{ ...fieldStyle, fontVariantNumeric: "tabular-nums" }}
                              value={draftPercent}
                              onChange={(e) => {
                                const n = Math.max(0, Math.min(100, Number(e.target.value || 0)));
                                setDraftPercent(n);
                                setProgressState("idle");
                              }}
                            />
                          </div>
                        </div>
                        <p
                          id="progress-hint"
                          className="mt-3 text-[13px]"
                          style={{ color: brand.neutralColor }}
                        >
                          Any whole number from 0 to 100.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span
                            className="leading-none"
                            style={{ ...headingFont, fontSize: 36, color: brand.accentColor }}
                          >
                            {statusLabel(draftStatus)}
                          </span>
                          {draftStatus !== committedStatus ? (
                            <span className="text-[13px]" style={{ color: brand.neutralColor }}>
                              Saved value {statusLabel(committedStatus)} — not yet committed
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-6 max-w-[320px]">
                          <Label htmlFor="progress-status" style={labelStyle}>
                            Status
                          </Label>
                          <Select
                            id="progress-status"
                            className="v-focus mt-3 w-full px-3 py-2"
                            style={fieldStyle}
                            value={draftStatus}
                            onChange={(e) => {
                              setDraftStatus(e.target.value);
                              setProgressState("idle");
                            }}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option
                                key={s.value}
                                value={s.value}
                                style={{ backgroundColor: SURFACE }}
                              >
                                {s.label}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {willComplete ? (
                    <p
                      className="v-enter mt-6 pl-4 text-[13px]"
                      style={{
                        borderLeft: "2px solid " + brand.accentColor,
                        color: brand.primaryColor,
                      }}
                    >
                      Saving this marks the goal complete and records 5 Nov 2026 as its completion
                      date.
                    </p>
                  ) : null}

                  {completedAt ? (
                    <p
                      className="v-enter mt-6 inline-flex items-center gap-2 text-[13px]"
                      style={{ color: brand.accentColor }}
                    >
                      <Icons.CheckCircle className="h-4 w-4" aria-hidden="true" />
                      Completed — completion date recorded {completedAt}
                    </p>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button
                      type="button"
                      onClick={onSaveProgress}
                      disabled={!progressDirty || progressState === "saving"}
                      className="v-focus px-6 py-3 text-[14px] transition-opacity"
                      style={{
                        backgroundColor: brand.accentColor,
                        color: brand.backgroundColor,
                        borderRadius: brand.radius,
                        opacity: !progressDirty || progressState === "saving" ? 0.45 : 1,
                        fontWeight: 600,
                      }}
                    >
                      {progressState === "saving" ? "Saving progress…" : "Save progress"}
                    </Button>
                    {progressState === "saved" && !progressDirty ? (
                      <span
                        className="v-enter inline-flex items-center gap-2 text-[13px]"
                        style={{ color: brand.accentColor }}
                      >
                        <Icons.Check className="h-4 w-4" aria-hidden="true" />
                        Progress saved to {GOAL_REF}
                      </span>
                    ) : !progressDirty ? (
                      <span className="text-[13px]" style={{ color: brand.neutralColor }}>
                        Nothing to save — the figure above matches the record.
                      </span>
                    ) : null}
                  </div>
                </section>

                {/* ---------------- Tabs ---------------- */}
                <Tabs
                  tabs={[
                    { key: "details", label: "Goal details" },
                    { key: "checkins", label: "Check-ins (" + checkIns.length + ")" },
                    { key: "history", label: "Progress history" },
                  ]}
                  active={tab}
                  onChange={setTab}
                  className="mb-6"
                />

                {tab === "details" ? (
                  <section aria-labelledby="details-heading" className="p-6 lg:p-8" style={panel}>
                    <h2
                      id="details-heading"
                      className="text-[24px] leading-tight"
                      style={headingFont}
                    >
                      SMART fields
                    </h2>
                    <p
                      className="mt-1 mb-8 text-[13px] max-w-[62ch]"
                      style={{ color: brand.neutralColor }}
                    >
                      Specific wording, a measurable target and a timeframe. Edits are saved against
                      the goal record and shown to {personName(form.owner_id)} immediately.
                    </p>

                    <form onSubmit={onSaveDetails} noValidate>
                      <div className="mb-6">
                        <Label htmlFor="goal-title" style={labelStyle}>
                          Title <span style={{ color: brand.accentColor }}>required</span>
                        </Label>
                        <Input
                          id="goal-title"
                          className="v-focus mt-3 w-full px-4 py-3 text-[15px]"
                          style={{
                            ...fieldStyle,
                            borderColor: errors.title ? brand.accentColor : LINE,
                          }}
                          value={form.title}
                          onChange={(e) => update("title", e.target.value)}
                          aria-invalid={errors.title ? "true" : "false"}
                          aria-describedby={errors.title ? "goal-title-error" : undefined}
                        />
                        {errors.title ? (
                          <p
                            id="goal-title-error"
                            className="v-enter mt-2 inline-flex items-center gap-2 text-[13px]"
                            style={{ color: brand.accentColor }}
                          >
                            <Icons.AlertCircle className="h-4 w-4" aria-hidden="true" />
                            {errors.title}
                          </p>
                        ) : null}
                      </div>

                      <div className="mb-6">
                        <Label htmlFor="goal-description" style={labelStyle}>
                          Description
                        </Label>
                        <Textarea
                          id="goal-description"
                          rows={4}
                          className="v-focus mt-3 w-full px-4 py-3 text-[14px] leading-[1.6]"
                          style={fieldStyle}
                          value={form.description}
                          onChange={(e) => update("description", e.target.value)}
                        />
                      </div>

                      <div className="mb-6">
                        <Label htmlFor="goal-metric" style={labelStyle}>
                          Target metric
                        </Label>
                        <Textarea
                          id="goal-metric"
                          rows={2}
                          className="v-focus mt-3 w-full px-4 py-3 text-[14px] leading-[1.6]"
                          style={fieldStyle}
                          value={form.target_metric}
                          onChange={(e) => update("target_metric", e.target.value)}
                          aria-describedby="metric-hint"
                        />
                        <p
                          id="metric-hint"
                          className="mt-2 text-[13px]"
                          style={{ color: brand.neutralColor }}
                        >
                          State the number and how it is measured, so progress is not a matter of
                          opinion.
                        </p>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2 mb-6">
                        <div>
                          <Label htmlFor="goal-due" style={labelStyle}>
                            Due date <span style={{ color: brand.accentColor }}>required</span>
                          </Label>
                          <Input
                            id="goal-due"
                            type="date"
                            className="v-focus mt-3 w-full px-4 py-3 text-[14px]"
                            style={{
                              ...fieldStyle,
                              borderColor: errors.due_date ? brand.accentColor : LINE,
                              fontVariantNumeric: "tabular-nums",
                            }}
                            value={form.due_date}
                            onChange={(e) => update("due_date", e.target.value)}
                            aria-invalid={errors.due_date ? "true" : "false"}
                            aria-describedby={errors.due_date ? "goal-due-error" : undefined}
                          />
                          {errors.due_date ? (
                            <p
                              id="goal-due-error"
                              className="v-enter mt-2 inline-flex items-center gap-2 text-[13px]"
                              style={{ color: brand.accentColor }}
                            >
                              <Icons.AlertCircle className="h-4 w-4" aria-hidden="true" />
                              {errors.due_date}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <Label htmlFor="goal-cadence" style={labelStyle}>
                            Check-in every (days)
                          </Label>
                          <Input
                            id="goal-cadence"
                            type="number"
                            min="1"
                            className="v-focus mt-3 w-full px-4 py-3 text-[14px]"
                            style={{ ...fieldStyle, fontVariantNumeric: "tabular-nums" }}
                            value={form.check_in_interval_days}
                            onChange={(e) => update("check_in_interval_days", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <Label htmlFor="goal-parent" style={labelStyle}>
                          Parent objective (optional)
                        </Label>
                        <Select
                          id="goal-parent"
                          className="v-focus mt-3 w-full px-4 py-3 text-[14px]"
                          style={fieldStyle}
                          value={form.parent_objective_id}
                          onChange={(e) => update("parent_objective_id", e.target.value)}
                        >
                          {OBJECTIVES.map((o) => (
                            <option
                              key={o.id || "none"}
                              value={o.id}
                              style={{ backgroundColor: SURFACE }}
                            >
                              {o.id ? o.id + " — " + o.title + " (" + o.meta + ")" : o.title}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="mb-2">
                        <Label htmlFor="goal-owner" style={labelStyle}>
                          Assigned to
                        </Label>
                        <Select
                          id="goal-owner"
                          className="v-focus mt-3 w-full px-4 py-3 text-[14px]"
                          style={{
                            ...fieldStyle,
                            borderColor: assigneeDenied ? brand.accentColor : LINE,
                          }}
                          value={form.owner_id}
                          onChange={(e) => update("owner_id", e.target.value)}
                          aria-describedby={assigneeDenied ? "assignee-denied" : undefined}
                        >
                          <optgroup label="Your direct reports">
                            {DIRECT_REPORTS.map((p) => (
                              <option key={p.id} value={p.id} style={{ backgroundColor: SURFACE }}>
                                {p.name} — {p.title}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Elsewhere in the organisation">
                            {OTHER_PEOPLE.map((p) => (
                              <option key={p.id} value={p.id} style={{ backgroundColor: SURFACE }}>
                                {p.name} — {p.title}
                              </option>
                            ))}
                          </optgroup>
                        </Select>
                      </div>

                      {assigneeDenied ? (
                        <div
                          id="assignee-denied"
                          role="status"
                          className="v-enter mt-5 p-5"
                          style={{
                            backgroundColor: SURFACE_2,
                            border: "1px solid " + brand.accentColor,
                            borderRadius: brand.radius,
                          }}
                        >
                          <h3
                            className="text-[16px] inline-flex items-center gap-2"
                            style={headingFont}
                          >
                            <Icons.AlertCircle
                              className="h-4 w-4"
                              aria-hidden="true"
                              style={{ color: brand.accentColor }}
                            />
                            You can only assign goals inside your reporting line
                          </h3>
                          <p
                            className="mt-2 text-[13px] leading-[1.6] max-w-[62ch]"
                            style={{ color: brand.neutralColor }}
                          >
                            {personName(form.owner_id)} does not report to you, so this goal cannot
                            be moved to them. Priya Raghunathan, Tomás Esquivel, Hanne Lindqvist and
                            Ade Balogun are your direct reports. If the reporting line is wrong, an
                            HR admin can correct it in People admin.
                          </p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <Button
                              type="button"
                              onClick={() => update("owner_id", savedForm.owner_id)}
                              className="v-focus px-4 py-2 text-[13px]"
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid " + LINE_STRONG,
                                color: brand.primaryColor,
                                borderRadius: brand.radius,
                              }}
                            >
                              Put it back to {personName(savedForm.owner_id)}
                            </Button>
                            <Button
                              type="button"
                              onClick={() => navigate("employees")}
                              className="v-focus px-4 py-2 text-[13px]"
                              style={{
                                backgroundColor: "transparent",
                                color: brand.accentColor,
                                borderRadius: brand.radius,
                              }}
                            >
                              Open People admin
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-8" style={{ borderTop: "1px solid " + LINE }} />

                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        <Button
                          type="submit"
                          disabled={saveState === "saving" || assigneeDenied}
                          className="v-focus px-6 py-3 text-[14px]"
                          style={{
                            backgroundColor: brand.accentColor,
                            color: brand.backgroundColor,
                            borderRadius: brand.radius,
                            fontWeight: 600,
                            opacity: saveState === "saving" || assigneeDenied ? 0.45 : 1,
                          }}
                        >
                          {saveState === "saving" ? "Saving changes…" : "Save changes"}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setForm(savedForm);
                            setErrors({});
                            setSaveState("idle");
                          }}
                          disabled={!dirty}
                          className="v-focus px-5 py-3 text-[14px]"
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid " + LINE,
                            color: brand.neutralColor,
                            borderRadius: brand.radius,
                            opacity: dirty ? 1 : 0.4,
                          }}
                        >
                          Discard edits
                        </Button>
                        <span
                          aria-live="polite"
                          className="text-[13px]"
                          style={{ color: brand.neutralColor }}
                        >
                          {saveState === "saved" && !dirty ? (
                            <span
                              className="v-enter inline-flex items-center gap-2"
                              style={{ color: brand.accentColor }}
                            >
                              <Icons.Check className="h-4 w-4" aria-hidden="true" />
                              Saved — {GOAL_REF} updated {savedAt}
                            </span>
                          ) : (
                            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                              Last saved {savedAt} by Dilan Okonkwo
                            </span>
                          )}
                        </span>
                      </div>
                    </form>
                  </section>
                ) : null}

                {tab === "checkins" ? (
                  <section aria-labelledby="checkins-heading" className="p-6 lg:p-8" style={panel}>
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                      <div>
                        <h2
                          id="checkins-heading"
                          className="text-[24px] leading-tight"
                          style={headingFont}
                        >
                          Check-ins
                        </h2>
                        <p className="mt-1 text-[13px]" style={{ color: brand.neutralColor }}>
                          Every fortnight, oldest first. {checkIns.length} notes since 14 Aug 2026.
                        </p>
                      </div>
                      <div className="flex items-end gap-3 flex-wrap">
                        <div>
                          <Label htmlFor="checkin-filter" style={labelStyle}>
                            Filter notes
                          </Label>
                          <div className="relative mt-2">
                            <Icons.Search
                              className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                              aria-hidden="true"
                              style={{ color: brand.neutralColor }}
                            />
                            <Input
                              id="checkin-filter"
                              className="v-focus pl-9 pr-3 py-2 text-[13px] w-[200px]"
                              style={fieldStyle}
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="e.g. blocked"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setOrder((o) => (o === "asc" ? "desc" : "asc"))}
                          className="v-focus px-4 py-2 text-[13px] whitespace-nowrap"
                          style={{
                            backgroundColor: "transparent",
                            border: "1px solid " + LINE,
                            color: brand.primaryColor,
                            borderRadius: brand.radius,
                          }}
                        >
                          {order === "asc" ? "Oldest first" : "Newest first"}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-8">
                      {checkIns.length === 0 ? (
                        <Empty
                          title="No check-ins on this goal yet"
                          description="Check-ins are the written record of how this goal moved. Add the first one below — a sentence on progress and anything in the way is enough."
                        />
                      ) : filtered.length === 0 ? (
                        <Empty
                          title={"Nothing matches “" + query.trim() + "”"}
                          description={
                            "None of the " +
                            checkIns.length +
                            " check-ins on this goal mention that. Try another word, or clear the filter to read the full history."
                          }
                          action={
                            <Button
                              type="button"
                              onClick={() => setQuery("")}
                              className="v-focus px-4 py-2 text-[13px]"
                              style={{
                                backgroundColor: "transparent",
                                border: "1px solid " + LINE_STRONG,
                                color: brand.primaryColor,
                                borderRadius: brand.radius,
                              }}
                            >
                              Clear filter
                            </Button>
                          }
                        />
                      ) : (
                        <ol className="m-0 p-0 list-none">
                          {filtered.map((c, i) => (
                            <li
                              key={c.id}
                              className={c.fresh ? "v-enter py-5" : "py-5"}
                              style={{ borderTop: i === 0 ? "none" : "1px solid " + LINE }}
                            >
                              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                <span
                                  className="text-[12px] tracking-[0.12em]"
                                  style={{
                                    color: brand.accentColor,
                                    fontVariantNumeric: "tabular-nums",
                                  }}
                                >
                                  {c.date.toUpperCase()}
                                </span>
                                <span className="text-[13px]" style={{ color: brand.neutralColor }}>
                                  {c.author}
                                </span>
                              </div>
                              <p
                                className="mt-2 text-[14px] leading-[1.65] max-w-[68ch]"
                                style={{ color: brand.primaryColor }}
                              >
                                {c.note}
                              </p>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>

                    <div className="mt-8 pt-8" style={{ borderTop: "1px solid " + LINE }}>
                      <h3 className="text-[18px]" style={headingFont}>
                        Add a check-in
                      </h3>
                      <form onSubmit={onAddCheckIn} className="mt-4">
                        <Label htmlFor="new-checkin" style={labelStyle}>
                          Note — dated 5 Nov 2026, posted as Dilan Okonkwo
                        </Label>
                        <Textarea
                          id="new-checkin"
                          rows={3}
                          className="v-focus mt-3 w-full px-4 py-3 text-[14px] leading-[1.6]"
                          style={{
                            ...fieldStyle,
                            borderColor: noteError ? brand.accentColor : LINE,
                          }}
                          value={note}
                          onChange={(e) => {
                            setNote(e.target.value);
                            setNoteError("");
                            setNoteState("idle");
                          }}
                          placeholder="Where the number stands this fortnight, and anything blocking it."
                          aria-invalid={noteError ? "true" : "false"}
                          aria-describedby={noteError ? "checkin-error" : undefined}
                        />
                        {noteError ? (
                          <p
                            id="checkin-error"
                            className="v-enter mt-2 inline-flex items-center gap-2 text-[13px]"
                            style={{ color: brand.accentColor }}
                          >
                            <Icons.AlertCircle className="h-4 w-4" aria-hidden="true" />
                            {noteError}
                          </p>
                        ) : null}
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          <Button
                            type="submit"
                            disabled={noteState === "saving"}
                            className="v-focus px-5 py-2.5 text-[14px]"
                            style={{
                              backgroundColor: "transparent",
                              border: "1px solid " + brand.accentColor,
                              color: brand.accentColor,
                              borderRadius: brand.radius,
                              opacity: noteState === "saving" ? 0.5 : 1,
                            }}
                          >
                            {noteState === "saving" ? "Posting…" : "Post check-in"}
                          </Button>
                          <span
                            aria-live="polite"
                            className="text-[13px]"
                            style={{ color: brand.neutralColor }}
                          >
                            {noteState === "saved"
                              ? "Check-in posted to the history above."
                              : "Posted notes cannot be edited."}
                          </span>
                        </div>
                      </form>
                    </div>
                  </section>
                ) : null}

                {tab === "history" ? (
                  <section aria-labelledby="history-heading" className="p-6 lg:p-8" style={panel}>
                    <h2
                      id="history-heading"
                      className="text-[24px] leading-tight"
                      style={headingFont}
                    >
                      Progress history
                    </h2>
                    <p className="mt-1 mb-6 text-[13px]" style={{ color: brand.neutralColor }}>
                      Every saved change to this goal's completion figure, newest first.
                    </p>
                    <Table
                      className="w-full text-[14px]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      <THead>
                        <TR style={{ borderBottom: "1px solid " + LINE_STRONG }}>
                          <TH className="text-left py-3" style={labelStyle}>
                            Date
                          </TH>
                          <TH className="text-left py-3" style={labelStyle}>
                            Change
                          </TH>
                          <TH className="text-left py-3" style={labelStyle}>
                            Updated by
                          </TH>
                        </TR>
                      </THead>
                      <TBody>
                        {history.map((h) => (
                          <TR
                            key={h.id}
                            className={h.fresh ? "v-enter" : ""}
                            style={{ borderBottom: "1px solid " + LINE }}
                          >
                            <TD
                              className="py-4 pr-6 whitespace-nowrap"
                              style={{ color: brand.neutralColor }}
                            >
                              {h.date}
                            </TD>
                            <TD className="py-4 pr-6" style={{ color: brand.primaryColor }}>
                              {h.from === null ? "Goal created at " : h.from + "% → "}
                              <span style={{ color: brand.accentColor }}>{h.to}%</span>
                            </TD>
                            <TD className="py-4" style={{ color: brand.neutralColor }}>
                              {h.by}
                            </TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  </section>
                ) : null}
              </div>

              {/* ---------------- Right rail ---------------- */}
              <aside className="space-y-6">
                <Card style={panel} className="p-6">
                  <CardHeader className="p-0 mb-5">
                    <CardTitle className="text-[18px]" style={headingFont}>
                      Goal record
                    </CardTitle>
                    <CardDescription
                      className="text-[13px] mt-1"
                      style={{ color: brand.neutralColor }}
                    >
                      Reference {GOAL_REF}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 gap-4">
                      <Stat label="Days remaining" value="56" hint="to 31 Dec 2026" />
                      <Stat
                        label="Check-in cadence"
                        value={form.check_in_interval_days + "d"}
                        hint="next due 6 Nov"
                      />
                    </div>
                    <div className="my-5" style={{ borderTop: "1px solid " + LINE }} />
                    <dl className="text-[13px] space-y-4 m-0">
                      <div>
                        <dt style={labelStyle}>Owner</dt>
                        <dd
                          className="mt-1.5 flex items-center gap-2 m-0"
                          style={{ color: brand.primaryColor }}
                        >
                          <Avatar name={personName(form.owner_id)} className="h-6 w-6" />
                          {personName(form.owner_id)}
                        </dd>
                      </div>
                      <div>
                        <dt style={labelStyle}>Created by</dt>
                        <dd className="mt-1.5 m-0" style={{ color: brand.primaryColor }}>
                          Dilan Okonkwo · 14 Aug 2026
                        </dd>
                      </div>
                      <div>
                        <dt style={labelStyle}>Parent objective</dt>
                        <dd
                          className="mt-1.5 m-0 leading-[1.5]"
                          style={{ color: brand.primaryColor }}
                        >
                          {form.parent_objective_id ? (
                            <React.Fragment>
                              <span
                                style={{
                                  color: brand.accentColor,
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {form.parent_objective_id}
                              </span>{" "}
                              {
                                (OBJECTIVES.find((o) => o.id === form.parent_objective_id) || {})
                                  .title
                              }
                            </React.Fragment>
                          ) : (
                            "None — valid as a standalone goal"
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt style={labelStyle}>Progress type</dt>
                        <dd className="mt-1.5 m-0" style={{ color: brand.primaryColor }}>
                          {progressType === "percent" ? "Percentage" : "Status"}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card style={panel} className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-[18px]" style={headingFont}>
                      Elsewhere
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="m-0 p-0 list-none">
                      {[
                        { label: "Priya's other goals", route: "team", icon: Icons.Users },
                        { label: "My goals dashboard", route: "dashboard", icon: Icons.Home },
                        { label: "Send Priya praise", route: "praise", icon: Icons.CheckCircle },
                      ].map((link, i) => (
                        <li
                          key={link.route}
                          style={{ borderTop: i === 0 ? "none" : "1px solid " + LINE }}
                        >
                          <button
                            type="button"
                            onClick={() => navigate(link.route)}
                            className="v-focus w-full flex items-center justify-between gap-3 py-3 text-[14px] text-left transition-colors hover:opacity-100 opacity-85"
                            style={{ color: brand.primaryColor, borderRadius: brand.radius }}
                          >
                            <span className="inline-flex items-center gap-3">
                              <link.icon
                                className="h-4 w-4"
                                aria-hidden="true"
                                style={{ color: brand.neutralColor }}
                              />
                              {link.label}
                            </span>
                            <Icons.ChevronRight
                              className="h-4 w-4"
                              aria-hidden="true"
                              style={{ color: brand.neutralColor }}
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
