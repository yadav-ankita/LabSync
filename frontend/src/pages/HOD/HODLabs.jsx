import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import axios from "../../axios";
import { TopBar } from "../../components/TopBar";
import { LabCard } from "../LabAdmin/LabCard";
export function HODLabs() {
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLabs = async () => {
      try {
        const { data } = await axios.get("/lab");
        setLabs(data.labs || []);
      } catch (error) {
        console.error("Error fetching department laboratories:", error.response?.data || error);
        setLabs([]);
      } finally {
        setLoading(false);
      }
    };
    getLabs();
  }, []);

  return (
    <div>
      <TopBar
        title="Laboratories"
        subtitle="View laboratories and their assigned resources across the department."
        rightTop="HOD Portal"
        rightBottom="Computer Engineering"
      />

      {loading ? (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center" style={{ borderColor: "#E3E6DF" }}>
          <p className="text-sm" style={{ color: "#5B6A5F" }}>Loading laboratories...</p>
        </div>
      ) : labs.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center" style={{ borderColor: "#E3E6DF" }}>
          <Building2 size={24} className="mx-auto mb-3" color="#D89A4E" />
          <p className="text-sm font-medium" style={{ color: "#1F2A24" }}>No laboratories found</p>
          <p className="text-xs mt-1" style={{ color: "#7B867E" }}>Laboratory records could not be loaded.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
          {labs.map((lab) => (
            <LabCard
              key={lab._id || lab.LabName}
              labName={lab.LabName || lab.labName || "Unnamed Lab"}
              faculty={
  lab.AssignFaculty?.name ||
  lab.facultyName ||
  "Not Yet Assigned"
}
              numberOfResources={lab.NumResources ?? lab.numberOfResources ?? 0}
              onClick={() =>
  navigate(
    `/labs/${encodeURIComponent(lab.LabName || lab.labName)}/resource`,
    { state: { returnView: "labs" } }
  )
}
            />
          ))}
        </div>
      )}
    </div>
  );
}
