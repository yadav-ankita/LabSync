import { useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useStudentContext } from "../../context/StudentContext";

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function EditProfile() {
  const { currentUser } = useAppContext();
  const { editProfile, getStudentData } = useStudentContext();
  const [form, setForm] = useState(() => ({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    branch: currentUser?.department || currentUser?.branch || "",
    semester: currentUser?.semester || "",
    currentPassword: currentUser?.password || "",
    password: "",
  }));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const labelStyle = { color: "#1F2A24", fontWeight: 500 };
  const inputStyle = { borderColor: "#D8DCD4", color: "#1F2A24" };

  useEffect(() => {
    let isActive = true;
    const loadProfile = async () => {
      const student = await getStudentData();
      if (!student || !isActive) return;
      setForm((currentForm) => ({
        ...currentForm,
        name: student.name || "",
        email: student.email || "",
        branch: student.department || student.branch || "",
        semester: student.semester || "",
        currentPassword: student.password || "",
      }));
    };

    loadProfile();
    return () => {
      isActive = false;
    };
  }, [getStudentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setErrorMessage("");
    setSaving(true);

    const payload = {
      name: form.name,
      email: form.email,
      department: form.branch,
      semester: form.semester,
    };
    if (form.password) payload.password = form.password;

    try {
      const result = await editProfile(payload);

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      setSaved(true);
      setForm((formState) => ({
        ...formState,
        currentPassword: result.student.password || "",
        password: "",
      }));
      setShowCurrentPassword(false);
      setShowPassword(false);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
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
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
            required
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
            required
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
              required
              className="w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={labelStyle}>Semester</label>
            <select
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              required
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

        <div className="mb-5">
          <label className="block text-sm mb-1.5" style={labelStyle}>Current password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="current-password"
              value={form.currentPassword}
              readOnly
              className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
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
          <p className="mt-1.5 text-xs text-stone-500">
            This is your current password. Enter a new password below to change it.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1.5" style={labelStyle}>New password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current password"
              minLength={6}
              className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm focus:outline-none"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              aria-label={showPassword ? "Hide new password" : "Show new password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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

        {errorMessage && (
          <div
            className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm"
            style={{ backgroundColor: "#FBEAEA", color: "#B3261E" }}
          >
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}