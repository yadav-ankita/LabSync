import { useState } from "react";
import { TopBar } from '../../components/TopBar';
import { RequestRow } from "./Requestrow";
import { RESOURCE_REQUESTS } from "./dummyData";
import { useAppContext } from "../../context/AppContext";

export function ResourceRequests() {
  const {currentUser}=useAppContext();
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
        rightTop={`${currentUser?.lab_name || currentUser?.name || "No assigned lab"}`} 
         rightBottom=" Assigned laboratory"
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