// Same pattern the dashboard already uses: small uppercase heading above a
// white bordered card. `padded={false}` is for list-style cards whose rows
// bring their own padding.
export function SectionCard({ title, action, padded = true, children }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm uppercase tracking-wide" style={{ color: "#5B6A5F" }}>
          {title}
        </h2>
        {action}
      </div>
      <div
        className={`bg-white rounded-xl border overflow-hidden flex-1 ${padded ? "p-5" : ""}`}
        style={{ borderColor: "#E3E6DF" }}
      >
        {children}
      </div>
    </div>
  );
}
