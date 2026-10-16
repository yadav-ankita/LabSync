import { useMemo, useState } from "react";
import { ReportPage } from "../../components/reports/ReportPage";
import { useReportData, useDateRange } from "../../components/reports/useReportData";
import { statusCell, daysCell, toComplaintRow, toResourceRow } from "../../components/reports/reportColumns";
import {
  getId, fmtDate, isInDateRange, isOpen, complaintStats,
  isAvailable, isInUse, isMaintenance, isScrapped,
} from "../../components/reports/reportUtils";

const TABS = [
  { id: "stock", label: "Stock register" },
  { id: "pending", label: "Pending actions" },
  { id: "monthly", label: "Monthly summary" },
];

// The backend must scope these three endpoints to the incharge's own lab using the token.
const SOURCES = [
  { key: "resources", url: "/faculty/labResource", pick: (d) => d.resources },
  { key: "complaints", url: "/faculty/complaints", pick: (d) => d.complaints },
  { key: "maintenance", url: "/faculty/labMaintenance", pick: (d) => d.maintenance },
];

const STOCK_COLUMNS = [
  { key: "code", label: "Resource ID" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", render: statusCell },
  { key: "condition", label: "Condition" },
  { key: "complaints", label: "Complaints" },
  { key: "lastMaintenance", label: "Last maintenance" },
];

const PENDING_COLUMNS = [
  { key: "ref", label: "ID" },
  { key: "resource", label: "Resource" },
  { key: "type", label: "Type" },
  { key: "description", label: "Issue", wrap: true },
  { key: "raisedBy", label: "Raised by" },
  { key: "raised", label: "Raised on" },
  { key: "daysOpen", label: "Days open", render: daysCell },
  { key: "status", label: "Status", render: statusCell },
];

const MONTHLY_COLUMNS = [
  { key: "metric", label: "Metric" },
  { key: "value", label: "Value" },
];

export function Reports() {
  const { data, loading, error } = useReportData(SOURCES);
  const range = useDateRange("month"); // monthly report is the default view
  const [tab, setTab] = useState("stock");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const resources = data.resources || [];

  const complaints = useMemo(
    () => (data.complaints || []).filter((c) => isInDateRange(c.createdAt, range.fromDate, range.toDate)),
    [data.complaints, range.fromDate, range.toDate]
  );
  const maintenance = useMemo(
    () => (data.maintenance || []).filter((m) => isInDateRange(m.createdAt, range.fromDate, range.toDate)),
    [data.maintenance, range.fromDate, range.toDate]
  );

  const q = search.trim().toLowerCase();

  /* ---------- stock register (full inventory snapshot) ---------- */
  const allComplaints = data.complaints || [];
  const allMaintenance = data.maintenance || [];
  const stockRows = resources
    .map((r) => {
      const base = toResourceRow(r);
      const related = allComplaints.filter((c) => c.resourceId === base.code);
      const lastM = allMaintenance
        .filter((m) => m.complaint?.resourceId === base.code || getId(m.resource) === base.id)
        .map((m) => new Date(m.createdAt))
        .sort((a, b) => b - a)[0];
      return { ...base, complaints: related.length, lastMaintenance: lastM ? fmtDate(lastM) : "—" };
    })
    .filter((r) => statusFilter === "all" || r.status === statusFilter)
    .filter((r) => `${r.code} ${r.name} ${r.category}`.toLowerCase().includes(q));

  /* ---------- pending actions (oldest first) ---------- */
  const pendingRows = complaints
    .filter(isOpen)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(toComplaintRow)
    .filter((r) => `${r.ref} ${r.resource} ${r.description} ${r.raisedBy}`.toLowerCase().includes(q));

  /* ---------- monthly summary ---------- */
  const s = complaintStats(complaints);
  const monthlyRows = [
    ["Total resources", resources.length],
    ["Available", resources.filter(isAvailable).length],
    ["In use / borrowed", resources.filter(isInUse).length],
    ["Under maintenance", resources.filter(isMaintenance).length],
    ["Scrapped", resources.filter(isScrapped).length],
    ["Complaints raised", s.total],
    ["Resolved", s.resolved],
    ["Still open", s.open],
    ["Resolution rate", `${s.rate}%`],
    ["Average days to resolve", s.avgDays],
    ["Open longer than 7 days", s.aging],
    ["Maintenance cases", maintenance.length],
  ].map(([metric, value]) => ({ id: metric, metric, value }));

  const config = {
    stock: {
      title: "Lab stock register",
      columns: STOCK_COLUMNS,
      rows: stockRows,
      showDates: false,
      placeholder: "Resource ID, name or category",
      summary: [
        { label: "Total resources", value: resources.length },
        { label: "Available", value: resources.filter(isAvailable).length },
        { label: "In maintenance", value: resources.filter(isMaintenance).length },
        { label: "Scrapped", value: resources.filter(isScrapped).length },
      ],
      insight: "",
    },
    pending: {
      title: "Pending action list (oldest first)",
      columns: PENDING_COLUMNS,
      rows: pendingRows,
      showDates: true,
      placeholder: "ID, resource, issue or student",
      summary: [
        { label: "Open complaints", value: pendingRows.length },
        { label: "Pending", value: s.pending },
        { label: "In progress", value: s.inProgress },
        { label: "Open > 7 days", value: s.aging, warn: s.aging > 0 },
      ],
      insight: s.aging > 0 ? `${s.aging} complaint${s.aging > 1 ? "s have" : " has"} been open for more than 7 days and need attention.` : "",
    },
    monthly: {
      title: "Lab summary report",
      columns: MONTHLY_COLUMNS,
      rows: monthlyRows,
      showDates: true,
      placeholder: "Search metric",
      summary: [
        { label: "Resources", value: resources.length },
        { label: "Complaints raised", value: s.total },
        { label: "Resolved", value: s.resolved },
        { label: "Avg days to resolve", value: s.avgDays },
      ],
      insight: s.total > 0 ? `${s.rate}% of complaints in this period were resolved; ${s.aging} still open beyond 7 days.` : "",
    },
  }[tab];

  const rows = tab === "monthly" ? config.rows.filter((r) => r.metric.toLowerCase().includes(q)) : config.rows;

  const statusFilterControl =
    tab === "stock" ? (
      <label className="text-xs" style={{ color: "#5B6A5F" }}>
        Status
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block mt-1 px-3 py-2 rounded-lg border bg-white text-sm"
          style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
        >
          {["all", "Available", "In Use", "Borrowed", "Maintenance", "Scrapped"].map((v) => (
            <option key={v} value={v}>{v === "all" ? "All statuses" : v}</option>
          ))}
        </select>
      </label>
    ) : null;

  return (
    <ReportPage
      title="Lab Reports"
      subtitle="Stock, pending work and monthly summary for your lab."
      rightTop="Lab Incharge"
      rightBottom="Computer Engineering"
      tabs={TABS}
      activeTab={tab}
      onTab={(id) => { setTab(id); setSearch(""); }}
      range={range}
      showDates={config.showDates}
      search={search}
      onSearch={setSearch}
      searchPlaceholder={config.placeholder}
      extraFilters={statusFilterControl}
      summary={config.summary}
      insight={config.insight}
      tableTitle={config.title}
      columns={config.columns}
      rows={rows}
      loading={loading}
      error={error}
      exportName={`labtrack-${tab}`}
      generatedBy="Lab Incharge"
    />
  );
}
