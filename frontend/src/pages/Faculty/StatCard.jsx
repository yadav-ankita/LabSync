export function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="p-5 rounded-xl border bg-white" style={{ borderColor: "#E3E6DF" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide" style={{ color: "#5B6A5F" }}>
          {label}
        </span>
        <Icon size={18} color={accent} />
      </div>
      <p className="text-3xl" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1F2A24" }}>
        {value}
      </p>
    </div>
  );
}