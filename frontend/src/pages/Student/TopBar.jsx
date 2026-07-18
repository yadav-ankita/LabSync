
 export function TopBar({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between mb-7">
      <div>
        <h1
          className="text-2xl"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#1F2A24" }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: "#5B6A5F" }}>{subtitle}</p>}
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-sm" style={{ color: "#1F2A24" }}>
            {/* {STUDENT.branch} */}
            Computer Engineering
        </p>
        <p className="text-xs" style={{ color: "#5B6A5F" }}>
            5th Semester
            {/* {STUDENT.semester} */}
            </p>
      </div>
    </div>
  );
}