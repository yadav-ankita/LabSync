import { CheckCircle2, UserRound, Wrench } from "lucide-react";

export function ResourceStatusPill({ status }) {
  const map = {
    Available: { bg: "#E3EEE5", text: "#2F6F52", icon: CheckCircle2 },
    Borrowed: { bg: "#FDF3D8", text: "#8A6410", icon: UserRound },
    "Under Maintenance": { bg: "#FDECE3", text: "#9A4A1B", icon: Wrench },
  };
  const cfg = map[status] || map.Available;
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