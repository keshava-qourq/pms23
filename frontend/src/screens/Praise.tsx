// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Textarea, Label, Select, Badge, Avatar } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Search, X, ChevronRight, Clock, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } = Icons;

const hexToRgb = (h) => {
  const s = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};

const mix = (a, b, p) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return (
    '#' +
    A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join('')
  );
};

const T = {
  canvas: brand.backgroundColor,
  panel: mix(brand.backgroundColor, brand.primaryColor, 0.05),
  panelHi: mix(brand.backgroundColor, brand.primaryColor, 0.09),
  inset: mix(brand.backgroundColor, brand.primaryColor, 0.02),
  line: mix(brand.backgroundColor, brand.primaryColor, 0.14),
  lineSoft: mix(brand.backgroundColor, brand.primaryColor, 0.08),
  text: brand.primaryColor,
  muted: brand.neutralColor,
  accent: brand.accentColor,
  accentInk: mix(brand.accentColor, brand.backgroundColor, 0.82),
  danger: '#cd8f7f', // clay — reserved for errors only
};

const MAX_CHARS = 280;
const NOW = new Date('2026-11-05T11:20:00');

const ME = { id: 'u-04', name: 'Elena Vasquez', title: 'Senior Product Designer' };

const PEOPLE = [
  { id: 'u-01', name: 'Marcus Oyelaran', title: 'Engineering Manager', is_active: true },
  { id: 'u-02', name: 'Hannah Lindqvist', title: 'Staff Engineer', is_active: true },
  { id: 'u-03', name: 'Tomás Ferreira', title: 'Customer Success Lead', is_active: true },
  { id: 'u-04', name: 'Elena Vasquez', title: 'Senior Product Designer', is_active: true },
  { id: 'u-05', name: 'Priya Raghunathan', title: 'People Operations', is_active: true },
  { id: 'u-06', name: 'Daniel Mbeki', title: 'Data Analyst', is_active: true },
  { id: 'u-07', name: 'Yuki Tanaka', title: 'QA Engineer', is_active: true },
  { id: 'u-08', name: 'Róisín Doyle', title: 'Finance Partner', is_active: true },
  { id: 'u-09', name: 'Samir Haddad', title: 'Account Executive', is_active: true },
  { id: 'u-10', name: 'Grace Whitfield', title: 'Chief Operating Officer', is_active: true },
  { id: 'u-11', name: 'Oliver Brandt', title: 'Support Specialist', is_active: false },
];

const RECEIVED = [
  {
    id: 'p-312',
    sender_id: 'u-01',
    recipient_id: 'u-04',
    message:
      'You ran the onboarding walkthrough on Tuesday with four stakeholders in the room and three opinions each, and everybody left knowing what shipped first. The annotated flow you left behind is already the thing my engineers open.',
    created_at: '2026-11-04T16:20:00',
    is_new: true,
  },
  {
    id: 'p-309',
    sender_id: 'u-03',
    recipient_id: 'u-04',
    message:
      'Northwind escalated at 08:10 and you were on the call by 08:25 with the screens redrawn. They renewed on Thursday. That was not luck.',
    created_at: '2026-11-03T09:05:00',
    is_new: true,
  },
  {
    id: 'p-298',
    sender_id: 'u-07',
    recipient_id: 'u-04',
    message:
      'Thank you for taking the 14 contrast failures seriously instead of arguing about them. Release 4.2 went out clean and I did not have to raise a single blocker.',
    created_at: '2026-10-31T13:42:00',
    is_new: false,
  },
  {
    id: 'p-281',
    sender_id: 'u-02',
    recipient_id: 'u-04',
    message:
      'The design token document saved my team about a week of guessing. I have linked it in the engineering handbook.',
    created_at: '2026-10-28T10:15:00',
    is_new: false,
  },
  {
    id: 'p-264',
    sender_id: 'u-08',
    recipient_id: 'u-04',
    message:
      'You sat through two hours of budget detail that was not your job and asked the one question that changed the forecast. Genuinely appreciated.',
    created_at: '2026-10-21T15:00:00',
    is_new: false,
  },
  {
    id: 'p-240',
    sender_id: 'u-10',
    recipient_id: 'u-04',
    message:
      'I read every Q3 review pack. Yours was the only one I did not have to send back for evidence. Standard set.',
    created_at: '2026-10-09T18:30:00',
    is_new: false,
  },
];

