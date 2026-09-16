import {
  LayoutGrid,
  ClipboardCheck,
  ArrowLeftRight,
  User,
  LogOut,
  FlaskConical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

export function Sidebar({ activeView, setActiveView }) {
  const navigate = useNavigate();
  const { logout, currentUser } = useAppContext();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      key: "home",
      label: "Overview",
      icon: LayoutGrid,
    },
    {
      key: "maintenance",
      label: "Maintenance Approval",
      icon: ClipboardCheck,
    },
    {
  key: "transferRequests",
  label: "Transfer Requests",
  icon: ArrowLeftRight,
},
    {
      key: "profile",
      label: "Edit Profile",
      icon: User,
    },
  ];

  return (
    <aside
      className="w-64 shrink-0 flex flex-col min-h-screen"
      style={{
        backgroundColor: "#1F2A24",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      {/* Logo */}
      <div
        className="px-6 pt-7 pb-6 border-b"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          <FlaskConical
            size={22}
            color="#D89A4E"
          />

          <span
            className="text-white text-base"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
            }}
          >
            LabSync
          </span>
        </div>

        <p
          className="text-xs mt-1"
          style={{
            color: "rgba(255,255,255,0.45)",
          }}
        >
          HOD Portal
        </p>
      </div>

      {/* Navigation */}
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
                backgroundColor: active
                  ? "rgba(216,154,78,0.15)"
                  : "transparent",

                color: active
                  ? "#EFC48A"
                  : "rgba(255,255,255,0.75)",

                fontWeight: active ? 600 : 400,

                borderLeft: active
                  ? "2px solid #D89A4E"
                  : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor =
                    "transparent";
                }
              }}
            >
              <Icon size={17} />

              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        className="px-6 py-5 border-t"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{
              backgroundColor: "#D89A4E",
              color: "#1F2A24",
            }}
          >
            {currentUser?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "HO"}
          </div>

          {/* Name */}
          <div className="min-w-0">
            <p className="text-white text-sm truncate">
              {currentUser?.name || "HOD"}
            </p>

            <p
              className="text-xs mt-0.5"
              style={{
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Head of Department
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 mt-4 text-sm font-medium"
          style={{
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <LogOut
            size={16}
            color="#D89A4E"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}