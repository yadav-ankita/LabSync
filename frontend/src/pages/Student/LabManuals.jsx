
import { useEffect, useMemo, useState } from "react";
import { TopBar } from "./TopBar";
import { LabManualCard } from "./LabManualCard";
import { useAppContext } from "../../context/AppContext";
import { BookOpen, Loader2 } from "lucide-react";

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function LabManuals() {
  const {
    labManuals = [],
    getLabManuals,
    loadingManuals,
    manualsError,
    currentUser,
  } = useAppContext();

  const [selectedSemester, setSelectedSemester] = useState(
    String(currentUser?.semester || "1")
  );

  useEffect(() => {
    getLabManuals?.();
  }, [getLabManuals]);

  useEffect(() => {
    if (currentUser?.semester) {
      setSelectedSemester(String(currentUser.semester));
    }
  }, [currentUser?.semester]);

  const filteredManuals = useMemo(() => {
    return labManuals.filter(
      (manual) => String(manual.semester) === selectedSemester
    );
  }, [labManuals, selectedSemester]);

  return (
    <div>
      <TopBar
        title="Lab Manuals"
        subtitle="Browse and read manuals published for each semester."
      />
  {manualsError && (
  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
    {manualsError}
  </div>
)}
      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap items-end justify-between gap-4"
        style={{ borderColor: "#E3E6DF" }}
      >
        <div>
          <label
            htmlFor="manual-semester"
            className="block text-xs mb-2"
            style={{ color: "#5B6A5F" }}
          >
            Filter by semester
          </label>

          <select
            id="manual-semester"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm bg-white min-w-48"
            style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
          >
            {SEMESTERS.map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs" style={{ color: "#5B6A5F" }}>
          {filteredManuals.length}{" "}
          {filteredManuals.length === 1 ? "manual" : "manuals"} available
        </p>
      </div>

      {loadingManuals ? (
        <div
          className="flex items-center justify-center gap-2 py-12 text-sm"
          style={{ color: "#5B6A5F" }}
        >
          <Loader2 size={18} className="animate-spin" />
          Loading manuals...
        </div>
      ) : filteredManuals.length === 0 ? (
        <div
          className="bg-white rounded-xl border p-8 text-center"
          style={{ borderColor: "#E3E6DF" }}
        >
          <BookOpen
            size={28}
            className="mx-auto mb-3"
            color="#D89A4E"
          />
          <p className="text-sm font-medium" style={{ color: "#1F2A24" }}>
            No manuals available
          </p>
          <p className="text-xs mt-2" style={{ color: "#5B6A5F" }}>
            No manuals have been published for Semester {selectedSemester} yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredManuals.map((manual) => (
            <LabManualCard
              key={manual._id || manual.id}
              manual={manual}
            />
          ))}
        </div>
      )}
    </div>
  );
}
