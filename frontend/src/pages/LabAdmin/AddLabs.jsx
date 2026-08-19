import React, { useState, useEffect } from 'react'
import { LabCard } from './LabCard';
import { UserPlus, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { TopBar } from "./TopBar";
import { FacultyCard } from "./FacultyCard";
import { useAppContext } from "../../context/AppContext";
const AddLabs = () => {
  const { getLabs, AddLabs, labName } = useAppContext();

  const [LabName, setLabName] = useState("")
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null); // { type: 'success' | 'error', text }
  const [loadingList, setLoadingList] = useState(true);


  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };
  const labelStyle = { color: "#1F2A24", fontWeight: 500 };

  useEffect(() => {
    (async () => {
      setLoadingList(true);
      await getLabs();
      setLoadingList(false);
    })();

  }, []);
const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = LabName.trim();

    if (!trimmedName) {
        setFormMessage({
            type: "error",
            text: "Please enter a lab name."
        });
        return;
    }

    setSubmitting(true);
    setFormMessage(null);

    const result = await AddLabs({
        LabName: trimmedName
    });

    setSubmitting(false);

    if (result.success) {
        setLabName("");

        setFormMessage({
            type: "success",
            text: "Lab Added Successfully"
        });
    } else {
        setFormMessage({
            type: "error",
            text: result.message
        });
    }

    setTimeout(() => setFormMessage(null), 4000);
};
  return (
    <div>
      <TopBar title="Lab Management" subtitle="Add labs" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-5 mb-4 flex flex-wrap items-end gap-3"
        style={{ borderColor: "#E3E6DF" }}
      >
        <div className="flex-1 min-w-45">
          <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Lab Name</label>
          <input
            type="text"
            value={LabName}
            onChange={(e) => setLabName(e.target.value)}
            placeholder="F206"
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "#1F2A24" }}
        >
          <Plus size={15} /> {submitting ? "Adding..." : "Add Lab"}
        </button>
      </form>
      {formMessage && (
        <div
          className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg text-sm"
          style={{
            backgroundColor: formMessage.type === "success" ? "#E3EEE5" : "#FBEAEA",
            color: formMessage.type === "success" ? "#2F6F52" : "#B3261E",
          }}
        >
          {formMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {formMessage.text}
        </div>
      )}
      {loadingList ? (
        <div className="bg-white rounded-xl border p-8 text-center text-sm" style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}>
          Loading labs...
        </div>
      ) : labName.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-sm" style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}>
          No Labs yet. Add one using the form above.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {labName.map((lab) => (
            <LabCard
              key={lab._id}
              labName={lab.LabName}
              faculty={lab.AssignFaculty?.name || lab.facultyName || "Not Yet Assigned"}
              numberOfResources={lab.NumResources || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { AddLabs };
