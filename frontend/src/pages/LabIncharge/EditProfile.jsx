import { useState } from "react";
import { TopBar } from "./TopBar";
import { CheckCircle2 } from "lucide-react";
import { LAB_INCHARGE } from "./Sidebar";

export function EditProfile() {
  const [form, setForm] = useState({
    username: LAB_INCHARGE.name,
    email: "neha.sharma@college.edu",
    department: "Computer Engineering",
    password: "",
  });
  const [saved, setSaved] = useState(false);

  const labelStyle = { color: "#1F2A24", fontWeight: 500 };
  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setForm((f) => ({ ...f, password: "" }));
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <TopBar title="Edit Profile" subtitle="Keep your details up to date." />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-xl" style={{ borderColor: "#E3E6DF" }}>
        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Full name</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
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
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Department</label>
          <input
            type="text"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
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
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "#1F2A24" }}
        >
          Save changes
        </button>

        {saved && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm"
            style={{ backgroundColor: "#E3EEE5", color: "#2F6F52" }}
          >
            <CheckCircle2 size={16} /> Profile updated successfully.
          </div>
        )}
      </form>
    </div>
  );
}