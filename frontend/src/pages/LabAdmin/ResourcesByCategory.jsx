import { SectionCard } from "../../components/SectionCard";
import { DonutChart } from "../../components/DonutChart";

// Theme-friendly palette (amber / green / dark / burnt orange / sage)
const PALETTE = ["#D89A4E", "#2F6F52", "#1F2A24", "#C9782E", "#7FA38C"];
const OTHERS_COLOR = "#D8DCD4";
const MAX_SLICES = 5;

// "Category" = the resource name (Computer, Projector, Camera, ...).
// Top 5 are shown individually; everything else is rolled into "Others".
export function ResourcesByCategory({ resources }) {
  const groups = {};
  resources.forEach((r) => {
    const name = (r.resourceName || "Unknown").trim();
    const key = name.toLowerCase();
    if (!groups[key]) groups[key] = { label: name, value: 0 };
    groups[key].value += 1;
  });

  const sorted = Object.values(groups).sort((a, b) => b.value - a.value);
  const data = sorted.slice(0, MAX_SLICES).map((g, i) => ({ ...g, color: PALETTE[i] }));
  const othersCount = sorted.slice(MAX_SLICES).reduce((sum, g) => sum + g.value, 0);
  if (othersCount > 0) data.push({ label: "Others", value: othersCount, color: OTHERS_COLOR });

  return (
    <SectionCard title="Resources by category">
      {resources.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#5B6A5F" }}>No resources yet.</p>
      ) : (
        <DonutChart data={data} />
      )}
    </SectionCard>
  );
}
