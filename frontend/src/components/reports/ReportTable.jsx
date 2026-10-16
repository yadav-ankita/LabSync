import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";

const TONES = {
  Pending: { bg: "#FBE9E4", fg: "#B5472B" },
  "In Progress": { bg: "#FBF1E3", fg: "#9A5F1D" },
  Resolved: { bg: "#E3EEE5", fg: "#2F6F52" },
  Available: { bg: "#E3EEE5", fg: "#2F6F52" },
  "In Use": { bg: "#FBF1E3", fg: "#9A5F1D" },
  Borrowed: { bg: "#FBF1E3", fg: "#9A5F1D" },
  Maintenance: { bg: "#FBF1E3", fg: "#9A5F1D" },
  "Under Maintenance": { bg: "#FBF1E3", fg: "#9A5F1D" },
};

export function StatusBadge({ value }) {
  const tone = TONES[value] || { bg: "#EEF0EC", fg: "#5B6A5F" };
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: tone.bg, color: tone.fg }}>
      {value}
    </span>
  );
}

const compare = (x, y) => {
  const nx = parseFloat(x);
  const ny = parseFloat(y);
  if (!isNaN(nx) && !isNaN(ny)) return nx - ny;
  return String(x ?? "").localeCompare(String(y ?? ""));
};

export function ReportTable({ title, columns, rows, loading, error, onRowClick, emptyText = "No records match the selected filters." }) {
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const sorted = useMemo(() => {
    if (!sort.key) return rows;
    const copy = [...rows];
    copy.sort((a, b) => (sort.dir === "asc" ? 1 : -1) * compare(a[sort.key], b[sort.key]));
    return copy;
  }, [rows, sort]);

  const toggleSort = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const message = (text, color) => (
    <tr>
      <td colSpan={columns.length} className="px-4 py-10 text-center" style={{ color }}>{text}</td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
      <div className="px-4 py-3 border-b text-sm font-medium" style={{ color: "#1F2A24", borderColor: "#E3E6DF" }}>
        {title}
        {!loading && !error && (
          <span className="ml-2 text-xs font-normal" style={{ color: "#8A968D" }}>{rows.length} records</span>
        )}
        {onRowClick && !loading && rows.length > 0 && (
          <span className="ml-3 text-xs font-normal no-print" style={{ color: "#8A968D" }}>Click a row for details</span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead style={{ backgroundColor: "#F8F9F7", color: "#5B6A5F" }}>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-4 py-3 text-xs font-medium whitespace-nowrap">
                  <button type="button" onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown size={11} style={{ opacity: sort.key === col.key ? 1 : 0.35 }} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? message("Loading report data...", "#5B6A5F")
              : error
              ? message(error, "#B3261E")
              : sorted.length === 0
              ? message(emptyText, "#5B6A5F")
              : sorted.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`border-t ${onRowClick ? "cursor-pointer hover:bg-stone-50" : ""}`}
                    style={{ borderColor: "#E3E6DF", color: "#1F2A24" }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${col.wrap ? "" : "whitespace-nowrap"}`}
                        style={col.wrap ? { minWidth: 220 } : undefined}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
