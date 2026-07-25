import { useState } from "react";
import { TopBar } from "./TopBar";
import { ResourceRow } from "./ResourceRow";
import { AddResourceForm } from "./AddResourceForm";
import { ALL_RESOURCES, LABS } from "./dummyData";

export function ResourceManagement() {
  const [resources, setResources] = useState(ALL_RESOURCES);
  const [labFilter, setLabFilter] = useState("All Labs");

  const handleAdd = (resource) => {
    if (resources.some((r) => r.id === resource.id)) return;
    setResources((prev) => [resource, ...prev]);
  };

  const handleStatusChange = (id, status) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleDelete = (id) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const visible =
    labFilter === "All Labs" ? resources : resources.filter((r) => r.labName === labFilter);

  return (
    <div>
      <TopBar title="Resource Management" subtitle="Add, update, or remove equipment across all laboratories." />

      <AddResourceForm onAdd={handleAdd} />

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setLabFilter("All Labs")}
          className="text-xs px-3 py-1.5 rounded-full border transition-colors"
          style={{
            borderColor: labFilter === "All Labs" ? "#D89A4E" : "#D8DCD4",
            backgroundColor: labFilter === "All Labs" ? "#FBF1E3" : "white",
            color: labFilter === "All Labs" ? "#9A5F1D" : "#5B6A5F",
            fontWeight: labFilter === "All Labs" ? 600 : 400,
          }}
        >
          All Labs
        </button>
        {LABS.map((lab) => (
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
          <span className="col-span-2">Category</span>
          <span className="col-span-2 text-right">Status</span>
        </div>
        {visible.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            No resources in this lab yet.
          </div>
        ) : (
          visible.map((r) => (
            <ResourceRow key={r.id} resource={r} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}