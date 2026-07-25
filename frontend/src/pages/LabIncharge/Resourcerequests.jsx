import { useState } from "react";
import { TopBar } from "./TopBar";
import { RequestRow } from "./RequestRow";
import { RESOURCE_REQUESTS } from "./dummyData";

export function ResourceRequests() {
  const [requests, setRequests] = useState(RESOURCE_REQUESTS);

  const handleDecision = (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <div>
      <TopBar
        title="Resource Requests"
        subtitle={`${pendingCount} request${pendingCount === 1 ? "" : "s"} awaiting your decision.`}
      />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {requests.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            No resource requests yet.
          </div>
        ) : (
          requests.map((r) => <RequestRow key={r.id} request={r} onDecision={handleDecision} />)
        )}
      </div>
    </div>
  );
}