import * as React from "react";

import { brand } from "@/lib/brand";
import { Icons } from "@/lib/icons";
import { apiFetch } from "@/lib/api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Label,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Badge,
  Empty,
} from "@/lib/ui";

const HAIRLINE = "1px solid rgba(255,255,255,0.10)";
const ACCESS_DENIED_MESSAGE =
  "You do not have access to employee data-protection actions. This area is limited to HR admins.";

interface ExportEmployee {
  id: string;
  name: string;
  email: string | null;
  role: string;
  manager_id: string | null;
  is_active: boolean;
  anonymised_at: string | null;
  created_at: string;
}

interface ExportGoal {
  id: string;
  title: string;
  description: string;
  target_metric: string;
  progress_type: string;
  progress_percent: number | null;
  status: string;
  due_date: string;
  created_at: string;
}

interface ExportCheckIn {
  id: string;
  goal_id: string;
  note: string;
  created_at: string;
}

interface ExportPraise {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface ExportAuditRow {
  id: string;
  action: string;
  entity_type: string;
  changes: Record<string, unknown> | null;
  created_at: string;
}

interface EmployeeExport {
  employee: ExportEmployee;
  goals: ExportGoal[];
  check_ins: ExportCheckIn[];
  praise_received: ExportPraise[];
  audit: ExportAuditRow[];
}

interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  changes: Record<string, unknown> | null;
  created_at: string;
}

type LoadState = "idle" | "loading" | "error";

function statusOf(err: unknown): number | null {
  const message = err instanceof Error ? err.message : String(err);
  const match = /failed: (\d+)/.exec(message);
  return match ? Number(match[1]) : null;
}

