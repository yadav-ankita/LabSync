import { ArrowLeftRight } from "lucide-react";
import { SectionCard } from "../../components/SectionCard";
import { ResourceTag } from "../../components/ResourceTag";
import { TransferStatusPill } from "../../components/TransferStatusPill";

// Maps one request from /admin/resource-assignment-requests into the shape
// this list needs. The fallbacks cover the usual field names; if your
// documents use different ones, this is the only place to change.
const normalizeTransfer = (r) => ({
  id: r._id,
  assetId: r.assetId || r.resourceId || r.resource?.assetId || "—",
  fromLab: r.fromLab || r.sourceLab || r.currentLab || r.resource?.labName || "—",
  toLab: r.toLab || r.targetLab || r.destinationLab || r.requestedLab || r.labName || "—",
  status: r.status || "Pending",
  createdAt: r.createdAt,
});

const formatDate = (value) => {
  const d = new Date(value);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-GB");
};

export function RecentTransfers({ requests, onViewAll }) {
  const transfers = requests
    .map(normalizeTransfer)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <SectionCard
      title="Recent resource transfers"
      padded={false}
      action={
        onViewAll && (
          <button onClick={onViewAll} className="text-xs" style={{ color: "#D89A4E" }}>
            View all
          </button>
        )
      }
    >
      {transfers.length === 0 ? (
        <p className="text-sm text-center py-10" style={{ color: "#5B6A5F" }}>
          No resource transfers yet.
        </p>
      ) : (
        transfers.map((t, i) => (
          <div
            key={t.id || i}
            className="flex items-center justify-between gap-4 px-5 py-3.5"
            style={{ borderTop: i === 0 ? "none" : "1px solid #E3E6DF" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#F2F4F1" }}
              >
                <ArrowLeftRight size={16} color="#D89A4E" />
              </div>
              <div className="min-w-0">
                <ResourceTag id={t.assetId} />
                <p className="text-xs mt-1 truncate" style={{ color: "#5B6A5F" }}>
                  {t.fromLab} → {t.toLab}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <TransferStatusPill status={t.status} />
              <span
                className="text-xs"
                style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A968D" }}
              >
                {formatDate(t.createdAt)}
              </span>
            </div>
          </div>
        ))
      )}
    </SectionCard>
  );
}
