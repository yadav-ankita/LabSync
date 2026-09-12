import {
  MessageSquareWarning,
  ClipboardCheck,
  Wrench,
  ChevronRight,
  CircleDot,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { TopBar } from "../../components/TopBar";
import { StatCard } from "./StatCard";
import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";
import {
  INCHARGE_COMPLAINTS,
  LAB_RESOURCES,
} from "./dummyData";
import { useAppContext } from "../../context/AppContext";
import { useFacultyContext } from "../../context/FacultyContext";
import { Navigate } from "react-router-dom";

export function DashboardHome({ setActiveView }) {
  const { currentUser } = useAppContext();
  const { getResourceAssignmentRequests } = useFacultyContext();

  const pending = INCHARGE_COMPLAINTS.filter(
    (c) => c.status === "Pending"
  ).length;

  const inProgress = INCHARGE_COMPLAINTS.filter(
    (c) => c.status === "In Progress"
  ).length;

  const [pendingRequests, setPendingRequests] = useState(0);

  const underMaintenance = LAB_RESOURCES.filter(
    (r) => r.status === "Under Maintenance"
  ).length;

  useEffect(() => {
    const fetchPendingRequests = async () => {
      const result = await getResourceAssignmentRequests();

      if (result.success) {
        const requests = result.requests || [];

        setPendingRequests(
          requests.filter(
            (request) => request.status === "Pending"
          ).length
        );
      }
    };

    fetchPendingRequests();
  }, [getResourceAssignmentRequests]);

  const quickActions = [
    {
      label: "Approve resource assignments",
      desc: "Approve or reject resource assignments from the Lab Administrator",
      icon: ClipboardCheck,
      view: "assignmentApprovals",
    },
    {
      label: "Review complaints",
      desc: "Update status on issues reported in your labs",
      icon: MessageSquareWarning,
      view: "complaints",
    },
    {
      label: "Approve resource transfer requests",
      desc: "Approve or reject pending resource transfer",
      icon: ClipboardCheck,
      view: "requests",
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
      {currentUser && (
        <Navigate to="/labIncharge-dashboard" />
      )}

      <div>
        <TopBar
          title={`Welcome, ${
            currentUser?.faculty_name?.split(" ,") ||
            currentUser?.faculty_name ||
            "Faculty"
          }`}
          subtitle="Here's what's happening across your assigned labs."
          rightTop={`${
            currentUser?.lab_name ||
            currentUser?.name ||
            "No assigned lab"
          }`}
          rightBottom="Assigned laboratory"
        />

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
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
  label="Resource Assignments"
  value={pendingRequests}
  icon={ClipboardCheck}
  accent="#2F6F52"
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

        <div className="grid grid-cols-4 gap-4 mb-8">
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
          {INCHARGE_COMPLAINTS.slice(0, 4).map((c, i) => (
            <div
              key={c.id}
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

                <p
                  className="text-sm truncate"
                  style={{ color: "#1F2A24" }}
                >
                  {c.description}
                </p>
              </div>

              <StatusPill status={c.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}