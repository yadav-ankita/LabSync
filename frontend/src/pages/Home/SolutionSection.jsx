import {
  ClipboardEdit,
  RadioTower,
  Boxes,
  Eye,
  Workflow,
  BookOpen,
  ShieldCheck,
  History,
} from "lucide-react";

const FEATURES = [
  { icon: ClipboardEdit, title: "Digital issue reporting", desc: "Hardware and software issues are reported digitally, not on paper forms." },
  { icon: RadioTower, title: "Real-time status tracking", desc: "Every complaint is tracked in real time, right through to resolution." },
  { icon: Boxes, title: "Centralized resources", desc: "Every laboratory's resources are tracked in one place, not scattered spreadsheets." },
  { icon: Eye, title: "Full visibility", desc: "See a resource's location, availability, and current borrower at a glance." },
  { icon: Workflow, title: "Digital borrow workflow", desc: "Requesting, borrowing, returning, and transferring resources — all digital." },
  { icon: BookOpen, title: "Centralized lab manuals", desc: "Semester- and subject-wise lab manuals, accessible in one repository." },
  { icon: ShieldCheck, title: "Role-based access", desc: "Dedicated access for students, faculty, HOD, and lab assistants." },
  { icon: History, title: "Full audit history", desc: "Digital records of every complaint, resource movement, and maintenance event." },
];

export function SolutionSection() {
  return (
    <section id="solution" className="py-20" style={{ backgroundColor: "#EFF2ED" }}>
      <div className="max-w-6xl mx-auto px-6">
        <span className="text-xs uppercase tracking-wide" style={{ color: "#D89A4E", fontWeight: 600 }}>
          The solution
        </span>
        <h2 className="text-2xl md:text-3xl mt-2 max-w-xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#1F2A24" }}>
          One platform for every lab, every role, every resource.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-5 rounded-xl border bg-white" style={{ borderColor: "#E3E6DF" }}>
                <Icon size={20} color="#D89A4E" />
                <p className="text-sm font-medium mt-3" style={{ color: "#1F2A24" }}>{f.title}</p>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#5B6A5F" }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
