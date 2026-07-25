import { useState } from "react";
import { TopBar } from "./TopBar";
import { ComplaintRow } from "./ComplaintRow";
import { INCHARGE_COMPLAINTS } from "./dummyData";

const FILTERS = ["All", "Pending", "In Progress", "Resolved"];

export function ComplaintsPanel() {
  const [complaints, setComplaints] = useState(INCHARGE_COMPLAINTS);
  const [filter, setFilter] = useState("All");

  const handleStatusChange = (id, status) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const visible = filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div>
      <TopBar title="Complaints" subtitle="Review and update issues reported in your labs." />

      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: filter === f ? "#D89A4E" : "#D8DCD4",
              backgroundColor: filter === f ? "#FBF1E3" : "white",
              color: filter === f ? "#9A5F1D" : "#5B6A5F",
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {visible.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            No complaints match this filter.
          </div>
        ) : (
          visible.map((c) => (
            <ComplaintRow key={c.id} complaint={c} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}