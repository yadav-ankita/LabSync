import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import axios from "../../axios";
import { TopBar } from "../../components/TopBar";

const REPORT_TYPES = [
  { id: "lab", label: "Lab-wise" },
  { id: "faculty", label: "Faculty-wise" },
];

const getId = (value) => (value?._id || value || "").toString();

const isInDateRange = (value, fromDate, toDate) => {
  const date = value ? new Date(value) : null;
  if (fromDate && (!date || date < new Date(`${fromDate}T00:00:00`))) return false;
  if (toDate && (!date || date > new Date(`${toDate}T23:59:59.999`))) return false;
  return true;
};

const csvValue = (value) => {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white border rounded-lg px-4 py-3" style={{ borderColor: "#E3E6DF" }}>
      <p className="text-xs" style={{ color: "#5B6A5F" }}>{label}</p>
      <p className="text-xl font-semibold mt-1" style={{ color: "#1F2A24", fontFamily: "'IBM Plex Mono', monospace" }}>{value}</p>
    </div>
  );
}

export function Reports() {
  const [reportType, setReportType] = useState("lab");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [labs, setLabs] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [resources, setResources] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadReportData = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [labResponse, facultyResponse, resourceResponse, complaintResponse, maintenanceResponse] = await Promise.all([
          axios.get("/lab"),
          axios.get("/admin/faculty/"),
          axios.get("/admin/LabResource"),
          axios.get("/admin/complaints"),
          axios.get("/admin/maintenance"),
        ]);

        if (!active) return;
        setLabs(labResponse.data.labs || []);
        setFaculty(facultyResponse.data.faculties || []);
        setResources(resourceResponse.data.resources || []);
        setComplaints(complaintResponse.data.complaints || []);
        setMaintenance(maintenanceResponse.data.maintenance || []);
      } catch (error) {
        if (active) {
          setLoadError(error.response?.data?.message || "Could not load report data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadReportData();
    return () => {
      active = false;
    };
  }, []);

  const filteredResources = resources.filter((item) => isInDateRange(item.createdAt, fromDate, toDate));
  const filteredComplaints = complaints.filter((item) => isInDateRange(item.createdAt, fromDate, toDate));
  const filteredMaintenance = maintenance.filter((item) => isInDateRange(item.createdAt, fromDate, toDate));

  const labRows = labs.map((lab) => {
    const labResources = filteredResources.filter((item) => item.labName === lab.LabName);
    const labComplaints = filteredComplaints.filter((item) => item.labName === lab.LabName);
    const labMaintenance = filteredMaintenance.filter((item) => item.complaint?.labName === lab.LabName);
    return {
      id: getId(lab),
      lab: lab.LabName,
      incharge: lab.AssignFaculty?.name || "Unassigned",
      resources: labResources.length,
      available: labResources.filter((item) => item.status === "Available").length,
      inUse: labResources.filter((item) => ["In Use", "Borrowed"].includes(item.status)).length,
      maintenanceResources: labResources.filter((item) => ["Maintenance", "Under Maintenance"].includes(item.status)).length,
      scrapped: labResources.filter((item) => item.status === "Scrapped").length,
      complaints: labComplaints.length,
      openComplaints: labComplaints.filter((item) => item.status !== "Resolved").length,
      resolved: labComplaints.filter((item) => item.status === "Resolved").length,
      maintenanceCases: labMaintenance.length,
    };
  });

  const facultyRows = faculty.map((member) => {
    const memberId = getId(member);
    const memberComplaints = filteredComplaints.filter((item) => getId(item.faculty) === memberId);
    const memberMaintenance = filteredMaintenance.filter((item) => getId(item.complaint?.faculty) === memberId);
    const assignedLab = member.lab?.LabName || member.lab_name || "Unassigned";
    const labResources = assignedLab === "Unassigned"
      ? []
      : filteredResources.filter((item) => item.labName === assignedLab);

    return {
      id: memberId,
      name: member.name,
      email: member.email,
      lab: assignedLab,
      resources: labResources.length,
      complaints: memberComplaints.length,
      pending: memberComplaints.filter((item) => item.status === "Pending").length,
      inProgress: memberComplaints.filter((item) => item.status === "In Progress").length,
      resolved: memberComplaints.filter((item) => item.status === "Resolved").length,
      maintenanceCases: memberMaintenance.length,
    };
  });

  const normalizedSearch = search.trim().toLowerCase();
  const reportRows = (reportType === "lab" ? labRows : facultyRows).filter((row) => {
    const searchable = reportType === "lab"
      ? `${row.lab} ${row.incharge}`
      : `${row.name} ${row.email} ${row.lab}`;
    return searchable.toLowerCase().includes(normalizedSearch);
  });

  const columns = reportType === "lab"
    ? [
        { key: "lab", label: "Lab" },
        { key: "incharge", label: "Lab Incharge" },
        { key: "resources", label: "Resources" },
        { key: "available", label: "Available" },
        { key: "inUse", label: "In use" },
        { key: "maintenanceResources", label: "In maintenance" },
        { key: "scrapped", label: "Scrapped" },
        { key: "complaints", label: "Complaints" },
        { key: "openComplaints", label: "Open" },
        { key: "resolved", label: "Resolved" },
        { key: "maintenanceCases", label: "Maintenance cases" },
      ]
    : [
        { key: "name", label: "Faculty" },
        { key: "email", label: "Email" },
        { key: "lab", label: "Assigned lab" },
        { key: "resources", label: "Lab resources" },
        { key: "complaints", label: "Complaints submitted" },
        { key: "pending", label: "Pending" },
        { key: "inProgress", label: "In progress" },
        { key: "resolved", label: "Resolved" },
        { key: "maintenanceCases", label: "Maintenance cases" },
      ];

  const summary = reportRows.reduce((total, row) => ({
    entities: total.entities + 1,
    resources: total.resources + row.resources,
    complaints: total.complaints + row.complaints,
    maintenance: total.maintenance + row.maintenanceCases,
  }), { entities: 0, resources: 0, complaints: 0, maintenance: 0 });

  const exportCsv = () => {
    const csvRows = [
      columns.map((column) => column.label),
      ...reportRows.map((row) => columns.map((column) => row[column.key])),
    ];
    const csv = csvRows.map((row) => row.map(csvValue).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `labsync-${reportType}-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <TopBar
        title="Reports"
        subtitle="Generate lab and faculty summaries from current inventory and service records."
        rightTop="Lab Administrator"
        rightBottom="Computer Engineering"
      />

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-5">
        <div role="tablist" aria-label="Report type" className="inline-flex rounded-lg border bg-white p-1 self-start" style={{ borderColor: "#D8DCD4" }}>
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              role="tab"
              aria-selected={reportType === type.id}
              onClick={() => setReportType(type.id)}
              className="px-4 py-2 rounded-md text-sm font-medium"
              style={{
                backgroundColor: reportType === type.id ? "#1F2A24" : "transparent",
                color: reportType === type.id ? "white" : "#5B6A5F",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <label className="text-xs" style={{ color: "#5B6A5F" }}>
            Search
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={reportType === "lab" ? "Lab or incharge" : "Faculty, email, or lab"}
              className="block w-full sm:w-52 mt-1 px-3 py-2 rounded-lg border bg-white text-sm"
              style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
            />
          </label>
          <label className="text-xs" style={{ color: "#5B6A5F" }}>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="block mt-1 px-3 py-2 rounded-lg border bg-white text-sm"
              style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
            />
          </label>
          <label className="text-xs" style={{ color: "#5B6A5F" }}>
            To
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
              className="block mt-1 px-3 py-2 rounded-lg border bg-white text-sm"
              style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
            />
          </label>
          <button
            type="button"
            onClick={exportCsv}
            disabled={loading || reportRows.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#1F2A24" }}
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        <SummaryCard label={reportType === "lab" ? "Labs" : "Faculty"} value={summary.entities} />
        <SummaryCard label="Resources" value={summary.resources} />
        <SummaryCard label="Complaints" value={summary.complaints} />
        <SummaryCard label="Maintenance cases" value={summary.maintenance} />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        <div className="px-4 py-3 border-b text-sm font-medium" style={{ color: "#1F2A24", borderColor: "#E3E6DF" }}>
          {reportType === "lab" ? "Lab-wise report" : "Faculty-wise report"}
          {!loading && <span className="ml-2 text-xs font-normal" style={{ color: "#8A968D" }}>{reportRows.length} records</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead style={{ backgroundColor: "#F8F9F7", color: "#5B6A5F" }}>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} scope="col" className="px-4 py-3 text-xs font-medium whitespace-nowrap">{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color: "#5B6A5F" }}>Loading report data...</td></tr>
              ) : loadError ? (
                <tr><td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color: "#B3261E" }}>{loadError}</td></tr>
              ) : reportRows.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color: "#5B6A5F" }}>No records match the selected filters.</td></tr>
              ) : reportRows.map((row) => (
                <tr key={row.id} className="border-t" style={{ borderColor: "#E3E6DF", color: "#1F2A24" }}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 whitespace-nowrap">{row[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}