import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../../components/TopBar";
import { useAdminContext } from "../../context/AdminContext";
import { Sidebar } from "./Sidebar";
import { ResourceRow } from "./Resourcerow";
import { ALL_RESOURCE_CATEGORIES, getResourceCategory } from "../../utils/resourceCategories";

export function LabResourceDetails() {
  const { labName: routeLabName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { labName, labResorces, getLabs, getLabResources, deleteLabResource } = useAdminContext();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_RESOURCE_CATEGORIES);

  useEffect(() => {
    let isCurrent = true;

    Promise.all([getLabs(), getLabResources()]).finally(() => {
      if (isCurrent) setLoading(false);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    setResources(labResorces || []);
  }, [labResorces]);

  const selectedLab = (labName || []).find((lab) => lab.LabName === routeLabName);
  const labResources = resources.filter((resource) => resource.labName === routeLabName);
  const categories = [...new Set(labResources.map((resource) => getResourceCategory(resource.resourceName)))].sort();
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleResources = labResources.filter((resource) => {
    const matchesCategory = selectedCategory === ALL_RESOURCE_CATEGORIES
      || getResourceCategory(resource.resourceName) === selectedCategory;
    const searchableText = `${resource.resourceName || ""} ${resource.assetId || ""}`.toLowerCase();
    return matchesCategory && searchableText.includes(normalizedSearch);
  });

  const handleStatusChange = (id, status) => {
    setResources((current) => current.map((resource) => (
      resource._id === id ? { ...resource, status } : resource
    )));
  };

  const handleDelete = async (id) => {
    const result = await deleteLabResource(id);
    if (result.success) {
      setResources((current) => current.filter((resource) => resource._id !== id));
    }
  };

  const handleBack = () => {
    navigate("/labAdmin-dashboard", {
      state: { activeView: location.state?.returnView || "labs" },
    });
  };

  const handleSidebarNavigation = (activeView) => {
    navigate("/labAdmin-dashboard", { state: { activeView } });
  };

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ backgroundColor: "#F2F4F1", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />
      <aside className="h-screen shrink-0 overflow-y-auto">
        <Sidebar activeView="LabResources" setActiveView={handleSidebarNavigation} />
      </aside>
      <main className="flex-1 min-w-0 px-6 py-8 md:px-10 overflow-y-auto">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 mb-5 text-sm font-medium"
          style={{ color: "#5B6A5F" }}
        >
          <ArrowLeft size={16} /> Back to labs
        </button>

        <TopBar
          title={selectedLab?.LabName || routeLabName || "Lab Resources"}
          subtitle="Search and filter this lab's resources."
          rightTop="Lab Administrator"
          rightBottom="Lab Resources"
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

        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
          <div
            className="grid grid-cols-9 px-5 py-3 text-xs uppercase tracking-wide"
            style={{ color: "#8A968D", borderBottom: "1px solid #E3E6DF", backgroundColor: "#F8F9F7" }}
          >
            <span className="col-span-2">Asset ID</span>
            <span className="col-span-4">Name</span>
            <span className="col-span-3 text-right">Status</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
              Loading resources...
            </div>
          ) : !selectedLab ? (
            <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
              Lab not found. Return to the lab list and select a lab.
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
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}