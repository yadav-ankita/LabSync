import { useMemo, useState } from "react";
import { ReportPage } from "../../components/reports/ReportPage";
import { useReportData, useDateRange } from "../../components/reports/useReportData";
import { COMPLAINT_COLUMNS, toComplaintRow } from "../../components/reports/reportColumns";
import {
  isInDateRange, complaintStats, pct,
  isAvailable, isInUse, isMaintenance, isScrapped,
} from "../../components/reports/reportUtils";

const TABS = [
  { id: "complaints", label: "My complaints" },
  { id: "lab", label: "My lab status" },
];

// The backend must scope both endpoints to the logged-in faculty member using the token.
const SOURCES = [
  { key: "complaints", url: "/faculty/complaints", pick: (d) => d.complaints },
  { key: "resources", url: "/faculty/labResource", pick: (d) => d.resources },
];

const MY_COMPLAINT_COLUMNS = [
  { key: "ref", label: "ID" },
  { key: "lab", label: "Lab" },
  ...COMPLAINT_COLUMNS.slice(1),
];

const LAB_STATUS_COLUMNS = [
  { key: "category", label: "Category" },
  { key: "total", label: "Total" },
  { key: "available", label: "Available" },
  { key: "inUse", label: "In use" },
  { key: "maintenance", label: "In maintenance" },
  { key: "scrapped", label: "Scrapped" },
  { key: "availability", label: "Availability" },
];

export function Reports() {
  const { data, loading, error } = useReportData(SOURCES);
  const range = useDateRange("all");
  const [tab, setTab] = useState("complaints");
  const [search, setSearch] = useState("");

  const resources = data.resources || [];
  const q = search.trim().toLowerCase();

  const complaints = useMemo(
    () => (data.complaints || []).filter((c) => isInDateRange(c.createdAt, range.fromDate, range.toDate)),
    [data.complaints, range.fromDate, range.toDate]
  );

  /* ---------- my complaints ---------- */
  const s = complaintStats(complaints);
  const complaintRows = complaints
    .map(toComplaintRow)
    .filter((r) => `${r.ref} ${r.lab} ${r.resource} ${r.description}`.toLowerCase().includes(q));

  /* ---------- my lab status (grouped by category) ---------- */
  const groups = {};
  resources.forEach((r) => {
    const cat = r.purchase?.category || r.category || r.resourceName || r.name || "Other";
    (groups[cat] = groups[cat] || []).push(r);
  });
  const labRows = Object.entries(groups)
    .map(([category, list]) => ({
      id: category,
      category,
      total: list.length,
      available: list.filter(isAvailable).length,
      inUse: list.filter(isInUse).length,
      maintenance: list.filter(isMaintenance).length,
      scrapped: list.filter(isScrapped).length,
      availability: `${pct(list.filter(isAvailable).length, list.length)}%`,
    }))
    .filter((r) => r.category.toLowerCase().includes(q));

  const totalAvail = resources.filter(isAvailable).length;

  const config =
    tab === "complaints"
      ? {
          title: "My complaints report",
          columns: MY_COMPLAINT_COLUMNS,
          rows: complaintRows,
          showDates: true,
          placeholder: "ID, lab, resource or issue",
          summary: [
            { label: "Raised", value: s.total },
            { label: "Open", value: s.open },
            { label: "Resolved", value: s.resolved },
            { label: "Avg days to resolve", value: s.avgDays },
          ],
          insight: s.aging > 0 ? `${s.aging} of your complaints have been open for more than 7 days.` : "",
        }
      : {
          title: "Lab resource availability",
          columns: LAB_STATUS_COLUMNS,
          rows: labRows,
          showDates: false,
          placeholder: "Category",
          summary: [
            { label: "Total resources", value: resources.length },
            { label: "Available", value: totalAvail },
            { label: "In maintenance", value: resources.filter(isMaintenance).length },
            { label: "Availability", value: `${pct(totalAvail, resources.length)}%` },
          ],
          insight: resources.length ? `${totalAvail} of ${resources.length} resources in your lab are available for practicals.` : "",
        };

  return (
    <ReportPage
      title="My Reports"
      subtitle="Track the complaints you raised and see how your lab is doing."
      rightTop="Faculty"
      rightBottom="Computer Engineering"
      tabs={TABS}
      activeTab={tab}
      onTab={(id) => { setTab(id); setSearch(""); }}
      range={range}
      showDates={config.showDates}
      search={search}
      onSearch={setSearch}
      searchPlaceholder={config.placeholder}
      summary={config.summary}
      insight={config.insight}
      tableTitle={config.title}
      columns={config.columns}
      rows={config.rows}
      loading={loading}
      error={error}
      exportName={`labtrack-faculty-${tab}`}
      generatedBy="Faculty"
    />
  );
}
