import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { TopBar } from "../../components/TopBar";

export function ScrapCupboard() {
  const [scrappedResources, setScrappedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const getScrappedResources = async () => {
    try {
      const { data } = await axios.get("/admin/LabResource/scrapped");

      setScrappedResources(data.resources || []);
    } catch (error) {
      console.error("Error fetching scrapped resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getScrappedResources();
  }, []);

  return (
    <div>
      <TopBar
        title="Scrap Cupboard"
        subtitle="View assets marked as beyond repair"
        rightTop="Lab Administrator"
        rightBottom="Computer Engineering"
      />

      <div className="mt-8">
        {loading ? (
          <p className="text-gray-500">Loading scrapped assets...</p>
        ) : scrappedResources.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500">
              No scrapped assets found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {scrappedResources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Asset ID
                    </p>

                    <h3 className="font-semibold text-gray-900 mt-1">
                      {resource.assetId}
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Scrapped
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Resource</p>
                    <p className="font-medium text-gray-800">
                      {resource.resourceName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Original Lab</p>
                    <p className="font-medium text-gray-800">
                      {resource.previousLabName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Current Location</p>
                    <p className="font-medium text-gray-800">
                      {resource.labName || "Not Assigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Scrapped On</p>
                    <p className="font-medium text-gray-800">
                      {resource.updatedAt
                        ? new Date(resource.updatedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
})
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}