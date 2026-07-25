import { Wrench } from "lucide-react";
import { TopBar } from "./TopBar";
import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";
import { MAINTENANCE_LOG } from "./dummyData";

export function MaintenanceLog() {
  return (
    <div>
      <TopBar title="Maintenance" subtitle="History and current status of resources under repair across all labs." />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {MAINTENANCE_LOG.map((m, i) => (
          <div
            key={m.id}
            className="flex items-start justify-between gap-4 px-5 py-4"
            style={{ borderTop: i === 0 ? "none" : "1px solid #E3E6DF" }}
          >
            <div className="flex gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#F2F4F1" }}
              >
                <Wrench size={16} color="#D89A4E" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A968D" }}>
                    {m.id}
                  </span>
                  <ResourceTag id={m.resourceId} />
                </div>
                <p className="text-sm mt-1.5" style={{ color: "#1F2A24" }}>{m.issue}</p>
                <p className="text-xs mt-1" style={{ color: "#8A968D" }}>
                  {m.labName} · Logged {m.loggedOn}
                </p>
              </div>
            </div>
            <StatusPill status={m.status} />
          </div>
        ))}
      </div>
    </div>
  );
}