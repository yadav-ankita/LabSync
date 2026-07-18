import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";
import {Clock} from "lucide-react"
 export function ComplaintRow({ complaint }) {
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
              {complaint.type}
            </span>
          </div>
          <p className="text-sm mt-2" style={{ color: "#1F2A24" }}>{complaint.description}</p>
          <div className="flex items-center gap-1.5 text-xs mt-2" style={{ color: "#8A968D" }}>
            <span>{complaint.labName}</span>
            <span>·</span>
            <Clock size={12} />
            <span>{complaint.date}</span>
          </div>
        </div>
        <StatusPill status={complaint.status} />
      </div>
    </div>
  );
}
