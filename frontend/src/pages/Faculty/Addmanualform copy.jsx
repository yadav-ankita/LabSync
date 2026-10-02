import { useRef, useState } from "react";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useFacultyContext } from "../../context/FacultyContext";

export function AddManualForm() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("1");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [formMessage, setFormMessage] = useState(null);
  const fileInputRef = useRef(null);
  const { uploadLabManual } = useFacultyContext();

  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  // Handle file selection from input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus('');
      setFormMessage(null);
    } else {
      setSelectedFile(null);
      setFormMessage({ type: "error", text: "Please select a valid PDF file." });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !semester || !selectedFile) {
      setFormMessage({
        type: "error",
        text: "Title, subject, semester, and a PDF file are required.",
      });
      return;
    }
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("subject", subject.trim());
    formData.append("semester", semester);
    formData.append('pdfFile', selectedFile); // Key 'pdfFile' matches backend upload.single()
    try {
      setUploadStatus('Uploading...');
      const response = await uploadLabManual(formData);
      if (!response.success) {
        setUploadStatus('');
        setFormMessage({ type: "error", text: response.message || "Upload failed. Try again." });
        setTimeout(() => setFormMessage(null), 4000);
        return;
      }
      setUploadStatus('');
      setFormMessage({ type: "success", text: "Manual uploaded successfully." });
      fileInputRef.current.value = "";
      setTimeout(() => setFormMessage(null), 4000);
    } catch (err) {
      setUploadStatus('');
      setFormMessage({ type: "error", text: "Upload failed. Try again." });
      setTimeout(() => setFormMessage(null), 4000);
    }
    setTitle("");
    setSubject("");
    setSelectedFile(null);
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
        <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Manual file</label>
        <input
          ref={fileInputRef}
          id="manual-file"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="sr-only"
        />
        <label
          htmlFor="manual-file"
          className="flex items-center gap-2 h-10 min-w-60 px-1.5 rounded-lg border bg-white cursor-pointer"
          style={inputStyle}
        >
          <span
            className="px-3 py-1.5 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: "#1F2A24" }}
          >
            Choose file
          </span>
          <span className="truncate text-sm pr-2" style={{ color: selectedFile ? "#1F2A24" : "#8A968D" }}>
            {selectedFile ? selectedFile.name : "No file selected"}
          </span>
        </label>
      </div>
      <button
        type="submit"
        disabled={!selectedFile}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white"
        style={{ backgroundColor: "#1F2A24" }}
      >
        <Plus size={15} /> Add manual
      </button>
      {uploadStatus && <p className="basis-full text-xs" style={{ color: "#5B6A5F" }}>{uploadStatus}</p>}
      {formMessage && (
        <div
          className="basis-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
          style={{
            backgroundColor: formMessage.type === "success" ? "#E3EEE5" : "#FBEAEA",
            color: formMessage.type === "success" ? "#2F6F52" : "#B3261E",
          }}
        >
          {formMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {formMessage.text}
        </div>
      )}
    </form>
  );
}