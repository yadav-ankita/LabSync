import { SectionCard } from "../../components/SectionCard";
import { DonutChart } from "../../components/DonutChart";

const STATUSES = [
  { label: "Available", color: "#2F6F52" },
  { label: "Borrowed", color: "#B08A1E" },
  { label: "Under Maintenance", color: "#C9782E" },
  { label: "Scrapped", color: "#B3261E" },
];

export function ResourceStatusChart({ resources }) {
  const counts = {};
  resources.forEach((r) => {
    const key = (r.status || "").toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });

  const data = STATUSES.map((s) => ({
    ...s,
    value: counts[s.label.toLowerCase()] || 0,
  }));

  // Anything with a status we don't list above (e.g. a newly added one)
  // still gets counted instead of silently disappearing from the total.
  const known = new Set(STATUSES.map((s) => s.label.toLowerCase()));
  const otherCount = Object.entries(counts)
    .filter(([key]) => !known.has(key))
    .reduce((sum, [, n]) => sum + n, 0);
  if (otherCount > 0) data.push({ label: "Other", value: otherCount, color: "#D8DCD4" });

  return (
    <SectionCard title="Resource status">
      {resources.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#5B6A5F" }}>No resources yet.</p>
      ) : (
        <DonutChart data={data} />
      )}
    </SectionCard>
  );
}
