import { FileWarning, FolderX, EyeOff, PackageSearch, Table2 } from "lucide-react";

const PROBLEMS = [
  {
    icon: FileWarning,
    title: "Manual issue reporting",
    desc: "Hardware and software issues are reported through manual forms, with no digital trail.",
  },
  {
    icon: FolderX,
    title: "Paper complaint records",
    desc: "Physical complaint records make issue tracking and follow-up difficult for faculty and admins.",
  },
  {
    icon: EyeOff,
    title: "No transparent tracking",
    desc: "There's no visibility from the moment an issue is reported to when it's actually resolved.",
  },
  {
    icon: PackageSearch,
    title: "Borrowed equipment gets lost",
    desc: "It's hard to track who currently has a borrowed resource, or when it's due back.",
  },
  {
    icon: Table2,
    title: "Everything lives in one spreadsheet",
    desc: "Resource information across all labs is maintained in a single Excel sheet — error-prone and hard to keep current.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="max-w-6xl mx-auto px-6 py-20">
      <span className="text-xs uppercase tracking-wide" style={{ color: "#D89A4E", fontWeight: 600 }}>
        The problem
      </span>
      <h2 className="text-2xl md:text-3xl mt-2 max-w-xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#1F2A24" }}>
        Lab management today is manual, scattered, and hard to trust.
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mt-10">
        {PROBLEMS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="p-5 rounded-xl border bg-white" style={{ borderColor: "#E3E6DF" }}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: "#F2F4F1" }}
              >
                <Icon size={17} color="#C9782E" />
              </div>
              <p className="text-sm font-medium" style={{ color: "#1F2A24" }}>{p.title}</p>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#5B6A5F" }}>{p.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
