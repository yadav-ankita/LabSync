import { StatusBadge } from "./ReportTable";
import { fmtDate, getId, isOpen, daysBetween } from "./reportUtils";

/* ---------- row mappers (adjust field names here if your models differ) ---------- */
export const toComplaintRow = (c) => ({
  id: getId(c),
  ref: c.complaintId || getId(c).slice(-6).toUpperCase(),
  lab: c.labName || c.lab?.LabName || "—",
  resource: c.resourceId || "—",
  type: c.issueType || c.type || "—",
  description: c.description || "—",
  status: c.status || "—",
  raised: fmtDate(c.createdAt),
  raisedBy: c.student?.username || c.student?.studentId || c.faculty?.name || "—",
  daysOpen: isOpen(c) ? daysBetween(c.createdAt) : "—",
});

export const toResourceRow = (r) => ({
  id: getId(r),
  code: r.resourceId || r.assetId || getId(r).slice(-6).toUpperCase(),
  name: r.name || r.resourceName || "—",
  category: r.purchase?.category || r.category || r.resourceName || r.type || "—",
  status: r.status || "—",
  condition: r.condition || "—",
});

/* ---------- cell renderers ---------- */
export const statusCell = (row) => <StatusBadge value={row.status} />;

// days open > 7 is shown in red (SLA breach)
export const daysCell = (row) =>
  typeof row.daysOpen === "number" && row.daysOpen > 7 ? (
    <span style={{ color: "#B3261E", fontWeight: 600 }}>{row.daysOpen}</span>
  ) : (
    row.daysOpen
  );

/* ---------- column sets ---------- */
export const COMPLAINT_COLUMNS = [
  { key: "ref", label: "ID" },
  { key: "resource", label: "Resource" },
  { key: "type", label: "Type" },
  { key: "description", label: "Issue", wrap: true },
  { key: "status", label: "Status", render: statusCell },
  { key: "raised", label: "Raised on" },
  { key: "daysOpen", label: "Days open", render: daysCell },
];

export const RESOURCE_COLUMNS = [
  { key: "code", label: "Resource ID" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", render: statusCell },
  { key: "condition", label: "Condition" },
];
