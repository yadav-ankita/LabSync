import { useEffect } from "react";
import { X } from "lucide-react";

/* data = { title, subtitle, sections: [{ title, columns, rows }] }  (null = closed) */
export function DrilldownDrawer({ data, onClose }) {
  useEffect(() => {
    if (!data) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data, onClose]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(31,42,36,0.35)" }} onClick={onClose} />
      <aside className="relative w-full max-w-3xl h-full bg-white overflow-y-auto" style={{ borderLeft: "1px solid #E3E6DF" }}>
        <div className="flex items-start justify-between px-6 py-5 border-b" style={{ borderColor: "#E3E6DF" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#1F2A24", fontFamily: "'Space Grotesk', sans-serif" }}>{data.title}</h2>
            {data.subtitle && <p className="text-sm mt-0.5" style={{ color: "#5B6A5F" }}>{data.subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ color: "#5B6A5F" }}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {data.sections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-medium mb-2" style={{ color: "#1F2A24" }}>
                {section.title}
                <span className="ml-2 text-xs font-normal" style={{ color: "#8A968D" }}>{section.rows.length}</span>
              </p>
              <div className="border rounded-lg overflow-x-auto" style={{ borderColor: "#E3E6DF" }}>
                <table className="min-w-full text-left text-sm">
                  <thead style={{ backgroundColor: "#F8F9F7", color: "#5B6A5F" }}>
                    <tr>
                      {section.columns.map((c) => (
                        <th key={c.key} className="px-3 py-2 text-xs font-medium whitespace-nowrap">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.length === 0 ? (
                      <tr><td colSpan={section.columns.length} className="px-3 py-6 text-center text-sm" style={{ color: "#5B6A5F" }}>No records.</td></tr>
                    ) : (
                      section.rows.map((row, i) => (
                        <tr key={row.id ?? i} className="border-t" style={{ borderColor: "#E3E6DF", color: "#1F2A24" }}>
                          {section.columns.map((c) => (
                            <td key={c.key} className="px-3 py-2" style={c.wrap ? { minWidth: 200 } : { whiteSpace: "nowrap" }}>
                              {c.render ? c.render(row) : row[c.key]}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
