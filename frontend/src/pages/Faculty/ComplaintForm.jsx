import { TopBar } from '../../components/TopBar';

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
import { useState, useEffect } from "react";
import axios from "../../axios";


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
  const [labs, setLabs] = useState([]);
  const [labName, setLabName] = useState("");
  const [resources, setResources] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [issueType, setIssueType] = useState("Hardware");
  const [resourceId, setResourceId] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    axios.get("/lab")
      .then(({ data }) => {
        if (isCurrent) setLabs(data.labs || []);
      })
      .catch(() => {
        if (isCurrent) setLoadError("Could not load labs. Please try again.");
      })
      .finally(() => {
        if (isCurrent) setLoadingLabs(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    setResourceId("");
    setResources([]);

    if (!labName) {
      setLoadingResources(false);
      return;
    }

    let isCurrent = true;
    setLoadingResources(true);
    setLoadError("");

    axios.get("/admin/LabResource", { params: { labName } })
      .then(({ data }) => {
        if (isCurrent) setResources(data.resources || []);
      })
      .catch(() => {
        if (isCurrent) setLoadError("Could not load resources for this lab. Please try again.");
      })
      .finally(() => {
        if (isCurrent) setLoadingResources(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [labName]);

  const handleSubmit = async (e) => {
e.preventDefault();
    if (!labName) {
  setFormError("Please select a lab.");
  return;
}

if (!resourceId) {
  setFormError("Please select a resource.");
  return;
}

if (!description.trim()) {
  setFormError("Please enter a description.");
  return;
}

    try {
      const result = await raiseComplaint({
        labName,
        issueType,
        resourceId: resourceId.trim(),
        description: description.trim(),
        status: "Pending",
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      });
     if(result.success){
       setSubmitted(true);
       setFormError("");
      setResourceId("");
      setDescription("");

      setTimeout(() => setSubmitted(false), 3000);
     }else{
       setFormError(result.message || "Could not submit complaint.");
     }
      
    } catch (error) {
      setFormError("Could not submit complaint. Please try again.");
    }

  };
  const labelStyle = { color: "#1F2A24", fontWeight: 500 };
  const inputStyle = {
    borderColor: "#D8DCD4",
    color: "#1F2A24",
  };

  return (
    <div>
      <TopBar title="Raise a Complaint" subtitle="Report a hardware or software issue with a lab resource."
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-xl" style={{ borderColor: "#E3E6DF" }}>
        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Lab name</label>
          <select
            value={labName}
            onChange={(e) => {
              setLabName(e.target.value);
              setFormError("");
            }}
            required
            className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white focus:outline-none"
            style={inputStyle}
          >
            <option value="">{loadingLabs ? "Loading labs..." : "Select a lab"}</option>
            {labs.map((lab) => (
              <option key={lab._id} value={lab.LabName}>{lab.LabName}</option>
            ))}
          </select>
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
  <label
    className="block text-sm mb-1.5"
    style={labelStyle}
  >
    Resource / PC ID
  </label>

  <select
    value={resourceId}
    onChange={(e) => setResourceId(e.target.value)}
    disabled={!labName || loadingResources}
    required
    className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white focus:outline-none"
    style={inputStyle}
  >
    <option value="">
      {!labName ? "Select a lab first" : loadingResources ? "Loading resources..." : "Select a resource"}
    </option>

    {resources.map((resource) => (
      <option
        key={resource._id || resource.assetId}
        value={resource.assetId}
      >
        {resource.assetId} - {resource.resourceName || resource.name}
      </option>
    ))}
  </select>
  {labName && !loadingResources && resources.length === 0 && (
    <p className="mt-1.5 text-xs" style={{ color: "#8A968D" }}>No resources found for this lab.</p>
  )}
</div>

        <div className="mb-6">
          <label className="block text-sm mb-1.5" style={labelStyle}>Issue description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setFormError("");
            }}
            required
            placeholder="Describe the issue in detail..."
            rows={4}
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none resize-none"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={!labName || !resourceId || !description.trim() || loadingResources}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1F2A24", opacity: !labName || !resourceId || !description.trim() || loadingResources ? 0.6 : 1 }}
        >
          Submit complaint
        </button>

        {(loadError || formError) && (
          <p className="mt-3 text-sm" style={{ color: "#B3261E" }}>{loadError || formError}</p>
        )}

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