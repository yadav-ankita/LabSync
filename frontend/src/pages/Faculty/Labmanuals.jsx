import { useEffect, useState } from "react";
import { TopBar } from '../../components/TopBar';
import { AddManualForm } from "./Addmanualform";
import { ManualCard } from "./ManualCard"
import { useFacultyContext } from "../../context/FacultyContext";
export function LabManuals() {
  const { facultyManuals, getFacultyManuals, removeFacultyManual } = useFacultyContext();
  const [manuals, setManuals] = useState([]);

  useEffect(() => {
    getFacultyManuals();
  }, []);

  useEffect(() => {
    setManuals(facultyManuals);
  }, [facultyManuals]);

  const handleDelete = async (id) => {
    const result = await removeFacultyManual(id);
    if (result.success) setManuals((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div>
      <TopBar title="Lab Manuals" subtitle="Publish and manage manuals available to students and faculty." />
      <AddManualForm />
      {manuals.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-sm" style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}>
          No manuals published yet.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {manuals.map((manual) => (
            <ManualCard key={manual._id} manual={manual} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}