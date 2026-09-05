import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlaskConical, Mail, Lock, Phone, User, Users, Eye, EyeOff } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const PHONE_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
    const { register} = useAppContext();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Please enter your full name.";
        if (!form.email.trim()) next.email = "Please enter your email.";
        else if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address.";
        if (!form.password) next.password = "Please enter a password.";
        else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/.test(form.password)) {
            next.password = "Use 8-20 characters with uppercase, lowercase, number, and special character.";
        }
        if (!form.phone.trim()) next.phone = "Please enter your phone number.";
        else if (!PHONE_REGEX.test(form.phone.trim())) next.phone = "Enter a valid 10-digit phone number.";
        if (!form.role) next.role = "Please select a role.";
        return next;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        setSubmitting(true);
        try {
            const result = await register(form);
            if (!result?.success) {
                setErrors({ form: result?.message || "Could not create your account." });
            } else {
                navigate("/login", { replace: true });
            }
        } catch (error) {
            setErrors({form: error.response?.data?.message || error.message || "Could not create your account.",});
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <>
            <div className="min-h-screen w-full flex bg-stone-100">
                {/* Brand panel */}
                <div
                    className="hidden lg:flex lg:w-2/5 relative flex-col justify-between p-12 overflow-hidden"
                    style={{
                        backgroundColor: "#1F2A24",
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                    }}
                >
                    <div className="relative z-10 flex items-center gap-3">
                        <FlaskConical className="w-7 h-7 text-amber-500" strokeWidth={1.75} />
                        <Link to="/">
                        <div>
                            <p className="text-white font-semibold text-lg leading-none">LabSync</p>
                        </div>
                        </Link>
                    </div>

                    <div className="relative z-10">
                        <p className="text-stone-300 text-sm uppercase tracking-widest mb-3">Get started</p>
                        <h1 className="text-white text-3xl font-semibold leading-snug max-w-sm">
                            Create your account to start tracking labs, complaints, and resources.
                        </h1>
                        <p className="text-stone-400 text-sm mt-4 max-w-sm">
                            It only takes a minute — you'll be signed in right after.
                        </p>
                    </div>

                    <p className="relative z-10 text-stone-500 text-xs">© {new Date().getFullYear()} LabSync</p>
                </div>

                {/* Form panel */}
                <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-sm">
                        <div className="lg:hidden flex items-center gap-2 mb-8">
                            <FlaskConical className="w-6 h-6 text-amber-600" strokeWidth={1.75} />
                            <span className="font-semibold text-neutral-900 text-lg">LabSync</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-neutral-900">Create your account</h2>
                        <p className="text-stone-500 text-sm mt-1.5 mb-8">
                            Fill in your details to get started.
                        </p>

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
                                >
                                    Full name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Jane Doe"
                                        className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${errors.name ? "border-red-400" : "border-stone-200"
                                            }`}
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="abc@gmail.com"
                                        className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${errors.email ? "border-red-400" : "border-stone-200"
                                            }`}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
                                >
                                    Phone number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="9876543210"
                                        className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2.5 text-sm text-neutral-900 placeholder:text-stone-400 outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${errors.phone ? "border-red-400" : "border-stone-200"
                                            }`}
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone}</p>}
                            </div>
                             <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
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
                            <div>
                                <label
                                    htmlFor="role"
                                    className="block text-xs font-medium uppercase tracking-wide text-stone-500 mb-1.5"
                                >
                                    Role
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                    <select
                                        id="role"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className={`w-full appearance-none rounded-lg border bg-white pl-10 pr-8 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${form.role ? "text-neutral-900" : "text-stone-400"
                                            } ${errors.role ? "border-red-400" : "border-stone-200"}`}
                                    >
                                        <option value="" disabled>Select role</option>
                                        <option value="student">Student</option>
                                        <option value="admin">Lab Admin</option>
                                        <option value="hod">HOD</option>
                                    </select>
                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
                                        viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {errors.role && <p className="text-xs text-red-500 mt-1.5">{errors.role}</p>}
                            </div>
                           
                            {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium text-sm py-2.5 transition-colors"
                            >
                                {submitting ? "Creating account…" : "Create account"}
                            </button>
                        </form>
                        <p className="text-center text-sm text-stone-500 mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}