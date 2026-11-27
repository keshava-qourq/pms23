// Hand-written: the generated design mockup rendered sample data only and
// never called the backend. This wires employee lookup, export, deletion
// and the audit trail to the real endpoints per AC-017, AC-018 and AC-019,
// and hides every action behind a single access-denied view the moment any
// of them comes back 403.
import * as React from "react";

import { apiFetch } from "@/lib/api";

interface EmployeeRecord {
  id: string;
  name: string;
  email: string | null;
  role: string;
  manager_id: string | null;
  is_active: boolean;
  anonymised_at: string | null;
  created_at: string;
}

interface ExportPayload {
  employee: EmployeeRecord;
  goals: unknown[];
  check_ins: unknown[];
  praise_received: unknown[];
  audit: unknown[];
}

interface AuditRow {
  id: string;
  actor_id: string | null;
  actor_name: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes: Record<string, unknown> | null;
  created_at: string;
}

type EmployeeState = "none" | "loading" | "loaded" | "error";
type AuditState = "none" | "loading" | "loaded" | "empty" | "error";

// apiFetch throws `Error("${method} ${path} failed: ${status}")` on a
// non-2xx response; this pulls the status back out so a 403, a 404 and
// everything else can be told apart without touching api.ts.
function statusFromError(err: unknown): string {
  const message = err instanceof Error ? err.message : "";
  const match = message.match(/(\d{3})\s*$/);
  return match ? match[1] : "";
}

function employeeStatusLabel(employee: EmployeeRecord): string {
  if (employee.anonymised_at) return "Anonymised";
  if (!employee.is_active) return "Deactivated";
  return "Active";
}

