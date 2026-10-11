
import { useEffect, useState } from "react";
import { SectionCard } from "../../components/SectionCard";

const CHART_HEIGHT = 130;
const MAX_BARS = 5;

const COLORS = {
  bar: "#D89A4E",
  others: "#D9DEE5",
  baseline: "#ECEFF1",
  text: "#344054",
  muted: "#7B8490",
};

const shortLabel = (lab) =>
  lab.replace(/\s*lab(oratory)?\s*$/i, "") || lab;

export function ResourcesByLab({ resources, animationKey = 0 }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);

    let frame1;
    let frame2;

    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => setAnimated(true));
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
    };
  }, [animationKey]);

  const counts = {};

  resources.forEach((resource) => {
    const lab = resource.labName || "Unassigned";
    counts[lab] = (counts[lab] || 0) + 1;
  });

  const sorted = Object.entries(counts)
    .map(([lab, value]) => ({ lab, value }))
    .sort((a, b) => b.value - a.value);

  const data = sorted.slice(0, MAX_BARS);

  const othersCount = sorted
    .slice(MAX_BARS)
    .reduce((sum, item) => sum + item.value, 0);

  if (othersCount > 0) {
    data.push({ lab: "Others", value: othersCount });
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <SectionCard title="Resources by lab">
      {resources.length === 0 ? (
        <p
          className="text-sm text-center py-10"
          style={{ color: COLORS.muted }}
        >
          No resources yet.
        </p>
      ) : (
        <div>
          <div
            className="flex items-end gap-3 border-b px-1"
            style={{
              height: CHART_HEIGHT + 24,
              borderColor: COLORS.baseline,
            }}
          >
            {data.map((item, index) => {
              const targetHeight = Math.max(
                6,
                Math.round((item.value / max) * CHART_HEIGHT)
              );

              return (
                <div
                  key={`${animationKey}-${item.lab}`}
                  className="flex-1 min-w-0 flex flex-col items-center justify-end"
                >
                  <span
                    className="text-xs mb-1"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: COLORS.text,
                    }}
                  >
                    {item.value}
                  </span>

                  <div
                    key={`${animationKey}-${item.lab}-bar`}
                    className="w-full rounded-t-md"
                    style={{
                      maxWidth: 36,
                      height: targetHeight,
                      backgroundColor:
                        item.lab === "Others"
                          ? COLORS.others
                          : COLORS.bar,
                      transformOrigin: "bottom",
                      transform: animated ? "scaleY(1)" : "scaleY(0)",
                      animation: animated
                        ? `growBar-${animationKey} 850ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 100}ms both`
                        : "none",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-2 px-1">
            {data.map((item) => (
              <span
                key={item.lab}
                title={item.lab}
                className="flex-1 min-w-0 text-center text-xs truncate"
                style={{ color: COLORS.muted }}
              >
                {shortLabel(item.lab)}
              </span>
            ))}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes growBar-${animationKey} {
            from {
              transform: scaleY(0);
            }
            to {
              transform: scaleY(1);
            }
          }
        `}
      </style>
    </SectionCard>
  );
}
