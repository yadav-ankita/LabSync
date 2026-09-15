import React, { useEffect, useState } from "react";
import {
  Wrench,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  User,
  Package,
} from "lucide-react";

import axios from "../../axios";
import { TopBar } from "../../components/TopBar";
import { Sidebar } from "./Sidebar";

export default function HodDashbaord() {
  const [activeView, setActiveView] = useState("home");

  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPendingMaintenance = async () => {
    try {
      const { data } = await axios.get("/hod/maintenance");

      console.log("HOD MAINTENANCE:", data);

      setMaintenance(data.maintenance || []);
    } catch (error) {
      console.error(
        "Error fetching HOD maintenance:",
        error.response?.data || error
      );

      setMaintenance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingMaintenance();
  }, []);

const handleApprove = async (id) => {
  try {
    const { data } = await axios.patch("/hod/maintenance", {
      maintenanceId: id,
      approvalStatus: "Approved",
    });

    console.log("Approved:", data);

    // Remove the approved request from pending list
    setMaintenance((prev) =>
      prev.filter((item) => item._id !== id)
    );
  } catch (error) {
    console.error(
      "Error approving maintenance:",
      error.response?.data || error
    );
  }
};

const handleReject = async (id) => {
  const hodRemarks = window.prompt(
    "Please enter the reason for rejecting this maintenance request:"
  );

  if (hodRemarks === null) {
    return; // HOD clicked Cancel
  }

  if (!hodRemarks.trim()) {
    alert("Please enter a rejection reason.");
    return;
  }

  try {
    const { data } = await axios.patch("/hod/maintenance", {
      maintenanceId: id,
      approvalStatus: "Rejected",
      hodRemarks: hodRemarks.trim(),
    });

    console.log("Rejected:", data);

    setMaintenance((prev) =>
      prev.filter((item) => item._id !== id)
    );
  } catch (error) {
    console.error(
      "Error rejecting maintenance:",
      error.response?.data || error
    );
  }
};

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: "#F2F4F1",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-w-0 p-7">

        {/* ================= OVERVIEW ================= */}
        {activeView === "home" && (
          <>
            <TopBar
              title="HOD Dashboard"
              subtitle="Review and manage laboratory maintenance approvals."
              rightTop="Maintenance Approval"
              rightBottom="HOD Portal"
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">

              {/* Pending Approval */}
              <div
                className="bg-white rounded-xl border p-5"
                style={{
                  borderColor: "#E3E6DF",
                }}
              >
                <div className="flex items-center gap-4">

                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: "#FFF4E5",
                    }}
                  >
                    <Clock
                      size={21}
                      color="#D89A4E"
                    />
                  </div>

                  <div>
                    <p
                      className="text-sm"
                      style={{
                        color: "#7B867E",
                      }}
                    >
                      Pending Approval
                    </p>

                    <p
                      className="text-2xl font-semibold mt-1"
                      style={{
                        color: "#1F2A24",
                      }}
                    >
                      {maintenance.length}
                    </p>
                  </div>

                </div>
              </div>

              {/* Status */}
              <div
                className="bg-white rounded-xl border p-5"
                style={{
                  borderColor: "#E3E6DF",
                }}
              >
                <div className="flex items-center gap-4">

                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor:
                        maintenance.length > 0
                          ? "#FFF4E5"
                          : "#E8F3EA",
                    }}
                  >
                    <CheckCircle
                      size={21}
                      color={
                        maintenance.length > 0
                          ? "#D89A4E"
                          : "#35663D"
                      }
                    />
                  </div>

                  <div>
                    <p
                      className="text-sm"
                      style={{
                        color: "#7B867E",
                      }}
                    >
                      Approval Status
                    </p>

                    <p
                      className="text-lg font-semibold mt-1"
                      style={{
                        color: "#1F2A24",
                      }}
                    >
                      {maintenance.length > 0
                        ? "Requires Review"
                        : "All Clear"}
                    </p>
                  </div>

                </div>
              </div>

            </div>

            {/* Quick Action */}
            <div className="mb-7">

              <h2
                className="text-sm uppercase tracking-wide mb-3"
                style={{
                  color: "#5B6A5F",
                }}
              >
                Quick actions
              </h2>

              <button
                onClick={() => setActiveView("maintenance")}
                className="text-left p-5 rounded-xl border bg-white hover:shadow-sm transition-shadow group w-full"
                style={{
                  borderColor: "#E3E6DF",
                }}
              >
                <div className="flex items-start justify-between">

                  <div>
                    <Wrench
                      size={20}
                      color="#D89A4E"
                    />

                    <p
                      className="mt-3 text-sm font-medium"
                      style={{
                        color: "#1F2A24",
                      }}
                    >
                      Review Maintenance Requests
                    </p>

                    <p
                      className="text-xs mt-1"
                      style={{
                        color: "#5B6A5F",
                      }}
                    >
                      Review maintenance requests waiting for HOD approval.
                    </p>
                  </div>

                  <span
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: "#FFF4E5",
                      color: "#A66A20",
                    }}
                  >
                    {maintenance.length} Pending
                  </span>

                </div>
              </button>

            </div>

            {/* Recent Requests */}
            <div
              className="bg-white rounded-xl border overflow-hidden"
              style={{
                borderColor: "#E3E6DF",
              }}
            >
              <div
                className="px-6 py-5 border-b"
                style={{
                  borderColor: "#E3E6DF",
                }}
              >
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: "#1F2A24",
                  }}
                >
                  Maintenance Approval Requests
                </h2>

                <p
                  className="text-sm mt-1"
                  style={{
                    color: "#7B867E",
                  }}
                >
                  Requests waiting for your approval.
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <p
                    className="text-sm"
                    style={{
                      color: "#7B867E",
                    }}
                  >
                    Loading maintenance requests...
                  </p>
                </div>
              ) : maintenance.length === 0 ? (
                <div className="p-10 text-center">

                  <div
                    className="w-11 h-11 rounded-full mx-auto flex items-center justify-center mb-3"
                    style={{
                      backgroundColor: "#E8F3EA",
                    }}
                  >
                    <CheckCircle
                      size={21}
                      color="#35663D"
                    />
                  </div>

                  <p
                    className="text-sm font-medium"
                    style={{
                      color: "#1F2A24",
                    }}
                  >
                    No pending requests
                  </p>

                  <p
                    className="text-xs mt-1"
                    style={{
                      color: "#8A968D",
                    }}
                  >
                    There are no maintenance requests waiting for approval.
                  </p>

                </div>
              ) : (
                maintenance.slice(0, 4).map((item, index) => {
                  const complaint = item.complaint;

                  return (
                    <div
                      key={item._id}
                      className="px-6 py-4"
                      style={{
                        borderTop:
                          index === 0
                            ? "none"
                            : "1px solid #E3E6DF",
                      }}
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3 min-w-0">

                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: "#FFF4E5",
                            }}
                          >
                            <Package
                              size={16}
                              color="#D89A4E"
                            />
                          </div>

                          <div className="min-w-0">

                            <p
                              className="text-sm font-medium truncate"
                              style={{
                                color: "#1F2A24",
                              }}
                            >
                              {complaint?.resourceId || "Resource"}
                            </p>

                            <p
                              className="text-xs mt-1 truncate"
                              style={{
                                color: "#8A968D",
                              }}
                            >
                              {complaint?.issueType} ·{" "}
                              {complaint?.labName}
                            </p>

                          </div>

                        </div>

                        <span
                          className="text-xs px-2.5 py-1 rounded-full shrink-0"
                          style={{
                            backgroundColor: "#FFF4E5",
                            color: "#A66A20",
                          }}
                        >
                          Pending
                        </span>

                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ================= MAINTENANCE ================= */}
        {activeView === "maintenance" && (
          <>
            <TopBar
              title="Maintenance Approval"
              subtitle="Review maintenance requests forwarded for your approval."
              rightTop={`${maintenance.length} Pending`}
              rightBottom="HOD Portal"
            />

            <div
              className="bg-white rounded-xl border overflow-hidden"
              style={{
                borderColor: "#E3E6DF",
              }}
            >

              {/* Header */}
              <div
                className="px-6 py-5 border-b"
                style={{
                  borderColor: "#E3E6DF",
                }}
              >
                <div className="flex items-center gap-3">

                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: "#FFF4E5",
                    }}
                  >
                    <Wrench
                      size={18}
                      color="#D89A4E"
                    />
                  </div>

                  <div>
                    <h2
                      className="text-lg font-semibold"
                      style={{
                        color: "#1F2A24",
                      }}
                    >
                      Maintenance Approval Requests
                    </h2>

                    <p
                      className="text-sm mt-1"
                      style={{
                        color: "#7B867E",
                      }}
                    >
                      Review requests before they are forwarded for maintenance.
                    </p>
                  </div>

                </div>
              </div>

              {/* Loading */}
              {loading ? (
                <div className="p-10 text-center">
                  <p
                    className="text-sm"
                    style={{
                      color: "#7B867E",
                    }}
                  >
                    Loading maintenance requests...
                  </p>
                </div>

              ) : maintenance.length === 0 ? (

                /* Empty */
                <div className="p-12 text-center">

                  <div
                    className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
                    style={{
                      backgroundColor: "#E8F3EA",
                    }}
                  >
                    <CheckCircle
                      size={22}
                      color="#35663D"
                    />
                  </div>

                  <p
                    className="text-sm font-medium"
                    style={{
                      color: "#1F2A24",
                    }}
                  >
                    No pending maintenance requests
                  </p>

                  <p
                    className="text-xs mt-1"
                    style={{
                      color: "#8A968D",
                    }}
                  >
                    All maintenance requests have been reviewed.
                  </p>

                </div>

              ) : (

                /* Requests */
                maintenance.map((item, index) => {
                  const complaint = item.complaint;

                  return (
                    <div
                      key={item._id}
                      className="px-6 py-5"
                      style={{
                        borderTop:
                          index === 0
                            ? "none"
                            : "1px solid #E3E6DF",
                      }}
                    >

                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                        {/* Request Information */}
                        <div className="min-w-0 flex-1">

                          {/* Resource / Type / Status */}
                          <div className="flex items-center gap-3 flex-wrap">

                            <div className="flex items-center gap-2">

                              <Package
                                size={16}
                                color="#D89A4E"
                              />

                              <span
                                className="text-sm font-semibold"
                                style={{
                                  color: "#1F2A24",
                                }}
                              >
                                {complaint?.resourceId ||
                                  "Resource"}
                              </span>

                            </div>

                            <span
                              className="text-xs px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: "#F2F4F1",
                                color: "#5B6A5F",
                              }}
                            >
                              {complaint?.issueType ||
                                "Issue"}
                            </span>

                            <span
                              className="text-xs px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: "#FFF4E5",
                                color: "#A66A20",
                              }}
                            >
                              Pending Approval
                            </span>

                          </div>

                          {/* Description */}
                          <p
                            className="text-sm mt-3 leading-6"
                            style={{
                              color: "#1F2A24",
                            }}
                          >
                            {complaint?.description}
                          </p>

                          {/* Details */}
                          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">

                            <div className="flex items-center gap-1.5">

                              <Building2
                                size={14}
                                color="#8A968D"
                              />

                              <span
                                className="text-xs"
                                style={{
                                  color: "#7B867E",
                                }}
                              >
                                Lab:{" "}
                                {complaint?.labName ||
                                  "N/A"}
                              </span>

                            </div>

                            <div className="flex items-center gap-1.5">

                              <User
                                size={14}
                                color="#8A968D"
                              />

                              <span
                                className="text-xs"
                                style={{
                                  color: "#7B867E",
                                }}
                              >
                                Raised by:{" "}
                                {complaint?.faculty?.name ||
                                  "Faculty"}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2 shrink-0">

                          <button
                            onClick={() =>
                              handleApprove(item._id)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                              backgroundColor: "#E8F3EA",
                              color: "#35663D",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "#DCEBDD";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "#E8F3EA";
                            }}
                          >
                            <CheckCircle size={15} />
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              handleReject(item._id)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                              backgroundColor: "#FCECEC",
                              color: "#9A3D3D",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "#F8DFDF";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "#FCECEC";
                            }}
                          >
                            <XCircle size={15} />
                            Reject
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })
              )}

            </div>
          </>
        )}

        {/* ================= PROFILE ================= */}
        {activeView === "profile" && (
          <>
            <TopBar
              title="Edit Profile"
              subtitle="Manage your HOD profile information."
              rightTop="HOD Portal"
              rightBottom="LabSync"
            />

            <div
              className="bg-white rounded-xl border p-6"
              style={{
                borderColor: "#E3E6DF",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: "#5B6A5F",
                }}
              >
                Profile management will be added here.
              </p>
            </div>
          </>
        )}

      </main>
    </div>
  );
}