// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Card, CardHeader, CardContent, Input, Label, Select, Switch, Badge, Avatar, Separator, Tabs, Stat, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Search, Check, X, ChevronRight, Users, Settings, Bell, Calendar, Clock, Download, ArrowLeft, AlertCircle, CheckCircle } = Icons;

const TODAY = new Date(2026, 10, 5); // 5 November 2026

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Semantic hues reserved strictly for warning / error meaning.
const SEMANTIC_AMBER = '#d9a05b';
const SEMANTIC_CLAY = '#cf8171';

const STATUS_OPTIONS = ['Not started', 'In progress', 'Completed', 'Blocked'];

const parseISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const daysUntil = (iso) => Math.round((parseISO(iso) - TODAY) / 86400000);
const addDays = (iso, n) => {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const hexToRgba = (hex, a) => {
  let h = String(hex || '#000000').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const INITIAL_GOALS = [
  {
    id: 'GL-1042',
    title: 'Ship Atlas design system v2 to all squads',
    description: 'Migrate every product surface onto Atlas v2 tokens and retire the v1 package.',
    target_metric: '100% of product surfaces on Atlas v2 tokens',
    parent_objective: { title: 'Cut time-to-first-draft by 30%', level: 'Company' },
    progress_type: 'percent',
    progress_percent: 72,
    status: 'In progress',
    check_in_interval_days: 14,
    last_check_in: '2026-10-29',
    due_date: '2026-12-18',
    created_at: '2026-10-01',
    completed_at: null,
  },
  {
    id: 'GL-1051',
    title: 'Cut onboarding drop-off from 34% to 20%',
    description: 'Rework the first-run flow for self-serve teams with Growth engineering.',
    target_metric: 'Day-7 activation at or above 80%',
    parent_objective: { title: 'Grow activated accounts to 12,000', level: 'Company' },
    progress_type: 'percent',
    progress_percent: 45,
    status: 'In progress',
    check_in_interval_days: 7,
    last_check_in: '2026-11-01',
    due_date: '2026-11-14',
    created_at: '2026-09-15',
    completed_at: null,
  },
  {
    id: 'GL-1033',
    title: 'Publish the accessibility audit for Billing & Settings',
    description: 'Full WCAG 2.2 AA sweep, with remediation tickets filed against each finding.',
    target_metric: 'WCAG 2.2 AA audit signed off by Engineering',
    parent_objective: null,
    progress_type: 'status',
    progress_percent: null,
    status: 'Blocked',
    check_in_interval_days: 7,
    last_check_in: '2026-10-20',
    due_date: '2026-11-02',
    created_at: '2026-09-01',
    completed_at: null,
  },
  {
    id: 'GL-1017',
    title: 'Reduce design QA defects to under 5 per release',
    description: 'Tighten the handoff checklist and pair with QA on release-train reviews.',
    target_metric: 'Fewer than 5 design defects per release train',
    parent_objective: { title: 'Cut time-to-first-draft by 30%', level: 'Company' },
    progress_type: 'percent',
    progress_percent: 18,
    status: 'In progress',
    check_in_interval_days: 14,
    last_check_in: '2026-09-22',
    due_date: '2026-11-20',
    created_at: '2026-08-18',
    completed_at: null,
  },
  {
    id: 'GL-1060',
    title: 'Mentor two designers from IC3 to IC4',
    description: 'Weekly craft sessions with Noor Haddad and Tomas Lindqvist, evidence logged.',
    target_metric: 'Two ladder reviews submitted with evidence packs',
    parent_objective: { title: 'Grow design bench strength', level: 'Manager' },
    progress_type: 'status',
    progress_percent: null,
    status: 'In progress',
    check_in_interval_days: 30,
    last_check_in: '2026-10-12',
    due_date: '2027-01-30',
    created_at: '2026-10-05',
    completed_at: null,
  },
  {
    id: 'GL-1066',
    title: 'Draft the 2027 research operating plan',
    description: 'Headcount, panel budget and cadence for the coming year.',
    target_metric: 'Plan reviewed by Daniel Osei before 15 Jan',
    parent_objective: null,
    progress_type: 'status',
    progress_percent: null,
    status: 'Not started',
    check_in_interval_days: 21,
    last_check_in: null,
    due_date: '2026-12-31',
    created_at: '2026-11-03',
    completed_at: null,
  },
  {
    id: 'GL-0987',
    title: 'Run 12 moderated sessions with enterprise admins',
    description: 'Discovery for the permissions rebuild, synthesis shared org-wide.',
    target_metric: '12 sessions completed, synthesis published',
    parent_objective: { title: 'Enterprise retention above 94%', level: 'Manager' },
    progress_type: 'percent',
    progress_percent: 100,
    status: 'Completed',
    check_in_interval_days: 14,
    last_check_in: '2026-10-30',
    due_date: '2026-10-31',
    created_at: '2026-08-04',
    completed_at: '2026-10-30',
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NT-3391',
    type: 'due_soon',
    message: '“Cut onboarding drop-off from 34% to 20%” is due in 9 days. Update your progress before Friday.',
    created_at: 'Today, 08:40',
    is_read: false,
    email_status: 'sent',
  },
  {
    id: 'NT-3387',
    type: 'check_in_overdue',
    message: 'No check-in on “Reduce design QA defects to under 5 per release” for 44 days. Your cadence is every 14.',
    created_at: 'Today, 07:15',
    is_read: false,
    email_status: 'failed',
  },
  {
    id: 'NT-3384',
    type: 'overdue',
    message: '“Publish the accessibility audit for Billing & Settings” passed its due date on 2 Nov.',
    created_at: 'Yesterday, 18:02',
    is_read: false,
    email_status: 'sent',
  },
  {
    id: 'NT-3372',
    type: 'praise',
    message: 'Daniel Osei sent you praise: “The Atlas migration guide saved the Payments team a week.”',
    created_at: '3 Nov, 16:20',
    is_read: true,
    email_status: 'sent',
    route: 'praise',
  },
  {
    id: 'NT-3365',
    type: 'completed',
    message: 'Goal closed: “Run 12 moderated sessions with enterprise admins” was completed on 30 Oct.',
    created_at: '30 Oct, 11:05',
    is_read: true,
    email_status: 'sent',
  },
];

const SYNC_TIMES = ['09:12', '09:41', '10:06', '10:28'];

export default function Screen() {
  const navigate = useNavigate();
  const text = brand.primaryColor;
  const muted = brand.neutralColor;
  const accent = brand.accentColor;
  const bg = brand.backgroundColor;
  const surface = hexToRgba(text, 0.04);
  const surfaceUp = hexToRgba(text, 0.07);
  const hairline = hexToRgba(text, 0.12);
  const hairlineSoft = hexToRgba(text, 0.08);
  const serif = brand.fontHeading;
  const sans = brand.fontBody;

  const [goals, setGoals] = React.useState(INITIAL_GOALS);
  const [notifications, setNotifications] = React.useState(INITIAL_NOTIFICATIONS);
  const [tab, setTab] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState({ percent: '', status: 'In progress' });
  const [formError, setFormError] = React.useState('');
  const [flash, setFlash] = React.useState(null);
  const [unreadOnly, setUnreadOnly] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [connection, setConnection] = React.useState('live');
  const [syncIdx, setSyncIdx] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [accessRequested, setAccessRequested] = React.useState(false);
  const timer = React.useRef(null);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const syncedAt = SYNC_TIMES[Math.min(syncIdx, SYNC_TIMES.length - 1)];

  const refresh = () => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => {
      const n = attempts + 1;
      setAttempts(n);
      if (n % 2 === 0) {
        setConnection('stale');
      } else {
        setConnection('live');
        setSyncIdx((i) => Math.min(i + 1, SYNC_TIMES.length - 1));
      }
      setLoading(false);
    }, 700);
  };

  const checkInOverdue = (g) => {
    if (g.status === 'Completed') return false;
    const base = g.last_check_in || g.created_at;
    return -daysUntil(base) > g.check_in_interval_days;
  };
  const isOverdue = (g) => g.status !== 'Completed' && daysUntil(g.due_date) < 0;
  const isDueSoon = (g) => g.status !== 'Completed' && daysUntil(g.due_date) >= 0 && daysUntil(g.due_date) <= 14;
  const needsAttention = (g) => isOverdue(g) || isDueSoon(g) || g.status === 'Blocked' || checkInOverdue(g);

  const counts = {
    all: goals.length,
    attention: goals.filter(needsAttention).length,
    in_progress: goals.filter((g) => g.status === 'In progress').length,
    completed: goals.filter((g) => g.status === 'Completed').length,
  };

  const TABS = [
    { key: 'all', label: `All goals · ${counts.all}` },
    { key: 'attention', label: `Needs attention · ${counts.attention}` },
    { key: 'in_progress', label: `In progress · ${counts.in_progress}` },
    { key: 'completed', label: `Completed · ${counts.completed}` },
  ];
  const tabLabel = (TABS.find((t) => t.key === tab) || TABS[0]).label.split(' · ')[0];

  const q = query.trim().toLowerCase();
  const visible = goals.filter((g) => {
    const tabOk =
      tab === 'all' ||
      (tab === 'attention' && needsAttention(g)) ||
      (tab === 'in_progress' && g.status === 'In progress') ||
      (tab === 'completed' && g.status === 'Completed');
    if (!tabOk) return false;
    if (!q) return true;
    return (
      g.title.toLowerCase().includes(q) ||
      g.target_metric.toLowerCase().includes(q) ||
      g.id.toLowerCase().includes(q) ||
      (g.parent_objective ? g.parent_objective.title.toLowerCase().includes(q) : false)
    );
  });

  const measured = goals.filter((g) => g.progress_type === 'percent');
  const avgProgress = measured.length
    ? Math.round(measured.reduce((s, g) => s + (g.progress_percent || 0), 0) / measured.length)
    : 0;
  const overdueCount = goals.filter(isOverdue).length;
  const checkInsDue = goals.filter(checkInOverdue).length;
  const activeCount = goals.filter((g) => g.status !== 'Completed').length;
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const shownNotifications = unreadOnly ? notifications.filter((n) => !n.is_read) : notifications;

  const openEditor = (g) => {
    setEditingId(g.id);
    setFormError('');
    setFlash(null);
    setDraft({ percent: g.progress_percent == null ? '0' : String(g.progress_percent), status: g.status });
  };

  const saveProgress = (e, g) => {
    e.preventDefault();
    if (g.progress_type === 'percent') {
      const raw = draft.percent.trim();
      const v = Number(raw);
      if (raw === '' || Number.isNaN(v) || !Number.isInteger(v) || v < 0 || v > 100) {
        setFormError(`Progress is a whole number from 0 to 100 — “${raw || 'blank'}” can’t be saved. Your entry is still in the field.`);
        return;
      }
      const before = g.progress_percent;
      const nextStatus = v === 100 ? 'Completed' : v === 0 ? 'Not started' : 'In progress';
      setGoals((prev) =>
        prev.map((x) =>
          x.id === g.id
            ? { ...x, progress_percent: v, status: nextStatus, completed_at: v === 100 ? '2026-11-05' : null, updated_at: '2026-11-05' }
            : x,
        ),
      );
      setFlash({
        id: g.id,
        message:
          v === 100
            ? `Saved — ${before}% → 100%. Marked complete, completion date 5 Nov 2026.`
            : `Saved — ${before}% → ${v}%. Next check-in due ${fmtDate(addDays('2026-11-05', g.check_in_interval_days))}.`,
      });
    } else {
      const s = draft.status;
      const before = g.status;
      setGoals((prev) =>
        prev.map((x) =>
          x.id === g.id
            ? { ...x, status: s, completed_at: s === 'Completed' ? '2026-11-05' : null, updated_at: '2026-11-05' }
            : x,
        ),
      );
      setFlash({
        id: g.id,
        message:
          s === 'Completed'
            ? `Saved — status ${before} → Completed. Completion date 5 Nov 2026.`
            : `Saved — status ${before} → ${s}.`,
      });
    }
    setFormError('');
    setEditingId(null);
  };

  const labelCls = 'text-[11px] uppercase tracking-[0.18em]';
  const focusCls = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  const ghostBtn = {
    backgroundColor: 'transparent',
    color: text,
    border: `1px solid ${hairline}`,
    outlineColor: accent,
    fontFamily: sans,
  };
  const primaryBtn = { backgroundColor: accent, color: bg, border: '1px solid transparent', outlineColor: accent, fontFamily: sans };

  const dueBadge = (g) => {
    const d = daysUntil(g.due_date);
    if (g.status === 'Completed') {
      return (
        <Badge className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] [font-variant-numeric:tabular-nums]"
          style={{ backgroundColor: hexToRgba(accent, 0.14), color: accent, border: `1px solid ${hexToRgba(accent, 0.3)}` }}>
          <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Completed {fmtDate(g.completed_at)}
        </Badge>
      );
    }
    if (d < 0) {
      return (
        <Badge className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] [font-variant-numeric:tabular-nums]"
          style={{ backgroundColor: hexToRgba(SEMANTIC_CLAY, 0.16), color: SEMANTIC_CLAY, border: `1px solid ${hexToRgba(SEMANTIC_CLAY, 0.4)}` }}>
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Overdue by {Math.abs(d)} days · {fmtDate(g.due_date)}
        </Badge>
      );
    }
    if (d <= 14) {
      return (
        <Badge className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] [font-variant-numeric:tabular-nums]"
          style={{ backgroundColor: hexToRgba(SEMANTIC_AMBER, 0.14), color: SEMANTIC_AMBER, border: `1px solid ${hexToRgba(SEMANTIC_AMBER, 0.35)}` }}>
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Due in {d} days · {fmtDate(g.due_date)}
        </Badge>
      );
    }
    return (
      <Badge className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] [font-variant-numeric:tabular-nums]"
        style={{ backgroundColor: 'transparent', color: muted, border: `1px solid ${hairline}` }}>
        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
        Due {fmtDate(g.due_date)}
      </Badge>
    );
  };

  // Signature element: the pace rule — progress against elapsed timeframe.
  const PaceRule = ({ goal }) => {
    const total = Math.max(1, Math.round((parseISO(goal.due_date) - parseISO(goal.created_at)) / 86400000));
    const elapsed = Math.round((TODAY - parseISO(goal.created_at)) / 86400000);
    const expected = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));

    if (goal.progress_type === 'percent') {
      const pct = goal.progress_percent || 0;
      const behind = pct < expected - 10 && goal.status !== 'Completed';
      return (
        <div>
          <div className="flex items-baseline justify-between">
            <span className={labelCls} style={{ color: muted }}>Completion</span>
            <span className="text-[26px] leading-none [font-variant-numeric:tabular-nums]" style={{ fontFamily: serif, color: goal.status === 'Completed' ? accent : text }}>
              {pct}<span className="text-[15px]" style={{ color: muted }}>%</span>
            </span>
          </div>
          <div className="relative mt-3 h-[6px] rounded-full" style={{ backgroundColor: hexToRgba(text, 0.08) }}>
            <div className="h-full rounded-full transition-[width] duration-500 ease-out velvet-anim" style={{ width: `${pct}%`, backgroundColor: accent }} />
            {goal.status !== 'Completed' && (
              <span className="absolute top-1/2 h-[9px] w-[9px] -translate-y-1/2 rotate-45"
                style={{ left: `calc(${expected}% - 4px)`, backgroundColor: bg, border: `1px solid ${hexToRgba(text, 0.55)}` }}
                aria-hidden="true" />
            )}
          </div>
          <p className="mt-2 text-xs [font-variant-numeric:tabular-nums]" style={{ color: behind ? SEMANTIC_AMBER : muted }}>
            {goal.status === 'Completed'
              ? `Closed ${fmtDate(goal.completed_at)} · ${total} day timeframe`
              : `Pace marker at ${expected}% of the timeframe · ${behind ? 'running behind pace' : 'on pace'}`}
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-baseline justify-between">
          <span className={labelCls} style={{ color: muted }}>Status track</span>
          <span className="text-[15px]" style={{ fontFamily: serif, color: goal.status === 'Blocked' ? SEMANTIC_AMBER : text }}>{goal.status}</span>
        </div>
        <ol className="mt-3 flex gap-1.5">
          {STATUS_OPTIONS.map((s) => {
            const on = s === goal.status;
            const tone = goal.status === 'Blocked' ? SEMANTIC_AMBER : accent;
            return (
              <li key={s} className="flex-1">
                <div className="h-[6px] rounded-full transition-colors duration-300 velvet-anim"
                  style={{ backgroundColor: on ? tone : hexToRgba(text, 0.08) }} />
                <span className="mt-2 block text-[10px] uppercase tracking-[0.12em]" style={{ color: on ? text : hexToRgba(text, 0.35) }}>{s}</span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };

  const notifIcon = (type) => {
    const common = 'h-4 w-4 shrink-0';
    if (type === 'check_in_overdue' || type === 'overdue') return <AlertCircle className={common} style={{ color: SEMANTIC_AMBER }} aria-hidden="true" />;
    if (type === 'praise') return <Bell className={common} style={{ color: accent }} aria-hidden="true" />;
    if (type === 'completed') return <CheckCircle className={common} style={{ color: accent }} aria-hidden="true" />;
    return <Clock className={common} style={{ color: muted }} aria-hidden="true" />;
  };

  return (
    <div className="min-h-full px-6 py-8 md:px-10 md:py-10" style={{ backgroundColor: bg, color: text, fontFamily: sans }}>
      <style>{`
        @keyframes velvetRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes velvetSheen { 0% { opacity: .3 } 50% { opacity: .65 } 100% { opacity: .3 } }
        @media (prefers-reduced-motion: reduce) {
          .velvet-anim, .velvet-skel { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-7" style={{ borderBottom: `1px solid ${hairline}` }}>
          <div>
            <p className={labelCls} style={{ color: accent }}>Q4 FY26 · 1 Oct – 31 Dec 2026</p>
            <h1 className="mt-3 text-[34px] leading-[1.15] md:text-[40px]" style={{ fontFamily: serif }}>My goals</h1>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name="Priya Raghunathan" className="h-8 w-8" />
              <p className="text-sm" style={{ color: muted }}>
                Priya Raghunathan · Product Design · reports to Daniel Osei
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="flex items-center gap-2 text-xs [font-variant-numeric:tabular-nums]"
              style={{ color: connection === 'stale' ? SEMANTIC_AMBER : muted }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: connection === 'stale' ? SEMANTIC_AMBER : accent }} aria-hidden="true" />
              {connection === 'stale' ? `Stale — last synced ${syncedAt}` : `Synced ${syncedAt}`}
            </p>
            <Button onClick={refresh} disabled={loading}
              className={`inline-flex h-11 items-center gap-2 rounded-[6px] px-4 text-sm transition-opacity hover:opacity-80 disabled:opacity-50 ${focusCls}`}
              style={ghostBtn}>
              <Download className="h-4 w-4" aria-hidden="true" />
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
            <Button onClick={() => navigate('login')}
              className={`inline-flex h-11 items-center gap-2 rounded-[6px] px-4 text-sm transition-opacity hover:opacity-80 ${focusCls}`}
              style={ghostBtn}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
            <Button onClick={() => navigate('goal-detail')}
              className={`inline-flex h-11 items-center gap-2 rounded-[6px] px-5 text-sm font-medium transition-opacity hover:opacity-90 ${focusCls}`}
              style={primaryBtn}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              New goal
            </Button>
          </div>
        </div>

        {/* ── Quarter metrics ───────────────────────────────── */}
        <h2 className="sr-only">This quarter at a glance</h2>
        <div className="mt-8 grid grid-cols-1 rounded-[6px] sm:grid-cols-2 lg:grid-cols-4"
          style={{ backgroundColor: surface, border: `1px solid ${hairline}` }}>
          {[
            { label: 'Active goals', value: String(activeCount), hint: `${counts.completed} completed this quarter` },
            { label: 'Average progress', value: `${avgProgress}%`, hint: `Across ${measured.length} measured goals` },
            { label: 'Overdue', value: String(overdueCount), hint: overdueCount ? 'Accessibility audit, 2 Nov' : 'Nothing past its due date' },
            { label: 'Check-ins due', value: String(checkInsDue), hint: 'Cadence set per goal' },
          ].map((s, i) => (
            <div key={s.label} className="px-6 py-5"
              style={{ borderLeft: i === 0 ? 'none' : `1px solid ${hairlineSoft}` }}>
              <Stat label={s.label} value={s.value} hint={s.hint} className="[font-variant-numeric:tabular-nums]" />
            </div>
          ))}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="mx-auto mt-10 grid max-w-[1180px] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[22px]" style={{ fontFamily: serif }}>Current goals</h2>
            <div className="w-full sm:w-[290px]">
              <Label htmlFor="goal-search" className={`${labelCls} block`} style={{ color: muted }}>Search my goals</Label>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: muted }} aria-hidden="true" />
                <Input id="goal-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Title, measure or objective"
                  className={`h-11 w-full rounded-[6px] pl-9 pr-3 text-sm ${focusCls}`}
                  style={{ backgroundColor: surface, border: `1px solid ${hairline}`, color: text, outlineColor: accent }} />
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Tabs tabs={TABS} active={tab} onChange={setTab} />
          </div>

          {connection === 'stale' && (
            <div role="status" className="mt-6 flex flex-wrap items-start gap-3 rounded-[6px] p-4 velvet-anim"
              style={{ backgroundColor: hexToRgba(SEMANTIC_AMBER, 0.08), border: `1px solid ${hexToRgba(SEMANTIC_AMBER, 0.32)}`, animation: 'velvetRise .3s ease-out both' }}>
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: SEMANTIC_AMBER }} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm" style={{ color: text }}>
                  Showing your goals as they stood at {syncedAt}. The server didn’t answer just now — nothing you saved has been lost.
                </p>
              </div>
              <Button onClick={refresh} disabled={loading}
                className={`h-9 rounded-[6px] px-3 text-xs transition-opacity hover:opacity-80 disabled:opacity-50 ${focusCls}`}
                style={{ ...ghostBtn, borderColor: hexToRgba(SEMANTIC_AMBER, 0.45), color: SEMANTIC_AMBER, outlineColor: SEMANTIC_AMBER }}>
                {loading ? 'Retrying…' : 'Retry sync'}
              </Button>
            </div>
          )}

          <div className="mt-6" role="region" aria-label={`${tabLabel}, ${visible.length} goals`} aria-busy={loading}>
            {loading ? (
              <ul className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="rounded-[6px] p-6" style={{ backgroundColor: surface, border: `1px solid ${hairline}` }}>
                    <div className="velvet-skel" style={{ animation: 'velvetSheen 1.4s ease-in-out infinite' }}>
                      <div className="h-3 w-24 rounded" style={{ backgroundColor: hexToRgba(text, 0.1) }} />
                      <div className="mt-4 h-5 w-2/3 rounded" style={{ backgroundColor: hexToRgba(text, 0.1) }} />
                      <div className="mt-5 h-[6px] w-full rounded-full" style={{ backgroundColor: hexToRgba(text, 0.08) }} />
                    </div>
                    <p className="sr-only">Loading your goals</p>
                  </li>
                ))}
              </ul>
            ) : goals.length === 0 ? (
              <div className="rounded-[6px] px-6 py-12" style={{ backgroundColor: surface, border: `1px solid ${hairline}` }}>
                <Empty
                  title="No goals yet for Q4 FY26"
                  description="Goals you write, or ones Daniel Osei assigns you, land here with their measure, due date and check-in cadence."
                  action={
                    <Button onClick={() => navigate('goal-detail')}
                      className={`inline-flex h-11 items-center gap-2 rounded-[6px] px-5 text-sm font-medium transition-opacity hover:opacity-90 ${focusCls}`}
                      style={primaryBtn}>
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Write my first goal
                    </Button>
                  }
                />
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-[6px] px-6 py-12" style={{ backgroundColor: surface, border: `1px solid ${hairline}` }}>
                <Empty
                  title="Nothing here under those filters"
                  description={q ? `No goal in “${tabLabel}” matches “${query}”. Try the goal reference, the measure, or a parent objective.` : `You have no goals in “${tabLabel}” right now.`}
                  action={
                    <Button onClick={() => { setQuery(''); setTab('all'); }}
                      className={`h-11 rounded-[6px] px-5 text-sm transition-opacity hover:opacity-80 ${focusCls}`}
                      style={ghostBtn}>
                      Clear search and show all goals
                    </Button>
                  }
                />
              </div>
            ) : (
              <ul className="space-y-4">
                {visible.map((g, i) => {
                  const overdue = isOverdue(g);
                  const ciOverdue = checkInOverdue(g);
                  const nextCheckIn = addDays(g.last_check_in || g.created_at, g.check_in_interval_days);
                  const editing = editingId === g.id;
                  return (
                    <li key={g.id}
                      className="rounded-[6px] p-6 velvet-anim"
                      style={{
                        backgroundColor: surface,
                        border: `1px solid ${overdue ? hexToRgba(SEMANTIC_CLAY, 0.35) : hairline}`,
                        borderLeft: overdue ? `2px solid ${SEMANTIC_CLAY}` : `1px solid ${hairline}`,
                        animation: `velvetRise .32s ease-out ${i * 0.04}s both`,
                      }}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className={`${labelCls} [font-variant-numeric:tabular-nums]`} style={{ color: accent }}>{g.id}</p>
                          <h3 className="mt-2 text-[20px] leading-snug" style={{ fontFamily: serif }}>{g.title}</h3>
                          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed" style={{ color: muted }}>{g.description}</p>
                        </div>
                        <div className="shrink-0">{dueBadge(g)}</div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                          <p className={labelCls} style={{ color: muted }}>Measure</p>
                          <p className="mt-2 text-sm" style={{ color: text }}>{g.target_metric}</p>
                          <p className="mt-3 text-xs" style={{ color: muted }}>
                            {g.parent_objective
                              ? <>Contributes to <span style={{ color: text }}>{g.parent_objective.title}</span> · {g.parent_objective.level} objective</>
                              : 'Standalone goal · no parent objective'}
                          </p>
                        </div>
                        <PaceRule goal={g} />
                      </div>

                      <div className="my-5" style={{ borderTop: `1px solid ${hairlineSoft}` }} />

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="text-xs [font-variant-numeric:tabular-nums]" style={{ color: ciOverdue ? SEMANTIC_AMBER : muted }}>
                          {ciOverdue && <AlertCircle className="mr-1.5 inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />}
                          {g.last_check_in
                            ? `Last check-in ${fmtDate(g.last_check_in)} · every ${g.check_in_interval_days} days · ${ciOverdue ? `check-in overdue since ${fmtDate(nextCheckIn)}` : `next due ${fmtDate(nextCheckIn)}`}`
                            : `No check-in yet · cadence every ${g.check_in_interval_days} days · first due ${fmtDate(nextCheckIn)}`}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button onClick={() => (editing ? setEditingId(null) : openEditor(g))}
                            aria-expanded={editing}
                            className={`h-10 rounded-[6px] px-4 text-sm transition-opacity hover:opacity-80 ${focusCls}`}
                            style={{ ...ghostBtn, borderColor: hexToRgba(accent, 0.4), color: accent, outlineColor: accent }}>
                            {editing ? 'Cancel update' : 'Update progress'}
                          </Button>
                          <Button onClick={() => navigate('goal-detail')}
                            className={`inline-flex h-10 items-center gap-1.5 rounded-[6px] px-4 text-sm transition-opacity hover:opacity-80 ${focusCls}`}
                            style={ghostBtn}>
                            Open goal
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>

                      {editing && (
                        <form onSubmit={(e) => saveProgress(e, g)}
                          className="mt-5 rounded-[6px] p-5 velvet-anim"
                          style={{ backgroundColor: surfaceUp, border: `1px solid ${hairline}`, animation: 'velvetRise .24s ease-out both' }}>
                          {g.progress_type === 'percent' ? (
                            <div className="flex flex-wrap items-end gap-4">
                              <div>
                                <Label htmlFor={`pct-${g.id}`} className={`${labelCls} block`} style={{ color: muted }}>Completion (0–100%)</Label>
                                <Input id={`pct-${g.id}`} type="number" inputMode="numeric" min="0" max="100" step="1"
                                  value={draft.percent}
                                  onChange={(e) => setDraft((d) => ({ ...d, percent: e.target.value }))}
                                  aria-invalid={formError ? 'true' : 'false'}
                                  aria-describedby={formError ? `err-${g.id}` : undefined}
                                  className={`mt-2 h-11 w-32 rounded-[6px] px-3 text-sm [font-variant-numeric:tabular-nums] ${focusCls}`}
                                  style={{ backgroundColor: bg, border: `1px solid ${formError ? SEMANTIC_CLAY : hairline}`, color: text, outlineColor: accent }} />
                              </div>
                              <Button type="button" onClick={() => setDraft((d) => ({ ...d, percent: '100' }))}
                                className={`h-11 rounded-[6px] px-4 text-sm transition-opacity hover:opacity-80 ${focusCls}`}
                                style={ghostBtn}>
                                Set to 100%
                              </Button>
                              <Button type="submit"
                                className={`inline-flex h-11 items-center gap-2 rounded-[6px] px-5 text-sm font-medium transition-opacity hover:opacity-90 ${focusCls}`}
                                style={primaryBtn}>
                                <Check className="h-4 w-4" aria-hidden="true" />
                                Save progress
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-end gap-4">
                              <div>
                                <Label htmlFor={`st-${g.id}`} className={`${labelCls} block`} style={{ color: muted }}>Status</Label>
                                <Select id={`st-${g.id}`} value={draft.status}
                                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                                  className={`mt-2 h-11 w-56 rounded-[6px] px-3 text-sm ${focusCls}`}
                                  style={{ backgroundColor: bg, border: `1px solid ${hairline}`, color: text, outlineColor: accent }}>
                                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                                </Select>
                              </div>
                              <Button type="submit"
                                className={`inline-flex h-11 items-center gap-2 rounded-[6px] px-5 text-sm font-medium transition-opacity hover:opacity-90 ${focusCls}`}
                                style={primaryBtn}>
                                <Check className="h-4 w-4" aria-hidden="true" />
                                Save status
                              </Button>
                            </div>
                          )}
                          {formError && (
                            <p id={`err-${g.id}`} role="alert" className="mt-3 flex items-start gap-2 text-sm" style={{ color: SEMANTIC_CLAY }}>
                              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                              {formError}
                            </p>
                          )}
                        </form>
                      )}

                      {flash && flash.id === g.id && !editing && (
                        <p role="status" className="mt-4 flex items-start gap-2 rounded-[6px] px-4 py-3 text-sm velvet-anim"
                          style={{ backgroundColor: hexToRgba(accent, 0.1), border: `1px solid ${hexToRgba(accent, 0.3)}`, color: text, animation: 'velvetRise .26s ease-out both' }}>
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} aria-hidden="true" />
                          <span className="[font-variant-numeric:tabular-nums]">{flash.message}</span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* ── Right rail ───────────────────────────────────── */}
        <aside className="space-y-6">
          <Card className="rounded-[6px]" style={{ backgroundColor: surface, border: `1px solid ${hairline}` }}>
            <CardHeader className="px-5 pt-5 pb-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[18px]" style={{ fontFamily: serif }}>Reminders</h2>
                <Badge className="rounded-full px-2.5 py-1 text-[11px] [font-variant-numeric:tabular-nums]"
                  style={{ backgroundColor: unreadCount ? hexToRgba(accent, 0.14) : 'transparent', color: unreadCount ? accent : muted, border: `1px solid ${unreadCount ? hexToRgba(accent, 0.3) : hairline}` }}>
                  {unreadCount} unread
                </Badge>
              </div>
              <Label className="mt-4 flex cursor-pointer items-center justify-between gap-3 text-sm" style={{ color: muted }}>
                <span>Unread only</span>
                <Switch checked={unreadOnly}
                  onChange={(v) => setUnreadOnly(typeof v === 'boolean' ? v : !!(v && v.target && v.target.checked))} />
              </Label>
            </CardHeader>
            <div className="px-5 pt-4"><Separator /></div>
            <CardContent className="px-0 pb-2 pt-0">
              {shownNotifications.length === 0 ? (
                <div className="px-5 py-8">
                  <Empty
                    title={unreadOnly ? 'Nothing unread' : 'No reminders right now'}
                    description={unreadOnly ? 'Every reminder has been read. Switch off “unread only” to see the full list.' : 'When a due date comes close or a check-in slips past its cadence, the reminder appears here.'}
                  />
                </div>
              ) : (
                <ul>
                  {shownNotifications.map((n, i) => (
                    <li key={n.id} className="px-5 py-4 velvet-anim"
                      style={{ borderTop: i === 0 ? 'none' : `1px solid ${hairlineSoft}`, animation: 'velvetRise .26s ease-out both' }}>
                      <div className="flex items-start gap-3">
                        {notifIcon(n.type)}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-relaxed" style={{ color: n.is_read ? muted : text }}>{n.message}</p>
                          <p className="mt-2 flex flex-wrap items-center gap-2 text-[11px] [font-variant-numeric:tabular-nums]" style={{ color: muted }}>
                            <span>{n.created_at}</span>
                            <span aria-hidden="true">·</span>
                            <span style={{ color: n.is_read ? muted : accent }}>{n.is_read ? 'Read' : 'Unread'}</span>
                          </p>
                          {n.email_status === 'failed' && (
                            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed" style={{ color: SEMANTIC_AMBER }}>
                              <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              Email copy not sent — the mail service isn’t configured. Logged for IT; this reminder still stands.
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-2">
                            {n.route && (
                              <Button onClick={() => navigate(n.route)}
                                className={`h-8 rounded-[6px] px-3 text-xs transition-opacity hover:opacity-80 ${focusCls}`}
                                style={{ ...ghostBtn, borderColor: hexToRgba(accent, 0.35), color: accent, outlineColor: accent }}>
                                Read it
                              </Button>
                            )}
                            {!n.is_read && (
                              <Button aria-label={`Mark reminder ${n.id} as read`}
                                onClick={() => setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)))}
                                className={`inline-flex h-8 items-center gap-1.5 rounded-[6px] px-3 text-xs transition-opacity hover:opacity-80 ${focusCls}`}
                                style={ghostBtn}>
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                Mark read
                              </Button>
                            )}
                            <Button aria-label={`Dismiss reminder ${n.id}`}
                              onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition-opacity hover:opacity-80 ${focusCls}`}
                              style={ghostBtn}>
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[6px]" style={{ backgroundColor: 'transparent', border: `1px dashed ${hairline}` }}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 shrink-0" style={{ color: muted }} aria-hidden="true" />
                <div>
                  <h2 className="text-[15px]" style={{ fontFamily: serif }}>Team progress is closed to you</h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: muted }}>
                    Direct-report goals are visible to managers, HR admins and leadership. Your account is set up as an employee.
                  </p>
                  {accessRequested ? (
                    <p role="status" className="mt-3 flex items-start gap-2 text-sm" style={{ color: accent }}>
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      Request sent to Lena Fiore in People Ops. She’ll confirm by email.
                    </p>
                  ) : (
                    <Button onClick={() => setAccessRequested(true)}
                      className={`mt-3 h-10 rounded-[6px] px-4 text-sm transition-opacity hover:opacity-80 ${focusCls}`}
                      style={ghostBtn}>
                      Ask People Ops for manager access
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[6px]" style={{ backgroundColor: surface, border: `1px solid ${hairline}` }}>
            <CardContent className="p-5">
              <h2 className={labelCls} style={{ color: muted }}>Elsewhere</h2>
              <ul className="mt-3 space-y-1">
                {[
                  { label: 'Praise I’ve received', route: 'praise', icon: Bell },
                  { label: 'My team', route: 'team', icon: Users },
                  { label: 'People admin', route: 'employees', icon: Settings },
                ].map((l) => (
                  <li key={l.route}>
                    <Button onClick={() => navigate(l.route)}
                      className={`flex h-11 w-full items-center justify-between rounded-[6px] px-3 text-sm transition-opacity hover:opacity-80 ${focusCls}`}
                      style={{ backgroundColor: 'transparent', color: text, border: '1px solid transparent', outlineColor: accent }}>
                      <span className="flex items-center gap-2.5">
                        <l.icon className="h-4 w-4" style={{ color: muted }} aria-hidden="true" />
                        {l.label}
                      </span>
                      <ChevronRight className="h-4 w-4" style={{ color: muted }} aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
