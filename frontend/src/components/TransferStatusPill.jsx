import { Clock, CheckCircle2, XCircle, CheckCheck, CircleDot } from "lucide-react";

// Matches on keywords so labels like "Pending (HOD)" or "Pending (Incharge)"
// still get the right colour, and any unknown status falls back to a
// neutral pill that shows its raw text.
export function TransferStatusPill({ status }) {
  const label = status || "Pending";
  const s = label.toLowerCase();

  let cfg = { bg: "#EEF1EC", text: "#3E4A41", icon: CircleDot };
  if (s.includes("pending")) cfg = { bg: "#FDECE3", text: "#9A4A1B", icon: Clock };
  else if (s.includes("reject")) cfg = { bg: "#FBEAEA", text: "#B3261E", icon: XCircle };
  else if (s.includes("complete")) cfg = { bg: "#EEF1EC", text: "#3E4A41", icon: CheckCheck };
  else if (s.includes("approve")) cfg = { bg: "#E3EEE5", text: "#2F6F52", icon: CheckCircle2 };

  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <Icon size={12} />
      {label}
    </span>
  );
}
