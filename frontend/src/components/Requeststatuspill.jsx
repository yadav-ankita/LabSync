import { CircleDot, CheckCircle2, XCircle } from "lucide-react";

export function RequestStatusPill({ status }) {
  const map = {
    Pending: { bg: "#FDECE3", text: "#9A4A1B", icon: CircleDot },
    Approved: { bg: "#E3EEE5", text: "#2F6F52", icon: CheckCircle2 },
    Rejected: { bg: "#FBEAEA", text: "#B3261E", icon: XCircle },
  };
  const cfg = map[status] || map.Pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}