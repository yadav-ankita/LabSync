
import { useEffect, useState } from "react";
import axios from "../../axios";
import { TopBar } from "../../components/TopBar";
import { Trash2, Search } from "lucide-react";

export function ScrappedAssets() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchScrappedAssets = async () => {
      try {
        // Connect this to the Lab Incharge-specific endpoint.
        const { data } = await axios.get(
          "/faculty/LabResource/scrapped"
        );

        setResources(data.resources || []);
      } catch (error) {
        console.error(
          "Error fetching scrapped assets:",
          error.response?.data || error
        );
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScrappedAssets();
  }, []);

  const filteredResources = resources.filter((resource) => {
    const query = search.toLowerCase();

    return (
      (resource.assetId || "").toLowerCase().includes(query) ||
      (resource.resourceName || "").toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <TopBar
        title="Scrapped Assets"
        subtitle="View equipment that has been marked as scrapped."
      />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center
          sm:justify-between gap-4 mb-6">

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-50">
              <Trash2 size={24} className="text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Scrapped inventory
              </h2>
              <p className="text-sm text-gray-500">
                {resources.length} scrapped asset(s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border
            rounded-lg px-3 py-2 bg-white">
            <Search size={17} className="text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search asset ID or name..."
              className="outline-none text-sm w-full sm:w-64"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200
          rounded-xl overflow-x-auto">

          {loading ? (
            <p className="p-8 text-center text-gray-500">
              Loading scrapped assets...
            </p>
          ) : filteredResources.length === 0 ? (
            <div className="p-12 text-center">
              <Trash2
                size={36}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium text-gray-700">
                No scrapped assets found
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Scrapped assets will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Asset ID</th>
                  <th className="px-5 py-4">Resource name</th>
                  <th className="px-5 py-4">Lab</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Last updated</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredResources.map((resource) => (
                  <tr
                    key={resource._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium
                      text-gray-800 whitespace-nowrap">
                      {resource.assetId || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {resource.resourceName || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {resource.labName || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {resource.purchase?.category || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-1
                        rounded-full bg-red-50 text-red-700
                        text-xs font-medium">
                        {resource.status || "Scrapped"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-500
                      whitespace-nowrap">
                      {resource.updatedAt
                        ? new Date(
                            resource.updatedAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
