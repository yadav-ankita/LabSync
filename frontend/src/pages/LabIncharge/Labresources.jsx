import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { TopBar } from '../../components/TopBar';
import { ResourceTag } from "../../components/ResourceTag";
import { ResourceStatusPill } from "../../components/ResourceStatusPill";
import { useAppContext } from "../../context/AppContext";
import { useFacultyContext } from "../../context/FacultyContext";
import { ALL_RESOURCE_CATEGORIES, getResourceCategory } from "../../utils/resourceCategories";

export function LabResources() {
  const { currentUser} = useAppContext();
  const {facultyResources, getAssignedLabResources }=useFacultyContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_RESOURCE_CATEGORIES);

  useEffect(() => {
    getAssignedLabResources();
  }, []);

  const activeResources = (facultyResources || []).filter(
    (resource) => resource.status !== "Scrapped"
  );
  const categories = [...new Set(
    activeResources.map((resource) => getResourceCategory(resource.resourceName || resource.name))
  )].sort();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visible = activeResources.filter((resource) => {
    const resourceName = resource.resourceName || resource.name || "";
    const matchesCategory = selectedCategory === ALL_RESOURCE_CATEGORIES
      || getResourceCategory(resourceName) === selectedCategory;
    const searchableText = `${resourceName} ${resource.assetId || resource.id || ""}`.toLowerCase();
    return matchesCategory && searchableText.includes(normalizedSearch);
  });

  return (
    <div>
      <TopBar title="Lab Resources" subtitle="Inventory for the laboratory assigned to you." 
       rightTop={`${currentUser?.lab_name || currentUser?.name || "No assigned lab"}`} 
       rightBottom=" Assigned laboratory"
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <label className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color="#8A968D" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search resource name or asset ID"
            aria-label="Search resources by name or asset ID"
            className="w-full rounded-lg border bg-white py-2.5 pl-9 pr-3 text-sm outline-none"
            style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
          />
        </label>
        <label className="sm:w-56">
          <span className="sr-only">Filter by category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
          >
            <option value={ALL_RESOURCE_CATEGORIES}>{ALL_RESOURCE_CATEGORIES}</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto" style={{ borderColor: "#E3E6DF" }}>
        <div
          className="grid min-w-160 grid-cols-9 px-5 py-3 text-xs uppercase tracking-wide"
          style={{ color: "#8A968D", borderBottom: "1px solid #E3E6DF", backgroundColor: "#F8F9F7" }}
        >
          <span className="col-span-2">Asset ID</span>
          <span className="col-span-4">Name</span>
          <span className="col-span-3 text-right">Status</span>
        </div>
        {activeResources.length === 0 ? (
          <div className="px-5 py-6 text-sm" style={{ color: "#5B6A5F" }}>
            No lab resources found for this assigned lab yet.
          </div>
        ) : visible.length === 0 ? (
          <div className="px-5 py-6 text-sm" style={{ color: "#5B6A5F" }}>
            No resources match these filters.
          </div>
        ) : visible.map((r, i) => (
          <div
            key={r._id || r.assetId || `${r.resourceName}-${i}`}
            className="grid min-w-160 grid-cols-9 items-center px-5 py-3.5"
            style={{ borderTop: i === 0 ? "none" : "1px solid #E3E6DF" }}
          >
            <span className="col-span-2">
              <ResourceTag id={r.assetId || r.id || "N/A"} />
            </span>
            <span className="col-span-4 text-sm" style={{ color: "#1F2A24" }}>{r.resourceName || r.name}</span>
            <span className="col-span-3 flex justify-end">
              <ResourceStatusPill status={r.status || "Available"} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}