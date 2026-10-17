
import { FileText, ExternalLink } from "lucide-react";

export function LabManualCard({ manual }) {
  const updatedDate = manual.updatedAt || manual.createdAt;

  const formattedDate = updatedDate
    ? new Date(updatedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <div
      className="p-5 rounded-xl border bg-white flex flex-col"
      style={{ borderColor: "#E3E6DF" }}
    >
      <div className="flex items-start justify-between">
        <FileText size={20} color="#D89A4E" />

        <span
          className="text-xs px-2 py-0.5 rounded"
          style={{
            backgroundColor: "#F2F4F1",
            color: "#5B6A5F",
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          {manual.fileType || "PDF"}
        </span>
      </div>

      <p className="text-sm font-medium mt-3" style={{ color: "#1F2A24" }}>
        {manual.title}
      </p>

      <p className="text-xs mt-1" style={{ color: "#5B6A5F" }}>
        {manual.subject}
      </p>

      <p className="text-xs mt-1" style={{ color: "#8A968D" }}>
        Semester {manual.semester}
      </p>

      <div
        className="flex items-center justify-between mt-4 pt-3 border-t gap-3"
        style={{ borderColor: "#E3E6DF" }}
      >
        <span className="text-xs" style={{ color: "#8A968D" }}>
          Updated {formattedDate}
        </span>

        {manual.fileUrl ? (
          <a
            href={manual.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border hover:bg-gray-50 shrink-0"
            style={{ borderColor: "#D89A4E", color: "#9A5F1D" }}
          >
            <ExternalLink size={13} />
            View
          </a>
        ) : (
          <span className="text-xs" style={{ color: "#8A968D" }}>
            File unavailable
          </span>
        )}
      </div>
    </div>
  );
}
