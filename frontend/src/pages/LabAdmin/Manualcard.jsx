import { FileText, Trash2 } from "lucide-react";

export function ManualCard({ manual, onDelete }) {
  return (
    <div className="p-5 rounded-xl border bg-white flex flex-col" style={{ borderColor: "#E3E6DF" }}>
      <div className="flex items-start justify-between">
        <FileText size={20} color="#D89A4E" />
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: "#F2F4F1", color: "#5B6A5F", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {manual.fileType}
          </span>
          <button onClick={() => onDelete(manual.id)} className="p-1 rounded hover:bg-gray-50" title="Remove manual">
            <Trash2 size={14} color="#B3261E" />
          </button>
        </div>
      </div>
      <p className="text-sm font-medium mt-3" style={{ color: "#1F2A24" }}>{manual.title}</p>
      <p className="text-xs mt-1" style={{ color: "#5B6A5F" }}>{manual.subject}</p>
      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "#E3E6DF" }}>
        <span className="text-xs" style={{ color: "#8A968D" }}>
          Sem {manual.semester} · Updated {manual.updated}
        </span>
      </div>
    </div>
  );
}