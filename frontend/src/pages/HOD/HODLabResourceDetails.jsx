import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { useAdminContext } from "../../context/AdminContext";
import { ResourceRow } from "../LabAdmin/Resourcerow";
import { Sidebar } from "./Sidebar";
const ALL_CATEGORIES = "All categories";

const RESOURCE_CATEGORIES = [
  "Desktops",
  "Laptops",
  "Monitors",
  "CPUs",
  "Keyboards",
  "Mouse",
  "Printers",
  "Projectors",
  "Networking Equipment",
  "Power Backup",
  "Servers",
  "Raspberry Pi Kits",
  "Furniture",
  "Electrical Equipment",
  "Cameras",
  "Software Licenses",
];

export default function HODLabResourceDetails() {
  const { labName: routeLabName } = useParams();
  const navigate = useNavigate();

  const { labName, labResorces, getLabs, getLabResources } =
    useAdminContext();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [selectedResource, setSelectedResource] = useState(null);
  const [activeTab, setActiveTab] = useState("Configuration");

  const handleSidebarNavigation = (activeView) => {
  navigate("/HOD-dashboard", {
    state: { activeView },
  });
};
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);

      try {
        await Promise.all([getLabs(), getLabResources()]);
      } catch (error) {
        console.error("Error loading HOD lab resources:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setResources(labResorces || []);
  }, [labResorces]);

  const selectedLab = (labName || []).find(
    (lab) => lab.LabName === routeLabName
  );

  const labResources = resources.filter(
    (resource) => resource.labName === routeLabName
  );

  const getCategory = (resource) =>
    resource.purchase?.category || "";

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleResources = labResources.filter((resource) => {
    const category = getCategory(resource);

    const matchesCategory =
      selectedCategory === ALL_CATEGORIES ||
      category === selectedCategory;

    const status = resource.status || "Available";

    const matchesStatus =
      selectedStatus === "All statuses" ||
      (selectedStatus === "Under Maintenance"
        ? ["maintenance", "under maintenance"].includes(
            status.toLowerCase()
          )
        : status.toLowerCase() === selectedStatus.toLowerCase());

    const searchableText =
      `${resource.resourceName || ""} ${resource.assetId || ""}`.toLowerCase();

    return (
      matchesCategory &&
      matchesStatus &&
      searchableText.includes(normalizedSearch)
    );
  });

  const handleBack = () => {
    navigate("/HOD-dashboard", {
      state: { activeView: "labs" },
    });
  };

  const configuration =
    selectedResource?.configuration &&
    Object.keys(selectedResource.configuration).length
      ? selectedResource.configuration
      : selectedResource?.purchase?.configuration || {};

  const history = [...(selectedResource?.configurationHistory || [])].sort(
    (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
  );

  return (
    <div
    className="flex h-screen overflow-hidden"
    style={{
      backgroundColor: "#F2F4F1",
      fontFamily: "'IBM Plex Sans', sans-serif",
    }}
  >
    <aside className="h-full shrink-0 overflow-hidden">
      <Sidebar
        activeView="labs"
        setActiveView={handleSidebarNavigation}
      />
    </aside>
      <main className="mx-auto max-w-[1600px] px-6 py-8 md:px-10">
        <button
          type="button"
          onClick={handleBack}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium"
          style={{ color: "#5B6A5F" }}
        >
          <ArrowLeft size={16} />
          Back to laboratories
        </button>

        <TopBar
          title={selectedLab?.LabName || routeLabName || "Lab Resources"}
          subtitle="View laboratory resources, configurations and history."
          rightTop="HOD Portal"
          rightBottom="Read-only access"
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              color="#8A968D"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search resource name or asset ID"
              aria-label="Search resources by name or asset ID"
              className="w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm outline-none"
              style={{
                borderColor: "#D8DCD4",
                color: "#1F2A24",
              }}
            />
          </label>

          <label className="sm:w-64">
            <span className="sr-only">Filter by category</span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
              style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
            >
              <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
              {RESOURCE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="sm:w-64">
            <span className="sr-only">Filter by status</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
              style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
            >
              <option value="All statuses">All statuses</option>
              <option value="Available">Available</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Scrapped">Scrapped</option>
            </select>
          </label>
        </div>

        <div
          className="overflow-hidden rounded-xl border bg-white"
          style={{ borderColor: "#E3E6DF" }}
        >
          <div
            className="grid grid-cols-12 items-center gap-3 px-5 py-3 text-xs uppercase tracking-wide"
            style={{
              color: "#8A968D",
              borderBottom: "1px solid #E3E6DF",
              backgroundColor: "#F8F9F7",
            }}
          >
            <span className="col-span-2">Asset ID</span>
            <span className="col-span-2">Name</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-3 text-center">Configuration</span>
            <span className="col-span-3 text-right">Status</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
              Loading resources...
            </div>
          ) : !selectedLab ? (
            <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
              Lab not found. Return to the laboratory list and select a lab.
            </div>
          ) : labResources.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
              No resources allocated to this lab yet.
            </div>
          ) : visibleResources.length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
              No resources match these filters.
            </div>
          ) : (
            visibleResources.map((resource) => (
              <ResourceRow
                key={resource._id}
                resource={resource}
                onViewConfiguration={(resource) => {
                  setSelectedResource(resource);
                  setActiveTab("Configuration");
                }}
              />
            ))
          )}
        </div>

        {selectedResource && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelectedResource(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="hod-resource-title"
              className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              style={{ color: "#1F2A24" }}
            >
              <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
                <div>
                  <h2 id="hod-resource-title" className="text-xl font-semibold">
                    {selectedResource.assetId}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: "#66736B" }}>
                    {selectedResource.resourceName}
                  </p>
                  <div
                    className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs"
                    style={{ color: "#66736B" }}
                  >
                    <span>Lab: {selectedResource.labName || "—"}</span>
                    <span>Category: {getCategory(selectedResource) || "—"}</span>
                    <span>Type: {selectedResource.resourceType || "Hardware"}</span>
                    <span>Status: {selectedResource.status || "Available"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Close
                </button>
              </div>

              <div className="flex gap-2 border-b px-6 pt-4">
                {["Configuration", "Remarks & History"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className="border-b-2 px-4 py-3 text-sm font-medium"
                    style={{
                      borderColor: activeTab === tab ? "#246B45" : "transparent",
                      color: activeTab === tab ? "#246B45" : "#66736B",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "Configuration" && (
                  <section
                    className="rounded-xl border p-5"
                    style={{ borderColor: "#E3E6DF" }}
                  >
                    <h3 className="mb-1 font-semibold">Current Configuration</h3>
                    <p className="mb-4 text-xs" style={{ color: "#66736B" }}>
                      Latest recorded specifications for this resource.
                    </p>

                    {Object.keys(configuration).length > 0 ? (
                      <div className="divide-y">
                        {Object.entries(configuration).map(([key, value]) => (
                          <div
                            key={key}
                            className="grid grid-cols-2 gap-3 py-3 text-sm"
                          >
                            <span className="capitalize" style={{ color: "#66736B" }}>
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                            <span className="break-words font-medium">
                              {String(value ?? "—")}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "#66736B" }}>
                        No configuration has been recorded for this resource.
                      </p>
                    )}

                    {selectedResource.purchase?.configurationRemarks && (
                      <div
                        className="mt-4 rounded-lg p-3"
                        style={{ backgroundColor: "#F8F9F7" }}
                      >
                        <p className="text-xs font-medium">
                          Initial Purchase Remarks
                        </p>
                        <p
                          className="mt-1 whitespace-pre-wrap text-sm"
                          style={{ color: "#66736B" }}
                        >
                          {selectedResource.purchase.configurationRemarks}
                        </p>
                      </div>
                    )}
                  </section>
                )}

                {activeTab === "Remarks & History" && (
                  <section>
                    <h3 className="mb-1 font-semibold">
                      Remarks / Configuration History
                    </h3>
                    <p className="mb-5 text-sm" style={{ color: "#66736B" }}>
                      Review the recorded changes and remarks for this asset.
                    </p>

                    {history.length > 0 ? (
                      <div className="space-y-4">
                        {history.map((entry, index) => (
                          <div
                            key={entry._id || index}
                            className="rounded-xl border p-4"
                            style={{ borderColor: "#E3E6DF" }}
                          >
                            <p className="text-xs" style={{ color: "#66736B" }}>
                              {entry.changedAt
                                ? new Date(entry.changedAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "Date unavailable"}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {entry.remarks || "Configuration updated"}
                            </p>

                            {entry.changes &&
                              Object.entries(entry.changes).map(([key, value]) => (
                                <p
                                  key={key}
                                  className="mt-1 text-sm"
                                  style={{ color: "#66736B" }}
                                >
                                  {key}: {String(value)}
                                </p>
                              ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        className="rounded-lg border p-5 text-sm"
                        style={{ borderColor: "#E3E6DF", color: "#66736B" }}
                      >
                        No configuration changes have been recorded for this asset.
                      </p>
                    )}

                    {selectedResource.purchase?.configurationRemarks && (
                      <div
                        className="mt-4 rounded-xl border p-4"
                        style={{ borderColor: "#E3E6DF" }}
                      >
                        <p className="text-xs" style={{ color: "#66736B" }}>
                          Initial purchase configuration
                        </p>
                        <p className="mt-1 text-sm">
                          {selectedResource.purchase.configurationRemarks}
                        </p>
                      </div>
                    )}
                  </section>
                )}
              </div>

              <div className="flex justify-end border-t px-6 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedResource(null)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                  style={{ borderColor: "#D8DCD4" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
