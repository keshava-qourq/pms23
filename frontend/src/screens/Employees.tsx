// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Select, Checkbox, Switch, Badge, Table, THead, TBody, TR, TH, TD, Avatar, Separator, Tabs, Stat, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Search, Check, X, ChevronRight, Clock, Trash, Download, AlertCircle, CheckCircle } = Icons;

const ROLE_OPTIONS = [
  { key: "employee", label: "Employee" },
  { key: "manager", label: "Manager" },
  { key: "hr_admin", label: "HR admin" },
  { key: "executive", label: "Executive" },
];

const ROLE_LABEL = {
  employee: "Employee",
  manager: "Manager",
  hr_admin: "HR admin",
  executive: "Executive",
};

const EMPLOYEES = [
  { id: "u-04", ref: "EMP-0101", name: "Daniel Achebe", email: "daniel.achebe@northgate.co", role: "executive", manager_id: null, is_active: true, anonymised_at: null, created_at: "2021-03-01", updated_at: "2026-10-28", last_actor: "Greta Hollins" },
  { id: "u-05", ref: "EMP-0114", name: "Ines Marchetti", email: "ines.marchetti@northgate.co", role: "manager", manager_id: "u-04", is_active: true, anonymised_at: null, created_at: "2021-09-14", updated_at: "2026-09-18", last_actor: "Priya Raghunathan" },
  { id: "u-09", ref: "EMP-0132", name: "Noor Haddad", email: "noor.haddad@northgate.co", role: "manager", manager_id: "u-04", is_active: true, anonymised_at: null, created_at: "2022-02-07", updated_at: "2026-09-22", last_actor: "Greta Hollins" },
  { id: "u-02", ref: "EMP-0147", name: "Marcus Oyelaran", email: "marcus.oyelaran@northgate.co", role: "manager", manager_id: "u-05", is_active: true, anonymised_at: null, created_at: "2022-06-20", updated_at: "2026-10-29", last_actor: "Greta Hollins" },
  { id: "u-01", ref: "EMP-0150", name: "Priya Raghunathan", email: "priya.raghunathan@northgate.co", role: "hr_admin", manager_id: "u-04", is_active: true, anonymised_at: null, created_at: "2022-07-04", updated_at: "2026-08-11", last_actor: "Greta Hollins" },
  { id: "u-12", ref: "EMP-0163", name: "Greta Hollins", email: "greta.hollins@northgate.co", role: "hr_admin", manager_id: "u-04", is_active: true, anonymised_at: null, created_at: "2022-11-28", updated_at: "2026-05-02", last_actor: "Priya Raghunathan" },
  { id: "u-07", ref: "EMP-0177", name: "Sunita Bhargava", email: "sunita.bhargava@northgate.co", role: "employee", manager_id: "u-05", is_active: false, anonymised_at: null, created_at: "2023-01-16", updated_at: "2026-09-30", last_actor: "Priya Raghunathan" },
  { id: "u-11", ref: "EMP-0193", name: "Anonymised employee", email: null, role: "employee", manager_id: null, is_active: false, anonymised_at: "2026-10-12", created_at: "2023-04-03", updated_at: "2026-10-12", last_actor: "Greta Hollins" },
  { id: "u-03", ref: "EMP-0208", name: "Thea Lindqvist", email: "thea.lindqvist@northgate.co", role: "employee", manager_id: "u-02", is_active: true, anonymised_at: null, created_at: "2023-08-21", updated_at: "2026-10-02", last_actor: "Priya Raghunathan" },
  { id: "u-06", ref: "EMP-0219", name: "Rory Kavanagh", email: "rory.kavanagh@northgate.co", role: "employee", manager_id: "u-02", is_active: true, anonymised_at: null, created_at: "2024-01-12", updated_at: "2026-10-29", last_actor: "Greta Hollins" },
  { id: "u-08", ref: "EMP-0234", name: "Felix Brenner", email: "felix.brenner@northgate.co", role: "employee", manager_id: "u-02", is_active: true, anonymised_at: null, created_at: "2024-05-06", updated_at: "2026-11-02", last_actor: "Greta Hollins" },
  { id: "u-10", ref: "EMP-0241", name: "Tomás Esquivel", email: "tomas.esquivel@northgate.co", role: "employee", manager_id: "u-09", is_active: true, anonymised_at: null, created_at: "2024-09-30", updated_at: "2026-07-15", last_actor: "Priya Raghunathan" },
  { id: "u-14", ref: "EMP-0252", name: "Hana Öztürk", email: "hana.ozturk@northgate.co", role: "employee", manager_id: "u-05", is_active: true, anonymised_at: null, created_at: "2025-02-10", updated_at: "2026-06-24", last_actor: "Priya Raghunathan" },
  { id: "u-13", ref: "EMP-0288", name: "Kwame Adjei", email: "kwame.adjei@northgate.co", role: "employee", manager_id: "u-09", is_active: true, anonymised_at: null, created_at: "2026-11-03", updated_at: "2026-11-05", last_actor: "Priya Raghunathan" },
];

const AUDIT = [
  { id: "a-01", at: "2026-11-05 09:12", actor: "Priya Raghunathan", entity_ref: "EMP-0288", entity_name: "Kwame Adjei", action: "manager.set", changes: "manager_id — none → Noor Haddad" },
  { id: "a-02", at: "2026-11-03 16:40", actor: "Priya Raghunathan", entity_ref: "EMP-0288", entity_name: "Kwame Adjei", action: "employee.create", changes: "Record created as Employee, kwame.adjei@northgate.co" },
  { id: "a-03", at: "2026-11-02 11:05", actor: "Greta Hollins", entity_ref: "EMP-0234", entity_name: "Felix Brenner", action: "employee.update", changes: "email — f.brenner@northgate.co → felix.brenner@northgate.co" },
  { id: "a-04", at: "2026-10-29 14:22", actor: "Greta Hollins", entity_ref: "EMP-0219", entity_name: "Rory Kavanagh", action: "manager.reassign", changes: "manager_id — Ines Marchetti → Marcus Oyelaran" },
  { id: "a-05", at: "2026-10-28 08:58", actor: "Priya Raghunathan", entity_ref: "EMP-0101", entity_name: "Daniel Achebe", action: "data.export", changes: "Personal + performance export generated (subject request SAR-2026-0117)" },
  { id: "a-06", at: "2026-10-12 17:03", actor: "Greta Hollins", entity_ref: "EMP-0193", entity_name: "Anonymised employee", action: "personal_data.delete", changes: "Identifying fields anonymised under approved request DPR-2026-0041" },
  { id: "a-07", at: "2026-10-02 10:41", actor: "Priya Raghunathan", entity_ref: "EMP-0208", entity_name: "Thea Lindqvist", action: "employee.update", changes: "name — Thea Lindquist → Thea Lindqvist" },
  { id: "a-08", at: "2026-09-30 10:15", actor: "Priya Raghunathan", entity_ref: "EMP-0177", entity_name: "Sunita Bhargava", action: "employee.deactivate", changes: "is_active — true → false (left the organisation 30 Sep 2026)" },
  { id: "a-09", at: "2026-09-22 13:47", actor: "Greta Hollins", entity_ref: "EMP-0132", entity_name: "Noor Haddad", action: "employee.update", changes: "role — Employee → Manager" },
  { id: "a-10", at: "2026-09-18 09:30", actor: "Priya Raghunathan", entity_ref: "EMP-0114", entity_name: "Ines Marchetti", action: "manager.reassign", changes: "manager_id — Noor Haddad → Daniel Achebe" },
];

