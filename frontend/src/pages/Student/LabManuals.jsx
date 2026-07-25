import React from "react";
import { TopBar } from "./TopBar";
import { LabManualCard } from "./LabManualCard";
import { useAppContext } from "../../context/AppContext";
const LAB_MANUALS = [
  {
    id: "LM001",
    subject: "Data Structures Lab",
    labName: "DS Lab - Block A",
    title: "Data Structures Lab Manual",
    fileType: "PDF",
    size: "2.4 MB",
    updated: "12 Jun 2026",
  },
  {
    id: "LM002",
    subject: "Database Management Lab",
    labName: "DBMS Lab - Block B",
    title: "SQL Practicals & Schema Guide",
    fileType: "PDF",
    size: "1.8 MB",
    updated: "03 Jun 2026",
  },
  {
    id: "LM003",
    subject: "Computer Networks Lab",
    labName: "Networks Lab - Block A",
    title: "Networking Protocols Manual",
    fileType: "PDF",
    size: "3.1 MB",
    updated: "28 May 2026",
  },
  {
    id: "LM004",
    subject: "Operating Systems Lab",
    labName: "OS Lab - Block B",
    title: "Process Scheduling Exercises",
    fileType: "DOCX",
    size: "980 KB",
    updated: "20 May 2026",
  },
  {
    id: "LM005",
    subject: "Web Technologies Lab",
    labName: "WebTech Lab - Block C",
    title: "Frontend & Backend Lab Guide",
    fileType: "PDF",
    size: "2.0 MB",
    updated: "15 Jun 2026",
  },
  {
    id: "LM006",
    subject: "Microprocessors Lab",
    labName: "Micro Lab - Block C",
    title: "8085 Assembly Programs",
    fileType: "PDF",
    size: "1.5 MB",
    updated: "09 Jun 2026",
  },
];
 export function LabManuals() {
  //  const { labManuals, getLabManuals, loadingManuals, currentUser } = useAppContext();
  // useEffect(() => {
  //   getLabManuals();
  // }, [getLabManuals]);
  return (
    <div>
      <TopBar title="Lab Manuals" subtitle="Manuals available for your enrolled subjects." />
      <div className="grid grid-cols-3 gap-4">
        {LAB_MANUALS.map((manual) => (
          <LabManualCard key={manual.id} manual={manual} />
        ))}
      </div>
    </div>

  // <div>
  //     <TopBar
  //       title="Lab Manuals"
  //       subtitle={
  //         currentUser?.semester
  //           ? `Manuals available for semester ${currentUser.semester}.`
  //           : "Set your semester under Edit Profile to see your manuals."
  //       }
  //     />
 
  //     {loadingManuals && <p className="text-sm" style={{ color: "#5B6A5F" }}>Loading manuals…</p>}
 
  //     {!loadingManuals && labManuals.length === 0 && (
  //       <p className="text-sm" style={{ color: "#5B6A5F" }}>
  //         No manuals found yet. Make sure your semester is set under Edit Profile.
  //       </p>
  //     )}
 
  //     <div className="grid grid-cols-3 gap-4">
  //       {labManuals.map((manual) => (
  //         <LabManualCard key={manual._id || manual.id} manual={manual} />
  //       ))}
  //     </div>
  //   </div>


  );
}