const SENT = [
  {
    id: 'p-305',
    sender_id: 'u-04',
    recipient_id: 'u-06',
    message:
      'The churn dashboard you rebuilt turned a monthly argument into a five-minute read. Finance stopped keeping their own spreadsheet, which is the highest praise available.',
    created_at: '2026-11-02T11:48:00',
  },
  {
    id: 'p-292',
    sender_id: 'u-04',
    recipient_id: 'u-07',
    message:
      'Thank you for staying late on the regression pass before 4.2. You caught the date-picker bug that would have reached every customer in Europe.',
    created_at: '2026-10-27T19:05:00',
  },
  {
    id: 'p-271',
    sender_id: 'u-04',
    recipient_id: 'u-09',
    message:
      'You brought me into the Halvorsen pitch early enough to actually help. That is rare and it showed in the room.',
    created_at: '2026-10-14T09:30:00',
  },
  {
    id: 'p-252',
    sender_id: 'u-04',
    recipient_id: 'u-02',
    message:
      'Three years of component debt sorted in a fortnight, and you documented it. The whole design system is easier to live in now.',
    created_at: '2026-09-30T16:12:00',
  },
];

export default function Screen() {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState('received');
  const [query, setQuery] = React.useState('');
  const [recipientId, setRecipientId] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(SENT);
  const [banner, setBanner] = React.useState(null);
  const [freshId, setFreshId] = React.useState(null);
  const [sync, setSync] = React.useState({ state: 'stale', at: '09:41' });

  const timers = React.useRef([]);
  const messageRef = React.useRef(null);
  const recipientRef = React.useRef(null);
  const tablistRef = React.useRef(null);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const personById = (id) => PEOPLE.find((p) => p.id === id) || { name: 'Former colleague', title: 'Record anonymised' };
  const colleagues = PEOPLE.filter((p) => p.is_active && p.id !== ME.id);
  const deactivatedCount = PEOPLE.filter((p) => !p.is_active).length;

  const dayLabel = (iso) => {
    const d = new Date(iso);
    const days = Math.floor((NOW - d) / 86400000);
    const time = d.toTimeString().slice(0, 5);
    if (days < 1) return 'Today · ' + time;
    if (days < 2) return 'Yesterday · ' + time;
    if (days < 7) return days + ' days ago · ' + time;
    return d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'short' }) + ' ' + d.getFullYear();
  };

  const list = tab === 'received' ? RECEIVED : sent;
  const q = query.trim().toLowerCase();
  const filtered = q
    ? list.filter((n) => {
        const other = personById(tab === 'received' ? n.sender_id : n.recipient_id);
        return (
          other.name.toLowerCase().includes(q) ||
          other.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q)
        );
      })
    : list;

  const over = message.length > MAX_CHARS;

  const submit = (e) => {
    e.preventDefault();
    if (sending) return;
    if (!recipientId) {
      setError({ field: 'recipient', text: 'Choose who this note is for. Praise is always addressed to one person.' });
      if (recipientRef.current) recipientRef.current.focus();
      return;
    }
    if (!message.trim()) {
      setError({ field: 'message', text: 'Write a line or two. Say what they did and why it mattered.' });
      if (messageRef.current) messageRef.current.focus();
      return;
    }
    if (over) {
      setError({ field: 'message', text: 'That is ' + (message.length - MAX_CHARS) + ' characters over. Keep it to ' + MAX_CHARS + '.' });
      if (messageRef.current) messageRef.current.focus();
      return;
    }
    setError(null);
    setSending(true);
    later(() => {
      const id = 'p-' + (320 + sent.length);
      const note = {
        id,
        sender_id: ME.id,
        recipient_id: recipientId,
        message: message.trim(),
        created_at: '2026-11-05T11:20:00',
      };
      setSent((prev) => [note, ...prev]);
      setBanner({ name: personById(recipientId).name, id });
      setFreshId(id);
      setTab('sent');
      setQuery('');
      setRecipientId('');
      setMessage('');
      setSending(false);
      later(() => setFreshId(null), 2400);
    }, 750);
  };

  const refresh = () => {
    setSync({ state: 'syncing', at: sync.at });
    later(() => setSync({ state: 'synced', at: '11:20' }), 800);
  };

  const praiseBack = (name, id) => {
    setRecipientId(id);
    setError(null);
    if (messageRef.current) {
      messageRef.current.focus();
      messageRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  };

  const tabs = [
    { key: 'received', label: 'Received', count: RECEIVED.length },
    { key: 'sent', label: 'Sent', count: sent.length },
  ];

  const onTabKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = tabs.findIndex((t2) => t2.key === tab);
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    setTab(next.key);
    const btns = tablistRef.current ? tablistRef.current.querySelectorAll('[role="tab"]') : [];
    const target = Array.from(btns).find((b) => b.getAttribute('data-key') === next.key);
    if (target) target.focus();
  };

  const labelStyle = {
    color: T.muted,
    fontSize: '11px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    fontFamily: brand.fontBody,
  };

  const fieldStyle = {
    backgroundColor: T.inset,
    border: '1px solid ' + T.line,
    borderRadius: brand.radius,
    color: T.text,
    fontFamily: brand.fontBody,
  };

  const panelStyle = {
    backgroundColor: T.panel,
    border: '1px solid ' + T.line,
    borderRadius: brand.radius,
  };

  const QuoteMark = ({ size }) => (
    <span
      aria-hidden="true"
      style={{
        fontFamily: brand.fontHeading,
        color: T.accent,
        fontSize: size + 'px',
        lineHeight: 1,
        display: 'block',
      }}
    >
      &ldquo;
    </span>
  );

  return (
    <div
      className="pms-scope min-h-full px-6 py-10 sm:px-10 lg:px-12"
      style={{ backgroundColor: T.canvas, color: T.text, fontFamily: brand.fontBody }}
    >
      <style>{`
        .pms-scope :focus-visible {
          outline: 2px solid ${T.accent};
          outline-offset: 2px;
          border-radius: 4px;
        }
        .pms-scope input::placeholder,
        .pms-scope textarea::placeholder { color: ${T.muted}; opacity: 1; }
        .pms-avatar {
          background-color: ${T.panelHi};
          color: ${T.accent};
          border: 1px solid ${T.line};
          font-family: ${brand.fontHeading};
        }
        .pms-row { animation: pms-enter 320ms ease-out both; }
        .pms-banner { animation: pms-drop 280ms ease-out both; }
        .pms-fresh { box-shadow: inset 2px 0 0 ${T.accent}; }
        @keyframes pms-enter {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes pms-drop {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes pms-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .pms-syncing { animation: pms-pulse 1.1s ease-in-out infinite; }
        .pms-link:hover { color: ${T.accent}; }
        @media (prefers-reduced-motion: reduce) {
          .pms-scope * { animation: none !important; transition: none !important; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1180px]">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <div>
            <p style={labelStyle}>Recognition · Harbour &amp; Co.</p>
            <h1
              className="mt-3 text-[34px] leading-[1.15] sm:text-[40px]"
              style={{ fontFamily: brand.fontHeading, color: T.text }}
            >
              Praise
            </h1>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.6]" style={{ color: T.muted }}>
              Notes written by name, kept for the person who earned them. Yours are below, most recent first —
              nobody else sees who praised you unless you tell them.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={'flex items-center gap-2 text-[12px] ' + (sync.state === 'syncing' ? 'pms-syncing' : '')}
              style={{ color: sync.state === 'synced' ? T.muted : T.muted, fontVariantNumeric: 'tabular-nums' }}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {sync.state === 'syncing'
                ? 'Checking for new notes…'
                : sync.state === 'stale'
                ? 'Showing notes as of ' + sync.at
                : 'Up to date at ' + sync.at}
            </span>
            <Button
              type="button"
              onClick={refresh}
              disabled={sync.state === 'syncing'}
              className="text-[13px] transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid ' + T.line,
                color: T.text,
                borderRadius: brand.radius,
                opacity: sync.state === 'syncing' ? 0.6 : 1,
                minHeight: '44px',
                paddingInline: '16px',
              }}
            >
              Refresh
            </Button>
          </div>
        </header>

        <div style={{ height: '1px', backgroundColor: T.line }} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Main column */}
          <div className="min-w-0">
            {/* Compose — the focal point */}
            <section aria-labelledby="compose-heading">
              <div className="relative overflow-hidden" style={{ ...panelStyle, backgroundColor: T.panelHi }}>
                <div
                  aria-hidden="true"
                  style={{ position: 'absolute', top: 0, left: 0, height: '2px', width: '72px', backgroundColor: T.accent }}
                />
                <div className="px-6 pb-6 pt-7 sm:px-8 sm:pb-8">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:block" style={{ marginTop: '-6px' }}>
                      <QuoteMark size={46} />
                    </div>
                    <div>
                      <h2
                        id="compose-heading"
                        className="text-[22px] leading-tight"
                        style={{ fontFamily: brand.fontHeading }}
                      >
                        Write a praise note
                      </h2>
                      <p className="mt-2 max-w-[58ch] text-[14px] leading-[1.6]" style={{ color: T.muted }}>
                        One colleague, one specific thing they did. It arrives in their notifications with your name on it.
                      </p>
                    </div>
                  </div>

                  {banner ? (
                    <div
                      role="status"
                      className="pms-banner mt-6 flex items-start justify-between gap-4 px-4 py-3"
                      style={{
                        border: '1px solid ' + T.accent,
                        borderRadius: brand.radius,
                        backgroundColor: mix(T.panelHi, T.accent, 0.1),
                      }}
                    >
                      <span className="flex items-start gap-3 text-[14px]" style={{ color: T.text }}>
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: T.accent }} aria-hidden="true" />
                        <span>
                          Sent to {banner.name}. It is in their notifications now and saved under{' '}
                          <strong style={{ fontWeight: 600 }}>Sent</strong> as {banner.id}.
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setBanner(null)}
                        aria-label="Dismiss confirmation"
                        className="shrink-0 rounded p-1 transition-opacity hover:opacity-70"
                        style={{ color: T.muted }}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : null}

                  <form className="mt-6" onSubmit={submit} noValidate>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="praise-recipient" style={labelStyle}>
                          Recipient
                        </Label>
                        <Select
                          id="praise-recipient"
                          ref={recipientRef}
                          value={recipientId}
                          onChange={(e) => {
                            setRecipientId(e.target.value);
                            if (error && error.field === 'recipient') setError(null);
                          }}
                          aria-invalid={error && error.field === 'recipient' ? 'true' : 'false'}
                          aria-describedby="recipient-hint"
                          className="mt-2 w-full px-3 text-[15px]"
                          style={{
                            ...fieldStyle,
                            minHeight: '44px',
                            borderColor: error && error.field === 'recipient' ? T.danger : T.line,
                          }}
                        >
                          <option value="">Choose a colleague…</option>
                          {colleagues.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {p.title}
                            </option>
                          ))}
                        </Select>
                        <p id="recipient-hint" className="mt-2 text-[12px]" style={{ color: T.muted }}>
                          {deactivatedCount} deactivated record{deactivatedCount === 1 ? '' : 's'} hidden. HR can restore
                          people from People admin.
                        </p>
                      </div>

                      <div className="sm:pt-[26px]">
                        <div
                          className="flex h-full items-center gap-3 px-4 py-3"
                          style={{ border: '1px solid ' + T.lineSoft, borderRadius: brand.radius }}
                        >
                          <Avatar name={recipientId ? personById(recipientId).name : 'New note'} className="pms-avatar h-9 w-9 rounded-full text-[13px]" />
                          <span className="min-w-0 text-[13px]" style={{ color: T.muted }}>
                            {recipientId ? (
                              <>
                                <span className="block truncate" style={{ color: T.text }}>
                                  {personById(recipientId).name}
                                </span>
                                <span className="block truncate">{personById(recipientId).title}</span>
                              </>
                            ) : (
                              'No recipient chosen yet'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Label htmlFor="praise-message" style={labelStyle}>
                        Message
                      </Label>
                      <Textarea
                        id="praise-message"
                        ref={messageRef}
                        rows={4}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (error && error.field === 'message') setError(null);
                        }}
                        aria-invalid={error && error.field === 'message' ? 'true' : 'false'}
                        aria-describedby="message-count"
                        placeholder="What did they do, and what difference did it make?"
                        className="mt-2 w-full resize-y px-3 py-3 text-[15px] leading-[1.6]"
                        style={{
                          ...fieldStyle,
                          borderColor: error && error.field === 'message' ? T.danger : T.line,
                        }}
                      />
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <p id="message-count" className="text-[12px]" style={{ color: over ? T.danger : T.muted, fontVariantNumeric: 'tabular-nums' }}>
                          {message.length} / {MAX_CHARS} characters
                        </p>
                        <p className="text-[12px]" style={{ color: T.muted }}>
                          Praise cannot be edited once sent.
                        </p>
                      </div>
                    </div>

                    {error ? (
                      <p
                        role="alert"
                        className="mt-4 flex items-start gap-2 px-3 py-2 text-[13px] leading-[1.5]"
                        style={{
                          color: T.text,
                          border: '1px solid ' + T.danger,
                          borderRadius: brand.radius,
                          backgroundColor: mix(T.panelHi, T.danger, 0.08),
                        }}
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: T.danger }} aria-hidden="true" />
                        <span>
                          <strong style={{ fontWeight: 600 }}>Not sent. </strong>
                          {error.text} Your words are still here.
                        </span>
                      </p>
                    ) : null}

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Button
                        type="submit"
                        disabled={sending || over}
                        className="text-[14px] font-medium transition-opacity"
                        style={{
                          backgroundColor: T.accent,
                          color: T.accentInk,
                          border: '1px solid ' + T.accent,
                          borderRadius: brand.radius,
                          minHeight: '44px',
                          paddingInline: '22px',
                          opacity: sending || over ? 0.55 : 1,
                          cursor: sending || over ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {sending ? 'Sending…' : 'Send praise'}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setRecipientId('');
                          setMessage('');
                          setError(null);
                        }}
                        className="text-[14px] transition-colors"
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid transparent',
                          color: T.muted,
                          borderRadius: brand.radius,
                          minHeight: '44px',
                          paddingInline: '12px',
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            {/* Feed */}
            <section aria-labelledby="feed-heading" className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <h2 id="feed-heading" className="text-[22px] leading-tight" style={{ fontFamily: brand.fontHeading }}>
                  Your notes
                </h2>

                <div className="w-full sm:w-[280px]">
                  <Label htmlFor="praise-search" style={labelStyle}>
                    Search notes
                  </Label>
                  <div className="relative mt-2">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: T.muted }}
                      aria-hidden="true"
                    />
                    <Input
                      id="praise-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Name or a word from the note"
                      className="w-full pl-9 pr-3 text-[14px]"
                      style={{ ...fieldStyle, minHeight: '44px' }}
                    />
                  </div>
                </div>
              </div>

              <div
                ref={tablistRef}
                role="tablist"
                aria-label="Praise received or sent"
                onKeyDown={onTabKey}
                className="mt-6 flex items-center gap-1"
                style={{ borderBottom: '1px solid ' + T.line }}
              >
                {tabs.map((t2) => {
                  const on = tab === t2.key;
                  return (
                    <button
                      key={t2.key}
                      role="tab"
                      data-key={t2.key}
                      id={'tab-' + t2.key}
                      aria-selected={on}
                      aria-controls={'panel-' + t2.key}
                      tabIndex={on ? 0 : -1}
                      type="button"
                      onClick={() => setTab(t2.key)}
                      className="px-4 pb-3 pt-2 text-[14px] transition-colors"
                      style={{
                        color: on ? T.text : T.muted,
                        borderBottom: '2px solid ' + (on ? T.accent : 'transparent'),
                        marginBottom: '-1px',
                        fontWeight: on ? 600 : 400,
                        minHeight: '44px',
                      }}
                    >
                      {t2.label}
                      <span className="ml-2 text-[12px]" style={{ color: T.muted, fontVariantNumeric: 'tabular-nums' }}>
                        {t2.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="sr-only" role="status">
                {filtered.length} of {list.length} notes shown
              </p>

              <div
                role="tabpanel"
                id={'panel-' + tab}
                aria-labelledby={'tab-' + tab}
                tabIndex={-1}
                className="mt-2"
              >
                {filtered.length === 0 ? (
                  <div
                    className="mt-6 flex flex-col items-center px-6 py-14 text-center"
                    style={{ ...panelStyle, borderStyle: 'dashed' }}
                  >
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ border: '1px solid ' + T.line }}
                    >
                      <span style={{ marginTop: '14px' }}>
                        <QuoteMark size={44} />
                      </span>
                    </span>
                    {q ? (
                      <>
                        <h3 className="mt-6 text-[19px]" style={{ fontFamily: brand.fontHeading }}>
                          Nothing matches &ldquo;{query}&rdquo;
                        </h3>
                        <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.6]" style={{ color: T.muted }}>
                          Try a colleague&rsquo;s first name, their team, or a word you remember from the note itself.
                        </p>
                        <Button
                          type="button"
                          onClick={() => setQuery('')}
                          className="mt-6 text-[14px]"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid ' + T.line,
                            color: T.text,
                            borderRadius: brand.radius,
                            minHeight: '44px',
                            paddingInline: '18px',
                          }}
                        >
                          Clear search
                        </Button>
                      </>
                    ) : tab === 'received' ? (
                      <>
                        <h3 className="mt-6 text-[19px]" style={{ fontFamily: brand.fontHeading }}>
                          No praise yet
                        </h3>
                        <p className="mt-2 max-w-[48ch] text-[14px] leading-[1.6]" style={{ color: T.muted }}>
                          When a colleague writes you a note it lands here with their name and the date, and stays for
                          as long as your record does.
                        </p>
                        <Button
                          type="button"
                          onClick={() => messageRef.current && messageRef.current.focus()}
                          className="mt-6 text-[14px]"
                          style={{
                            backgroundColor: T.accent,
                            color: T.accentInk,
                            border: '1px solid ' + T.accent,
                            borderRadius: brand.radius,
                            minHeight: '44px',
                            paddingInline: '18px',
                          }}
                        >
                          Write one for someone else
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="mt-6 text-[19px]" style={{ fontFamily: brand.fontHeading }}>
                          You haven&rsquo;t sent a note yet
                        </h3>
                        <p className="mt-2 max-w-[48ch] text-[14px] leading-[1.6]" style={{ color: T.muted }}>
                          Someone on your team did something worth saying out loud this week. Start the note above.
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <ul className="mt-2" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {filtered.map((n, i) => {
                      const other = personById(tab === 'received' ? n.sender_id : n.recipient_id);
                      const fresh = n.id === freshId;
                      return (
                        <li
                          key={n.id}
                          className={(fresh ? 'pms-row pms-fresh ' : '') + 'relative py-7 pl-8 pr-1 sm:pl-10'}
                          style={{
                            borderBottom: '1px solid ' + T.lineSoft,
                            backgroundColor: fresh ? mix(T.canvas, T.accent, 0.06) : 'transparent',
                            transition: 'background-color 600ms ease',
                          }}
                        >
                          {/* signature rail: hairline + accent lozenge + quote mark */}
                          <span
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              left: '3px',
                              top: 0,
                              bottom: 0,
                              width: '1px',
                              backgroundColor: T.lineSoft,
                            }}
                          />
                          <span
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: '34px',
                              width: '7px',
                              height: '7px',
                              backgroundColor: n.is_new ? T.accent : T.line,
                              transform: 'rotate(45deg)',
                            }}
                          />

                          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                            <div className="flex items-center gap-3">
                              <Avatar name={other.name} className="pms-avatar h-10 w-10 rounded-full text-[13px]" />
                              <div>
                                <p className="text-[15px] leading-tight" style={{ color: T.text, fontWeight: 600 }}>
                                  {tab === 'sent' ? 'To ' : ''}
                                  {other.name}
                                </p>
                                <p className="mt-1 text-[13px]" style={{ color: T.muted }}>
                                  {other.title}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {n.is_new ? (
                                <Badge
                                  className="text-[11px] uppercase"
                                  style={{
                                    backgroundColor: mix(T.canvas, T.accent, 0.14),
                                    color: T.accent,
                                    border: '1px solid ' + T.accent,
                                    borderRadius: brand.radius,
                                    letterSpacing: '0.14em',
                                    padding: '3px 8px',
                                  }}
                                >
                                  New
                                </Badge>
                              ) : null}
                              <span
                                className="text-[12px]"
                                style={{ color: T.muted, fontVariantNumeric: 'tabular-nums' }}
                              >
                                {dayLabel(n.created_at)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-3">
                            <span className="shrink-0" style={{ marginTop: '-10px' }}>
                              <QuoteMark size={30} />
                            </span>
                            <p
                              className="max-w-[68ch] text-[15px] leading-[1.7]"
                              style={{ color: mix(T.text, T.muted, 0.12), fontFamily: brand.fontBody }}
                            >
                              {n.message}
                            </p>
                          </div>

                          {tab === 'received' ? (
                            <div className="mt-4 pl-[42px]">
                              <Button
                                type="button"
                                onClick={() => praiseBack(other.name, n.sender_id)}
                                aria-label={'Write a praise note back to ' + other.name}
                                className="pms-link text-[13px] transition-colors"
                                style={{
                                  backgroundColor: 'transparent',
                                  border: '1px solid ' + T.lineSoft,
                                  color: T.muted,
                                  borderRadius: brand.radius,
                                  minHeight: '36px',
                                  paddingInline: '12px',
                                }}
                              >
                                Praise back
                              </Button>
                            </div>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
          </div>

          {/* Right rail */}
          <aside className="lg:pt-1">
            <section aria-labelledby="tally-heading">
              <div className="px-6 py-6" style={panelStyle}>
                <h2 id="tally-heading" style={labelStyle}>
                  This quarter
                </h2>
                <dl className="mt-5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {[
                    { label: 'Notes received', value: RECEIVED.length, hint: 'from 6 colleagues' },
                    { label: 'Notes sent', value: sent.length, hint: 'across 4 teams' },
                    { label: 'Last received', value: '1d', hint: 'Marcus Oyelaran, 4 Nov' },
                  ].map((m, i) => (
                    <div key={m.label} className={i === 0 ? '' : 'mt-5 pt-5'} style={i === 0 ? null : { borderTop: '1px solid ' + T.lineSoft }}>
                      <dt className="text-[13px]" style={{ color: T.muted }}>
                        {m.label}
                      </dt>
                      <dd
                        className="mt-1 text-[28px] leading-none"
                        style={{ fontFamily: brand.fontHeading, color: T.accent }}
                      >
                        {m.value}
                      </dd>
                      <p className="mt-2 text-[12px]" style={{ color: T.muted }}>
                        {m.hint}
                      </p>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section aria-labelledby="where-heading" className="mt-6">
              <div className="px-6 py-6" style={{ ...panelStyle, backgroundColor: 'transparent' }}>
                <h2 id="where-heading" style={labelStyle}>
                  Nearby
                </h2>
                <p className="mt-4 text-[13px] leading-[1.6]" style={{ color: T.muted }}>
                  Praise sits beside the record it reflects. Open a goal to see progress and check-ins for the work
                  people are thanking you for.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('dashboard')}
                    className="pms-link flex items-center justify-between px-3 text-left text-[14px] transition-colors"
                    style={{
                      color: T.text,
                      border: '1px solid ' + T.lineSoft,
                      borderRadius: brand.radius,
                      minHeight: '44px',
                    }}
                  >
                    My goals dashboard
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('team')}
                    className="pms-link flex items-center justify-between px-3 text-left text-[14px] transition-colors"
                    style={{
                      color: T.text,
                      border: '1px solid ' + T.lineSoft,
                      borderRadius: brand.radius,
                      minHeight: '44px',
                    }}
                  >
                    My team
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
