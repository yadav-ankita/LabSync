import { SectionCard } from "../../components/SectionCard";

const CHART_HEIGHT = 130;
const MAX_BARS = 5;

// "F206 Lab" -> "F206" so axis labels stay short
const shortLabel = (lab) => lab.replace(/\s*lab(oratory)?\s*$/i, "") || lab;

export function ResourcesByLab({ resources }) {
  const counts = {};
  resources.forEach((r) => {
    const lab = r.labName || "Unassigned";
    counts[lab] = (counts[lab] || 0) + 1;
  });

  const sorted = Object.entries(counts)
    .map(([lab, value]) => ({ lab, value }))
    .sort((a, b) => b.value - a.value);

  const data = sorted.slice(0, MAX_BARS);
  const othersCount = sorted.slice(MAX_BARS).reduce((sum, d) => sum + d.value, 0);
  if (othersCount > 0) data.push({ lab: "Others", value: othersCount });

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <SectionCard title="Resources by lab">
      {resources.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#5B6A5F" }}>No resources yet.</p>
      ) : (
        <div>
          <div
            className="flex items-end gap-3 border-b px-1"
            style={{ height: CHART_HEIGHT + 24, borderColor: "#E3E6DF" }}
          >
            {data.map((d) => (
              <div key={d.lab} className="flex-1 min-w-0 flex flex-col items-center justify-end">
                <span
                  className="text-xs mb-1"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1F2A24" }}
                >
                  {d.value}
                </span>
                <div
                  className="w-full rounded-t-md"
                  style={{
                    maxWidth: 36,
                    height: Math.max(6, Math.round((d.value / max) * CHART_HEIGHT)),
                    backgroundColor: d.lab === "Others" ? "#D8DCD4" : "#D89A4E",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2 px-1">
            {data.map((d) => (
              <span
                key={d.lab}
                title={d.lab}
                className="flex-1 min-w-0 text-center text-xs truncate"
                style={{ color: "#5B6A5F" }}
              >
                {shortLabel(d.lab)}
              </span>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
