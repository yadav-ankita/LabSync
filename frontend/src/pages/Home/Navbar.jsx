import { useState } from "react";
import { Link } from "react-router-dom";
import { FlaskConical, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Modules", href: "#modules" },
  { label: "Portals", href: "#portals" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b" style={{ backgroundColor: "rgba(242,244,241,0.9)", borderColor: "#E3E6DF" }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical size={22} color="#D89A4E" />
          <Link to="/">
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#1F2A24" }} className="text-lg">
            LabSync
          </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm transition-colors"
              style={{ color: "#5B6A5F" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#1F2A24")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#5B6A5F")}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm px-4 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1F2A24" }}
          >
            Sign in
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} color="#1F2A24" /> : <Menu size={22} color="#1F2A24" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t" style={{ borderColor: "#E3E6DF" }}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-sm py-1" style={{ color: "#5B6A5F" }} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link
            to="/student-login"
            className="text-sm px-4 py-2 rounded-lg font-medium text-white text-center mt-1"
            style={{ backgroundColor: "#1F2A24" }}
          >
            Sign in
          </Link>
        </div>
      )}
    </header>
  );
}
