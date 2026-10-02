import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function CreateTransferRequest({ onCreated, currentUser }) {
  const [labs, setLabs] = useState([]);
  const [resources, setResources] = useState([]);

  const [fromLabId, setFromLabId] = useState("");
  const [selectedAssetIds, setSelectedAssetIds] = useState([]);
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch labs and resources
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/v1/faculty/transferOptions",
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
            data.message || "Failed to load transfer options"
          );
        }

        setLabs(data.labs || []);
        setResources(data.resources || []);
      } catch (error) {
        console.error("Error loading transfer options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  // Logged-in Lab Incharge's lab = DESTINATION
  const myLab = labs.find(
    (lab) => lab.LabName === currentUser?.lab_name
  );

  const toLabId = myLab?._id || "";

  // Resources belonging to selected SOURCE lab
  const selectedSourceLab = labs.find(
    (lab) => lab._id === fromLabId
  );

  const availableResources = resources.filter(
    (resource) =>
      selectedSourceLab &&
      resource.labName === selectedSourceLab.LabName
  );

  // Resources already selected
  const selectedResources = resources.filter((resource) =>
    selectedAssetIds.includes(resource._id)
  );

  // Source lab changed
  const handleSourceLabChange = (e) => {
    setFromLabId(e.target.value);

    // Clear previously selected resources because
    // they may belong to the previous source lab
    setSelectedAssetIds([]);
  };

  // Add resource to request
  const handleAddResource = (e) => {
    const assetId = e.target.value;

    if (!assetId) {
      return;
    }

    if (!selectedAssetIds.includes(assetId)) {
      setSelectedAssetIds((prev) => [...prev, assetId]);
    }

    // Reset dropdown
    e.target.value = "";
  };

  // Remove resource from request
  const handleRemoveResource = (assetId) => {
    setSelectedAssetIds((prev) =>
      prev.filter((id) => id !== assetId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fromLabId ||
      selectedAssetIds.length === 0 ||
      !reason.trim()
    ) {
      alert(
        "Please select a source lab, at least one resource and provide a reason."
      );
      return;
    }

    if (fromLabId === toLabId) {
      alert("Source lab must be different from your lab.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:4000/api/v1/faculty/transferRequests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user") || "{}").token
            }`,
          },
          body: JSON.stringify({
            fromLabId,
            assetIds: selectedAssetIds,
            reason: reason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create transfer request"
        );
      }

      alert("Transfer request created successfully.");

      setFromLabId("");
      setSelectedAssetIds([]);
      setReason("");

      if (onCreated) {
        onCreated(data.request);
      }
    } catch (error) {
      console.error("Error creating transfer request:", error);
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="p-6 text-sm"
        style={{ color: "#5B6A5F" }}
      >
        Loading transfer options...
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl border p-6"
      style={{ borderColor: "#E3E6DF" }}
    >
      <h2
        className="text-xl font-semibold"
        style={{ color: "#1F2A24" }}
      >
        Create Transfer Request
      </h2>

      <p
        className="text-sm mt-1 mb-6"
        style={{ color: "#8A968D" }}
      >
        Request one or more laboratory resources from another lab.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Source Lab */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Source Lab
          </label>

          <select
            value={fromLabId}
            onChange={handleSourceLabChange}
            className="w-full border rounded-lg px-3 py-2.5"
          >
            <option value="">
              Select source lab
            </option>

            {labs
              .filter((lab) => lab._id !== toLabId)
              .map((lab) => (
                <option key={lab._id} value={lab._id}>
                  {lab.LabName}
                </option>
              ))}
          </select>
        </div>

        {/* Destination Lab */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Destination Lab
          </label>

          <div
            className="w-full border rounded-lg px-3 py-2.5 bg-gray-50"
            style={{ borderColor: "#D6DBD5" }}
          >
            {currentUser?.lab_name ||
              "Assigned lab not found"}
          </div>
        </div>

        {/* Resource Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Resources
          </label>

          <select
            onChange={handleAddResource}
            disabled={!fromLabId}
            className="w-full border rounded-lg px-3 py-2.5"
            defaultValue=""
          >
            <option value="">
              {fromLabId
                ? "Select resource to add"
                : "Select source lab first"}
            </option>

            {availableResources
              .filter(
                (resource) =>
                  !selectedAssetIds.includes(resource._id)
              )
              .map((resource) => (
                <option
                  key={resource._id}
                  value={resource._id}
                >
                  {resource.resourceName} — {resource.assetId}
                </option>
              ))}
          </select>
        </div>

        {/* Selected Resources */}
        {selectedResources.length > 0 && (
          <div>
            <p
              className="text-sm font-medium mb-2"
              style={{ color: "#1F2A24" }}
            >
              Selected Resources ({selectedResources.length})
            </p>

            <div className="space-y-2">
              {selectedResources.map((resource) => (
                <div
                  key={resource._id}
                  className="flex items-center justify-between border rounded-lg px-3 py-2.5"
                  style={{ borderColor: "#D6DBD5" }}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#1F2A24" }}
                    >
                      {resource.resourceName}
                    </p>

                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "#8A968D" }}
                    >
                      {resource.assetId}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveResource(resource._id)
                    }
                    className="p-1.5 rounded-md hover:bg-gray-100"
                    title="Remove resource"
                  >
                    <X
                      size={16}
                      style={{ color: "#8A968D" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for transfer"
            rows={4}
            className="w-full border rounded-lg px-3 py-2.5 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={
            submitting ||
            selectedAssetIds.length === 0
          }
          className="px-5 py-2.5 rounded-lg text-white disabled:opacity-50"
          style={{ backgroundColor: "#1F2A24" }}
        >
          {submitting
            ? "Submitting..."
            : "Create Transfer Request"}
        </button>

      </form>
    </div>
  );
}