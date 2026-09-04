import { Link } from "react-router-dom";
import { GraduationCap, FlaskConical, ShieldCheck, ArrowRight } from "lucide-react";

const ROLES = [
  {
    icon: GraduationCap,
    title: "Student",
    desc: "Report issues, track your complaints, borrow resources, and browse lab manuals.",
    href: "/student-login",
    cta: "Student sign in",
  },
  {
    icon: FlaskConical,
    title: "Lab Incharge",
    desc: "Review complaints, approve resource requests, and manage your assigned labs.",
    href: "/login",
    cta: "Faculty sign in",
  },
  {
    icon: ShieldCheck,
    title: "Lab Admin",
    desc: "Manage resources and faculty accounts across every laboratory in the department.",
    href: "/login",
    cta: "Admin sign in",
  },
];

export function RolesSection() {
  return (
    <section id="portals" className="max-w-6xl mx-auto px-6 py-20">
      <span className="text-xs uppercase tracking-wide" style={{ color: "#D89A4E", fontWeight: 600 }}>
        Portals
      </span>
      <h2 className="text-2xl md:text-3xl mt-2 max-w-xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#1F2A24" }}>
        Built for every role in the department.
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {ROLES.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="p-6 rounded-xl border bg-white flex flex-col" style={{ borderColor: "#E3E6DF" }}>
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#1F2A24" }}
              >
                <Icon size={20} color="#D89A4E" />
              </div>
              <p className="text-base font-medium mt-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1F2A24" }}>
                {r.title}
              </p>
              <p className="text-sm mt-1.5 leading-relaxed flex-1" style={{ color: "#5B6A5F" }}>{r.desc}</p>
              <Link
                to={r.href}
                className="inline-flex items-center gap-1.5 text-sm mt-5 font-medium group"
                style={{ color: "#9A5F1D" }}
              >
                {r.cta} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
