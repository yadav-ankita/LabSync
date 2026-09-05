import { useEffect, useState } from "react";
import { TopBar } from "./TopBar";
import { ResourceTag } from "../../components/ResourceTag";
import { ResourceStatusPill } from "../../components/ResourceStatusPill";
import { useAppContext } from "../../context/AppContext";
import { useFacultyContext } from "../../context/FacultyContext";

export function LabResources() {
  const { currentUser} = useAppContext();
  const {facultyResources, getAssignedLabResources }=useFacultyContext();
  //const [labFilter, setLabFilter] = useState("All Labs");

  useEffect(() => {
    getAssignedLabResources();
  }, []);

  /* const labs = ["All Labs", ...new Set((facultyResources || []).map((r) => r.labName || currentUser?.lab_name))].filter(Boolean);
  const visible =
    labFilter === "All Labs"
      ? facultyResources
      : facultyResources.filter((r) => (r.labName || currentUser?.lab_name) === labFilter); */
  const visible=facultyResources || [];

  return (
    <div>
      <TopBar title="Lab Resources" subtitle="Inventory for the laboratory assigned to you." />
    { /*
      {labs.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {labs.map((lab) => (
            <button
              key={lab}
              onClick={() => setLabFilter(lab)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor: labFilter === lab ? "#D89A4E" : "#D8DCD4",
                backgroundColor: labFilter === lab ? "#FBF1E3" : "white",
                color: labFilter === lab ? "#9A5F1D" : "#5B6A5F",
                fontWeight: labFilter === lab ? 600 : 400,
              }}
            >
              {lab}
            </button>
          ))}
        </div>
      )} 
      */}

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        <div
          className="grid grid-cols-12 px-5 py-3 text-xs uppercase tracking-wide"
          style={{ color: "#8A968D", borderBottom: "1px solid #E3E6DF", backgroundColor: "#F8F9F7" }}
        >
          <span className="col-span-2">Asset ID</span>
          <span className="col-span-4">Name</span>
          <span className="col-span-3">Lab</span>
          <span className="col-span-3 text-right">Status</span>
        </div>
        {visible.length === 0 ? (
          <div className="px-5 py-6 text-sm" style={{ color: "#5B6A5F" }}>
            No lab resources found for this assigned lab yet.
          </div>
        ) : visible.map((r, i) => (
          <div
            key={r._id || r.assetId || `${r.resourceName}-${i}`}
            className="grid grid-cols-12 items-center px-5 py-3.5"
            style={{ borderTop: i === 0 ? "none" : "1px solid #E3E6DF" }}
          >
            <span className="col-span-2">
              <ResourceTag id={r.assetId || r.id || "N/A"} />
            </span>
            <span className="col-span-4 text-sm" style={{ color: "#1F2A24" }}>{r.resourceName || r.name}</span>
            <span className="col-span-3 text-xs" style={{ color: "#5B6A5F" }}>{r.labName || currentUser?.lab_name}</span>
            <span className="col-span-3 flex justify-end">
              <ResourceStatusPill status={r.status || "Available"} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}