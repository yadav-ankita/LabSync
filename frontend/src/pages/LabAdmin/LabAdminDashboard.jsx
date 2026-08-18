import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHome } from "./DashboardHome";
import { ComplaintsPanel } from "./Complaintspanel";
import { ResourceManagement } from "./ResourceManagement";
import { Approvals } from "./Approvals";
import { MaintenanceLog } from "./MaintenanceLog";
import { Reports } from "./Reports";
import { EditProfile } from "./EditProfile";
import { AddFaculty } from "./AddFaculty";
import { PurchaseRegister } from "./PurchaseRegister";

export function LabAdminDashboard() {
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
        {activeView === "resources" && <ResourceManagement />}
        {activeView === "approvals" && <Approvals />}
        
        {activeView === "maintenance" && <MaintenanceLog />}
        {activeView === "reports" && <Reports />}
        {activeView === "profile" && <EditProfile />}
        {activeView==="faculty" && <AddFaculty/>}
        {activeView === "purchases" && <PurchaseRegister />}
      </main>
    </div>
  );
}