const AUDIT_FILTERS = [
  { key: "all", label: "All actions", match: () => true },
  { key: "create", label: "Records created", match: (a) => a.action === "employee.create" },
  { key: "update", label: "Details updated", match: (a) => a.action === "employee.update" },
  { key: "line", label: "Reporting-line changes", match: (a) => a.action.indexOf("manager") === 0 },
  { key: "deactivate", label: "Deactivations", match: (a) => a.action === "employee.deactivate" || a.action === "employee.reactivate" },
  { key: "dp", label: "Data protection", match: (a) => a.action === "data.export" || a.action === "personal_data.delete" },
];

const ACCESS_COPY = {
  employee: {
    title: "Employees see their own record only",
    body: "On an employee session this screen is not reachable. Thea can open her own goals and the praise she has received — nothing about anybody else's record, reporting line or data-protection history.",
  },
  manager: {
    title: "Managers see their reporting line, not the register",
    body: "A manager session reaches its own record and the goals of direct reports. Marcus can open Rory, Thea and Felix; everyone outside that line, including their email and employment data, stays closed.",
  },
  executive: {
    title: "Executive access is read-only analytics",
    body: "Leadership sessions get organisation-wide figures with no names attached, and cannot create, edit, deactivate or delete an individual record. The write actions on this screen are hidden entirely.",
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fmtDate = (iso) => {
  if (!iso) return "—";
  const parts = String(iso).slice(0, 10).split("-");
  return Number(parts[2]) + " " + MONTHS[Number(parts[1]) - 1] + " " + parts[0];
};

const fmtStamp = (s) => {
  const d = String(s).slice(0, 10);
  const t = String(s).slice(11, 16);
  return fmtDate(d) + " · " + t;
};

const toDraft = (e) =>
  e
    ? { name: e.name, email: e.email || "", role: e.role, manager_id: e.manager_id || "" }
    : { name: "", email: "", role: "employee", manager_id: "" };

const wouldCycle = (list, empId, managerId) => {
  if (!managerId) return false;
  if (managerId === empId) return true;
  let cur = list.find((u) => u.id === managerId);
  let guard = 0;
  while (cur && guard < 60) {
    if (cur.manager_id === empId) return true;
    cur = list.find((u) => u.id === cur.manager_id);
    guard += 1;
  }
  return false;
};

export default function Screen() {
  const navigate = useNavigate();
  const C = {
    canvas: brand.backgroundColor,
    panel: "rgba(255,255,255,0.035)",
    raised: "rgba(255,255,255,0.06)",
    hair: "rgba(233,237,233,0.12)",
    hairSoft: "rgba(233,237,233,0.07)",
    text: brand.primaryColor,
    muted: brand.neutralColor,
    accent: brand.accentColor,
    danger: "#cf8f7c",
  };
  const R = brand.radius;

  const [employees, setEmployees] = React.useState(EMPLOYEES);
  const [audit, setAudit] = React.useState(AUDIT);
  const [tab, setTab] = React.useState("employees");
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [showInactive, setShowInactive] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState("u-06");
  const [mode, setMode] = React.useState("detail");
  const [draft, setDraft] = React.useState(() => toDraft(EMPLOYEES.find((e) => e.id === "u-06")));
  const [newEmp, setNewEmp] = React.useState({ name: "", email: "", role: "employee", manager_id: "u-02" });
  const [errors, setErrors] = React.useState({});
  const [flash, setFlash] = React.useState(null);
  const [confirmKind, setConfirmKind] = React.useState(null);
  const [approved, setApproved] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [exportReady, setExportReady] = React.useState(null);
  const [listState, setListState] = React.useState("ready");
  const [synced, setSynced] = React.useState("09:41");
  const [auditStale, setAuditStale] = React.useState(true);
  const [auditFilter, setAuditFilter] = React.useState("all");
  const [auditRef, setAuditRef] = React.useState(null);
  const [previewRole, setPreviewRole] = React.useState("hr_admin");
  const [accessRequested, setAccessRequested] = React.useState(false);
  const [savingId, setSavingId] = React.useState(null);
  const [enteredId, setEnteredId] = React.useState(null);

  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);
  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const nameOf = (id) => {
    const m = employees.find((e) => e.id === id);
    return m ? m.name : null;
  };

  const selected = employees.find((e) => e.id === selectedId) || null;

  const visible = employees.filter((e) => {
    if (!showInactive && !e.is_active) return false;
    if (roleFilter !== "all" && e.role !== roleFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      e.name.toLowerCase().indexOf(q) > -1 ||
      (e.email || "").toLowerCase().indexOf(q) > -1 ||
      e.ref.toLowerCase().indexOf(q) > -1
    );
  });

  const activeCount = employees.filter((e) => e.is_active).length;
  const inactiveCount = employees.filter((e) => !e.is_active).length;
  const noManager = employees.filter((e) => e.is_active && !e.manager_id);

  const auditRows = audit.filter((a) => {
    const f = AUDIT_FILTERS.find((x) => x.key === auditFilter) || AUDIT_FILTERS[0];
    if (!f.match(a)) return false;
    if (auditRef && a.entity_ref !== auditRef) return false;
    return true;
  });

  const nowStamp = () => {
    const d = new Date();
    const pad = (n) => (n < 10 ? "0" + n : "" + n);
    return "2026-11-05 " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  };

  const pushAudit = (entry) =>
    setAudit((prev) => [{ id: "a-" + Math.random().toString(36).slice(2, 8), at: nowStamp(), actor: "Priya Raghunathan", ...entry }, ...prev]);

  const selectEmployee = (id) => {
    setSelectedId(id);
    setMode("detail");
    setDraft(toDraft(employees.find((e) => e.id === id)));
    setErrors({});
    setConfirmKind(null);
    setApproved(false);
    setExportReady(null);
    setExporting(false);
  };

  const refreshList = () => {
    setListState("loading");
    later(() => {
      setListState("ready");
      setSynced("just now");
      setAuditStale(false);
    }, 850);
  };

  /* ---------- create ---------- */
  const submitCreate = (e) => {
    e.preventDefault();
    const next = {};
    if (!newEmp.name.trim()) next.name = "A full name is required — it appears on every goal and praise note.";
    if (!newEmp.email.trim()) next.email = "A work email is required; it is how this person signs in.";
    else if (newEmp.email.indexOf("@") < 1) next.email = "That does not look like an email address.";
    else if (employees.some((u) => (u.email || "").toLowerCase() === newEmp.email.trim().toLowerCase()))
      next.email = "That email already belongs to " + employees.find((u) => (u.email || "").toLowerCase() === newEmp.email.trim().toLowerCase()).name + ". Work emails must be unique.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const id = "u-" + Math.random().toString(36).slice(2, 7);
    const ref = "EMP-0" + (290 + employees.length);
    const rec = {
      id,
      ref,
      name: newEmp.name.trim(),
      email: newEmp.email.trim(),
      role: newEmp.role,
      manager_id: newEmp.manager_id || null,
      is_active: true,
      anonymised_at: null,
      created_at: "2026-11-05",
      updated_at: "2026-11-05",
      last_actor: "Priya Raghunathan",
    };
    setEmployees((prev) => [rec, ...prev]);
    pushAudit({ entity_ref: ref, entity_name: rec.name, action: "employee.create", changes: "Record created as " + ROLE_LABEL[rec.role] + ", " + rec.email });
    if (rec.manager_id)
      pushAudit({ entity_ref: ref, entity_name: rec.name, action: "manager.set", changes: "manager_id — none → " + nameOf(rec.manager_id) });
    setNewEmp({ name: "", email: "", role: "employee", manager_id: "u-02" });
    setEnteredId(id);
    setFlash({ tone: "success", text: rec.name + " now has a record (" + ref + "). Goals can be assigned from My team." });
    selectEmployee(id);
    setSelectedId(id);
    setDraft(toDraft(rec));
    setMode("detail");
  };

  /* ---------- edit ---------- */
  const submitEdit = (e) => {
    e.preventDefault();
    if (!selected) return;
    const next = {};
    if (!draft.name.trim()) next.name = "A full name is required.";
    if (!draft.email.trim()) next.email = "A work email is required.";
    else if (employees.some((u) => u.id !== selected.id && (u.email || "").toLowerCase() === draft.email.trim().toLowerCase()))
      next.email = "That email already belongs to " + employees.find((u) => u.id !== selected.id && (u.email || "").toLowerCase() === draft.email.trim().toLowerCase()).name + ".";
    const mgr = draft.manager_id || null;
    if (wouldCycle(employees, selected.id, mgr))
      next.manager_id = mgr === selected.id
        ? "Nobody can report to themselves."
        : nameOf(mgr) + " already sits under " + selected.name + ". Reporting lines cannot loop.";
    setErrors(next);
    if (Object.keys(next).length) {
      setFlash({ tone: "error", text: "Nothing was saved — your edits are still here. Fix the highlighted field and save again." });
      return;
    }

    setSavingId(selected.id);
    later(() => {
      const before = selected;
      setEmployees((prev) =>
        prev.map((u) =>
          u.id === before.id
            ? { ...u, name: draft.name.trim(), email: draft.email.trim(), role: draft.role, manager_id: mgr, updated_at: "2026-11-05", last_actor: "Priya Raghunathan" }
            : u
        )
      );
      const changes = [];
      if (before.name !== draft.name.trim()) changes.push("name — " + before.name + " → " + draft.name.trim());
      if ((before.email || "") !== draft.email.trim()) changes.push("email — " + (before.email || "none") + " → " + draft.email.trim());
      if (before.role !== draft.role) changes.push("role — " + ROLE_LABEL[before.role] + " → " + ROLE_LABEL[draft.role]);
      if ((before.manager_id || null) !== mgr)
        pushAudit({
          entity_ref: before.ref,
          entity_name: draft.name.trim(),
          action: before.manager_id ? "manager.reassign" : "manager.set",
          changes: "manager_id — " + (nameOf(before.manager_id) || "none") + " → " + (nameOf(mgr) || "none"),
        });
      if (changes.length) pushAudit({ entity_ref: before.ref, entity_name: draft.name.trim(), action: "employee.update", changes: changes.join("; ") });
      setSavingId(null);
      setFlash({
        tone: "success",
        text:
          changes.length || (before.manager_id || null) !== mgr
            ? draft.name.trim() + " saved. The change is in the audit trail."
            : "No changes to save for " + draft.name.trim() + ".",
      });
    }, 550);
  };

  const doDeactivate = () => {
    const u = selected;
    setEmployees((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: !x.is_active, updated_at: "2026-11-05", last_actor: "Priya Raghunathan" } : x)));
    pushAudit({
      entity_ref: u.ref,
      entity_name: u.name,
      action: u.is_active ? "employee.deactivate" : "employee.reactivate",
      changes: "is_active — " + u.is_active + " → " + !u.is_active,
    });
    setFlash({
      tone: "success",
      text: u.is_active
        ? u.name + " can no longer sign in. Their goals and praise stay in reporting."
        : u.name + " can sign in again from their work email.",
    });
    setConfirmKind(null);
  };

  const doExport = () => {
    setExporting(true);
    later(() => {
      setExporting(false);
      setExportReady({ file: selected.ref.toLowerCase() + "-personal-data.json", size: "38 KB" });
      pushAudit({ entity_ref: selected.ref, entity_name: selected.name, action: "data.export", changes: "Personal + performance export generated" });
    }, 1100);
  };

  const doDelete = () => {
    if (!approved) {
      setErrors({ approve: "Tick the approval box first — deletions need an approved request on file." });
      return;
    }
    const u = selected;
    setEmployees((prev) =>
      prev.map((x) =>
        x.id === u.id ? { ...x, name: "Anonymised employee", email: null, manager_id: null, is_active: false, anonymised_at: "2026-11-05", updated_at: "2026-11-05", last_actor: "Priya Raghunathan" } : x
      )
    );
    pushAudit({ entity_ref: u.ref, entity_name: "Anonymised employee", action: "personal_data.delete", changes: "Identifying fields anonymised under approved request DPR-2026-0052" });
    setDraft({ name: "Anonymised employee", email: "", role: u.role, manager_id: "" });
    setConfirmKind(null);
    setApproved(false);
    setErrors({});
    setFlash({ tone: "success", text: u.ref + " is anonymised. Goals and praise remain, attributed to the reference only." });
  };

  /* ---------- shared styling ---------- */
  const panelStyle = { backgroundColor: C.panel, border: "1px solid " + C.hair, borderRadius: R };
  const labelCls = "block text-[11px] uppercase tracking-[0.16em] mb-2";
  const fieldStyle = {
    backgroundColor: "rgba(0,0,0,0.22)",
    border: "1px solid " + C.hair,
    borderRadius: R,
    color: C.text,
  };
  const primaryBtn = { backgroundColor: C.accent, color: C.canvas, borderRadius: R, border: "1px solid " + C.accent, fontWeight: 600 };
  const quietBtn = { backgroundColor: "transparent", color: C.text, borderRadius: R, border: "1px solid " + C.hair };
  const dangerBtn = { backgroundColor: "transparent", color: C.danger, borderRadius: R, border: "1px solid rgba(207,143,124,0.45)" };

  const StatusTag = ({ emp }) => {
    if (emp.anonymised_at)
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-[3px] text-[11px] tracking-wide" style={{ border: "1px solid rgba(207,143,124,0.4)", color: C.danger, borderRadius: 999 }}>
          <AlertCircle className="h-3 w-3" aria-hidden="true" /> Anonymised
        </span>
      );
    if (emp.is_active)
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-[3px] text-[11px] tracking-wide" style={{ border: "1px solid rgba(143,174,139,0.4)", color: C.accent, backgroundColor: "rgba(143,174,139,0.1)", borderRadius: 999 }}>
          <Check className="h-3 w-3" aria-hidden="true" /> Active
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-[3px] text-[11px] tracking-wide" style={{ border: "1px solid " + C.hair, color: C.muted, borderRadius: 999 }}>
        <X className="h-3 w-3" aria-hidden="true" /> Deactivated
      </span>
    );
  };

  const managerChoices = (excludeId) =>
    employees
      .filter((u) => u.is_active && !u.anonymised_at && u.id !== excludeId)
      .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="pms-root min-h-full px-6 py-8 lg:px-10" style={{ backgroundColor: C.canvas, color: C.text, fontFamily: brand.fontBody }}>
      <style>{`
        .pms-root :focus-visible { outline: 2px solid ${C.accent}; outline-offset: 2px; }
        .pms-root table { font-variant-numeric: tabular-nums; }
        .pms-num { font-variant-numeric: tabular-nums; }
        .pms-row:hover { background-color: rgba(255,255,255,0.045); }
        @keyframes pmsIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
        @keyframes pmsPanel { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .pms-in { animation: pmsIn .32s cubic-bezier(.2,.7,.3,1) both; }
        .pms-panel { animation: pmsPanel .26s cubic-bezier(.2,.7,.3,1) both; }
        .pms-fade { transition: background-color .18s ease, border-color .18s ease, opacity .18s ease, color .18s ease; }
        @media (prefers-reduced-motion: reduce) {
          .pms-in, .pms-panel, .animate-pulse { animation: none !important; }
          .pms-fade { transition: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1280px]">
        {/* ---------------- header ---------------- */}
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[62ch]">
            <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.muted }}>
              Northgate · People operations
            </p>
            <h1 className="mt-3 text-[36px] leading-[1.15]" style={{ fontFamily: brand.fontHeading, letterSpacing: "-0.01em" }}>
              People admin
            </h1>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
              The register of everyone at Northgate, who they report to, and every data-protection action taken on their record.
              Each change here is written to the audit trail the moment you save it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 pms-num text-[12px]" style={{ border: "1px solid " + C.hairSoft, borderRadius: R, color: C.muted }}>
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{listState === "loading" ? "Pulling records…" : "Synced " + synced}</span>
              <button
                type="button"
                onClick={refreshList}
                className="ml-1 px-2 py-1 pms-fade hover:opacity-70"
                style={{ color: C.accent, borderRadius: 4 }}
                aria-label="Refresh employee records"
              >
                Refresh
              </button>
            </div>
            <Button
              type="button"
              onClick={() => {
                setMode("create");
                setErrors({});
                setFlash(null);
              }}
              className="px-4 py-2.5 text-sm pms-fade hover:opacity-90"
              style={primaryBtn}
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" /> Add employee
              </span>
            </Button>
          </div>
        </header>

        <div className="mt-6 h-px w-full" style={{ backgroundColor: C.hair }} />

        {/* ---------------- flash ---------------- */}
        {flash ? (
          <div
            className="pms-in mt-6 flex items-start justify-between gap-4 px-4 py-3"
            style={{
              borderRadius: R,
              border: "1px solid " + (flash.tone === "error" ? "rgba(207,143,124,0.4)" : "rgba(143,174,139,0.4)"),
              backgroundColor: flash.tone === "error" ? "rgba(207,143,124,0.08)" : "rgba(143,174,139,0.08)",
            }}
            role="status"
          >
            <span className="flex items-start gap-3 text-sm" style={{ color: flash.tone === "error" ? C.danger : C.text }}>
              {flash.tone === "error" ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.accent }} aria-hidden="true" />}
              {flash.text}
            </span>
            <button type="button" onClick={() => setFlash(null)} aria-label="Dismiss message" className="p-1 pms-fade hover:opacity-70" style={{ color: C.muted, borderRadius: 4 }}>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        {/* ---------------- figures ---------------- */}
        <section aria-label="Register summary" className="mt-6 grid grid-cols-1 gap-px sm:grid-cols-3" style={{ backgroundColor: C.hairSoft, border: "1px solid " + C.hair, borderRadius: R, overflow: "hidden" }}>
          <div className="px-5 py-4" style={{ backgroundColor: C.canvas }}>
            <Stat label="Active records" value={String(activeCount)} hint="Can sign in today" />
          </div>
          <div className="px-5 py-4" style={{ backgroundColor: C.canvas }}>
            <Stat label="Deactivated" value={String(inactiveCount)} hint="Goals and praise retained for reporting" />
          </div>
          <div className="px-5 py-4" style={{ backgroundColor: C.canvas }}>
            <Stat
              label="No reporting line"
              value={String(noManager.length)}
              hint={noManager.length ? noManager.map((u) => u.name).join(", ") : "Every active person has a manager"}
            />
          </div>
        </section>

        {/* ---------------- access check ---------------- */}
        <section
          aria-label="Role access check"
          className="mt-6 flex flex-wrap items-center justify-between gap-4 px-5 py-3"
          style={{ ...panelStyle }}
        >
          <p className="text-sm" style={{ color: C.muted }}>
            <span className="mr-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: C.accent }}>
              Access check
            </span>
            You are signed in as <span style={{ color: C.text }}>Priya Raghunathan, HR admin</span> — every record is yours to manage.
          </p>
          <div className="flex items-center gap-3">
            <Label htmlFor="preview-role" className="text-[11px] uppercase tracking-[0.16em] whitespace-nowrap" style={{ color: C.muted }}>
              Preview as
            </Label>
            <Select
              id="preview-role"
              value={previewRole}
              onChange={(e) => {
                setPreviewRole(e.target.value);
                setAccessRequested(false);
              }}
              className="px-3 py-2 text-sm"
              style={fieldStyle}
            >
              <option value="hr_admin">HR admin (your role)</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="executive">Executive</option>
            </Select>
          </div>
        </section>

        {previewRole !== "hr_admin" ? (
          /* ---------------- permission denied ---------------- */
          <section className="pms-panel mt-6 px-6 py-10 sm:px-10" style={panelStyle} aria-labelledby="denied-title">
            <div className="mx-auto max-w-[62ch]">
              <div className="h-px w-16" style={{ backgroundColor: C.accent }} />
              <h2 id="denied-title" className="mt-5 text-[24px]" style={{ fontFamily: brand.fontHeading }}>
                {ACCESS_COPY[previewRole].title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.muted }}>
                {ACCESS_COPY[previewRole].body}
              </p>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: C.muted }}>
                People admin is granted by an HR admin. Yours are <span style={{ color: C.text }}>Priya Raghunathan</span> and{" "}
                <span style={{ color: C.text }}>Greta Hollins</span>.
              </p>

              {accessRequested ? (
                <p className="pms-in mt-6 inline-flex items-center gap-2 px-4 py-3 text-sm" style={{ borderRadius: R, border: "1px solid rgba(143,174,139,0.4)", backgroundColor: "rgba(143,174,139,0.08)" }}>
                  <CheckCircle className="h-4 w-4" style={{ color: C.accent }} aria-hidden="true" />
                  Request sent to Greta Hollins on 5 Nov 2026. It is waiting in her notifications.
                </p>
              ) : (
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button type="button" onClick={() => setAccessRequested(true)} className="px-4 py-2.5 text-sm pms-fade hover:opacity-90" style={primaryBtn}>
                    Request HR admin access
                  </Button>
                  <Button type="button" onClick={() => setPreviewRole("hr_admin")} className="px-4 py-2.5 text-sm pms-fade hover:opacity-80" style={quietBtn}>
                    Back to your own access
                  </Button>
                </div>
              )}

              <div className="mt-8 h-px w-full" style={{ backgroundColor: C.hairSoft }} />
              <p className="mt-5 text-[11px] uppercase tracking-[0.16em]" style={{ color: C.muted }}>
                Open to this role instead
              </p>
              <ul className="mt-3 flex flex-wrap gap-3">
                <li>
                  <button type="button" onClick={() => navigate("dashboard")} className="px-3 py-2 text-sm pms-fade hover:opacity-80" style={quietBtn}>
                    My goals dashboard
                  </button>
                </li>
                {previewRole === "manager" ? (
                  <li>
                    <button type="button" onClick={() => navigate("team")} className="px-3 py-2 text-sm pms-fade hover:opacity-80" style={quietBtn}>
                      My team
                    </button>
                  </li>
                ) : null}
                <li>
                  <button type="button" onClick={() => navigate("praise")} className="px-3 py-2 text-sm pms-fade hover:opacity-80" style={quietBtn}>
                    Praise
                  </button>
                </li>
              </ul>
            </div>
          </section>
        ) : (
          <>
            <div className="mt-8">
              <Tabs
                tabs={[
                  { key: "employees", label: "Employee records" },
                  { key: "audit", label: "Audit trail" },
                ]}
                active={tab}
                onChange={setTab}
              />
            </div>

            {tab === "employees" ? (
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_392px]">
                {/* ---------------- ledger ---------------- */}
                <section aria-label="Employee register">
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="min-w-[220px] flex-1">
                      <Label htmlFor="emp-search" className={labelCls} style={{ color: C.muted }}>
                        Find a person
                      </Label>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: C.muted }} aria-hidden="true" />
                        <Input
                          id="emp-search"
                          type="search"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Name, work email or EMP reference"
                          className="w-full py-2.5 pl-9 pr-3 text-sm"
                          style={fieldStyle}
                        />
                      </div>
                    </div>
                    <div className="w-[180px]">
                      <Label htmlFor="role-filter" className={labelCls} style={{ color: C.muted }}>
                        Role
                      </Label>
                      <Select id="role-filter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full py-2.5 px-3 text-sm" style={fieldStyle}>
                        <option value="all">All roles</option>
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r.key} value={r.key}>
                            {r.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex items-center gap-3 pb-2.5">
                      <Switch
                        checked={showInactive}
                        onChange={(v) => setShowInactive(typeof v === "boolean" ? v : !!(v && v.target && v.target.checked))}
                      />
                      <span className="text-sm" style={{ color: C.muted }}>
                        Include deactivated
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 pms-num text-[12px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>
                    {visible.length} of {employees.length} records
                  </p>

                  <div className="mt-3 overflow-x-auto" style={panelStyle}>
                    {listState === "loading" ? (
                      <div className="px-5 py-6" aria-live="polite">
                        <p className="text-sm" style={{ color: C.muted }}>
                          Pulling the register from the people service…
                        </p>
                        <ul className="mt-5 space-y-4">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <li key={i} className="flex items-center gap-4 animate-pulse">
                              <span className="h-8 w-8 rounded-full" style={{ backgroundColor: C.raised }} />
                              <span className="h-3 flex-1 rounded" style={{ backgroundColor: C.raised }} />
                              <span className="h-3 w-24 rounded" style={{ backgroundColor: C.hairSoft }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : visible.length === 0 ? (
                      <div className="px-6 py-10">
                        <Empty
                          title={query.trim() ? "Nobody matches “" + query.trim() + "”" : "No records match these filters"}
                          description={
                            query.trim()
                              ? "Check the spelling, or search by EMP reference instead. Deactivated people are hidden when the toggle is off."
                              : "Change the role filter or switch deactivated people back on to widen the register."
                          }
                          action={
                            <Button
                              type="button"
                              onClick={() => {
                                setQuery("");
                                setRoleFilter("all");
                                setShowInactive(true);
                              }}
                              className="px-4 py-2.5 text-sm pms-fade hover:opacity-80"
                              style={quietBtn}
                            >
                              Clear filters
                            </Button>
                          }
                        />
                      </div>
                    ) : (
                      <Table className="w-full text-sm">
                        <THead>
                          <TR style={{ borderBottom: "1px solid " + C.hair }}>
                            <TH className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                              Ref
                            </TH>
                            <TH className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                              Person
                            </TH>
                            <TH className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                              Role
                            </TH>
                            <TH className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                              Reports to
                            </TH>
                            <TH className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                              Status
                            </TH>
                          </TR>
                        </THead>
                        <TBody>
                          {visible.map((e) => {
                            const isSel = e.id === selectedId && mode === "detail";
                            return (
                              <TR
                                key={e.id}
                                className={"pms-row pms-fade " + (e.id === enteredId ? "pms-in" : "")}
                                style={{
                                  borderBottom: "1px solid " + C.hairSoft,
                                  backgroundColor: isSel ? "rgba(143,174,139,0.09)" : "transparent",
                                }}
                              >
                                <TD className="px-5 py-3 pms-num text-[12px] align-middle" style={{ color: C.accent, letterSpacing: "0.04em" }}>
                                  {e.ref}
                                </TD>
                                <TD className="px-3 py-3 align-middle">
                                  <button
                                    type="button"
                                    onClick={() => selectEmployee(e.id)}
                                    aria-pressed={isSel}
                                    className="flex w-full items-center gap-3 text-left pms-fade hover:opacity-85"
                                    style={{ borderRadius: 4 }}
                                  >
                                    <Avatar name={e.name} className="h-8 w-8 shrink-0" />
                                    <span className="min-w-0">
                                      <span className="block truncate" style={{ color: C.text }}>
                                        {e.name}
                                      </span>
                                      <span className="block truncate text-[12px]" style={{ color: C.muted }}>
                                        {e.email || "personal data removed"}
                                      </span>
                                    </span>
                                  </button>
                                </TD>
                                <TD className="px-3 py-3 align-middle text-[13px]" style={{ color: C.muted }}>
                                  {ROLE_LABEL[e.role]}
                                </TD>
                                <TD className="px-3 py-3 align-middle text-[13px]" style={{ color: nameOf(e.manager_id) ? C.text : C.muted }}>
                                  {nameOf(e.manager_id) || "— none —"}
                                </TD>
                                <TD className="px-5 py-3 align-middle">
                                  <StatusTag emp={e} />
                                </TD>
                              </TR>
                            );
                          })}
                        </TBody>
                      </Table>
                    )}
                  </div>
                </section>

                {/* ---------------- side panel ---------------- */}
                <aside className="lg:sticky lg:top-6 self-start w-full">
                  {mode === "create" ? (
                    <Card className="pms-panel overflow-hidden" style={panelStyle}>
                      <div className="h-px w-full" style={{ backgroundColor: C.accent }} />
                      <CardHeader className="px-6 pt-6">
                        <CardTitle className="text-[22px]" style={{ fontFamily: brand.fontHeading, color: C.text }}>
                          New employee record
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
                          Created by hand — Northgate has no HRIS sync yet. The person can be given goals as soon as this is saved.
                        </CardDescription>
                      </CardHeader>
                      <form onSubmit={submitCreate} noValidate>
                        <CardContent className="space-y-5 px-6 pb-2 pt-5">
                          <div>
                            <Label htmlFor="new-name" className={labelCls} style={{ color: C.muted }}>
                              Full name
                            </Label>
                            <Input
                              id="new-name"
                              value={newEmp.name}
                              onChange={(ev) => setNewEmp({ ...newEmp, name: ev.target.value })}
                              aria-invalid={!!errors.name}
                              aria-describedby={errors.name ? "new-name-err" : undefined}
                              className="w-full px-3 py-2.5 text-sm"
                              style={{ ...fieldStyle, borderColor: errors.name ? C.danger : C.hair }}
                            />
                            {errors.name ? (
                              <p id="new-name-err" className="pms-in mt-2 flex items-start gap-2 text-[12px]" style={{ color: C.danger }}>
                                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                {errors.name}
                              </p>
                            ) : null}
                          </div>
                          <div>
                            <Label htmlFor="new-email" className={labelCls} style={{ color: C.muted }}>
                              Work email
                            </Label>
                            <Input
                              id="new-email"
                              type="email"
                              value={newEmp.email}
                              onChange={(ev) => setNewEmp({ ...newEmp, email: ev.target.value })}
                              aria-invalid={!!errors.email}
                              aria-describedby={errors.email ? "new-email-err" : undefined}
                              className="w-full px-3 py-2.5 text-sm"
                              style={{ ...fieldStyle, borderColor: errors.email ? C.danger : C.hair }}
                            />
                            {errors.email ? (
                              <p id="new-email-err" className="pms-in mt-2 flex items-start gap-2 text-[12px]" style={{ color: C.danger }}>
                                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                {errors.email}
                              </p>
                            ) : null}
                          </div>
                          <div>
                            <Label htmlFor="new-role" className={labelCls} style={{ color: C.muted }}>
                              Role
                            </Label>
                            <Select id="new-role" value={newEmp.role} onChange={(ev) => setNewEmp({ ...newEmp, role: ev.target.value })} className="w-full px-3 py-2.5 text-sm" style={fieldStyle}>
                              {ROLE_OPTIONS.map((r) => (
                                <option key={r.key} value={r.key}>
                                  {r.label}
                                </option>
                              ))}
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="new-manager" className={labelCls} style={{ color: C.muted }}>
                              Reports to
                            </Label>
                            <Select id="new-manager" value={newEmp.manager_id} onChange={(ev) => setNewEmp({ ...newEmp, manager_id: ev.target.value })} className="w-full px-3 py-2.5 text-sm" style={fieldStyle}>
                              <option value="">No manager yet</option>
                              {managerChoices(null).map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name} · {ROLE_LABEL[m.role]}
                                </option>
                              ))}
                            </Select>
                            <p className="mt-2 text-[12px] leading-relaxed" style={{ color: C.muted }}>
                              The manager gains access to this person's goals as soon as the line is set.
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-3 px-6 pb-6 pt-5">
                          <Button type="submit" className="px-4 py-2.5 text-sm pms-fade hover:opacity-90" style={primaryBtn}>
                            Save employee record
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setMode("detail");
                              setErrors({});
                            }}
                            className="px-4 py-2.5 text-sm pms-fade hover:opacity-80"
                            style={quietBtn}
                          >
                            Cancel
                          </Button>
                        </CardFooter>
                      </form>
                    </Card>
                  ) : selected ? (
                    <Card key={selected.id} className="pms-panel overflow-hidden" style={panelStyle}>
                      <div className="h-px w-full" style={{ backgroundColor: C.accent }} />
                      <CardHeader className="px-6 pt-6">
                        <p className="pms-num text-[12px]" style={{ color: C.accent, letterSpacing: "0.08em" }}>
                          {selected.ref}
                        </p>
                        <CardTitle className="mt-2 text-[22px]" style={{ fontFamily: brand.fontHeading, color: C.text }}>
                          {selected.name}
                        </CardTitle>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusTag emp={selected} />
                          <Badge className="px-2 py-[3px] text-[11px] tracking-wide" style={{ border: "1px solid " + C.hair, color: C.muted, backgroundColor: "transparent", borderRadius: 999 }}>
                            {ROLE_LABEL[selected.role]}
                          </Badge>
                        </div>
                      </CardHeader>

                      {selected.anonymised_at ? (
                        <CardContent className="px-6 pb-6 pt-5">
                          <p className="px-4 py-3 text-sm leading-relaxed" style={{ borderRadius: R, border: "1px solid rgba(207,143,124,0.35)", color: C.muted }}>
                            Personal data was deleted on {fmtDate(selected.anonymised_at)} under approved request DPR-2026-0041. The goals and praise
                            attached to {selected.ref} remain for reporting; name, email and reporting line cannot be restored.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setTab("audit");
                              setAuditRef(selected.ref);
                              setAuditFilter("all");
                            }}
                            className="mt-5 inline-flex items-center gap-1.5 text-sm pms-fade hover:opacity-80"
                            style={{ color: C.accent, borderRadius: 4 }}
                          >
                            See the audit entries for {selected.ref}
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </CardContent>
                      ) : (
                        <form onSubmit={submitEdit} noValidate>
                          <CardContent className="space-y-5 px-6 pb-2 pt-5">
                            <div>
                              <Label htmlFor="edit-name" className={labelCls} style={{ color: C.muted }}>
                                Full name
                              </Label>
                              <Input
                                id="edit-name"
                                value={draft.name}
                                onChange={(ev) => setDraft({ ...draft, name: ev.target.value })}
                                aria-invalid={!!errors.name}
                                aria-describedby={errors.name ? "edit-name-err" : undefined}
                                className="w-full px-3 py-2.5 text-sm"
                                style={{ ...fieldStyle, borderColor: errors.name ? C.danger : C.hair }}
                              />
                              {errors.name ? (
                                <p id="edit-name-err" className="pms-in mt-2 text-[12px]" style={{ color: C.danger }}>
                                  {errors.name}
                                </p>
                              ) : null}
                            </div>
                            <div>
                              <Label htmlFor="edit-email" className={labelCls} style={{ color: C.muted }}>
                                Work email
                              </Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={draft.email}
                                onChange={(ev) => setDraft({ ...draft, email: ev.target.value })}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "edit-email-err" : undefined}
                                className="w-full px-3 py-2.5 text-sm"
                                style={{ ...fieldStyle, borderColor: errors.email ? C.danger : C.hair }}
                              />
                              {errors.email ? (
                                <p id="edit-email-err" className="pms-in mt-2 flex items-start gap-2 text-[12px]" style={{ color: C.danger }}>
                                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                  {errors.email}
                                </p>
                              ) : null}
                            </div>
                            <div>
                              <Label htmlFor="edit-role" className={labelCls} style={{ color: C.muted }}>
                                Role
                              </Label>
                              <Select id="edit-role" value={draft.role} onChange={(ev) => setDraft({ ...draft, role: ev.target.value })} className="w-full px-3 py-2.5 text-sm" style={fieldStyle}>
                                {ROLE_OPTIONS.map((r) => (
                                  <option key={r.key} value={r.key}>
                                    {r.label}
                                  </option>
                                ))}
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-manager" className={labelCls} style={{ color: C.muted }}>
                                Reports to
                              </Label>
                              <Select
                                id="edit-manager"
                                value={draft.manager_id}
                                onChange={(ev) => {
                                  setDraft({ ...draft, manager_id: ev.target.value });
                                  setErrors({ ...errors, manager_id: null });
                                }}
                                aria-invalid={!!errors.manager_id}
                                aria-describedby={errors.manager_id ? "edit-manager-err" : undefined}
                                className="w-full px-3 py-2.5 text-sm"
                                style={{ ...fieldStyle, borderColor: errors.manager_id ? C.danger : C.hair }}
                              >
                                <option value="">No manager</option>
                                {managerChoices(selected.id).map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} · {ROLE_LABEL[m.role]}
                                  </option>
                                ))}
                              </Select>
                              {errors.manager_id ? (
                                <p id="edit-manager-err" className="pms-in mt-2 flex items-start gap-2 text-[12px]" style={{ color: C.danger }}>
                                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                  {errors.manager_id}
                                </p>
                              ) : (
                                <p className="mt-2 text-[12px] leading-relaxed" style={{ color: C.muted }}>
                                  Reassigning removes the previous manager's access to this person's goals.
                                </p>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-wrap items-center gap-3 px-6 pb-5 pt-5">
                            <Button type="submit" disabled={savingId === selected.id} className="px-4 py-2.5 text-sm pms-fade hover:opacity-90 disabled:opacity-60" style={primaryBtn}>
                              {savingId === selected.id ? "Saving…" : "Save changes"}
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                setDraft(toDraft(selected));
                                setErrors({});
                              }}
                              className="px-4 py-2.5 text-sm pms-fade hover:opacity-80"
                              style={quietBtn}
                            >
                              Discard edits
                            </Button>
                          </CardFooter>
                        </form>
                      )}

                      <div className="px-6">
                        <Separator />
                      </div>

                      {/* data protection */}
                      <CardContent className="px-6 pb-6 pt-5">
                        <h3 className="text-[11px] uppercase tracking-[0.16em]" style={{ color: C.muted }}>
                          Data protection
                        </h3>

                        <div className="mt-4 space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <Button type="button" onClick={doExport} disabled={exporting} className="px-3.5 py-2 text-sm pms-fade hover:opacity-80 disabled:opacity-60" style={quietBtn}>
                              <span className="inline-flex items-center gap-2">
                                <Download className="h-4 w-4" aria-hidden="true" />
                                {exporting ? "Preparing export…" : "Export this person's data"}
                              </span>
                            </Button>
                            {!selected.anonymised_at ? (
                              <Button
                                type="button"
                                onClick={() => {
                                  setConfirmKind(confirmKind === "deactivate" ? null : "deactivate");
                                  setErrors({});
                                }}
                                className="px-3.5 py-2 text-sm pms-fade hover:opacity-80"
                                style={quietBtn}
                              >
                                {selected.is_active ? "Deactivate account" : "Reactivate account"}
                              </Button>
                            ) : null}
                          </div>

                          {exportReady ? (
                            <p className="pms-in flex items-center gap-2 px-3.5 py-2.5 pms-num text-[13px]" style={{ borderRadius: R, border: "1px solid rgba(143,174,139,0.35)", color: C.text }}>
                              <CheckCircle className="h-4 w-4 shrink-0" style={{ color: C.accent }} aria-hidden="true" />
                              {exportReady.file} · {exportReady.size} · ready to download
                            </p>
                          ) : null}

                          {confirmKind === "deactivate" ? (
                            <div className="pms-in px-4 py-4" style={{ borderRadius: R, border: "1px solid " + C.hair, backgroundColor: "rgba(0,0,0,0.2)" }}>
                              <p className="text-sm leading-relaxed" style={{ color: C.text }}>
                                {selected.is_active
                                  ? "Deactivate " + selected.name + "? Sign-in stops immediately. Their goals, check-ins and praise stay in reporting."
                                  : "Reactivate " + selected.name + "? They will be able to sign in with their work email again."}
                              </p>
                              <div className="mt-4 flex gap-3">
                                <Button type="button" onClick={doDeactivate} className="px-3.5 py-2 text-sm pms-fade hover:opacity-80" style={selected.is_active ? dangerBtn : primaryBtn}>
                                  {selected.is_active ? "Yes, deactivate" : "Yes, reactivate"}
                                </Button>
                                <Button type="button" onClick={() => setConfirmKind(null)} className="px-3.5 py-2 text-sm pms-fade hover:opacity-80" style={quietBtn}>
                                  Keep as is
                                </Button>
                              </div>
                            </div>
                          ) : null}

                          {!selected.anonymised_at ? (
                            confirmKind === "delete" ? (
                              <div className="pms-in px-4 py-4" style={{ borderRadius: R, border: "1px solid rgba(207,143,124,0.4)", backgroundColor: "rgba(207,143,124,0.06)" }}>
                                <p className="text-sm leading-relaxed" style={{ color: C.text }}>
                                  Deleting personal data removes {selected.name}'s name, email and reporting line for good. Goals and praise stay,
                                  attributed to {selected.ref} only. This cannot be undone.
                                </p>
                                <div className="mt-4 flex items-start gap-3">
                                  <Checkbox
                                    id="dp-approved"
                                    checked={approved}
                                    onChange={(ev) => {
                                      setApproved(ev.target.checked);
                                      setErrors({});
                                    }}
                                    className="mt-0.5"
                                  />
                                  <Label htmlFor="dp-approved" className="text-[13px] leading-relaxed" style={{ color: C.muted }}>
                                    A deletion request for this person has been approved and logged.
                                  </Label>
                                </div>
                                {errors.approve ? (
                                  <p className="pms-in mt-3 flex items-start gap-2 text-[12px]" style={{ color: C.danger }}>
                                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                    {errors.approve}
                                  </p>
                                ) : null}
                                <div className="mt-4 flex gap-3">
                                  <Button type="button" onClick={doDelete} className="px-3.5 py-2 text-sm pms-fade hover:opacity-80" style={dangerBtn}>
                                    Anonymise this record
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setConfirmKind(null);
                                      setApproved(false);
                                      setErrors({});
                                    }}
                                    className="px-3.5 py-2 text-sm pms-fade hover:opacity-80"
                                    style={quietBtn}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmKind("delete")}
                                className="inline-flex items-center gap-2 px-1 py-1 text-[13px] pms-fade hover:opacity-80"
                                style={{ color: C.danger, borderRadius: 4 }}
                              >
                                <Trash className="h-3.5 w-3.5" aria-hidden="true" />
                                Delete personal data (approved request only)
                              </button>
                            )
                          ) : null}
                        </div>

                        <div className="mt-6 h-px w-full" style={{ backgroundColor: C.hairSoft }} />
                        <p className="mt-4 text-[12px] leading-relaxed pms-num" style={{ color: C.muted }}>
                          Record created {fmtDate(selected.created_at)} · last changed by {selected.last_actor} on {fmtDate(selected.updated_at)}
                        </p>
                        {!selected.anonymised_at ? (
                          <button
                            type="button"
                            onClick={() => {
                              setTab("audit");
                              setAuditRef(selected.ref);
                              setAuditFilter("all");
                            }}
                            className="mt-3 inline-flex items-center gap-1.5 text-sm pms-fade hover:opacity-80"
                            style={{ color: C.accent, borderRadius: 4 }}
                          >
                            See the audit entries for {selected.ref}
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        ) : null}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="pms-panel px-6 py-10" style={panelStyle}>
                      <Empty
                        title="No record open"
                        description="Choose someone from the register to edit their details, move their reporting line, or handle an export or deletion request."
                        action={
                          <Button type="button" onClick={() => setMode("create")} className="px-4 py-2.5 text-sm pms-fade hover:opacity-90" style={primaryBtn}>
                            Add employee
                          </Button>
                        }
                      />
                    </div>
                  )}
                </aside>
              </div>
            ) : (
              /* ---------------- audit trail ---------------- */
              <section aria-label="Audit trail" className="mt-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="max-w-[58ch]">
                    <h2 className="text-[24px]" style={{ fontFamily: brand.fontHeading }}>
                      Audit trail
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: C.muted }}>
                      Who changed what, and when. Entries are kept for seven years and cannot be edited or removed.
                    </p>
                  </div>
                  <div className="w-[240px]">
                    <Label htmlFor="audit-filter" className={labelCls} style={{ color: C.muted }}>
                      Action
                    </Label>
                    <Select id="audit-filter" value={auditFilter} onChange={(e) => setAuditFilter(e.target.value)} className="w-full px-3 py-2.5 text-sm" style={fieldStyle}>
                      {AUDIT_FILTERS.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {auditRef ? (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 pms-num text-[12px]" style={{ border: "1px solid rgba(143,174,139,0.4)", color: C.accent, borderRadius: 999 }}>
                      Filtered to {auditRef}
                      <button type="button" onClick={() => setAuditRef(null)} aria-label={"Clear filter on " + auditRef} className="pms-fade hover:opacity-70" style={{ borderRadius: 4 }}>
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  </div>
                ) : null}

                {auditStale ? (
                  <p className="mt-4 flex flex-wrap items-center gap-3 px-4 py-2.5 text-[13px]" style={{ borderRadius: R, border: "1px solid " + C.hairSoft, color: C.muted }}>
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Showing the copy cached at 09:41 this morning.
                    <button type="button" onClick={refreshList} className="pms-fade hover:opacity-80" style={{ color: C.accent, borderRadius: 4 }}>
                      Pull the latest entries
                    </button>
                  </p>
                ) : null}

                <div className="mt-4 overflow-x-auto" style={panelStyle}>
                  {auditRows.length === 0 ? (
                    <div className="px-6 py-10">
                      <Empty
                        title="No entries of that kind"
                        description="Nothing has been recorded against this filter yet. Try all actions, or clear the record filter to see the whole trail."
                        action={
                          <Button
                            type="button"
                            onClick={() => {
                              setAuditFilter("all");
                              setAuditRef(null);
                            }}
                            className="px-4 py-2.5 text-sm pms-fade hover:opacity-80"
                            style={quietBtn}
                          >
                            Show everything
                          </Button>
                        }
                      />
                    </div>
                  ) : (
                    <Table className="w-full text-sm">
                      <THead>
                        <TR style={{ borderBottom: "1px solid " + C.hair }}>
                          <TH className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                            When
                          </TH>
                          <TH className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                            Actor
                          </TH>
                          <TH className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                            Record
                          </TH>
                          <TH className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                            Action
                          </TH>
                          <TH className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-normal" style={{ color: C.muted }}>
                            Change
                          </TH>
                        </TR>
                      </THead>
                      <TBody>
                        {auditRows.map((a, i) => (
                          <TR key={a.id} className={"pms-row pms-fade " + (i === 0 && a.id.length > 6 ? "pms-in" : "")} style={{ borderBottom: "1px solid " + C.hairSoft }}>
                            <TD className="px-5 py-3 align-top pms-num text-[12px] whitespace-nowrap" style={{ color: C.muted }}>
                              {fmtStamp(a.at)}
                            </TD>
                            <TD className="px-3 py-3 align-top text-[13px]" style={{ color: C.text }}>
                              {a.actor}
                            </TD>
                            <TD className="px-3 py-3 align-top text-[13px]">
                              <span className="pms-num block" style={{ color: C.accent, letterSpacing: "0.04em" }}>
                                {a.entity_ref}
                              </span>
                              <span className="block text-[12px]" style={{ color: C.muted }}>
                                {a.entity_name}
                              </span>
                            </TD>
                            <TD className="px-3 py-3 align-top text-[12px] whitespace-nowrap" style={{ color: C.text, letterSpacing: "0.02em" }}>
                              {a.action}
                            </TD>
                            <TD className="px-5 py-3 align-top text-[13px] leading-relaxed" style={{ color: C.muted }}>
                              {a.changes}
                            </TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  )}
                </div>

                <p className="mt-4 pms-num text-[12px] uppercase tracking-[0.14em]" style={{ color: C.muted }}>
                  {auditRows.length} {auditRows.length === 1 ? "entry" : "entries"}
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
