
import { useState, useEffect } from "react";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";



export function AddResourceForm() {
  const {
    createResourceAssignmentRequest,
    labName,
    getAvailableResources,
    getLabs,
  } = useAdminContext();

const [selectedPurchaseId, setSelectedPurchaseId] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [availableResources, setAvailableResources] = useState([]);

const purchases = [
  ...new Map(
    availableResources
      .filter((asset) => asset.purchase?._id)
      .map((asset) => [
        asset.purchase._id,
        asset.purchase,
      ])
  ).values(),
];

  // Quantity is always calculated from selected assets.
  const quantity = selectedAssets.length;

  const selectedLabData = (labName || []).find(
    (lab) => lab.LabName === selectedLab
  );

  const inputStyle = {
    borderColor: "#D8DCD4",
    color: "#1F2A24",
  };

  const fetchAvailableResources = async () => {
    setLoading(true);

    try {
      const resources = await getAvailableResources();
      setAvailableResources(
        Array.isArray(resources) ? resources : []
      );
    } catch (error) {
      setFormMessage({
        type: "error",
        text: "Unable to load available assets.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableResources();
    getLabs();
  }, []);

  // Show assets only for the selected category.
 const purchaseAssets = availableResources.filter((asset) => {
  const purchaseId =
    typeof asset.purchase === "object"
      ? asset.purchase?._id
      : asset.purchase;

  return (
    purchaseId === selectedPurchaseId &&
    asset.labName === "Not Assigned" &&
    !["Maintenance", "Faulty", "Scrapped"].includes(asset.status)
  );
});
const handlePurchaseChange = (purchaseId) => {
  setSelectedPurchaseId(purchaseId);
  setSelectedAssets([]);
  setFormMessage(null);
};

  const handleAssetToggle = (assetId) => {
    setSelectedAssets((previous) =>
      previous.includes(assetId)
        ? previous.filter((id) => id !== assetId)
        : [...previous, assetId]
    );

    setFormMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!selectedPurchaseId) {
  setFormMessage({
    type: "error",
    text: "Please select a purchased item.",
  });
  return;
}

    if (!selectedLab) {
      setFormMessage({
        type: "error",
        text: "Please select a lab.",
      });
      return;
    }

    if (!selectedLabData?.AssignFaculty) {
      setFormMessage({
        type: "error",
        text: "No Lab Incharge is assigned to this lab.",
      });
      return;
    }

    if (quantity === 0) {
      setFormMessage({
        type: "error",
        text: "Please select at least one asset.",
      });
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    try {
      const result = await createResourceAssignmentRequest({
        labName: selectedLab,
        assetIds: selectedAssets,
      });

      if (!result?.success) {
        setFormMessage({
          type: "error",
          text:
            result?.message ||
            "Failed to send the assignment request.",
        });
        return;
      }

    setSelectedPurchaseId("");
      setSelectedLab("");
      setSelectedAssets([]);

      await fetchAvailableResources();

      setFormMessage({
        type: "success",
        text: "Asset assignment request sent for approval.",
      });
    } catch (error) {
      setFormMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFormMessage(null), 5000);
    }
  };

  return (
    <div className="mb-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-5 flex flex-wrap items-start gap-3"
        style={{ borderColor: "#E3E6DF" }}
      >
{/* 1. Purchase dropdown — selects an actual purchased item */}        <div className="flex-1 min-w-45">
          <label
            className="block text-xs mb-1"
            style={{ color: "#5B6A5F" }}
          >
            Purchase
          </label>

       <select
  value={selectedPurchaseId}
  onChange={(e) => handlePurchaseChange(e.target.value)}
  className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
  style={inputStyle}
>
  <option value="">Select a purchased item</option>

  {purchases.map((purchase) => (
    <option key={purchase._id} value={purchase._id}>
      {purchase.particulars} — {purchase.supplierName}
    </option>
  ))}
</select>

        
 

 

        </div>

        {/* 2. Lab dropdown — same position and styling */}
        <div className="flex-1 min-w-40">
          <label
            className="block text-xs mb-1"
            style={{ color: "#5B6A5F" }}
          >
            Lab
          </label>

          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
            style={inputStyle}
          >
            <option value="">Select a lab</option>

            {(labName || []).map((lab) => (
              <option key={lab._id} value={lab.LabName}>
                {lab.LabName}
              </option>
            ))}
          </select>

          {selectedLab && (
            <div
              className="mt-1.5 text-xs"
              style={{ color: "#6B756E" }}
            >
              <span className="font-medium">Incharge: </span>

              <span
                style={{
                  color: selectedLabData?.AssignFaculty
                    ? "#1F2A24"
                    : "#B3261E",
                }}
              >
                {selectedLabData?.AssignFaculty?.name ||
                  "No Lab Incharge assigned"}
              </span>
            </div>
          )}
        </div>

        {/* 3. Quantity — automatic and not manually editable */}
        <div>
          <label
            className="block text-xs mb-1"
            style={{ color: "#5B6A5F" }}
          >
            Quantity
          </label>

          <input
            type="number"
            value={quantity}
            readOnly
            className="px-3 py-2 rounded-lg border text-sm w-20 bg-gray-50"
            style={inputStyle}
          />
        </div>

        {/* 4. Submit button — same position and styling */}
        <div>
          <label className="block text-xs mb-1 invisible select-none">
            Submit
          </label>

          <button
            type="submit"
            disabled={submitting || loading || quantity === 0}
            className="flex items-center justify-center gap-1.5 px-4 h-9.5 rounded-lg text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: "#1F2A24" }}
          >
            <Plus size={15} />
            {submitting ? "Sending..." : "Send for Approval"}
          </button>
        </div>
      </form>

      
{/* Available Assets — full-width list below the form */}
{selectedPurchaseId && (
  <div
    className="mt-4 bg-white rounded-xl border p-5"
    style={{ borderColor: "#E3E6DF" }}
  >
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3
          className="text-sm font-semibold"
          style={{ color: "#1F2A24" }}
        >
          Available Assets
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Select the assets you want to allocate to the selected lab.
        </p>
      </div>

      <span
        className="text-xs font-medium px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: "#E3EEE5",
          color: "#2F6F52",
        }}
      >
        {selectedAssets.length} selected
      </span>
    </div>

    {loading ? (
      <p className="text-sm text-gray-500 py-4">
        Loading assets...
      </p>
    ) : purchaseAssets.length === 0 ? (
      <p className="text-sm text-gray-500 py-4">
        No unassigned assets for this purchase.
      </p>
    ) : (
      <div
        className="border rounded-lg"
        style={{ borderColor: "#E3E6DF" }}
      >
        {purchaseAssets.map((asset) => (
          <label
            key={asset._id}
            className="flex items-center gap-4 px-4 py-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
            style={{ borderColor: "#E3E6DF" }}
          >
            <input
              type="checkbox"
              className="w-5 h-5 shrink-0 accent-green-700 cursor-pointer"
              checked={selectedAssets.includes(asset._id)}
              onChange={() => handleAssetToggle(asset._id)}
            />

            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium break-all"
                style={{ color: "#1F2A24" }}
              >
                {asset.assetId}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {asset.resourceName}
              </p>
            </div>

            <span
              className="text-xs px-2.5 py-1 rounded-full shrink-0"
              style={{
                backgroundColor: "#E3EEE5",
                color: "#2F6F52",
              }}
            >
              Available
            </span>
          </label>
        ))}
      </div>
    )}
  </div>
)}


      {/* Status message */}
      {formMessage && (
        <div
          className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-lg text-sm"
          style={{
            backgroundColor:
              formMessage.type === "success"
                ? "#E3EEE5"
                : "#FBEAEA",
            color:
              formMessage.type === "success"
                ? "#2F6F52"
                : "#B3261E",
          }}
        >
          {formMessage.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}

          {formMessage.text}
        </div>
      )}
    </div>
  );
}
