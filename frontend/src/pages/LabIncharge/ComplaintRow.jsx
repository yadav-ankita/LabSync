import { Clock, User } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

export function ComplaintRow({ complaint, onStatusChange }) {
  const date = new Date(complaint.createdAt);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="px-5 py-4 border-t first:border-t-0" style={{ borderColor: "#E3E6DF" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A968D" }}>
              {complaint.id}
            </span>
            <ResourceTag id={complaint.resourceId} />
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F2F4F1", color: "#5B6A5F" }}>
              {complaint.issueType}
            </span>
          </div>
          <p className="text-sm mt-2" style={{ color: "#1F2A24" }}>{complaint.description}</p>
          <div className="flex items-center gap-1.5 text-xs mt-2 flex-wrap" style={{ color: "#8A968D" }}>
            <span>{complaint.labName}</span>
            <span>·</span>
            <User size={12} />
            <span>{complaint.reportedBy}</span>
            <span>·</span>
            <Clock size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusPill status={complaint.status} />
          <select
            value={complaint.status}
            onChange={(e) => onStatusChange(complaint.id, e.target.value)}
            className="text-xs px-2 py-1.5 rounded-lg border bg-white focus:outline-none"
            style={{ borderColor: "#D8DCD4", color: "#5B6A5F" }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>Mark as {s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}