import { Clock, User, Check, X } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";
import { RequestStatusPill } from "../../components/RequestStatusPill";

export function RequestRow({ request, onDecision }) {
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

          {/* Resource + Lab */}
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

          {/* Quantity + Type */}
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

          {/* Incharge + Date */}
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

        {/* Status + Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">

          <RequestStatusPill status={request.status} />

          {request.status === "Pending" && (
            <div className="flex gap-2">

              <button
                onClick={() =>
                  onDecision(request._id, "Approved")
                }
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  borderColor: "#2F6F52",
                  color: "#2F6F52",
                }}
              >
                <Check size={13} />
                Approve
              </button>

              <button
                onClick={() => {
  const rejectionReason = window.prompt(
    "Enter reason for rejecting this resource assignment request:"
  );

  if (rejectionReason?.trim()) {
    onDecision(
      request._id,
      "Rejected",
      rejectionReason.trim()
    );
  }
}}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border"
                style={{
                  borderColor: "#B3261E",
                  color: "#B3261E",
                }}
              >
                <X size={13} />
                Reject
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}