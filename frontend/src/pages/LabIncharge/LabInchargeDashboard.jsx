import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHome } from "./DashboardHome";
import { ComplaintsPanel } from "./ComplaintsPanel";
import { ResourceRequests } from "./ResourceRequests";
import { LabResources } from "./LabResources";
import { MaintenanceLog } from "./MaintenanceLog";
import { EditProfile } from "./EditProfile";

export function LabInchargeDashboard() {
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
        {activeView === "complaints" && <ComplaintsPanel />}
        {activeView === "requests" && <ResourceRequests />}
        {activeView === "resources" && <LabResources />}
        {activeView === "maintenance" && <MaintenanceLog />}
        {activeView === "profile" && <EditProfile />}
      </main>
    </div>
  );
}