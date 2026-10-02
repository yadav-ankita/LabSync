
import { TopBar } from '../../components/TopBar';
import { RequestRow } from "./Requestrow";
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { CreateTransferRequest } from "./CreateTransferRequest";

export function ResourceRequests() {
  const {currentUser}=useAppContext();
  const [requests, setRequests] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  useEffect(() => {
  const fetchTransferRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/faculty/transferRequests",
        {
          headers: {
            Authorization: `Bearer ${
  JSON.parse(localStorage.getItem("user") || "{}").token
}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transfer requests");
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error("Error fetching transfer requests:", error);
    }
  };

  fetchTransferRequests();
}, []);
const handleDecision = async () => {
  try {
    const response = await fetch(
      "http://localhost:4000/api/v1/faculty/transferRequests",
      {
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
        data.message || "Failed to refresh transfer requests"
      );
    }

    setRequests(data.requests || []);
  } catch (error) {
    console.error(
      "Error refreshing transfer requests:",
      error
    );
  }
};

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const filteredRequests = requests.filter((request) => {
  if (activeFilter === "All") return true;
  if (activeFilter === "Completed") {
    return request.status === "Transferred";
  }
  return request.status === activeFilter;
});

  return (
    <div>
      <TopBar
        title="Transfer Requests"
        subtitle={`${pendingCount} transfer request${pendingCount === 1 ? "" : "s"} awaiting your decision.`}
        rightTop={`${currentUser?.lab_name || currentUser?.name || "No assigned lab"}`} 
         rightBottom=" Assigned laboratory"
      />
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
  <div className="flex items-center gap-2 flex-wrap">
    {["All", "Pending", "In Progress", "Completed", "Rejected"].map(
      (filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => setActiveFilter(filter)}
          className="px-4 py-2 rounded-lg text-sm font-medium border"
          style={{
            backgroundColor:
              activeFilter === filter ? "#1F2A24" : "#FFFFFF",
            color:
              activeFilter === filter ? "#FFFFFF" : "#5B6A5F",
            borderColor:
              activeFilter === filter ? "#1F2A24" : "#D6DBD5",
          }}
        >
          {filter}
        </button>
      )
    )}
  </div>

  {!showCreateForm && (
    <button
      type="button"
      onClick={() => setShowCreateForm(true)}
      className="px-5 py-2.5 rounded-lg text-white"
      style={{ backgroundColor: "#1F2A24" }}
    >
      + Create Transfer Request
    </button>
  )}
</div>
{showCreateForm && (
  <div className="mb-6">
    <CreateTransferRequest
      currentUser={currentUser}
      onCreated={(newRequest) => {
        setRequests((prev) => [newRequest, ...prev]);
        setShowCreateForm(false);
      }}
    />

    <button
      type="button"
      onClick={() => setShowCreateForm(false)}
      className="mt-3 px-4 py-2 rounded-lg border text-sm"
      style={{
        borderColor: "#D6DBD5",
        color: "#5B6A5F",
      }}
    >
      Cancel
    </button>
  </div>
)}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            No transfer requests yet.
          </div>
        ) : (
          filteredRequests.map((r) => <RequestRow key={r._id} request={r} onDecision={handleDecision} />)
        )}
      </div>
    </div>
  );
}