import { useState } from "react";
import { FlaskConical, User, Mail, Lock, Eye, EyeOff} from "lucide-react";
import { Link } from "react-router-dom";
import { registerStudent } from "../services/studentService";
import { useNavigate } from "react-router-dom";




const BATCHES = [2023, 2024, 2025, 2026];

const ADMISSION_TYPES = [
  "Regular",
  "D2D"
];

export default function StudentRegister() {
  const [form, setForm] = useState({
  studentId: "",
  name: "",
  email: "",
  password: "",
  batch: "",
  admissionType: "",
});
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: null }));
  };
  const navigate = useNavigate();
  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your full name.";
    if (!form.email.trim()) next.email = "Enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Create a password.";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    if (!form.studentId.trim())
    next.studentId = "Enter your Student ID.";

if (!form.batch)
    next.batch = "Select your batch.";

if (!form.admissionType)
    next.admissionType = "Select admission type.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setSubmitting(true);

  try {
    await registerStudent(form);

    alert("Registration Successful!");

navigate("/student-login", {
    replace: true,
});

  } catch (error) {
    alert(
    error.response?.data?.message ||
    "Something went wrong. Please try again."
);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen w-full flex bg-stone-100">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-neutral-900 flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(180,200,180,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(180,200,180,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <FlaskConical className="w-7 h-7 text-amber-500" strokeWidth={1.75} />
          <div>
            <p className="text-white font-semibold text-lg leading-none">LabTrack</p>
            <p className="text-stone-400 text-xs mt-1">Student Portal</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-stone-300 text-sm uppercase tracking-widest mb-3">Get started</p>
          <h1 className="text-white text-3xl font-semibold leading-snug max-w-sm">
            Create your account to raise and track lab complaints.
          </h1>
          <p className="text-stone-400 text-sm mt-4 max-w-sm">
            Set up your profile once — we'll match you to your semester's lab manuals automatically.
          </p>
        </div>

        <p className="relative z-10 text-stone-500 text-xs">© {new Date().getFullYear()} LabTrack</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <FlaskConical className="w-6 h-6 text-amber-600" strokeWidth={1.75} />
            <span className="font-semibold text-neutral-900 text-lg">LabTrack</span>
          </div>

          <h2 className="text-2xl font-semibold text-neutral-900">Create your account</h2>
          <p className="text-stone-500 text-sm mt-1.5 mb-8">
            Fill in your details to register as a student.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Aarav Mehta"
                  className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
                    errors.name ? "border-red-400" : "border-stone-200"
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
            </div>
            <div>
  <label
    htmlFor="studentId"
    className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
  >
    Student ID
  </label>

  <input
    id="studentId"
    type="text"
    value={form.studentId}
    onChange={handleChange("studentId")}
    placeholder="23CP056"
    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
    errors.studentId ? "border-red-400" : "border-stone-200"
}`}
  />
  {errors.studentId && (
    <p className="text-xs text-red-500 mt-1.5">
        {errors.studentId}
    </p>
)}
</div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@college.edu"
                  className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
                    errors.email ? "border-red-400" : "border-stone-200"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="At least 6 characters"
                  className={`w-full rounded-lg border bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
                    errors.password ? "border-red-400" : "border-stone-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">

    {/* Batch */}

    <div>
  <label
    htmlFor="batch"
    className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
  >
    Batch
  </label>

  <select
    id="batch"
    value={form.batch}
    onChange={handleChange("batch")}
    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
      errors.batch ? "border-red-400" : "border-stone-200"
    }`}
  >
    <option value="">Select Batch</option>
    {BATCHES.map((batch) => (
    <option key={batch} value={batch}>
        {batch}
    </option>
))}
  </select>

  {errors.batch && (
    <p className="text-xs text-red-500 mt-1.5">
      {errors.batch}
    </p>
  )}
</div>

    {/* Admission */}

    <div>
  <label
    htmlFor="admissionType"
    className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
  >
    Admission Type
  </label>

  <select
    id="admissionType"
    value={form.admissionType}
    onChange={handleChange("admissionType")}
    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
      errors.admissionType ? "border-red-400" : "border-stone-200"
    }`}
  >
    <option value="">Select Admission Type</option>
    {ADMISSION_TYPES.map((type) => (
    <option key={type} value={type}>
        {type}
    </option>
))}
  </select>

  {errors.admissionType && (
    <p className="text-xs text-red-500 mt-1.5">
      {errors.admissionType}
    </p>
  )}
</div>

</div>

              
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium text-sm py-2.5 transition-colors"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-stone-500 mt-8 text-center">
            Already have an account?{" "}
            <Link
              to="/student-login"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}