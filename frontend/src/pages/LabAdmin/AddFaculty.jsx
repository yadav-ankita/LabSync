import React, { useState } from 'react'
import { useEffect} from "react";
import { UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { TopBar } from "./TopBar";
import { FacultyCard } from "./FacultyCard";
import { useAppContext } from "../../context/AppContext";

const LAB_OPTIONS = [1, 2, 3, 4, 5, 6];

export function AddFaculty() {
  const { faculties, addFaculty, getFaculty, emailCredentialsToFaculty } = useAppContext();

  const [form, setForm] = useState({ name: "", email: "", lab_no: LAB_OPTIONS[0] });
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null); // { type: 'success' | 'error', text }
  const [loadingList, setLoadingList] = useState(true);
  const [sendStatus, setSendStatus] = useState({}); // { [facultyId]: 'sending' | 'sent' | 'error' }

  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };
  const labelStyle = { color: "#1F2A24", fontWeight: 500 };

  useEffect(() => {
    (async () => {
      setLoadingList(true);
      await getFaculty();
      setLoadingList(false);
    })();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.lab_no) return;

    setSubmitting(true);
    setFormMessage(null);
    const result = await addFaculty({
      name: form.name.trim(),
      email: form.email.trim(),
      lab_no: Number(form.lab_no),
    });
    setSubmitting(false);

    if (result.success) {
      setForm({ name: "", email: "", lab_no: LAB_OPTIONS[0] });
      setFormMessage({ type: "success", text: "Faculty added. A random password was generated for them." });
    } else {
      setFormMessage({ type: "error", text: result.message });
    }
    setTimeout(() => setFormMessage(null), 4000);
  };

  const handleSendCredentials = async (password, email) => {
    setSendStatus((prev) => ({ ...prev, [email]: "sending" }));
    const result = await emailCredentialsToFaculty({ password, email });
    setSendStatus((prev) => ({ ...prev, [email]: result.success ? "sent" : "error" }));
    if (result.success) {
      setTimeout(() => {
        setSendStatus((prev) => ({ ...prev, [email]: undefined }));
      }, 4000);
    }
  };

  return (
    <div>
      <TopBar title="Faculty Accounts" subtitle="Add lab incharges and send them their login credentials." />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-5 mb-4 flex flex-wrap items-end gap-3"
        style={{ borderColor: "#E3E6DF" }}
      >
        <div className="flex-1 min-w-45">
          <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Full name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Dr. Neha Sharma"
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        <div className="flex-1 min-w-50">
          <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g. neha.sharma@college.edu"
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>Assign Lab</label>
          <select
            value={form.lab_no}
            onChange={(e) => setForm({ ...form, lab_no: e.target.value })}
            className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
            style={inputStyle}
          >
            {LAB_OPTIONS.map((lab) => (
              <option key={lab} value={lab}>Lab {lab}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "#1F2A24" }}
        >
          <UserPlus size={15} /> {submitting ? "Adding..." : "Add Faculty"}
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
          Loading faculty accounts...
        </div>
      ) : faculties.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-sm" style={{ borderColor: "#E3E6DF", color: "#5B6A5F" }}>
          No faculty accounts yet. Add one using the form above.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {faculties.map((faculty) => (
            <FacultyCard
              key={faculty._id}
              faculty={faculty}
              sendStatus={sendStatus[faculty._id]}
              onSendCredentials={handleSendCredentials}
            />
          ))}
        </div>
      )}
    </div>
  );
}