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
export  function StatusPill({ status }) {
  const map = {
    Pending: { bg: "#FDECE3", text: "#9A4A1B", icon: CircleDot },
    "In Progress": { bg: "#FDF3D8", text: "#8A6410", icon: Loader2 },
    Resolved: { bg: "#E3EEE5", text: "#2F6F52", icon: CheckCircle2 },
  };
  const cfg = map[status] || map.Pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <Icon size={12} className={status === "In Progress" ? "animate-spin" : ""} />
      {status}
    </span>
  );
}