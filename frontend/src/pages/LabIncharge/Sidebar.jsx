import {
  LayoutGrid,
  MessageSquareWarning,
  ClipboardCheck,
  FlaskConical,
  Wrench,
  FileText,
  LogOut,
  BookOpen,
  MessageSquarePlus
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const LAB_INCHARGE = {
  name: "Faculty",
  facultyId: "FAC-0000",
  labs: [],
};

export function Sidebar({ activeView, setActiveView }) {
  const { currentUser,logout} = useAppContext();
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const displayName = currentUser?.faculty_name || currentUser?.name || LAB_INCHARGE.name;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "FI";

  const navItems = [
    { key: "home", label: "Overview", icon: LayoutGrid },
    { key: "complaints", label: "Complaints", icon: MessageSquareWarning },
     { key: "raise", label: "Raise a Complaint", icon: MessageSquarePlus },
    { key: "requests", label: "Resource Requests", icon: ClipboardCheck },
    { key: "resources", label: "Lab Resources", icon: FlaskConical },
    { key: "maintenance", label: "Maintenance", icon: Wrench },
    { key: "profile", label: "Edit Profile", icon: FileText },
    { key: "manuals", label: "Lab Manuals", icon: BookOpen },
  ];

  return (
    <aside
      className="w-64 shrink-0 flex flex-col"
      style={{
        backgroundColor: "#1F2A24",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="px-6 pt-7 pb-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <FlaskConical size={22} color="#D89A4E" />
          <span
            className="text-white text-base"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
          >
            LabTrack
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          Lab Incharge Portal
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: active ? "rgba(216,154,78,0.15)" : "transparent",
                color: active ? "#EFC48A" : "rgba(255,255,255,0.75)",
                fontWeight: active ? 600 : 400,
                borderLeft: active ? "2px solid #D89A4E" : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: "#D89A4E", color: "#1F2A24" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm truncate">{displayName}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.45)" }}>
              {currentUser?.lab_name || LAB_INCHARGE.labs[0] || "Assigned lab"}
            </p>
          </div>
        </div>
        <button onClick={handleLogout}>
          <div className="flex items-center gap-2 mt-3 text-sm font-medium text-white cursor-pointer">
            <LogOut size={16} color="#D89A4E" className="mt-1 ml-2" />
            <p>Logout</p>
          </div>
        </button>
      </div>
    </aside>
  );
}

export { LAB_INCHARGE };