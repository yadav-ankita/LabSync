import { useMemo, useState } from "react";
import { ReportPage } from "../../components/reports/ReportPage";
import { DrilldownDrawer } from "../../components/reports/DrilldownDrawer";
import { useReportData, useDateRange } from "../../components/reports/useReportData";
import {
  COMPLAINT_COLUMNS, RESOURCE_COLUMNS, toComplaintRow, toResourceRow,
} from "../../components/reports/reportColumns";
import {
  getId, isInDateRange, complaintStats, repeatResources,
  isAvailable, isInUse, isMaintenance, isScrapped, pct, 
} from "../../components/reports/reportUtils";

const TABS = [
  { id: "lab", label: "Lab-wise" },
  { id: "faculty", label: "Faculty-wise" },
];

// defined outside the component so the hook doesn't refetch on every render
const SOURCES = [
  { key: "labs", url: "/lab", pick: (d) => d.labs },
  { key: "faculty", url: "/admin/faculty/", pick: (d) => d.faculties },
  { key: "resources", url: "/admin/LabResource", pick: (d) => d.resources },
  { key: "complaints", url: "/admin/complaints", pick: (d) => d.complaints },
  { key: "maintenance", url: "/admin/maintenance", pick: (d) => d.maintenance },
];

// match by lab id first, fall back to name (survives renames if records carry the id)
const inLab = (item, lab) =>
  (item?.lab && getId(item.lab) === getId(lab)) || item?.labName === lab.LabName;

const LAB_COLUMNS = [
  { key: "lab", label: "Lab" },
  { key: "incharge", label: "Lab Incharge" },
  { key: "resources", label: "Resources" },
  { key: "available", label: "Available" },
  { key: "inUse", label: "In use" },
  { key: "maintenanceResources", label: "In maintenance" },
  { key: "scrapped", label: "Scrapped" },
  { key: "complaints", label: "Complaints" },
  { key: "open", label: "Open" },
  { key: "rate", label: "Resolution rate" },
  { key: "avgDays", label: "Avg days to resolve" },
  { key: "aging", label: "Open > 7 days", render: (r) => (r.aging > 0 ? <span style={{ color: "#B3261E", fontWeight: 600 }}>{r.aging}</span> : r.aging) },
  { key: "repeat", label: "Repeat-fault resources" },
  { key: "maintenanceCases", label: "Maintenance cases" },
];

const FACULTY_COLUMNS = [
  { key: "name", label: "Faculty" },
  { key: "email", label: "Email" },
  { key: "lab", label: "Assigned lab" },
  { key: "complaints", label: "Complaints" },
  { key: "pending", label: "Pending" },
  { key: "inProgress", label: "In progress" },
  { key: "resolved", label: "Resolved" },
  { key: "rate", label: "Resolution rate" },
  { key: "avgDays", label: "Avg days to resolve" },
  { key: "aging", label: "Open > 7 days" },
  { key: "maintenanceCases", label: "Maintenance cases" },
];

