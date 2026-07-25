import { TopBar } from "./TopBar";
import { ALL_COMPLAINTS, ALL_RESOURCES, LABS } from "./dummyData";

function BarRow({ label, value, max, color }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="mb-3.5">
      <div className="flex items-center justify-between text-xs mb-1">
        <span style={{ color: "#1F2A24" }}>{label}</span>
        <span style={{ color: "#5B6A5F", fontFamily: "'IBM Plex Mono', monospace" }}>{value}</span>
      </div>
      <div className="h-2 rounded-full" style={{ backgroundColor: "#F2F4F1" }}>
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function Reports() {
  const complaintsByLab = LABS.map((lab) => ({
    lab,
    count: ALL_COMPLAINTS.filter((c) => c.labName === lab).length,
  }));
  const maxComplaints = Math.max(...complaintsByLab.map((l) => l.count), 1);

  const resourcesByStatus = ["Available", "Borrowed", "Under Maintenance"].map((status) => ({
    status,
    count: ALL_RESOURCES.filter((r) => r.status === status).length,
  }));
  const maxResources = Math.max(...resourcesByStatus.map((s) => s.count), 1);

  const statusColors = { Available: "#2F6F52", Borrowed: "#B08A1E", "Under Maintenance": "#C9782E" };

  const complaintsByType = ["Hardware", "Software"].map((type) => ({
    type,
    count: ALL_COMPLAINTS.filter((c) => c.issueType === type).length,
  }));
  const maxType = Math.max(...complaintsByType.map((t) => t.count), 1);

  const resolvedPct = Math.round(
    (ALL_COMPLAINTS.filter((c) => c.status === "Resolved").length / ALL_COMPLAINTS.length) * 100
  );

  return (
    <div>
      <TopBar title="Reports" subtitle="Department-wide trends across complaints and resources." />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-5 rounded-xl border bg-white" style={{ borderColor: "#E3E6DF" }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: "#1F2A24" }}>Open complaints by lab</h3>
          {complaintsByLab.map((l) => (
            <BarRow key={l.lab} label={l.lab} value={l.count} max={maxComplaints} color="#D89A4E" />
          ))}
        </div>

        <div className="p-5 rounded-xl border bg-white" style={{ borderColor: "#E3E6DF" }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: "#1F2A24" }}>Resource status breakdown</h3>
          {resourcesByStatus.map((s) => (
            <BarRow key={s.status} label={s.status} value={s.count} max={maxResources} color={statusColors[s.status]} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border bg-white" style={{ borderColor: "#E3E6DF" }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: "#1F2A24" }}>Complaints by type</h3>
          {complaintsByType.map((t) => (
            <BarRow key={t.type} label={t.type} value={t.count} max={maxType} color="#3E6FA6" />
          ))}
        </div>

        <div className="col-span-2 p-5 rounded-xl border bg-white flex flex-col justify-center items-center" style={{ borderColor: "#E3E6DF" }}>
          <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#5B6A5F" }}>
            Overall resolution rate
          </p>
          <p className="text-4xl" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#2F6F52" }}>
            {resolvedPct}%
          </p>
          <p className="text-xs mt-2" style={{ color: "#8A968D" }}>
            of all reported complaints have been resolved to date.
          </p>
        </div>
      </div>
    </div>
  );
}