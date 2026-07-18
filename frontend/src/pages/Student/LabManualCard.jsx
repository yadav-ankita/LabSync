import {
  LayoutGrid,
  BookOpen,
  MessageSquarePlus,
  ListChecks,
  FlaskConical,
  FileText,
  Download,
  Cpu,
  Code2,
  ChevronRight,
  Clock,
  CircleDot,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { TopBar } from "./TopBar";

export function LabManualCard({ manual }) {
  return (
    <div className="p-5 rounded-xl border bg-white flex flex-col" style={{ borderColor: "#E3E6DF" }}>
      <div className="flex items-start justify-between">
        <FileText size={20} color="#D89A4E" />
        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{ backgroundColor: "#F2F4F1", color: "#5B6A5F", fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {manual.fileType}
        </span>
      </div>
      <p className="text-sm font-medium mt-3" style={{ color: "#1F2A24" }}>{manual.title}</p>
      <p className="text-xs mt-1" style={{ color: "#5B6A5F" }}>{manual.subject}</p>
      <p className="text-xs mt-0.5" style={{ color: "#8A968D" }}>{manual.labName}</p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: "#E3E6DF" }}>
        <span className="text-xs" style={{ color: "#8A968D" }}>
          {manual.size} · Updated {manual.updated}
        </span>
        <button
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border hover:bg-gray-50"
          style={{ borderColor: "#D89A4E", color: "#9A5F1D" }}
        >
          <Download size={13} /> View
        </button>
      </div>
    </div>
  );
}
