import { useEffect, useState } from "react";
import {
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
   ChevronDown,
} from "lucide-react";

import { TopBar } from "../../components/TopBar";
import { ResourceTag } from "../../components/ResourceTag";
import { useAppContext } from "../../context/AppContext";
import axios from "../../axios";


export function MaintenanceLog() {
  const { currentUser } = useAppContext();

  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const getMaintenance = async () => {
    try {
      const { data } = await axios.get("/admin/maintenance");

      const records = data.maintenance || [];

      // Only show maintenance records belonging to this lab
      const labRecords = records.filter(
        (item) =>
          item.complaint?.labName === currentUser?.lab_name
      );

      setMaintenance(labRecords);
    } catch (error) {
      console.error(
        "Error fetching maintenance:",
        error.response?.data || error
      );
      setMaintenance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.lab_name) {
      getMaintenance();
    }
  }, [currentUser?.lab_name]);
  return (
    <div>
      <TopBar title="Maintenance" subtitle="History and current status of resources under repair."
       rightTop={`${currentUser?.lab_name || currentUser?.name || "No assigned lab"}`} 
       rightBottom=" Assigned laboratory"
      />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {maintenance.map((m, i) => (
          <div
            key={m._id}
            className=" cursor-pointer px-5 py-4"
            style={{ borderTop: i === 0 ? "none" : "1px solid #E3E6DF" }}
             onClick={() =>
              setExpandedId(expandedId === m._id ? null : m._id)
            }
          >
             <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#F2F4F1" }}
              >
                <Wrench size={16} color="#D89A4E" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A968D" }}>
                    {m.id}
                  </span>
                  <ResourceTag id={m.complaint?.resourceId} />
                </div>
                <p className="text-sm mt-1.5" style={{ color: "#1F2A24" }}>{m.complaint?.description}</p>
                <p className="text-xs mt-1" style={{ color: "#8A968D" }}>
                  {m.complaint?.labName} · Logged{" "}
            {m.complaint?.createdAt
            ? new Date(m.complaint.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "-"}
                </p>
              </div>
            </div>
                      
                       <ChevronDown
              size={18}
              className={`shrink-0 transition-transform ${
                expandedId === m._id ? "rotate-180" : ""
              }`}
              style={{ color: "#8A968D" }}
            />
    </div>

                        {expandedId === m._id && (
            
              <div
  className="mt-4 pt-4 border-t"
  style={{ borderColor: "#E3E6DF" }}
  onClick={(e) => e.stopPropagation()}
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* HOD APPROVAL */}
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "#F7F8F6" }}
    >
      <div className="flex items-center gap-2 mb-2">
        {m.hodApprovalStatus === "Approved" ? (
          <CheckCircle size={16} color="#4F7A58" />
        ) : m.hodApprovalStatus === "Rejected" ? (
          <XCircle size={16} color="#B34D4D" />
        ) : (
          <Clock size={16} color="#D89A4E" />
        )}

        <span
          className="text-xs font-medium"
          style={{ color: "#5B6A5F" }}
        >
          HOD APPROVAL
        </span>
      </div>

      <p
        className="text-sm font-medium"
        style={{ color: "#1F2A24" }}
      >
        {m.hodApprovalStatus || "Pending"}
      </p>

      {m.hodApprovalDate && (
        <p
          className="text-xs mt-1"
          style={{ color: "#8A968D" }}
        >
          {new Date(m.hodApprovalDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      )}
    </div>

    {/* MAINTENANCE STATUS */}
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "#F7F8F6" }}
    >
      <div className="flex items-center gap-2 mb-2">
        {m.maintenanceStatus === "Completed" ? (
          <CheckCircle size={16} color="#4F7A58" />
        ) : m.maintenanceStatus === "In Progress" ? (
          <Wrench size={16} color="#D89A4E" />
        ) : (
          <Clock size={16} color="#8A968D" />
        )}

        <span
          className="text-xs font-medium"
          style={{ color: "#5B6A5F" }}
        >
          MAINTENANCE
        </span>
      </div>

      <p
        className="text-sm font-medium"
        style={{ color: "#1F2A24" }}
      >
        {m.maintenanceStatus || "Not Started"}
      </p>
    </div>

    {/* FORWARDING */}
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "#F7F8F6" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Wrench size={16} color="#8A968D" />

        <span
          className="text-xs font-medium"
          style={{ color: "#5B6A5F" }}
        >
          FORWARDING
        </span>
      </div>

      <p
        className="text-sm font-medium"
        style={{ color: "#1F2A24" }}
      >
        {m.forwardingType || "None"}
      </p>

      {m.forwardedTo && (
        <p
          className="text-xs mt-1"
          style={{ color: "#8A968D" }}
        >
          To: {m.forwardedTo}
        </p>
      )}
    </div>

  </div>

  {/* HOD REMARKS */}
  {m.hodRemarks && (
    <div
      className="mt-4 rounded-lg p-4"
      style={{ backgroundColor: "#F7F8F6" }}
    >
      <p
        className="text-xs font-medium"
        style={{ color: "#5B6A5F" }}
      >
        HOD REMARKS
      </p>

      <p
        className="text-sm mt-1"
        style={{ color: "#1F2A24" }}
      >
        {m.hodRemarks}
      </p>
    </div>
  )}

  {/* RESOLUTION DETAILS */}
  {m.maintenanceStatus === "Completed" && (
    <div
      className="mt-4 rounded-lg p-4"
      style={{ backgroundColor: "#F7F8F6" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={16} color="#4F7A58" />

        <span
          className="text-xs font-medium"
          style={{ color: "#5B6A5F" }}
        >
          RESOLUTION DETAILS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <p className="text-xs" style={{ color: "#8A968D" }}>
            Resolved By
          </p>
          <p className="text-sm mt-1" style={{ color: "#1F2A24" }}>
            {m.resolvedBy || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs" style={{ color: "#8A968D" }}>
            Resolution Date
          </p>
          <p className="text-sm mt-1" style={{ color: "#1F2A24" }}>
            {m.resolutionDate
              ? new Date(m.resolutionDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-xs" style={{ color: "#8A968D" }}>
            Maintenance Site
          </p>
          <p className="text-sm mt-1" style={{ color: "#1F2A24" }}>
            {m.maintenanceSite || "-"}
          </p>
        </div>

      </div>

      <div className="mt-4">
        <p className="text-xs" style={{ color: "#8A968D" }}>
          Resolution Remarks
        </p>

        <p
          className="text-sm mt-1"
          style={{ color: "#1F2A24" }}
        >
          {m.resolutionRemarks || "-"}
        </p>
      </div>

      {m.finalRemarks && (
        <div className="mt-4">
          <p className="text-xs" style={{ color: "#8A968D" }}>
            Final Remarks
          </p>

          <p
            className="text-sm mt-1"
            style={{ color: "#1F2A24" }}
          >
            {m.finalRemarks}
          </p>
        </div>
      )}
    </div>
  )}
</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}