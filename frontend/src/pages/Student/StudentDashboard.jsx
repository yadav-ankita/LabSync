import React, { useState } from "react";
import { LabManuals } from "./LabManuals";
import { Sidebar } from "./Sidebar";
import { EditProfile } from "./EditProfile";

export default function StudentDashboard() {
  const [activeView, setActiveView] = useState("manuals");

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "#F2F4F1",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />

      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 min-w-0 px-10 py-8 overflow-y-auto">
        {activeView === "manuals" && <LabManuals />}
        {activeView === "profile" && <EditProfile />}
      </main>
    </div>
  );
}
