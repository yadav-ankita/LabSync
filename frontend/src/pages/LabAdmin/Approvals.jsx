import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, ListFilter } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { RequestRow } from "./Requestrow";
import { useAdminContext } from "../../context/AdminContext";

const filters = [
  { label: "All", value: "All", icon: ListFilter },
  { label: "Approved", value: "Approved", icon: CheckCircle2 },
  { label: "Pending", value: "Pending", icon: Clock },
  { label: "Rejected", value: "Rejected", icon: XCircle },
];

export function Approvals() {
  const { getResourceAssignmentRequests } = useAdminContext();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchRequests = async () => {
    setLoading(true);

    try {
      const result = await getResourceAssignmentRequests();

      if (result.success) {
        setRequests(result.requests || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const statusCounts = {
    All: requests.length,
    Approved: requests.filter(
      (request) => request.status === "Approved"
    ).length,
    Pending: pendingCount,
    Rejected: requests.filter(
      (request) => request.status === "Rejected"
    ).length,
  };

  const filteredRequests =
    activeFilter === "All"
      ? requests
      : requests.filter(
          (request) => request.status === activeFilter
        );

  return (
    <div>
      <TopBar
        title="Approvals"
        subtitle={`${pendingCount} resource assignment ${
          pendingCount === 1 ? "request" : "requests"
        } awaiting Lab Incharge decision.`}
        rightTop="Lab Administrator"
        rightBottom="Computer Engineering"
      />

      {/* Status Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {filters.map(({ label, value, icon: Icon }) => {
          const isActive = activeFilter === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveFilter(value)}
              aria-pressed={isActive}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? "#E3ECE4" : "#FFFFFF",
                borderColor: isActive ? "#9CB6A0" : "#E3E6DF",
                color: isActive ? "#285C40" : "#526057",
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: isActive ? "#D1E2D4" : "#EEF1EC",
                  color: isActive ? "#285C40" : "#526057",
                }}
              >
                {statusCounts[value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Request List */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: "#E3E6DF" }}
      >
        {loading ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "#5B6A5F" }}
          >
            Loading resource assignment requests...
          </div>
        ) : requests.length === 0 ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "#5B6A5F" }}
          >
            No resource assignment requests.
          </div>
        ) : filteredRequests.length === 0 ? (
          <div
            className="p-8 text-center text-sm"
            style={{ color: "#5B6A5F" }}
          >
            No {activeFilter.toLowerCase()} requests found.
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestRow
              key={request._id}
              request={request}
            />
          ))
        )}
      </div>
    </div>
  );
}
