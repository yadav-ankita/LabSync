import { useState } from "react";
import { Plus } from "lucide-react";
import { LABS } from "./dummyData";

export function AddResourceForm({ onAdd }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [labName, setLabName] = useState(LABS[0]);
  const [category, setCategory] = useState("Hardware");

  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id.trim() || !name.trim()) return;
    onAdd({ id: id.trim(), name: name.trim(), labName, category, status: "Available" });
    setId("");
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border p-5 mb-4 flex flex-wrap items-end gap-3"
      style={{ borderColor: "#E3E6DF" }}
    >
      <div>
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Asset ID</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. PC-045"
          className="px-3 py-2 rounded-lg border text-sm focus:outline-none w-32"
          style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
        />
      </div>
      <div className="flex-1 min-w-45">
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lab PC (i5, 16GB)"
          className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
          style={inputStyle}
        />
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Lab</label>
        <select
          value={labName}
          onChange={(e) => setLabName(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
          style={inputStyle}
        >
          {LABS.map((lab) => (
            <option key={lab} value={lab}>{lab}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
          style={inputStyle}
        >
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
        </select>
      </div>
      <button
        type="submit"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: "#1F2A24" }}
      >
        <Plus size={15} /> Add resource
      </button>
    </form>
  );
}