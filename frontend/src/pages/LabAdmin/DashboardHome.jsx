import {
  MessageSquareWarning,
  Boxes,
  ClipboardCheck,
  BookOpen,
  ChevronRight,
  CircleDot,
  Wrench,
  FlaskConical,
} from "lucide-react";
import { TopBar } from "./TopBar";
import { StatCard } from "./StatCard";
import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";
import { ALL_COMPLAINTS, ALL_RESOURCES, APPROVAL_REQUESTS, LABS } from "./dummyData";

export function DashboardHome({ setActiveView }) {
  const openComplaints = ALL_COMPLAINTS.filter((c) => c.status !== "Resolved").length;
  const underMaintenance = ALL_RESOURCES.filter((r) => r.status === "Under Maintenance").length;
  const pendingApprovals = APPROVAL_REQUESTS.filter((r) => r.status === "Pending").length;
  const totalResources = ALL_RESOURCES.length;

  const quickActions = [
    {
      label: "Manage complaints",
      desc: "Review issues reported across every lab",
      icon: MessageSquareWarning,
      view: "complaints",
    },
    {
      label: "Manage resources",
      desc: "Add, edit, or transfer lab equipment",
      icon: Boxes,
      view: "resources",
    },
    {
      label: "Update lab manuals",
      desc: "Publish manuals for students and faculty",
      icon: BookOpen,
      view: "manuals",
    },
  ];

  const labBreakdown = LABS.map((lab) => ({
    lab,
    resources: ALL_RESOURCES.filter((r) => r.labName === lab).length,
    complaints: ALL_COMPLAINTS.filter((c) => c.labName === lab && c.status !== "Resolved").length,
  }));

  return (
    <div>
      <TopBar title="Department Overview" subtitle="A cross-lab snapshot of resources, complaints, and requests." />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Open Complaints" value={openComplaints} icon={CircleDot} accent="#C9782E" />
        <StatCard label="Total Resources" value={totalResources} icon={Boxes} accent="#2F6F52" />
        <StatCard label="Under Maintenance" value={underMaintenance} icon={Wrench} accent="#9A4A1B" />
        <StatCard label="Pending Approvals" value={pendingApprovals} icon={ClipboardCheck} accent="#B08A1E" />
      </div>

      <h2 className="text-sm uppercase tracking-wide mb-3" style={{ color: "#5B6A5F" }}>
        Quick actions
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {quickActions.map((qa) => {
          const Icon = qa.icon;
          return (
            <button
              key={qa.label}
              onClick={() => setActiveView(qa.view)}
              className="text-left p-5 rounded-xl border bg-white hover:shadow-sm transition-shadow group"
              style={{ borderColor: "#E3E6DF" }}
            >
              <Icon size={20} color="#D89A4E" />
              <p className="mt-3 text-sm font-medium" style={{ color: "#1F2A24" }}>{qa.label}</p>
              <p className="text-xs mt-1" style={{ color: "#5B6A5F" }}>{qa.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs mt-3" style={{ color: "#D89A4E" }}>
                Go <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-sm uppercase tracking-wide mb-3" style={{ color: "#5B6A5F" }}>
            Labs at a glance
          </h2>
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
            {labBreakdown.map((l, i) => (
              <div
                key={l.lab}
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderTop: i === 0 ? "none" : "1px solid #E3E6DF" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FlaskConical size={14} color="#D89A4E" />
                  <p className="text-sm truncate" style={{ color: "#1F2A24" }}>{l.lab}</p>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0" style={{ color: "#5B6A5F" }}>
                  <span>{l.resources} assets</span>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: l.complaints > 0 ? "#FDECE3" : "#F2F4F1",
                      color: l.complaints > 0 ? "#9A4A1B" : "#5B6A5F",
                    }}
                  >
                    {l.complaints} open
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wide mb-3" style={{ color: "#5B6A5F" }}>
            Recent complaints
          </h2>
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
            {ALL_COMPLAINTS.slice(0, 4).map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderTop: i === 0 ? "none" : "1px solid #E3E6DF" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <ResourceTag id={c.resourceId} />
                  <p className="text-sm truncate" style={{ color: "#1F2A24" }}>{c.description}</p>
                </div>
                <StatusPill status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}