import { useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FlaskConical, Mail, Lock, Eye, EyeOff, CalendarDays } from "lucide-react";
import { loginStudent } from "../services/studentService";

export default function StudentLogin() {
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

if (token) {
  return <Navigate to="/student-dashboard" replace />;
}
  const [form, setForm] = useState({ studentId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const validate = () => {
    const next = {};
    if (!form.studentId?.trim()) {
      next.studentId = "Enter your Student ID.";
    }
    else if (!/^\d{2}[A-Z]{2}\d{3}$/.test(form.studentId)) {
      next.studentId = "Enter a valid ID (e.g. 23CP065).";
    }
    if (!form.password) {
      next.password = "Enter your password.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await loginStudent(form);

localStorage.setItem("token", response.data.token);

localStorage.setItem(
    "student",
    JSON.stringify(response.data.student)
);

alert("Login Successful!");

navigate("/student-dashboard", {
    replace: true,
});
    } catch (error) {
      setErrors({
    form:
        error.response?.data?.message ||
        "Invalid Student ID or Password."
});
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
          <p className="text-stone-300 text-sm uppercase tracking-widest mb-3">Welcome back</p>
          <h1 className="text-white text-3xl font-semibold leading-snug max-w-sm">
            Track every complaint, manual, and lab session in one place.
          </h1>
          <p className="text-stone-400 text-sm mt-4 max-w-sm">
            Sign in with your credentials to pick up right where you left off.
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
          <h2 className="text-2xl font-semibold text-neutral-900">Sign in to your account</h2>
          <p className="text-stone-500 text-sm mt-1.5 mb-8">
            Enter your credentials to access your labs.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="studentId"
                className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
              >
                Student ID
              </label>

              <div className="relative">
                <input
                  id="studentId"
                  type="text"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  placeholder="e.g. 23CP065"
                  className={`w-full rounded-lg border bg-white pl-3 pr-3 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${errors.studentId ? "border-red-400" : "border-stone-200"
                    }`}
                />
              </div>

              {errors.studentId && (
                <p className="text-xs text-red-500 mt-1.5">{errors.studentId}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Password
                </label>
                {/* <button type="button" className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                  Forgot password?
                </button> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border bg-white pl-10 pr-10 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${errors.password ? "border-red-400" : "border-stone-200"
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
            {errors.form && 
            (<p className="text-sm text-red-500">{errors.form}</p>)}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium text-sm py-2.5 transition-colors"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}