
import { useEffect, useState } from "react";
import { Search,CheckCircle2, Wrench, Archive } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { ResourceTag } from "../../components/ResourceTag";
import { ResourceStatusPill } from "../../components/ResourceStatusPill";
import { useAppContext } from "../../context/AppContext";
import { useFacultyContext } from "../../context/FacultyContext";
import {
  ALL_RESOURCE_CATEGORIES,
  RESOURCE_CATEGORIES,
  UNCATEGORIZED,
  getResourceCategory,
} from "../../utils/resourceCategories";

export function LabResources() {
  const { currentUser } = useAppContext();
  const { facultyResources, getAssignedLabResources } = useFacultyContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    ALL_RESOURCE_CATEGORIES
  );
  const [selectedStatus, setSelectedStatus] = useState("All statuses");

  useEffect(() => {
    getAssignedLabResources();
  }, []);

  // Show all resources, including scrapped resources.
const activeResources = facultyResources || [];

  // Derive categories from the linked Purchase Register category.
  const categories = [
    ...new Set(
      activeResources.map((resource) => getResourceCategory(resource))
    ),
  ].sort();

  const hasUncategorizedResources = categories.includes(UNCATEGORIZED);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleResources = activeResources.filter((resource) => {
  const resourceName = resource.resourceName || resource.name || "";
  const category = getResourceCategory(resource);

  const matchesCategory =
    selectedCategory === ALL_RESOURCE_CATEGORIES ||
    category === selectedCategory;

  const matchesStatus =
    selectedStatus === "All statuses" ||
    (selectedStatus === "Under Maintenance"
      ? resource.status === "Maintenance"
      : (resource.status || "Available") === selectedStatus);

  const searchableText =
    `${resourceName} ${resource.assetId || resource.id || ""}`.toLowerCase();

  return (
    matchesCategory &&
    matchesStatus &&
    searchableText.includes(normalizedSearch)
  );
});

  return (
    <div>
      <TopBar
        title="Lab Resources"
        subtitle="Inventory for the laboratory assigned to you."
        rightTop={
          currentUser?.lab_name ||
          currentUser?.name ||
          "No assigned lab"
        }
        rightBottom="Assigned laboratory"
      />

      {/* Search and category filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
            style={{
              borderColor: "#D8DCD4",
              color: "#1F2A24",
            }}
          >
            <option value={ALL_RESOURCE_CATEGORIES}>
              {ALL_RESOURCE_CATEGORIES}
            </option>

            {/* Keep the complete category list consistent with Lab Admin. */}
            {RESOURCE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}

            {hasUncategorizedResources && (
              <option value={UNCATEGORIZED}>
                {UNCATEGORIZED}
              </option>
            )}
          </select>
        </label>
        <label className="sm:w-64">
  <span className="sr-only">Filter by status</span>

  <select
    value={selectedStatus}
    onChange={(event) => setSelectedStatus(event.target.value)}
    className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
    style={{
      borderColor: "#D8DCD4",
      color: "#1F2A24",
    }}
  >
    <option value="All statuses">All statuses</option>
    <option value="Available">Available</option>
    <option value="Under Maintenance">Under Maintenance</option>
    <option value="Scrapped">Scrapped</option>
  </select>
</label>
      </div>

      {/* Resource inventory table */}
      <div
        className="bg-white rounded-xl border overflow-x-auto"
        style={{ borderColor: "#E3E6DF" }}
      >
        <div
          className="grid min-w-160 grid-cols-9 px-5 py-3 text-xs uppercase tracking-wide"
          style={{
            color: "#8A968D",
            borderBottom: "1px solid #E3E6DF",
            backgroundColor: "#F8F9F7",
          }}
        >
          <span className="col-span-2">Asset ID</span>
          <span className="col-span-4">Name</span>
          <span className="col-span-3 text-right">Status</span>
        </div>

        {activeResources.length === 0 ? (
          <div
            className="px-5 py-6 text-sm"
            style={{ color: "#5B6A5F" }}
          >
            No lab resources found for this assigned lab yet.
          </div>
        ) : visibleResources.length === 0 ? (
          <div
            className="px-5 py-6 text-sm"
            style={{ color: "#5B6A5F" }}
          >
            No resources match these filters.
          </div>
        ) : (
          visibleResources.map((resource, index) => (
            <div
              key={
                resource._id ||
                resource.assetId ||
                `${resource.resourceName || resource.name}-${index}`
              }
              className="grid min-w-160 grid-cols-9 items-center px-5 py-3.5"
              style={{
                borderTop:
                  index === 0 ? "none" : "1px solid #E3E6DF",
              }}
            >
              <span className="col-span-2">
                <ResourceTag
                  id={resource.assetId || resource.id || "N/A"}
                />
              </span>

              <span
                className="col-span-4 text-sm"
                style={{ color: "#1F2A24" }}
              >
                {resource.resourceName || resource.name}
              </span>

              <span className="col-span-3 flex justify-end">
  {(() => {
    const status = resource.status || "Available";

    const styles = {
      Available: {
        backgroundColor: "#E3EEE5",
        color: "#246B45",
      },
      Maintenance: {
        backgroundColor: "#FEF0C7",
        color: "#92400E",
        border: "1px solid #F59E0B",
      },
      Scrapped: {
        backgroundColor: "#FCE8E6",
        color: "#B3261E",
        border: "1px solid #F2B8B5",
      },
    };

    const labels = {
      Available: "Available",
      Maintenance: "Under Maintenance",
      Scrapped: "Scrapped",
    };

    const icons = {
      Available: <CheckCircle2 size={14} />,
      Maintenance: <Wrench size={14} />,
      Scrapped: <Archive size={14} />,
    };

    return (
      <span
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
        style={styles[status] || styles.Available}
      >
        {icons[status] || icons.Available}
        {labels[status] || "Available"}
      </span>
    );
  })()}
</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
