// data: [{ label, value, color }]
// Pure SVG (no chart library). The circle radius is chosen so the
// circumference is exactly 100, which lets stroke-dasharray take a
// percentage directly.
const RADIUS = 15.9155;

export function DonutChart({ data, centerLabel = "Total", size = 120 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let offset = 25; // start at 12 o'clock

  return (
    <div className="flex items-center gap-5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 42 42"
        className="shrink-0"
        role="img"
        aria-label={`${centerLabel}: ${total}`}
      >
        <circle cx="21" cy="21" r={RADIUS} fill="none" stroke="#F2F4F1" strokeWidth="5" />
        {total > 0 &&
          data.map((d) => {
            if (d.value === 0) return null;
            const pct = (d.value / total) * 100;
            const segment = (
              <circle
                key={d.label}
                cx="21"
                cy="21"
                r={RADIUS}
                fill="none"
                stroke={d.color}
                strokeWidth="5"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset={offset}
              />
            );
            offset -= pct;
            return segment;
          })}
        <text
          x="21"
          y="22.5"
          textAnchor="middle"
          fontSize="7"
          fill="#1F2A24"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {total}
        </text>
        <text x="21" y="27.5" textAnchor="middle" fontSize="3" fill="#8A968D">
          {centerLabel}
        </text>
      </svg>

      <ul className="flex-1 min-w-0 space-y-2.5">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <li key={d.label} className="flex items-start justify-between gap-2 text-xs">
              <span className="flex flex-1 items-start gap-2 min-w-0">
                <span className="mt-0.5 w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="flex-1 min-w-0" style={{ color: "#5B6A5F", overflowWrap: "anywhere" }}>{d.label}</span>
              </span>
              <span
                className="shrink-0"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1F2A24" }}
              >
                {d.value} <span style={{ color: "#8A968D" }}>({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
