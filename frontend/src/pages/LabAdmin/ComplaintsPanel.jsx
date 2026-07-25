import { useState } from "react";
import { TopBar } from "./TopBar";
import { ComplaintRow } from "./ComplaintRow";
import { ALL_COMPLAINTS, LABS } from "./dummyData";

const STATUS_FILTERS = ["All", "Pending", "In Progress", "Resolved"];

export function ComplaintsPanel() {
  const [complaints, setComplaints] = useState(ALL_COMPLAINTS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [labFilter, setLabFilter] = useState("All Labs");

  const handleStatusChange = (id, status) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const visible = complaints.filter(
    (c) =>
      (statusFilter === "All" || c.status === statusFilter) &&
      (labFilter === "All Labs" || c.labName === labFilter)
  );

  return (
    <div>
      <TopBar title="All Complaints" subtitle="Complaints reported across every laboratory in the department." />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: statusFilter === f ? "#D89A4E" : "#D8DCD4",
                backgroundColor: statusFilter === f ? "#FBF1E3" : "white",
                color: statusFilter === f ? "#9A5F1D" : "#5B6A5F",
                fontWeight: statusFilter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={labFilter}
          onChange={(e) => setLabFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border bg-white focus:outline-none"
          style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
        >
          <option value="All Labs">All Labs</option>
          {LABS.map((lab) => (
            <option key={lab} value={lab}>{lab}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {visible.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            No complaints match these filters.
          </div>
        ) : (
          visible.map((c) => <ComplaintRow key={c.id} complaint={c} onStatusChange={handleStatusChange} />)
        )}
      </div>
    </div>
  );
}