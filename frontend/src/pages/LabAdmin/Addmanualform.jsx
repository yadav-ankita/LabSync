import { useState } from "react";
import { Plus } from "lucide-react";

export function AddManualForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("1");
  const [fileType, setFileType] = useState("PDF");

  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;
    onAdd({
      id: `LM${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      subject: subject.trim(),
      semester,
      fileType,
      updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setTitle("");
    setSubject("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border p-5 mb-4 flex flex-wrap items-end gap-3"
      style={{ borderColor: "#E3E6DF" }}
    >
      <div className="flex-1 min-w-45">
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Manual title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Data Structures Lab Manual"
          className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
          style={inputStyle}
        />
      </div>
      <div className="flex-1 min-w-40">
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Data Structures Lab"
          className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
          style={inputStyle}
        />
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Semester</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
          style={inputStyle}
        >
          {["1", "2", "3", "4", "5", "6", "7", "8"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>File type</label>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
          style={inputStyle}
        >
          <option value="PDF">PDF</option>
          <option value="DOCX">DOCX</option>
        </select>
      </div>
      <button
        type="submit"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: "#1F2A24" }}
      >
        <Plus size={15} /> Add manual
      </button>
    </form>
  );
}