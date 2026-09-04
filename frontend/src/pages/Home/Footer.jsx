import { FlaskConical } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#1F2A24" }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FlaskConical size={18} color="#D89A4E" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "white" }}>
            LabSync
          </span>
        </div>
        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
          4CP31 · Project 1 · Computer Engineering Department
        </p>
        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
          Vatsal Joshi · Drashti Gohel · Ankita Yadav
        </p>
      </div>
    </footer>
  );
}
