import { Trash2 } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";

const STATUS_OPTIONS = ["Available", "Borrowed", "Under Maintenance"];

export function ResourceRow({ resource, onStatusChange, onDelete, readOnly = false }) {
  return (
    <div className="grid grid-cols-9 items-center px-5 py-3.5 border-t first:border-t-0" style={{ borderColor: "#E3E6DF" }}>
      <span className="col-span-2">
        <ResourceTag id={resource.assetId} />
      </span>
      <span className="col-span-4 text-sm truncate" style={{ color: "#1F2A24" }}>{resource.resourceName}</span>
      <span className="col-span-3 flex items-center justify-end gap-2">
        {readOnly ? (
          <span className="text-xs" style={{ color: "#5B6A5F" }}>{resource.status}</span>
        ) : (
          <>
            <select
              value={resource.status}
              onChange={(e) => onStatusChange(resource._id, e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border bg-white focus:outline-none"
              style={{ borderColor: "#D8DCD4", color: "#5B6A5F" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => onDelete(resource._id)}
              className="p-1.5 rounded-lg hover:bg-gray-50 shrink-0"
              title="Remove resource"
            >
              <Trash2 size={14} color="#B3261E" />
            </button>
          </>
        )}
      </span>
    </div>
  );
}