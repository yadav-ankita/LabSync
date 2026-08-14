import { useState } from "react";
import { TopBar } from "../LabAdmin/TopBar";
import { ManualCard } from "../LabAdmin/ManualCard";
import { AddManualForm } from "../LabAdmin/AddManualForm";
import { LAB_MANUALS } from "../LabAdmin/dummyData";

export function LabManuals() {
  const [manuals, setManuals] = useState(LAB_MANUALS);

  const handleAdd = (manual) => setManuals((prev) => [manual, ...prev]);
  const handleDelete = (id) => setManuals((prev) => prev.filter((m) => m.id !== id));

  return (
    <div>
      <TopBar title="Lab Manuals" subtitle="Publish and manage manuals available to students and faculty." />

      <AddManualForm onAdd={handleAdd} />

      {manuals.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-sm" style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}>
          No manuals published yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {manuals.map((manual) => (
            <ManualCard key={manual.id} manual={manual} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}