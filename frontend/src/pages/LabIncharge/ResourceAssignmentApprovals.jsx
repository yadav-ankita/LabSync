import { useEffect, useState } from "react";
import { TopBar } from "../../components/TopBar";
import { useFacultyContext } from "../../context/FacultyContext";
import { RequestRow } from "./Requestrow";

export function ResourceAssignmentApprovals() {
const {
  getResourceAssignmentRequests,
  respondToResourceAssignmentRequest,
} = useFacultyContext();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);

    const result = await getResourceAssignmentRequests();

    if (result.success) {
      setRequests(result.requests || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id, status) => {
  const result = await respondToResourceAssignmentRequest(
    id,
    status
  );

  if (result.success) {
    alert(
      status === "Approved"
        ? "Resource successfully assigned to the lab."
        : "Resource assignment request rejected."
    );

    await fetchRequests();
  } else {
    alert(result.message);
  }
};

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  return (
    <div>
      <TopBar
        title="Resource Assignment Approvals"
        subtitle={`${pendingCount} resource assignment ${
          pendingCount === 1 ? "request" : "requests"
        } awaiting your decision.`}
        rightTop="Lab Incharge"
        rightBottom="Computer Engineering"
      />

      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: "#E3E6DF" }}
      >
        {loading ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "#5B6A5F" }}
          >
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "#5B6A5F" }}
          >
            No resource assignment requests.
          </div>
        ) : (
          requests.map((request) => (
            <RequestRow
              key={request._id}
              request={request}
              onDecision={handleDecision}
            />
          ))
        )}
      </div>
    </div>
  );
}