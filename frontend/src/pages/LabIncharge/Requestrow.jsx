import { Clock, User, Check, X } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";
import { RequestStatusPill } from "../../components/RequestStatusPill";

export function RequestRow({ request, onDecision }) {
  const date = new Date(request.createdAt);
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
              {request.id}
            </span>
            <ResourceTag id={request.resourceId} />
            <span className="text-sm font-medium" style={{ color: "#1F2A24" }}>{request.resourceName}</span>
          </div>
          <p className="text-sm mt-2" style={{ color: "#1F2A24" }}>{request.purpose}</p>
          <div className="flex items-center gap-1.5 text-xs mt-2 flex-wrap" style={{ color: "#8A968D" }}>
            <span>{request.labName}</span>
            <span>·</span>
            <User size={12} />
            <span>{request.requestedBy}</span>
            <span>·</span>
            <Clock size={12} />
            <span>{request.requestedFor}</span>
          </div>
          <p className="text-xs mt-1" style={{ color: "#8A968D" }}>Requested on {formattedDate}</p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <RequestStatusPill status={request.status} />
          {request.status === "Pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => onDecision(request.id, "Approved")}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border"
                style={{ borderColor: "#2F6F52", color: "#2F6F52" }}
              >
                <Check size={13} /> Approve
              </button>
              <button
                onClick={() => onDecision(request.id, "Rejected")}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border"
                style={{ borderColor: "#B3261E", color: "#B3261E" }}
              >
                <X size={13} /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}