function downloadJson(filename: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const anchor = document.createElement("a");
  anchor.href = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function fmtChanges(changes: Record<string, unknown> | null): string {
  if (!changes) return "—";
  try {
    return JSON.stringify(changes);
  } catch {
    return String(changes);
  }
}

export default function Screen() {
  const field = {
    border: HAIRLINE,
    borderRadius: brand.radius,
    backgroundColor: "rgba(0,0,0,0.25)",
    color: brand.primaryColor,
  };
  const label = { color: brand.neutralColor, letterSpacing: "0.16em" };
  const panel = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: HAIRLINE,
    borderRadius: brand.radius,
  };

  const [employeeId, setEmployeeId] = React.useState("");
  const [employee, setEmployee] = React.useState<ExportEmployee | null>(null);
  const [recordState, setRecordState] = React.useState<LoadState>("idle");
  const [recordError, setRecordError] = React.useState("");

  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState("");
  const [exportedFile, setExportedFile] = React.useState("");

  const [reason, setReason] = React.useState("");
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");
  const [deleteDone, setDeleteDone] = React.useState(false);

  const [accessDenied, setAccessDenied] = React.useState(false);

  const [entityFilter, setEntityFilter] = React.useState("");
  const [fromFilter, setFromFilter] = React.useState("");
  const [toFilter, setToFilter] = React.useState("");
  const [auditEntries, setAuditEntries] = React.useState<AuditLogEntry[] | null>(null);
  const [auditState, setAuditState] = React.useState<LoadState>("idle");
  const [auditError, setAuditError] = React.useState("");

  const loadEmployee = async (id: string): Promise<EmployeeExport | null> => {
    setRecordState("loading");
    setRecordError("");
    try {
      const data = await apiFetch<EmployeeExport>(`/employees/${id}/export`);
      setEmployee(data.employee);
      setRecordState("idle");
      return data;
    } catch (err) {
      const status = statusOf(err);
      if (status === 403) {
        setAccessDenied(true);
      } else if (status === 404) {
        setRecordError(`No employee found with id "${id}".`);
      } else {
        setRecordError("Could not load that employee record. Try again.");
      }
      setRecordState("error");
      setEmployee(null);
      return null;
    }
  };

  const onLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = employeeId.trim();
    if (!id) {
      setRecordError("Enter an employee ID first.");
      setRecordState("error");
      return;
    }
    setExportedFile("");
    setDeleteDone(false);
    await loadEmployee(id);
  };

  const onExport = async () => {
    const id = employeeId.trim();
    if (!id) return;
    setExporting(true);
    setExportError("");
    try {
      const data = await apiFetch<EmployeeExport>(`/employees/${id}/export`);
      setEmployee(data.employee);
      const filename = `employee-${id}.json`;
      downloadJson(filename, data);
      setExportedFile(filename);
    } catch (err) {
      const status = statusOf(err);
      if (status === 403) {
        setAccessDenied(true);
      } else if (status === 404) {
        setExportError(`No employee found with id "${id}".`);
      } else {
        setExportError("The export could not be generated. Try again.");
      }
    } finally {
      setExporting(false);
    }
  };

  const onDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = employeeId.trim();
    if (!id) return;
    if (!reason.trim()) {
      setDeleteError("Type a reason for this deletion before continuing.");
      return;
    }
    if (!confirmDelete) {
      setDeleteError("Confirm the deletion before it is sent.");
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      await apiFetch<void>(`/employees/${id}/personal-data`, {
        method: "DELETE",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      setDeleteDone(true);
      setReason("");
      setConfirmDelete(false);
      await loadEmployee(id);
    } catch (err) {
      const status = statusOf(err);
      if (status === 403) {
        setAccessDenied(true);
      } else if (status === 422) {
        setDeleteError("A reason is required to delete personal data.");
      } else if (status === 404) {
        setDeleteError(`No employee found with id "${id}".`);
      } else {
        setDeleteError("The deletion could not be completed. Try again.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const onApplyAuditFilters = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuditState("loading");
    setAuditError("");
    const params = new URLSearchParams();
    if (entityFilter.trim()) params.set("entity", entityFilter.trim());
    if (fromFilter) params.set("from", fromFilter);
    if (toFilter) params.set("to", toFilter);
    const qs = params.toString();
    try {
      const rows = await apiFetch<AuditLogEntry[]>(`/audit-log${qs ? `?${qs}` : ""}`);
      setAuditEntries(rows);
      setAuditState("idle");
    } catch (err) {
      const status = statusOf(err);
      if (status === 403) {
        setAccessDenied(true);
      } else {
        setAuditError("The audit trail could not be loaded. Try again.");
      }
      setAuditEntries(null);
      setAuditState("error");
    }
  };

  if (accessDenied) {
    return (
      <div
        className="min-h-full px-6 py-10 lg:px-10"
        style={{ backgroundColor: brand.backgroundColor, color: brand.primaryColor }}
      >
        <div className="mx-auto w-full max-w-[720px]">
          <Empty title="Access denied" description={ACCESS_DENIED_MESSAGE} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-full px-6 py-10 lg:px-10"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
      }}
    >
      <div className="mx-auto w-full max-w-[960px] space-y-10">
        <header>
          <p className="text-xs uppercase" style={label}>
            People operations
          </p>
          <h1 className="mt-2 text-3xl" style={{ fontFamily: brand.fontHeading }}>
            Employee data protection
          </h1>
        </header>

        {/* ---- Select / export ---- */}
        <Card style={panel}>
          <CardHeader>
            <CardTitle style={{ color: brand.primaryColor, fontFamily: brand.fontHeading }}>
              Employee record
            </CardTitle>
            <CardDescription style={{ color: brand.neutralColor }}>
              Load an employee by ID to export their data or action a deletion request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-wrap items-end gap-3" onSubmit={onLoad} noValidate>
              <div className="min-w-[240px] flex-1">
                <Label htmlFor="employee-id" style={label} className="block text-xs uppercase">
                  Employee ID
                </Label>
                <Input
                  id="employee-id"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                />
              </div>
              <Button type="submit" disabled={recordState === "loading"}>
                {recordState === "loading" ? "Loading…" : "Load"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onExport}
                disabled={exporting || !employeeId.trim()}
              >
                <Icons.Download className="h-4 w-4" aria-hidden="true" />
                {exporting ? "Exporting…" : "Export"}
              </Button>
            </form>

            {recordState === "error" && recordError ? (
              <p role="alert" className="mt-4 text-sm" style={{ color: "#cf8171" }}>
                {recordError}
              </p>
            ) : null}
            {exportError ? (
              <p role="alert" className="mt-4 text-sm" style={{ color: "#cf8171" }}>
                {exportError}
              </p>
            ) : null}
            {exportedFile ? (
              <p role="status" className="mt-4 text-sm" style={{ color: brand.accentColor }}>
                Downloaded {exportedFile}.
              </p>
            ) : null}

            {recordState === "loading" && !employee ? (
              <p className="mt-6 text-sm" style={{ color: brand.neutralColor }}>
                Loading employee…
              </p>
            ) : employee ? (
              <div className="mt-6" style={{ borderTop: HAIRLINE, paddingTop: 16 }}>
                <Table>
                  <THead>
                    <TR>
                      <TH>Name</TH>
                      <TH>Email</TH>
                      <TH>Role</TH>
                      <TH>Status</TH>
                    </TR>
                  </THead>
                  <TBody>
                    <TR>
                      <TD>{employee.name}</TD>
                      <TD>{employee.email ?? "—"}</TD>
                      <TD>{employee.role}</TD>
                      <TD>
                        {employee.anonymised_at ? (
                          <Badge variant="warning">Anonymised</Badge>
                        ) : employee.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge>Deactivated</Badge>
                        )}
                      </TD>
                    </TR>
                  </TBody>
                </Table>
              </div>
            ) : (
              <div className="mt-6">
                <Empty
                  title="No employee loaded"
                  description="Enter an employee ID and load their record to continue."
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---- Delete personal data ---- */}
        {employee ? (
          <Card style={panel}>
            <CardHeader>
              <CardTitle style={{ color: brand.primaryColor, fontFamily: brand.fontHeading }}>
                Delete personal data
              </CardTitle>
              <CardDescription style={{ color: brand.neutralColor }}>
                Anonymises this employee's identifying fields. Goals and praise stay, attributed to
                the reference only. This cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onDelete} noValidate>
                <div>
                  <Label htmlFor="delete-reason" style={label} className="block text-xs uppercase">
                    Reason
                  </Label>
                  <Textarea
                    id="delete-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-2 w-full px-3 py-2"
                    style={field}
                  />
                </div>
                <label
                  className="flex items-center gap-2 text-sm"
                  style={{ color: brand.primaryColor }}
                >
                  <input
                    type="checkbox"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                  />
                  I confirm this deletion is backed by an approved request.
                </label>
                {deleteError ? (
                  <p role="alert" className="text-sm" style={{ color: "#cf8171" }}>
                    {deleteError}
                  </p>
                ) : null}
                {deleteDone ? (
                  <p role="status" className="text-sm" style={{ color: brand.accentColor }}>
                    Personal data deleted. The record now shows the anonymised state.
                  </p>
                ) : null}
                <Button type="submit" variant="danger" disabled={deleting}>
                  <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                  {deleting ? "Deleting…" : "Delete personal data"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {/* ---- Audit trail ---- */}
        <Card style={panel}>
          <CardHeader>
            <CardTitle style={{ color: brand.primaryColor, fontFamily: brand.fontHeading }}>
              Audit trail
            </CardTitle>
            <CardDescription style={{ color: brand.neutralColor }}>
              Who did what, and when — newest first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-wrap items-end gap-3"
              onSubmit={onApplyAuditFilters}
              noValidate
            >
              <div className="min-w-[200px]">
                <Label htmlFor="audit-entity" style={label} className="block text-xs uppercase">
                  Entity
                </Label>
                <Input
                  id="audit-entity"
                  value={entityFilter}
                  onChange={(e) => setEntityFilter(e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                />
              </div>
              <div className="min-w-[160px]">
                <Label htmlFor="audit-from" style={label} className="block text-xs uppercase">
                  From
                </Label>
                <Input
                  id="audit-from"
                  type="date"
                  value={fromFilter}
                  onChange={(e) => setFromFilter(e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                />
              </div>
              <div className="min-w-[160px]">
                <Label htmlFor="audit-to" style={label} className="block text-xs uppercase">
                  To
                </Label>
                <Input
                  id="audit-to"
                  type="date"
                  value={toFilter}
                  onChange={(e) => setToFilter(e.target.value)}
                  className="mt-2 w-full px-3 py-2"
                  style={field}
                />
              </div>
              <Button type="submit" disabled={auditState === "loading"}>
                {auditState === "loading" ? "Loading…" : "Apply filters"}
              </Button>
            </form>

            {auditState === "error" && auditError ? (
              <p role="alert" className="mt-4 text-sm" style={{ color: "#cf8171" }}>
                {auditError}
              </p>
            ) : null}

            <div className="mt-6">
              {auditState === "loading" ? (
                <p className="text-sm" style={{ color: brand.neutralColor }}>
                  Loading audit entries…
                </p>
              ) : auditEntries === null ? (
                <Empty
                  title="No audit entries loaded"
                  description="Apply filters to load the audit trail."
                />
              ) : auditEntries.length === 0 ? (
                <Empty title="No audit entries" description="Nothing matches these filters." />
              ) : (
                <Table>
                  <THead>
                    <TR>
                      <TH>When</TH>
                      <TH>Who</TH>
                      <TH>Entity</TH>
                      <TH>Action</TH>
                      <TH>Changes</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {auditEntries.map((row) => (
                      <TR key={row.id}>
                        <TD>{row.created_at}</TD>
                        <TD>{row.actor_name ?? "—"}</TD>
                        <TD>{row.entity_type}</TD>
                        <TD>{row.action}</TD>
                        <TD>{fmtChanges(row.changes)}</TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