export function Reports() {
  const { data, loading, error } = useReportData(SOURCES);
  const range = useDateRange("all");
  const [tab, setTab] = useState("lab");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const labs = data.labs || [];
  const faculty = data.faculty || [];
  const resources = data.resources || []; // inventory is a snapshot: NOT date-filtered

  // only activity (complaints / maintenance) is filtered by the chosen period
  const complaints = useMemo(
    () => (data.complaints || []).filter((c) => isInDateRange(c.createdAt, range.fromDate, range.toDate)),
    [data.complaints, range.fromDate, range.toDate]
  );
  const maintenance = useMemo(
    () => (data.maintenance || []).filter((m) => isInDateRange(m.createdAt, range.fromDate, range.toDate)),
    [data.maintenance, range.fromDate, range.toDate]
  );

  const labRows = labs.map((lab) => {
    const r = resources.filter((x) => inLab(x, lab));
    const c = complaints.filter((x) => inLab(x, lab));
    const m = maintenance.filter((x) => inLab(x.complaint, lab));
    const s = complaintStats(c);
    return {
      id: getId(lab),
      lab: lab.LabName,
      incharge: lab.AssignFaculty?.name || "Unassigned",
      resources: r.length,
      available: r.filter(isAvailable).length,
      inUse: r.filter(isInUse).length,
      maintenanceResources: r.filter(isMaintenance).length,
      scrapped: r.filter(isScrapped).length,
      complaints: s.total,
      open: s.open,
      rate: `${s.rate}%`,
      avgDays: s.avgDays,
      aging: s.aging,
      repeat: repeatResources(c),
      maintenanceCases: m.length,
    };
  });

  const facultyRows = faculty.map((f) => {
    const id = getId(f);
    const c = complaints.filter((x) => getId(x.faculty) === id);
    const m = maintenance.filter((x) => getId(x.complaint?.faculty) === id);
    const s = complaintStats(c);
    return {
      id,
      name: f.name,
      email: f.email,
      lab: f.lab?.LabName || f.lab_name || "Unassigned",
      complaints: s.total,
      pending: s.pending,
      inProgress: s.inProgress,
      resolved: s.resolved,
      rate: `${s.rate}%`,
      avgDays: s.avgDays,
      aging: s.aging,
      maintenanceCases: m.length,
    };
  });

  const q = search.trim().toLowerCase();
  const isLab = tab === "lab";
  const rows = (isLab ? labRows : facultyRows).filter((r) =>
    (isLab ? `${r.lab} ${r.incharge}` : `${r.name} ${r.email} ${r.lab}`).toLowerCase().includes(q)
  );

  /* ---------- summary + auto insight ---------- */
  const sum = (key) => rows.reduce((t, r) => t + (r[key] || 0), 0);
  const summary = isLab
    ? [
        { label: "Labs", value: rows.length },
        { label: "Resources", value: sum("resources") },
        { label: "Complaints", value: sum("complaints") },
        { label: "Open > 7 days", value: sum("aging"), warn: sum("aging") > 0 },
      ]
    : [
        { label: "Faculty", value: rows.length },
        { label: "Complaints raised", value: sum("complaints") },
        { label: "Resolved", value: sum("resolved") },
        { label: "Open > 7 days", value: sum("aging"), warn: sum("aging") > 0 },
      ];

  let insight = "";
  if (isLab) {
    const totalOpen = sum("open");
    const top = [...rows].sort((a, b) => b.open - a.open)[0];
    if (totalOpen > 0 && top) insight = `${top.lab} holds ${pct(top.open, totalOpen)}% of all open complaints (${top.open} of ${totalOpen}).`;
  } else {
    const totalC = sum("complaints");
    const top = [...rows].sort((a, b) => b.complaints - a.complaints)[0];
    if (totalC > 0 && top) insight = `${top.name} raised ${pct(top.complaints, totalC)}% of all complaints in this period (${top.complaints} of ${totalC}).`;
  }

  /* ---------- drill-down ---------- */
  const drill = (() => {
    if (!selected) return null;
    if (selected.type === "lab") {
      const lab = labs.find((l) => getId(l) === selected.id);
      if (!lab) return null;
      return {
        title: lab.LabName,
        subtitle: `Incharge: ${lab.AssignFaculty?.name || "Unassigned"} · Period: ${range.label}`,
        sections: [
          { title: "Complaints", columns: COMPLAINT_COLUMNS, rows: complaints.filter((x) => inLab(x, lab)).map(toComplaintRow) },
          { title: "Resources", columns: RESOURCE_COLUMNS, rows: resources.filter((x) => inLab(x, lab)).map(toResourceRow) },
        ],
      };
    }
    const f = faculty.find((x) => getId(x) === selected.id);
    if (!f) return null;
    return {
      title: f.name,
      subtitle: `${f.email} · Period: ${range.label}`,
      sections: [
        { title: "Complaints raised", columns: COMPLAINT_COLUMNS, rows: complaints.filter((x) => getId(x.faculty) === selected.id).map(toComplaintRow) },
      ],
    };
  })();

  return (
    <>
      <ReportPage
        title="Reports"
        subtitle="Generate lab and faculty summaries from current inventory and service records."
        rightTop="Lab Administrator"
        rightBottom="Computer Engineering"
        tabs={TABS}
        activeTab={tab}
        onTab={(id) => { setTab(id); setSearch(""); }}
        range={range}
        search={search}
        onSearch={setSearch}
        searchPlaceholder={isLab ? "Lab or incharge" : "Faculty, email, or lab"}
        summary={summary}
        insight={insight}
        tableTitle={isLab ? "Lab-wise report" : "Faculty-wise report"}
        columns={isLab ? LAB_COLUMNS : FACULTY_COLUMNS}
        rows={rows}
        loading={loading}
        error={error}
        onRowClick={(row) => setSelected({ type: tab, id: row.id })}
        exportName={`labtrack-${tab}-report`}
        generatedBy="Lab Administrator"
      />
      <DrilldownDrawer data={drill} onClose={() => setSelected(null)} />
    </>
  );
}
