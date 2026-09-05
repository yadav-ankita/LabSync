import { useEffect, useState } from "react";
import { TopBar } from "./TopBar";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function EditProfile() {
  const { currentUser, editprofileadmin } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    currentPassword: "",
    password: "",
  });
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
        department: currentUser.department || "",
        currentPassword: currentUser.password || "",
        password: "",
      });
    }
  }, [currentUser]);

  const labelStyle = { color: "#1F2A24", fontWeight: 500 };
  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setErrorMessage("");
    const result = await editprofileadmin({
      name: form.name,
      email: form.email,
      department: form.department,
      ...(form.password ? { password: form.password } : {}),
    });
    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }
    setSaved(true);
    setForm((currentForm) => ({ ...currentForm, password: "" }));
    setShowPassword(false);
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
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>

        {errorMessage && <p className="mb-4 text-sm" style={{ color: "#B42318" }}>{errorMessage}</p>}

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
            value="Computer Engineering"
            className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
            readOnly
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Current password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={form.currentPassword || "********"}
              className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm bg-stone-50"
              style={{ borderColor: "#D8DCD4", color: "#5B6A5F" }}
              readOnly
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1.5" style={labelStyle}>New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current password"
              className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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