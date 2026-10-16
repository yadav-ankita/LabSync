import { Download, FileText, Printer, Lightbulb } from "lucide-react";
import { DATE_PRESETS } from "./reportUtils";

/* ---------------- Summary cards ---------------- */
export function SummaryCards({ items }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
      {items.map((item) => (
        <div key={item.label} className="bg-white border rounded-lg px-4 py-3" style={{ borderColor: "#E3E6DF" }}>
          <p className="text-xs" style={{ color: "#5B6A5F" }}>{item.label}</p>
          <p
            className="text-xl font-semibold mt-1"
            style={{ color: item.warn ? "#B3261E" : "#1F2A24", fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Auto-generated insight line ---------------- */
export function InsightBanner({ text }) {
  if (!text) return null;
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5 text-sm"
      style={{ backgroundColor: "#FBF1E3", color: "#9A5F1D", border: "1px solid #F0DDBF" }}
    >
      <Lightbulb size={16} /> {text}
    </div>
  );
}

/* ---------------- Filter bar ---------------- */
const fieldStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

export function ReportFilters({
  range, showDates = true,
  search, onSearch, searchPlaceholder,
  extra,
  onCsv, onPdf, onPrint, exportDisabled,
}) {
  return (
    <div className="flex flex-col gap-3 mb-5 no-print">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-3">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs" style={{ color: "#5B6A5F" }}>
            Search
            <input
              type="search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="block w-full sm:w-52 mt-1 px-3 py-2 rounded-lg border bg-white text-sm"
              style={fieldStyle}
            />
          </label>
          {extra}
          {showDates && (
            <>
              <label className="text-xs" style={{ color: "#5B6A5F" }}>
                From
                <input type="date" value={range.fromDate} onChange={(e) => range.setFrom(e.target.value)}
                  className="block mt-1 px-3 py-2 rounded-lg border bg-white text-sm" style={fieldStyle} />
              </label>
              <label className="text-xs" style={{ color: "#5B6A5F" }}>
                To
                <input type="date" value={range.toDate} min={range.fromDate || undefined} onChange={(e) => range.setTo(e.target.value)}
                  className="block mt-1 px-3 py-2 rounded-lg border bg-white text-sm" style={fieldStyle} />
              </label>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {[
            { label: "CSV", icon: Download, fn: onCsv },
            { label: "PDF", icon: FileText, fn: onPdf },
            { label: "Print", icon: Printer, fn: onPrint },
          ].map(({ label, icon: Icon, fn }) => (
            <button
              key={label}
              type="button"
              onClick={fn}
              disabled={exportDisabled}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#1F2A24" }}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {showDates && (
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((p) => {
            const active = range.preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => range.setPreset(p.id)}
                className="px-3 py-1.5 rounded-full border text-xs"
                style={{
                  borderColor: active ? "#D89A4E" : "#D8DCD4",
                  backgroundColor: active ? "#FBF1E3" : "white",
                  color: active ? "#9A5F1D" : "#5B6A5F",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
