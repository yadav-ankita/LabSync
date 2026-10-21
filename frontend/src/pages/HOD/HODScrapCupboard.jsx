import { useEffect, useState } from "react";
import { Archive } from "lucide-react";
import axios from "../../axios";
import { TopBar } from "../../components/TopBar";

export function HODScrapCupboard() {
  const [scrappedResources, setScrappedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getScrappedResources = async () => {
      try {
        const { data } = await axios.get("/admin/LabResource/scrapped");
        setScrappedResources(data.resources || []);
      } catch (error) {
        console.error("Error fetching scrapped resources:", error.response?.data || error);
        setScrappedResources([]);
      } finally {
        setLoading(false);
      }
    };
    getScrappedResources();
  }, []);

  return (
    <div>
      <TopBar
        title="Scrap Cupboard"
        subtitle="View assets marked as beyond repair across the department."
        rightTop="HOD Portal"
        rightBottom="Computer Engineering"
      />

      <div className="mt-8">
        {loading ? (
          <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: "#E3E6DF" }}>
            <p className="text-sm" style={{ color: "#5B6A5F" }}>Loading scrapped assets...</p>
          </div>
        ) : scrappedResources.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center" style={{ borderColor: "#E3E6DF" }}>
            <Archive size={24} className="mx-auto mb-3" color="#D89A4E" />
            <p className="text-sm font-medium" style={{ color: "#1F2A24" }}>No scrapped assets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {scrappedResources.map((resource) => (
              <div key={resource._id} className="bg-white rounded-xl border p-5" style={{ borderColor: "#E3E6DF" }}>
                <div className="flex justify-between items-start mb-4 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: "#7B867E" }}>Asset ID</p>
                    <h3 className="font-semibold mt-1" style={{ color: "#1F2A24" }}>{resource.assetId || "N/A"}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Scrapped</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div><p style={{ color: "#7B867E" }}>Resource</p><p className="font-medium" style={{ color: "#1F2A24" }}>{resource.resourceName || "N/A"}</p></div>
                  <div><p style={{ color: "#7B867E" }}>Original Lab</p><p className="font-medium" style={{ color: "#1F2A24" }}>{resource.previousLabName || "N/A"}</p></div>
                  <div><p style={{ color: "#7B867E" }}>Current Location</p><p className="font-medium" style={{ color: "#1F2A24" }}>{resource.labName || "Not Assigned"}</p></div>
                  <div><p style={{ color: "#7B867E" }}>Scrapped On</p><p className="font-medium" style={{ color: "#1F2A24" }}>{resource.updatedAt ? new Date(resource.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A"}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
