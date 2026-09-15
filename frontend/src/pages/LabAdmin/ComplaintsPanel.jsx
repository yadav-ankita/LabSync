import { useEffect, useState } from "react";
import { TopBar } from "../../components/TopBar";
import { ComplaintRow } from "./Complaintrow";
import { useComplaintContext } from "../../context/ComplaintContext";
import axios from "../../axios";

const STATUS_FILTERS = ["All", "Pending", "In Progress", "Resolved"];

export function ComplaintsPanel() {
  console.log("🔥 LAB ADMIN COMPLAINTS PANEL IS RUNNING");
  const {
    Allcomplaints,
    getAllComplaints,
    editComplaintStatus,
  } = useComplaintContext();
  const [maintenanceIds, setMaintenanceIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [labFilter, setLabFilter] = useState("All Labs");

  // Fetch all complaints when page loads
  useEffect(() => {
    getAllComplaints();
    getMaintenanceIds();
  }, []);

const getMaintenanceIds = async () => {
  try {
    const { data } = await axios.get("/admin/maintenance");

    const ids = (data.maintenance || [])
      .map((item) => item.complaint?._id)
      .filter(Boolean);

    setMaintenanceIds(ids);
  } catch (error) {
    console.error("Error fetching maintenance records:", error);
  }
};

  const complaints = Allcomplaints || [];
console.log("REAL COMPLAINTS:", Allcomplaints);


const handleMoveToMaintenance = async (complaintId) => {
  try {
    const { data } = await axios.post("/admin/maintenance", {
      complaintId,
    });

    console.log("Maintenance created:", data);

    setMaintenanceIds((prev) => [...prev, complaintId]);

    alert("Complaint moved to Maintenance successfully.");
  } catch (error) {
    console.error("Error moving complaint to maintenance:", error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.msg ||
      "Could not move complaint to maintenance.";

    alert(message);
  }
};
  // Get unique labs from actual complaints
  const labs = [
    ...new Set(
      complaints
        .map((complaint) => complaint.labName)
        .filter(Boolean)
    ),
  ];

  // Change complaint status
  const handleStatusChange = async (id, status) => {
    const result = await editComplaintStatus(id, status);

    if (!result.success) {
      console.error(result.message);
    }
  };

  // Apply filters
  const visible = complaints.filter(
    (c) =>
      (statusFilter === "All" || c.status === statusFilter) &&
      (labFilter === "All Labs" || c.labName === labFilter)
  );

  return (
    <div>
      <TopBar
        title="All Complaints"
        subtitle="Complaints reported across every laboratory in the department."
        rightTop="Lab Administrator"
        rightBottom="Computer Engineering"
      />

      {/* Filters */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="text-xs px-3 py-1.5 rounded-full border transition-colors"
              style={{
                borderColor:
                  statusFilter === f
                    ? "#D89A4E"
                    : "#D8DCD4",

                backgroundColor:
                  statusFilter === f
                    ? "#FBF1E3"
                    : "white",

                color:
                  statusFilter === f
                    ? "#9A5F1D"
                    : "#5B6A5F",

                fontWeight:
                  statusFilter === f ? 600 : 400,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lab filter */}
        <select
          value={labFilter}
          onChange={(e) => setLabFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border bg-white focus:outline-none"
          style={{
            borderColor: "#D8DCD4",
            color: "#1F2A24",
          }}
        >
          <option value="All Labs">
            All Labs
          </option>

          {labs.map((lab) => (
            <option key={lab} value={lab}>
              {lab}
            </option>
          ))}
        </select>

      </div>

      {/* Complaints */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: "#E3E6DF" }}
      >
        {visible.length === 0 ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "#5B6A5F" }}
          >
            No complaints match these filters.
          </div>
        ) : (
          visible.map((c) => (
            <ComplaintRow
              key={c._id}
              complaint={c}
              onStatusChange={handleStatusChange}
               onMoveToMaintenance={handleMoveToMaintenance}
               maintenanceExists={maintenanceIds.includes(c._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}