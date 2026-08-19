import { useEffect, useState } from "react";
import { TopBar } from "./TopBar";
import { CheckCircle2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function EditProfile() {
  const { currentUser, editFacultyProfile } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || currentUser.faculty_name || "",
        email: currentUser.email || "",
        password: "",
      });
    }
  }, []);

  const labelStyle = { color: "#1F2A24", fontWeight: 500 };
  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setErrorMessage("");

    const payload = {
      name: form.name,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
    };

    const result = await editFacultyProfile(payload);

    if (result.success) {
      setSaved(true);
      setForm((f) => ({ ...f, password: "" }));
      setTimeout(() => setSaved(false), 3000);
      return;
    }

    setErrorMessage(result.message || "Could not update profile.");
  };

  return (
    <div>
      <TopBar title="Edit Profile" subtitle="Keep your details up to date." />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 max-w-xl" style={{ borderColor: "#E3E6DF" }}>
        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Full name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <label className="block text-sm mb-1.5" style={labelStyle}>Assigned lab</label>
          <input
            type="text"
            value={currentUser?.lab_name || "Not assigned"}
            disabled
            className="w-full px-3 py-2.5 rounded-lg border text-sm bg-stone-50"
            style={{ borderColor: "#D8DCD4", color: "#5B6A5F" }}
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

        {errorMessage && (
          <div className="mt-4 px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: "#FDECEC", color: "#B42318" }}>
            {errorMessage}
          </div>
        )}

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