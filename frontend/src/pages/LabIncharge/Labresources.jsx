
import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle2,
  Wrench,
  Archive,
  Settings2,
} from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { ResourceTag } from "../../components/ResourceTag";
import { useAppContext } from "../../context/AppContext";
import { useFacultyContext } from "../../context/FacultyContext";
import { useAdminContext } from "../../context/AdminContext";
import {
  ALL_RESOURCE_CATEGORIES,
  RESOURCE_CATEGORIES,
  getResourceCategory,
} from "../../utils/resourceCategories";

export function LabResources() {
  const { currentUser } = useAppContext();
  const { facultyResources, getAssignedLabResources } = useFacultyContext();
  const { addResourceConfigurationRemark } = useAdminContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_RESOURCE_CATEGORIES);
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [selectedResource, setSelectedResource] = useState(null);
  const [activeConfigurationTab, setActiveConfigurationTab] = useState("Configuration");
  const [remarkText, setRemarkText] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);

  useEffect(() => {
    getAssignedLabResources();
  }, []);

  const activeResources = facultyResources || [];
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleResources = activeResources.filter((resource) => {
    const category = getResourceCategory(resource);
    const name = resource.resourceName || resource.name || "";
    const matchesCategory =
      selectedCategory === ALL_RESOURCE_CATEGORIES ||
      category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All statuses" ||
      (selectedStatus === "Under Maintenance"
        ? resource.status === "Maintenance"
        : (resource.status || "Available") === selectedStatus);
    const matchesSearch =
      `${name} ${resource.assetId || resource.id || ""}`
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const configuration =
    selectedResource?.configuration &&
    Object.keys(selectedResource.configuration).length
      ? selectedResource.configuration
      : selectedResource?.purchase?.configuration || {};

  const history = selectedResource?.configurationHistory || [];

  const handleAddRemark = async () => {
    if (!remarkText.trim() || !selectedResource?._id) return;

    setSavingRemark(true);
    try {
      const result = await addResourceConfigurationRemark(
        selectedResource._id,
        remarkText.trim()
      );

      if (!result.success) {
        alert(result.message);
        return;
      }

      setRemarkText("");
      await getAssignedLabResources();

      setSelectedResource((current) =>
        current
          ? {
              ...current,
              configurationHistory:
                result.resource?.configurationHistory ??
                [
                  {
                    remarks: remarkText.trim(),
                    changedAt: new Date().toISOString(),
                    changes: {},
                  },
                  ...(current.configurationHistory || []),
                ],
            }
          : current
      );

      alert("Remark saved successfully!");
    } catch (error) {
      console.error("Add remark error:", error);
      alert("Failed to save remark. Check the console.");
    } finally {
      setSavingRemark(false);
    }
  };

  const statusStyle = (status) => {
    if (status === "Maintenance") {
      return { backgroundColor: "#FEF0C7", color: "#92400E", border: "1px solid #F59E0B" };
    }
    if (status === "Scrapped") {
      return { backgroundColor: "#FCE8E6", color: "#B3261E", border: "1px solid #F2B8B5" };
    }
    return { backgroundColor: "#E3EEE5", color: "#246B45" };
  };

  const statusLabel = (status) =>
    status === "Maintenance" ? "Under Maintenance" : status || "Available";

  return (
    <div>
      <TopBar
        title="Lab Resources"
        subtitle="Inventory for the laboratory assigned to you."
        rightTop={currentUser?.lab_name || currentUser?.name || "No assigned lab"}
        rightBottom="Assigned laboratory"
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resource name or asset ID"
            className="w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm outline-none"
            style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
          />
        </label>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2.5 text-sm sm:w-64"
          style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
        >
          <option value={ALL_RESOURCE_CATEGORIES}>{ALL_RESOURCE_CATEGORIES}</option>
          {RESOURCE_CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2.5 text-sm sm:w-64"
          style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
        >
          <option>All statuses</option>
          <option>Available</option>
          <option>Under Maintenance</option>
          <option>Scrapped</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: "#E3E6DF" }}>
        <div
          className="grid min-w-[900px] grid-cols-12 items-center gap-3 px-5 py-3 text-xs uppercase tracking-wide"
          style={{ color: "#8A968D", borderBottom: "1px solid #E3E6DF", backgroundColor: "#F8F9F7" }}
        >
          <span className="col-span-2">Asset ID</span>
          <span className="col-span-2">Name</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-3 text-center">Configuration</span>
          <span className="col-span-3 text-right">Status</span>
        </div>

        {activeResources.length === 0 ? (
          <p className="px-5 py-6 text-sm" style={{ color: "#5B6A5F" }}>
            No lab resources found for this assigned lab yet.
          </p>
        ) : visibleResources.length === 0 ? (
          <p className="px-5 py-6 text-sm" style={{ color: "#5B6A5F" }}>
            No resources match these filters.
          </p>
        ) : (
          visibleResources.map((resource, index) => (
            <div
              key={resource._id || resource.assetId || index}
              className="grid min-w-[900px] grid-cols-12 items-center gap-3 px-5 py-3.5"
              style={{ borderTop: index === 0 ? "none" : "1px solid #E3E6DF" }}
            >
              <span className="col-span-2">
                <ResourceTag id={resource.assetId || resource.id || "N/A"} />
              </span>
              <span className="col-span-2 truncate text-sm" style={{ color: "#1F2A24" }}>
                {resource.resourceName || resource.name || "—"}
              </span>
              <span className="col-span-2 truncate text-sm" style={{ color: "#66736B" }}>
                {getResourceCategory(resource) || "—"}
              </span>
              <div className="col-span-3 flex justify-center">
                <button
                  type="button"
                  
onClick={async () => {
  const result = await getAssignedLabResources();

  const latestResource = result.resources?.find(
    (item) => item._id === resource._id
  );

  setSelectedResource(latestResource || resource);
  setActiveConfigurationTab("Configuration");
  setRemarkText("");
}}

                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50"
                  style={{ borderColor: "#D5DBD5", color: "#246B45" }}
                >
                  <Settings2 size={15} />
                  View Configuration
                </button>
              </div>
              <span className="col-span-3 flex justify-end">
                <span
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
                  style={statusStyle(resource.status)}
                >
                  {statusLabel(resource.status) === "Available" && <CheckCircle2 size={14} />}
                  {statusLabel(resource.status) === "Under Maintenance" && <Wrench size={14} />}
                  {statusLabel(resource.status) === "Scrapped" && <Archive size={14} />}
                  {statusLabel(resource.status)}
                </span>
              </span>
            </div>
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
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white shadow-2xl"
            style={{ color: "#1F2A24" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold">{selectedResource.assetId}</h2>
                <p className="mt-1 text-sm" style={{ color: "#66736B" }}>
                  {selectedResource.resourceName || selectedResource.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "#66736B" }}>
                  <span>Lab: {selectedResource.labName || currentUser?.lab_name || "—"}</span>
                  <span>Category: {getResourceCategory(selectedResource) || "—"}</span>
                  <span>Type: {selectedResource.resourceType || "Hardware"}</span>
                  <span>Status: {statusLabel(selectedResource.status)}</span>
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

            <div className="flex flex-wrap gap-2 border-b px-6 pt-4">
              {["Configuration", "Remarks & History"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveConfigurationTab(tab)}
                  className="border-b-2 px-4 py-3 text-sm font-medium"
                  style={{
                    borderColor: activeConfigurationTab === tab ? "#246B45" : "transparent",
                    color: activeConfigurationTab === tab ? "#246B45" : "#66736B",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeConfigurationTab === "Configuration" ? (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <section className="rounded-xl border p-5" style={{ borderColor: "#E3E6DF" }}>
                    <h3 className="mb-1 font-semibold">Current Configuration</h3>
                    <p className="mb-4 text-xs" style={{ color: "#66736B" }}>
                      Latest specifications for this resource.
                    </p>
                    {Object.keys(configuration).length ? (
                      <div className="divide-y">
                        {Object.entries(configuration).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 gap-3 py-3 text-sm">
                            <span className="capitalize" style={{ color: "#66736B" }}>
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                            <span className="break-words font-medium">{String(value || "—")}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "#66736B" }}>
                        No configuration has been recorded for this resource.
                      </p>
                    )}
                  </section>

                  <section className="rounded-xl border p-5" style={{ borderColor: "#E3E6DF" }}>
                    <h3 className="mb-1 font-semibold">Remarks / Configuration History</h3>
                    <p className="mb-4 text-xs" style={{ color: "#66736B" }}>
                      Upgrades and important remarks, in chronological order.
                    </p>
                    {history.length ? (
                      [...history].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)).map((entry, index) => (
                        <div key={entry._id || index} className="mb-4 border-l-2 pl-4" style={{ borderColor: "#B7D8C2" }}>
                          <p className="text-xs" style={{ color: "#66736B" }}>
                            {entry.changedAt ? new Date(entry.changedAt).toLocaleDateString("en-GB") : "Date unavailable"}
                          </p>
                          <p className="mt-1 text-sm font-semibold">{entry.remarks || "Configuration updated"}</p>
                          {Object.entries(entry.changes || {}).map(([key, value]) => (
                            <p key={key} className="mt-1 text-xs" style={{ color: "#66736B" }}>{key}: {String(value)}</p>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: "#66736B" }}>No individual configuration changes have been recorded yet.</p>
                    )}
                    {selectedResource.purchase?.configurationRemarks && (
                      <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: "#F8F9F7" }}>
                        <p className="text-xs font-medium">Initial Purchase Remarks</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm" style={{ color: "#66736B" }}>
                          {selectedResource.purchase.configurationRemarks}
                        </p>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <div>
                  <div className="mb-5">
                    <h3 className="font-semibold">Remarks / Configuration History</h3>
                    <p className="mt-1 text-sm" style={{ color: "#66736B" }}>
                      Review dated changes and remarks for this individual asset.
                    </p>
                  </div>

                  <div className="mb-5 flex flex-col gap-3">
                    <textarea
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      placeholder="Enter configuration remark..."
                      className="w-full rounded-lg border p-3 text-sm"
                      rows={3}
                    />
                    <button
                      type="button"
                      disabled={savingRemark || !remarkText.trim()}
                      onClick={handleAddRemark}
                      className="self-start rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      style={{ backgroundColor: "#123C35" }}
                    >
                      {savingRemark ? "Saving..." : "+ Add Remark"}
                    </button>
                  </div>

                  {history.length ? (
                    [...history].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt)).map((entry, index) => (
                      <div key={entry._id || index} className="mb-4 rounded-xl border p-4" style={{ borderColor: "#E3E6DF" }}>
                        <p className="text-xs" style={{ color: "#66736B" }}>
                          {entry.changedAt ? new Date(entry.changedAt).toLocaleDateString("en-GB") : "Date unavailable"}
                        </p>
                        <p className="mt-1 text-sm font-semibold">{entry.remarks || "Configuration updated"}</p>
                        {Object.entries(entry.changes || {}).map(([key, value]) => (
                          <p key={key} className="mt-1 text-sm" style={{ color: "#66736B" }}>{key}: {String(value)}</p>
                        ))}
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border p-5 text-sm" style={{ borderColor: "#E3E6DF", color: "#66736B" }}>
                      No remarks or configuration changes have been recorded for this asset yet.
                    </p>
                  )}

                  {selectedResource.purchase?.configurationRemarks && (
                    <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "#E3E6DF" }}>
                      <p className="text-xs" style={{ color: "#66736B" }}>Initial purchase configuration</p>
                      <p className="mt-1 text-sm">{selectedResource.purchase.configurationRemarks}</p>
                    </div>
                  )}
                </div>
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
    </div>
  );
}
