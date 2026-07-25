import { useState } from "react";
import { TopBar } from "./TopBar";
import { RequestRow } from "./RequestRow";
import { APPROVAL_REQUESTS } from "./dummyData";

export function Approvals() {
  const [requests, setRequests] = useState(APPROVAL_REQUESTS);

  const handleDecision = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div>
      <TopBar
        title="Approvals"
        subtitle={`${pendingCount} resource request${pendingCount === 1 ? "" : "s"} awaiting decision across all labs.`}
      />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {requests.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            No pending requests.
          </div>
        ) : (
          requests.map((r) => <RequestRow key={r.id} request={r} onDecision={handleDecision} />)
        )}
      </div>
    </div>
  );
}