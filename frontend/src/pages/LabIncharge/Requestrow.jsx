import { Clock, User, ArrowRight,Trash2 } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";
import { RequestStatusPill } from "../../components/RequestStatusPill";
import { useAppContext } from "../../context/AppContext";
import { useState } from "react";

export function RequestRow({ request, onDecision }) {
  const { currentUser } = useAppContext();

  const [responding, setResponding] = useState(false);

  const date = new Date(request.createdAt);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const assets = request.assets || [];

  const fromLab =
    request.fromLab?.LabName || "Unknown Lab";

  const toLab =
    request.toLab?.LabName || "Unknown Lab";

  const requester =
    request.requestedBy?.name || "Lab Incharge";

  const currentUserId = currentUser?._id?.toString();

  const isRequester =
    currentUserId === request.requestedBy?._id?.toString();

  const isOtherIncharge =
    currentUserId === request.otherIncharge?._id?.toString();

  const canRespond =
    (isOtherIncharge &&
      request.otherInchargeApproval?.status === "Pending") ||
    (isRequester &&
      request.otherInchargeApproval?.status === "Approved" &&
      request.requesterApproval?.status === "Pending");
  const approvalMessage =
  request.status === "Pending" && isRequester
    ? request.otherInchargeApproval?.status === "Approved" &&
      request.requesterApproval?.status === "Pending"
      ? `${request.otherIncharge?.name || "Source Lab Incharge"} approved, waiting for your approval`
      : null
    : request.status === "In Progress" &&
      (isRequester || isOtherIncharge)
    ? "You approved the request. Waiting for HOD approval"
    : null;

  const handleDecision = async (status, rejectionReason= "") => {
    try {
      setResponding(true);

      const response = await fetch(
        `http://localhost:4000/api/v1/faculty/transferRequests/${request._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user") || "{}").token
            }`,
          },
          body: JSON.stringify({
            status,
            rejectionReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update transfer request"
        );
      }

      if (onDecision) {
  onDecision();
}

    } catch (error) {
      console.error(
        "Error responding to transfer request:",
        error
      );

      alert(error.message);
    } finally {
      setResponding(false);
    }
  };
  const handleDelete = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this transfer request?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setResponding(true);

    const response = await fetch(
      `http://localhost:4000/api/v1/faculty/transferRequests/${request._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user") || "{}").token
          }`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete transfer request"
      );
    }

    if (onDecision) {
      onDecision();
    }
  } catch (error) {
    console.error("Error deleting transfer request:", error);
    alert(error.message);
  } finally {
    setResponding(false);
  }
};

  return (
    <div
      className="px-6 py-5 border-t first:border-t-0"
      style={{ borderColor: "#E3E6DF" }}
    >
      <div className="flex items-start justify-between gap-6">

        {/* Transfer Details */}
        <div className="min-w-0 flex-1">

          {/* Resources */}
          <div className="space-y-2">

            {assets.length === 0 ? (
              <span
                className="text-sm"
                style={{ color: "#8A968D" }}
              >
                No resources found
              </span>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset._id}
                  className="flex items-center gap-3"
                >
                  <ResourceTag id={asset.assetId} />

                  <span
                    className="text-base font-medium"
                    style={{ color: "#1F2A24" }}
                  >
                    {asset.resourceName}
                  </span>
                </div>
              ))
            )}

          </div>

          {/* Lab Transfer Direction */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">

            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "#EEF1EC",
                color: "#3E4A41",
              }}
            >
              {fromLab}
            </span>

            <ArrowRight
              size={15}
              style={{ color: "#5B6A5F" }}
            />

            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ color: "#3E4A41" }}
            >
              {toLab}
            </span>

          </div>

          {/* Reason */}
          <p
            className="text-sm mt-3"
            style={{ color: "#1F2A24" }}
          >
            <span className="font-medium">Reason:</span>{" "}
            {request.reason}
          </p>

          {/* Request Information */}
          <div
            className="flex items-center gap-2 text-xs mt-3 flex-wrap"
            style={{ color: "#8A968D" }}
          >
            <User size={13} />

            <span>
              Requested by: {requester}
            </span>

            <span>·</span>

            <Clock size={13} />

            <span>
              Requested on {formattedDate}
            </span>
          </div>

        </div>

        {/* Status + Actions */}
        <div className="flex flex-col items-end gap-3 shrink-0">

          {request.status === "Transferred" ? (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
    style={{
      backgroundColor: "#E3EEE5",
      color: "#2F6F52",
    }}
  >
    ✓ Transferred
  </span>
) : (
  <RequestStatusPill status={request.status} />
  
)}
{approvalMessage && (
  <p
    className="text-xs text-right max-w-xs"
    style={{ color: "#5B6A5F" }}
  >
    {approvalMessage}
  </p>
)}
          {canRespond && (
            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={responding}
                onClick={() => handleDecision("Approved")}
                className="px-4 py-2 rounded-lg text-sm text-white disabled:opacity-50"
                style={{
                  backgroundColor: "#2F6F52",
                }}
              >
                {responding ? "..." : "Approve"}
              </button>

              <button
                type="button"
                disabled={responding}
                onClick={() => {
  const rejectionReason = window.prompt(
    "Enter reason for rejecting this transfer request:"
  );

  if (rejectionReason?.trim()) {
    handleDecision("Rejected", rejectionReason.trim());
  }
}}
                className="px-4 py-2 rounded-lg text-sm border disabled:opacity-50"
                style={{
                  borderColor: "#B3261E",
                  color: "#B3261E",
                }}
              >
                Reject
              </button>

            </div>
          )}
  <button
  type="button"
  disabled={responding}
  onClick={handleDelete}
  className="p-2 rounded-lg border disabled:opacity-50"
  style={{
    borderColor: "#D6DBD5",
    color: "#8A968D",
  }}
  title="Delete transfer request"
>
  <Trash2 size={16} />
</button>
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