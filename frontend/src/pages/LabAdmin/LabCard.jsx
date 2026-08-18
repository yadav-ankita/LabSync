import { FlaskConical, Users, Package } from "lucide-react";

export function LabCard({
    labName,
    faculty = "Not Yet Assigned",
    numberOfResources = 0,
}) {
    const initials = labName
        ?.trim()
        .split(/\s+/)
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow duration-200"
            style={{ borderColor: "#E3E6DF" }}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                
                {/* Lab Avatar */}
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center 
                               text-sm font-semibold shrink-0"
                    style={{
                        backgroundColor: "#F4E4D0",
                        color: "#8A5A20",
                    }}
                >
                    {initials || "LB"}
                </div>

                {/* Lab Name */}
                <div className="min-w-0 flex-1">
                    <h3
                        className="text-sm font-semibold truncate"
                        style={{ color: "#1F2A24" }}
                    >
                        {labName}
                    </h3>

                    <div
                        className="flex items-center gap-1.5 mt-1 text-xs"
                        style={{ color: "#5B6A5F" }}
                    >
                        <Users size={13} />
                        <span className="truncate">
                            {faculty || "Not Yet Assigned"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Resources */}
            <div className="flex items-center gap-2 mt-4">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#F2F4F1" }}
                >
                    <Package size={15} color="#5B6A5F" />
                </div>

                <div>
                    <p
                        className="text-xs"
                        style={{ color: "#8A968D" }}
                    >
                        Resources
                    </p>

                    <p
                        className="text-sm font-medium"
                        style={{ color: "#1F2A24" }}
                    >
                        {numberOfResources}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div
                className="mt-4 pt-3 border-t flex items-center gap-2"
                style={{ borderColor: "#E3E6DF" }}
            >
                <FlaskConical size={14} color="#D89A4E" />

                <span
                    className="text-xs"
                    style={{ color: "#5B6A5F" }}
                >
                    Laboratory
                </span>
            </div>
        </div>
    );
}