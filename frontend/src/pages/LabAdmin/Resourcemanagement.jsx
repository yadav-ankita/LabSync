import { useEffect, useState } from "react";
import { TopBar } from "./TopBar";
import { ResourceRow } from "./ResourceRow";
import { AddResourceForm } from "./AddResourceForm";
import { useAdminContext } from "../../context/AdminContext";

export function ResourceManagement() {
  const { labName, labResorces, getLabResources, getLabs, deleteLabResource } = useAdminContext();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [labFilter, setLabFilter] = useState("All Labs");

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getLabResources();
      await getLabs();
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    setResources(labResorces || []);
  }, [labResorces]);

  const handleStatusChange = (id, status) => {
    setResources((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
  };

  const handleDelete = async (id) => {
    const result = await deleteLabResource(id);
    if (result.success) {
      setResources((prev) => prev.filter((r) => r._id !== id));
    }
  };

  const labs = [
    "All Labs",
    ...new Set((labName || []).map((lab) => lab.LabName.trim())),
  ];
  const visibleLabs = labFilter === "All Labs" ? labs.slice(1) : [labFilter];
  const visible = visibleLabs.flatMap((lab) => {
    const labResources = resources.filter((resource) => resource.labName === lab);
    return labResources.length > 0
      ? labResources
      : [{ _id: `empty-${lab}`, labName: lab, empty: true }];
  });

  return (
    <div>
      <TopBar title="Resource Management" subtitle="Add, update, or remove equipment across all laboratories." />

      <AddResourceForm />

      <div className="flex gap-2 mb-4 flex-wrap">
        {labs.map((lab) => (
          <button
            key={lab}
            onClick={() => setLabFilter(lab)}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: labFilter === lab ? "#D89A4E" : "#D8DCD4",
              backgroundColor: labFilter === lab ? "#FBF1E3" : "white",
              color: labFilter === lab ? "#9A5F1D" : "#5B6A5F",
              fontWeight: labFilter === lab ? 600 : 400,
            }}
          >
            {lab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        <div
          className="grid grid-cols-12 px-5 py-3 text-xs uppercase tracking-wide"
          style={{ color: "#8A968D", borderBottom: "1px solid #E3E6DF", backgroundColor: "#F8F9F7" }}
        >
          <span className="col-span-2">Asset ID</span>
          <span className="col-span-3">Name</span>
          <span className="col-span-3">Lab</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-2 text-right">Status</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            Loading resources...
          </div>
        ) : visible.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            No resources yet. Add one using the form above.
          </div>
        ) : (
          visible.map((r) => (
            r.empty ? (
              <div key={r._id} className="grid grid-cols-12 items-center px-5 py-3.5 border-t first:border-t-0" style={{ borderColor: "#E3E6DF" }}>
                <span className="col-span-2 text-xs" style={{ color: "#A0AAA2" }}>-</span>
                <span className="col-span-3 text-sm" style={{ color: "#8A968D" }}>No resources allocated</span>
                <span className="col-span-3 text-xs truncate" style={{ color: "#5B6A5F" }}>{r.labName}</span>
                <span className="col-span-2 text-xs" style={{ color: "#A0AAA2" }}>-</span>
                <span className="col-span-2 text-xs text-right" style={{ color: "#8A968D" }}>Resources are not yet allocated to this lab</span>
              </div>
            ) : (
              <ResourceRow key={r._id} resource={r} onStatusChange={handleStatusChange} onDelete={handleDelete} />
            )
          ))
        )}
      </div>
    </div>
  );
}