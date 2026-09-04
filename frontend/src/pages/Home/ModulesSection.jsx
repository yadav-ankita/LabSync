import {
  KeyRound,
  FlaskConical,
  ClipboardCheck,
  ArrowLeftRight,
  MessageSquareWarning,
  Wrench,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

const MODULES = [
  { icon: KeyRound, title: "Authentication & Role-Based Access", desc: "Secure sign-in with dedicated permissions for each role." },
  { icon: FlaskConical, title: "Laboratory & Resource Management", desc: "Every lab and its equipment, catalogued in one place." },
  { icon: ClipboardCheck, title: "Resource Request & Approval", desc: "Students request resources; faculty approve or reject them." },
  { icon: ArrowLeftRight, title: "Borrow, Return & Transfer", desc: "Track resources as they move between people and labs." },
  { icon: MessageSquareWarning, title: "Complaint & Resolution", desc: "Report issues digitally and track them through to resolution." },
  { icon: Wrench, title: "Maintenance & Resource History", desc: "A full maintenance log for every asset in the department." },
  { icon: BookOpen, title: "Laboratory Manual Repository", desc: "Semester- and subject-wise manuals, always up to date." },
  { icon: LayoutDashboard, title: "Role-Based Dashboards & Reports", desc: "Purpose-built dashboards for students, faculty, and admins." },
];

export function ModulesSection() {
  return (
    <section id="modules" className="max-w-6xl mx-auto px-6 py-20">
      <span className="text-xs uppercase tracking-wide" style={{ color: "#D89A4E", fontWeight: 600 }}>
        What's inside
      </span>
      <h2 className="text-2xl md:text-3xl mt-2 max-w-xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#1F2A24" }}>
        Eight modules, working together.
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {MODULES.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-5 rounded-xl border bg-white flex flex-col" style={{ borderColor: "#E3E6DF" }}>
              <div className="flex items-center justify-between">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#F2F4F1" }}
                >
                  <Icon size={17} color="#D89A4E" />
                </div>
                <span
                  className="text-xs"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A968D" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="text-sm font-medium mt-3" style={{ color: "#1F2A24" }}>{m.title}</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#5B6A5F" }}>{m.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
