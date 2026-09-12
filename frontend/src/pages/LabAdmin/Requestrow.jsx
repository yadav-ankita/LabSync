import { Clock, User } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";
import { RequestStatusPill } from "../../components/RequestStatusPill";

export function RequestRow({ request }) {
  const date = new Date(request.createdAt);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const resourceName =
    request.purchase?.particulars || "Unknown Resource";

  const labName =
    request.lab?.LabName || "Unknown Lab";

  const labIncharge =
    request.lab?.AssignFaculty?.name || "Lab Incharge";

  return (
    <div
      className="px-6 py-5 border-t first:border-t-0"
      style={{ borderColor: "#E3E6DF" }}
    >
      <div className="flex items-start justify-between gap-6">

        {/* Request Details */}
        <div className="min-w-0">

          <div className="flex items-center gap-3 flex-wrap">

            <ResourceTag id={resourceName} />

            <span
              className="text-base font-medium"
              style={{ color: "#1F2A24" }}
            >
              {resourceName}
            </span>

            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "#EEF1EC",
                color: "#3E4A41",
              }}
            >
              {labName}
            </span>

          </div>

          <p
            className="text-sm mt-3"
            style={{ color: "#1F2A24" }}
          >
            <span className="font-medium">Quantity:</span>{" "}
            {request.quantity}
            {" · "}
            <span className="font-medium">Type:</span>{" "}
            {request.resourceType}
          </p>

          <div
            className="flex items-center gap-2 text-xs mt-3 flex-wrap"
            style={{ color: "#8A968D" }}
          >
            <User size={13} />

            <span>
              Lab Incharge: {labIncharge}
            </span>

            <span>·</span>

            <Clock size={13} />

            <span>
              Requested on {formattedDate}
            </span>
          </div>

        </div>

        {/* Status */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <RequestStatusPill status={request.status} />

          {request.status === "Rejected" &&
            request.rejectionReason && (
              <p
                className="text-xs max-w-xs text-right"
                style={{ color: "#B3261E" }}
              >
                Reason: {request.rejectionReason}
              </p>
            )}
        </div>

      </div>
    </div>
  );
}