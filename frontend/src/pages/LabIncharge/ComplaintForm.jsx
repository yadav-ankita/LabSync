import { TopBar } from "./TopBar";
import { useState } from "react";
import {
  LayoutGrid,
  BookOpen,
  MessageSquarePlus,
  ListChecks,
  FlaskConical,
  FileText,
  Download,
  Cpu,
  Code2,
  ChevronRight,
  Clock,
  CircleDot,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useComplaintContext } from "../../context/ComplaintContext";

/* const LAB_OPTIONS = [
  "DS Lab - Block A",
  "DBMS Lab - Block B",
  "Networks Lab - Block A",
  "OS Lab - Block B",
  "WebTech Lab - Block C",
  "Micro Lab - Block C",
]; */
export function ComplaintForm() {
  const {raiseComplaint}=useComplaintContext();
  const {currentUser } = useAppContext();
  // const [labName, setLabName] = useState(LAB_OPTIONS[0]);
  const [issueType, setIssueType] = useState("Hardware");
  const [resourceId, setResourceId] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Use the currently assigned lab instead of allowing lab selection
  const labName = currentUser?.lab_name || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resourceId.trim() || !description.trim()) return;
    try {
      const result = await raiseComplaint({
        labName,
        issueType,
        resourceId: resourceId.trim(),
        description: description.trim(),
        status: "Pending",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      });
      setSubmitted(true);
      setResourceId("");
      setDescription("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.log("the error in complaint form occurse");
      console.log(error);
    }

  };
  const labelStyle = { color: "#1F2A24", fontWeight: 500 };
  const inputStyle = {
    borderColor: "#D8DCD4",
    color: "#1F2A24",
  };

  return (
    <div>
      <TopBar title="Raise a Complaint" subtitle="Report a hardware or software issue with a lab resource." />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-xl" style={{ borderColor: "#E3E6DF" }}>
        {/*
        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Lab name</label>
          <select
            value={labName}
            onChange={(e) => setLabName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white focus:outline-none"
            style={inputStyle}
          >
            {LAB_OPTIONS.map((lab) => (
              <option key={lab} value={lab}>{lab}</option>
            ))}
          </select>
        </div>
        */}
        {/* Assigned lab — automatically taken from currentUser */}
        <div className="mb-5">
          <label
            className="block text-sm mb-1.5"
            style={labelStyle}
          >
            Lab name
          </label>

          <input
            type="text"
            value={labName}
            readOnly
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={{
              ...inputStyle,
              backgroundColor: "#F8F9F7",
            }}
          />
        </div>
        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Issue type</label>
          <div className="flex gap-3">
            {["Hardware", "Software"].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setIssueType(type)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm"
                style={{
                  borderColor: issueType === type ? "#D89A4E" : "#D8DCD4",
                  backgroundColor: issueType === type ? "#FBF1E3" : "white",
                  color: issueType === type ? "#9A5F1D" : "#5B6A5F",
                  fontWeight: issueType === type ? 600 : 400,
                }}
              >
                {type === "Hardware" ? <Cpu size={15} /> : <Code2 size={15} />}
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Resource / PC ID</label>
          <input
            type="text"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="e.g. PC-014"
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={{ ...inputStyle, fontFamily: "'IBM Plex Mono', monospace" }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1.5" style={labelStyle}>Issue description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1F2A24" }}
        >
          Submit complaint
        </button>

        {submitted && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm"
            style={{ backgroundColor: "#E3EEE5", color: "#2F6F52" }}
          >
            <CheckCircle2 size={16} /> Complaint submitted. Track it under "My Complaints".
          </div>
        )}
      </form>
    </div>
  );
}