export default function Screen() {
  const [forbidden, setForbidden] = React.useState(false);

  const [employeeIdInput, setEmployeeIdInput] = React.useState("");
  const [employeeState, setEmployeeState] = React.useState<EmployeeState>("none");
  const [employeeData, setEmployeeData] = React.useState<ExportPayload | null>(null);
  const [employeeError, setEmployeeError] = React.useState<string | null>(null);

  const [exportStatus, setExportStatus] = React.useState<string | null>(null);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const [reason, setReason] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [auditEntity, setAuditEntity] = React.useState("");
  const [auditFrom, setAuditFrom] = React.useState("");
  const [auditTo, setAuditTo] = React.useState("");
  const [auditState, setAuditState] = React.useState<AuditState>("none");
  const [auditRows, setAuditRows] = React.useState<AuditRow[]>([]);

  const fetchEmployee = async (id: string): Promise<void> => {
    const data = await apiFetch<ExportPayload>(`/employees/${id}/export`);
    setEmployeeData(data);
    setEmployeeState("loaded");
  };

  const doLoad = async () => {
    const id = employeeIdInput.trim();
    if (!id) return;
    setEmployeeError(null);
    setExportError(null);
    setExportStatus(null);
    setEmployeeState("loading");
    try {
      await fetchEmployee(id);
    } catch (err) {
      const status = statusFromError(err);
      if (status === "403") {
        setForbidden(true);
        return;
      }
      setEmployeeState("error");
      setEmployeeError("Could not load that employee. Check the ID and try again.");
    }
  };

  const doExport = async () => {
    const id = employeeIdInput.trim();
    if (!id) return;
    setExportError(null);
    setExportStatus(null);
    try {
      const data = await apiFetch<ExportPayload>(`/employees/${id}/export`);
      const filename = `employee-${id}.json`;
      const dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data),
      )}`;
      const anchor = document.createElement("a");
      anchor.href = dataUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setExportStatus(filename);
    } catch (err) {
      const status = statusFromError(err);
      if (status === "403") {
        setForbidden(true);
        return;
      }
      if (status === "404") {
        setExportError("No employee found with that ID.");
      } else {
        setExportError("Something went wrong exporting this record. Try again.");
      }
    }
  };

  const submitDelete = async () => {
    setDeleteError(null);
    if (!confirmed) {
      setDeleteError("Please confirm this deletion before it can be submitted.");
      return;
    }
    if (!reason.trim()) {
      setDeleteError("Please type a reason before this record can be deleted.");
      return;
    }
    const id = employeeIdInput.trim();
    setDeleting(true);
    try {
      await apiFetch(`/employees/${id}/personal-data`, {
        method: "DELETE",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      setReason("");
      setConfirmed(false);
      await fetchEmployee(id);
    } catch (err) {
      const status = statusFromError(err);
      if (status === "403") {
        setForbidden(true);
        return;
      }
      setDeleteError("Something went wrong deleting this record. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const applyFilters = async () => {
    setAuditState("loading");
    const params = new URLSearchParams();
    if (auditEntity.trim()) params.set("entity", auditEntity.trim());
    if (auditFrom.trim()) params.set("from", auditFrom.trim());
    if (auditTo.trim()) params.set("to", auditTo.trim());
    const qs = params.toString();
    try {
      const rows = await apiFetch<AuditRow[]>(`/audit-log${qs ? `?${qs}` : "?"}`);
      if (rows.length === 0) {
        setAuditRows([]);
        setAuditState("empty");
      } else {
        setAuditRows(rows);
        setAuditState("loaded");
      }
    } catch (err) {
      const status = statusFromError(err);
      if (status === "403") {
        setForbidden(true);
        return;
      }
      setAuditState("error");
    }
  };

  if (forbidden) {
    return (
      <div className="px-6 py-8">
        <h1 className="text-2xl font-semibold">People admin</h1>
        <p className="mt-4 text-sm">
          Access denied. You do not have permission to perform this action.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-semibold">People admin</h1>

      <section aria-label="Employee lookup" className="mt-8">
        <h2 className="text-lg font-medium">Employee lookup</h2>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="employee-id" className="block text-xs uppercase tracking-wide">
              Employee ID
            </label>
            <input
              id="employee-id"
              value={employeeIdInput}
              onChange={(e) => setEmployeeIdInput(e.target.value)}
              className="mt-1 rounded border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={doLoad}
            className="rounded border border-neutral-600 px-3 py-2 text-sm"
          >
            Load
          </button>
          <button
            type="button"
            onClick={doExport}
            className="rounded border border-neutral-600 px-3 py-2 text-sm"
          >
            Export
          </button>
        </div>

        {exportStatus ? (
          <p role="status" className="mt-3 text-sm">
            {exportStatus}
          </p>
        ) : null}
        {exportError ? (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {exportError}
          </p>
        ) : null}

        {employeeState === "none" ? (
          <p className="mt-3 text-sm text-neutral-400">No employee loaded.</p>
        ) : employeeState === "loading" ? (
          <p className="mt-3 text-sm text-neutral-400">Loading employee…</p>
        ) : employeeState === "error" ? (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {employeeError}
          </p>
        ) : employeeState === "loaded" && employeeData ? (
          <div className="mt-4 rounded border border-neutral-700 p-4">
            <h3 className="text-base font-medium">{employeeData.employee.name}</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {employeeStatusLabel(employeeData.employee)}
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="delete-reason" className="block text-xs uppercase tracking-wide">
                  Reason
                </label>
                <input
                  id="delete-reason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setDeleteError(null);
                  }}
                  className="mt-1 rounded border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
                />
              </div>
              <label htmlFor="confirm-delete" className="flex items-center gap-2 text-sm">
                <input
                  id="confirm-delete"
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => {
                    setConfirmed(e.target.checked);
                    setDeleteError(null);
                  }}
                />
                I confirm this deletion
              </label>
              <button
                type="button"
                onClick={submitDelete}
                disabled={deleting}
                className="rounded border border-neutral-600 px-3 py-2 text-sm disabled:opacity-60"
              >
                Delete personal data
              </button>
              {deleteError ? (
                <p role="alert" className="text-sm text-red-400">
                  {deleteError}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <section aria-label="Audit trail" className="mt-10">
        <h2 className="text-lg font-medium">Audit trail</h2>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="audit-entity" className="block text-xs uppercase tracking-wide">
              Entity
            </label>
            <input
              id="audit-entity"
              value={auditEntity}
              onChange={(e) => setAuditEntity(e.target.value)}
              className="mt-1 rounded border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="audit-from" className="block text-xs uppercase tracking-wide">
              From
            </label>
            <input
              id="audit-from"
              value={auditFrom}
              onChange={(e) => setAuditFrom(e.target.value)}
              className="mt-1 rounded border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="audit-to" className="block text-xs uppercase tracking-wide">
              To
            </label>
            <input
              id="audit-to"
              value={auditTo}
              onChange={(e) => setAuditTo(e.target.value)}
              className="mt-1 rounded border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={applyFilters}
            className="rounded border border-neutral-600 px-3 py-2 text-sm"
          >
            Apply filters
          </button>
        </div>

        {auditState === "none" ? (
          <p className="mt-3 text-sm text-neutral-400">No audit entries loaded.</p>
        ) : auditState === "loading" ? (
          <p className="mt-3 text-sm text-neutral-400">Loading audit entries…</p>
        ) : auditState === "error" ? (
          <p role="alert" className="mt-3 text-sm text-red-400">
            The audit trail could not be loaded. Try again.
          </p>
        ) : auditState === "empty" ? (
          <p className="mt-3 text-sm text-neutral-400">No audit entries match these filters.</p>
        ) : (
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr>
                <th className="pb-2 pr-3">When</th>
                <th className="pb-2 pr-3">Actor</th>
                <th className="pb-2 pr-3">Record</th>
                <th className="pb-2 pr-3">Action</th>
                <th className="pb-2">Changes</th>
              </tr>
            </thead>
            <tbody>
              {auditRows.map((row) => (
                <tr key={row.id} className="border-t border-neutral-700">
                  <td className="py-2 pr-3">{row.created_at}</td>
                  <td className="py-2 pr-3">{row.actor_name}</td>
                  <td className="py-2 pr-3">
                    {row.entity_type} {row.entity_id}
                  </td>
                  <td className="py-2 pr-3">{row.action}</td>
                  <td className="py-2">{row.changes ? JSON.stringify(row.changes) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
