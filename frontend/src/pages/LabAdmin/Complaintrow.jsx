import { Clock, User, Wrench } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

export function ComplaintRow({
  complaint,
  onStatusChange,
  onMoveToMaintenance,
  maintenanceExists = false,
}) {
  const date = new Date(complaint.createdAt);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="px-5 py-4 border-t first:border-t-0"
      style={{ borderColor: "#E3E6DF" }}
    >
      <div className="flex items-start justify-between gap-4">

        {/* LEFT SIDE */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <ResourceTag id={complaint.resourceId} />

            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#F2F4F1",
                color: "#5B6A5F",
              }}
            >
              {complaint.issueType}
            </span>

            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "#EEF1EC",
                color: "#3E4A41",
              }}
            >
              {complaint.labName}
            </span>
          </div>

          <p
            className="text-sm mt-2"
            style={{ color: "#1F2A24" }}
          >
            {complaint.description}
          </p>

          <div
            className="flex items-center gap-1.5 text-xs mt-2 flex-wrap"
            style={{ color: "#8A968D" }}
          >
            <User size={12} />
            <span>{complaint.faculty?.name || "Faculty"}</span>

            <span>·</span>

            <Clock size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end gap-2 shrink-0">

          <StatusPill status={complaint.status} />

          {/* Status change */}
          <select
            value={complaint.status}
            onChange={(e) =>
              onStatusChange(complaint._id, e.target.value)
            }
            className="text-xs px-2 py-1.5 rounded-lg border bg-white focus:outline-none"
            style={{
              borderColor: "#D8DCD4",
              color: "#5B6A5F",
            }}
          >
            {STATUS_OPTIONS
  .filter((s) => !maintenanceExists || s !== "Resolved")
  .map((s) => (
    <option key={s} value={s}>
      Mark as {s}
    </option>
  ))}
          </select>

          {/* Move to Maintenance */}
          {complaint.status === "Resolved" ? (
  <span
    className="text-xs px-3 py-1.5 rounded-lg"
    style={{
      backgroundColor: "#E8F3EA",
      color: "#35663D",
    }}
  >
    Complaint Resolved
  </span>
) : maintenanceExists ? (
  <span
    className="text-xs px-3 py-1.5 rounded-lg"
    style={{
      backgroundColor: "#F2F4F1",
      color: "#8A968D",
    }}
  >
    Already in Maintenance
  </span>
) : (
  <button
    onClick={() => onMoveToMaintenance(complaint._id)}
    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition"
    style={{
      backgroundColor: "#FFF4E5",
      color: "#B56A00",
      border: "1px solid #F0D6A8",
    }}
  >
    <Wrench size={13} />
    Move to Maintenance
  </button>
)}

        </div>
      </div>
    </div>
  );
}