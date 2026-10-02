import {
  MessageSquareWarning,
  Wrench,
  ChevronRight,
  CircleDot,
  Loader2,
} from "lucide-react";
import axios from "../../axios";
import { useEffect, useState } from "react";
import { TopBar } from "../../components/TopBar";
import { StatCard } from "./StatCard";
import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";
import { LAB_RESOURCES } from "./dummyData";
import { useAppContext } from "../../context/AppContext";

export function DashboardHome({ setActiveView }) {
  const { currentUser } = useAppContext();
const [complaints, setComplaints] = useState([]);
const pending = complaints.filter(
  (c) => c.status === "Pending"
).length;

const inProgress = complaints.filter(
  (c) => c.status === "In Progress"
).length;


useEffect(() => {
  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get("/faculty/complaints");
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    }
  };

  fetchComplaints();
}, []);
  const underMaintenance = LAB_RESOURCES.filter(
    (r) => r.status === "Under Maintenance"
  ).length;

  const quickActions = [
    {
      label: "Review complaints",
      desc: "Review and update your reported issues",
      icon: MessageSquareWarning,
      view: "complaints",
    },
    {
      label: "Track maintenance",
      desc: "See resources currently under repair",
      icon: Wrench,
      view: "maintenance",
    },
  ];

  return (
    <>
      <div>
        <TopBar
          title={`Welcome, ${currentUser?.faculty_name || currentUser?.name || "Faculty"}`}
          subtitle="Your faculty workspace"
        />

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Pending Complaints"
            value={pending}
            icon={CircleDot}
            accent="#C9782E"
          />

          <StatCard
            label="In Progress"
            value={inProgress}
            icon={Loader2}
            accent="#B08A1E"
          />

          <StatCard
            label="Under Maintenance"
            value={underMaintenance}
            icon={Wrench}
            accent="#9A4A1B"
          />
        </div>

        {/* Quick Actions */}
        <h2
          className="text-sm uppercase tracking-wide mb-3"
          style={{ color: "#5B6A5F" }}
        >
          Quick actions
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-8">
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

                <p
                  className="mt-3 text-sm font-medium"
                  style={{ color: "#1F2A24" }}
                >
                  {qa.label}
                </p>

                <p
                  className="text-xs mt-1"
                  style={{ color: "#5B6A5F" }}
                >
                  {qa.desc}
                </p>

                <span
                  className="inline-flex items-center gap-1 text-xs mt-3"
                  style={{ color: "#D89A4E" }}
                >
                  Go
                  <ChevronRight
                    size={13}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Recent Complaints */}
        <h2
          className="text-sm uppercase tracking-wide mb-3"
          style={{ color: "#5B6A5F" }}
        >
          Recent complaints
        </h2>

        <div
          className="bg-white rounded-xl border overflow-hidden"
          style={{ borderColor: "#E3E6DF" }}
        >
         {complaints.length === 0 ? (
  <div className="p-6 text-center text-sm" style={{ color: "#5B6A5F" }}>
    No complaints found.
  </div>
) : (
  complaints.slice(0, 4).map((c, i) => (
    <div
      key={c._id}
      className="flex items-center justify-between px-5 py-3.5"
      style={{
        borderTop:
          i === 0
            ? "none"
            : "1px solid #E3E6DF",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <ResourceTag id={c.resourceId} />

        <div className="min-w-0">
          <p
            className="text-sm truncate"
            style={{ color: "#1F2A24" }}
          >
            {c.description}
          </p>

          <p
            className="text-xs mt-1"
            style={{ color: "#8A968D" }}
          >
            {c.issueType} · {c.labName}
          </p>
        </div>
      </div>

      <StatusPill status={c.status} />
    </div>
  ))
)}
        </div>
      </div>
    </>
  );
}