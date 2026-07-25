import {
  LayoutGrid,
  BookOpen,
  MessageSquarePlus,
  ListChecks,
  FlaskConical,
  FileText,
  Download,
  Cpu,
  Code2,
  ChevronRight,
  Clock,
  CircleDot,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { TopBar } from "./TopBar";
import { StatCard } from "./StatCard";
import { ResourceTag } from "../../components/ResourceTag";
import { StatusPill } from "../../components/StatusPill";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
const STUDENT = {
  name: "Aarav Mehta",
  rollNo: "21CS1042",
  branch: "Computer Science Engineering",
  semester: "5th Semester",
};
export  function DashboardHome({setActiveView }) {
  const {currentUser,complaints,getComplaints}=useAppContext();
  const firstName = currentUser?.name?.split(" ")[0] || "Student";
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const quickActions = [
    {
      label: "Browse lab manuals",
      desc: "View manuals for your enrolled subjects",
      icon: BookOpen,
      view: "manuals",
    },
    {
      label: "Raise a complaint",
      desc: "Report a hardware or software issue",
      icon: MessageSquarePlus,
      view: "raise",
    },
    {
      label: "Track complaint status",
      desc: "Check progress on issues you reported",
      icon: ListChecks,
      view: "complaints",
    },
  ];
  useEffect(()=>{
       getComplaints();
  },[])
  return (
    <div>
      <TopBar title={`Welcome back, ${firstName}`} subtitle="Here's what's happening across your labs." />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Pending" value={pending} icon={CircleDot} accent="#C9782E" />
        <StatCard label="In Progress" value={inProgress} icon={Loader2} accent="#B08A1E" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} accent="#2F6F52" />
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

      <h2 className="text-sm uppercase tracking-wide mb-3" style={{ color: "#5B6A5F" }}>
        Recent complaints
      </h2>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {complaints.slice(0, 3).map((c, i) => (
          <div
            key={c._id}
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
  );
}