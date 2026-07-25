import React, { useState } from "react";
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
import { LabManualCard } from "./LabManualCard";
import { LabManuals } from "./LabManuals";
import { TopBar } from "./TopBar";
import { StatusPill } from "../../components/StatusPill";
import { ResourceTag } from "../../components/ResourceTag";
import { ComplaintRow } from "./ComplaintRow";
import { MyComplaints } from "./MyComplaints";
import { ComplaintForm } from "./ComplaintForm";
import { Sidebar } from "./Sidebar";
import { DashboardHome } from "./DashboardHome";
import { StatCard } from "./StatCard";
import { EditProfile } from "./EditProfile";
/* =========================================================
   DUMMY DATA
   ========================================================= */
const INITIAL_COMPLAINTS = [
  {
    id: "CMP-1042",
    labName: "DBMS Lab - Block B",
    type: "Hardware",
    resourceId: "PC-014",
    description: "Monitor flickers intermittently and turns black after 10 minutes.",
    status: "In Progress",
    date: "05 Jul 2026",
  },
  {
    id: "CMP-1039",
    labName: "Networks Lab - Block A",
    type: "Software",
    resourceId: "PC-007",
    description: "Wireshark crashes on launch, packet capture not starting.",
    status: "Resolved",
    date: "28 Jun 2026",
  },
  {
    id: "CMP-1051",
    labName: "OS Lab - Block B",
    type: "Hardware",
    resourceId: "PC-021",
    description: "Keyboard has three unresponsive keys (A, S, D).",
    status: "Pending",
    date: "09 Jul 2026",
  },
]; 
/* =========================================================
   APP ROOT
   ========================================================= */
export default function StudentDashboard() {
  const [activeView, setActiveView] = useState("home");
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F2F4F1", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 px-10 py-8 overflow-y-auto">
        {activeView === "home" && <DashboardHome setActiveView={setActiveView} />}
        {activeView === "manuals" && <LabManuals />}
        {activeView === "raise" && <ComplaintForm/>}
        {activeView === "complaints" && <MyComplaints  />}
        {activeView === "profile" && <EditProfile />}
      </main>
    </div>
  );
}