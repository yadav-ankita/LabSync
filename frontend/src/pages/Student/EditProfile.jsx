import { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { CheckCircle2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useStudentContext } from "../../context/StudentContext";

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function EditProfile() {
  const {currentUser}=useAppContext();
  const { editProfile, getStudentData} =useStudentContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    branch: "",
    semester: "",
    password: "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const labelStyle = { color: "#1F2A24", fontWeight: 500 };
  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      username: form.username,
      email: form.email,
      branch: form.branch,
      semester: form.semester,
    };
    if (form.password.trim()) payload.password = form.password.trim();

    const result = await editProfile(payload);
    setSaving(false);

    if (result.success) {
      setSaved(true);
      setForm((f) => ({
        username: "",
        email: "",
        branch: "",
        semester: "",
        password: "",
        password: ""
      }));
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      <TopBar title="Edit Profile" subtitle="Keep your details up to date." />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-6 max-w-xl"
        style={{ borderColor: "#E3E6DF" }}
      >
        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Full name</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Your full name"
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@college.edu"
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm mb-1.5" style={labelStyle}>Branch</label>
            <input
              type="text"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              placeholder="e.g. Computer Science"
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={labelStyle}>Semester</label>
            <select
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border text-sm bg-white focus:outline-none"
              style={inputStyle}
            >
              <option value="">Select</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1.5" style={labelStyle}>New password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Leave blank to keep current password"
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1F2A24" }}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>

        {saved && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm"
            style={{ backgroundColor: "#E3EEE5", color: "#2F6F52" }}
          >
            <CheckCircle2 size={16} /> Profile updated successfully.
          </div>
        )}

        {!saved  && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm"
            style={{ backgroundColor: "#FBEAEA", color: "#B3261E" }}
          >
            {"error here "}
          </div>
        )}
      </form>
    </div>
  );
}