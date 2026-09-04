import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#1F2A24",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(216,154,78,0.15)" }}>
          <FlaskConical size={14} color="#D89A4E" />
          <span className="text-xs" style={{ color: "#EFC48A" }}>
            Computer Engineering Department · Project 4CP31
          </span>
        </div>

        <h1
          className="text-4xl md:text-5xl leading-tight max-w-2xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "white" }}
        >
          A smart laboratory resource management system for the department.
        </h1>

        <p className="text-base md:text-lg mt-5 max-w-xl" style={{ color: "rgba(255,255,255,0.65)" }}>
          LabSync is a centralized, intranet-based platform that streamlines asset tracking, borrowing
          and return, complaint resolution, maintenance, and lab manuals across every laboratory —
          with dedicated, role-based access for students, faculty, and lab administrators.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-8">
          <Link
            to="/student-login"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: "#D89A4E", color: "#1F2A24" }}
          >
            Student Sign in <ArrowRight size={16} />
          </Link>
          <a
            href="#portals"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.25)", color: "white" }}
          >
            Faculty &amp; Admin Portals
          </a>
        </div>
      </div>
    </section>
  );
}
