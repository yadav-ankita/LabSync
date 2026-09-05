import { useState, useEffect } from "react";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { useAdminContext } from "../../context/AdminContext";
export function AddResourceForm() {
  const {
    addLabResource,
    labName,
    getAvailableResources,
  } = useAdminContext();

  //const [resourceName, setResourceName] = useState("");
  const [selectedPurchaseId, setSelectedPurchaseId] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [resourceType, setResourceType] = useState("Hardware");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [availableResources, setAvailableResources] = useState([]);

  const selectedPurchase = (availableResources || []).find(
  (resource) => resource._id === selectedPurchaseId
);

  const inputStyle = {
    borderColor: "#D8DCD4",
    color: "#1F2A24",
  };

  useEffect(() => {
  const fetchAvailableResources = async () => {
    const resources = await getAvailableResources();
    setAvailableResources(resources);
  };

  fetchAvailableResources();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPurchaseId || !selectedLab) {
      setFormMessage({
        type: "error",
        text: "Please select a purchase and a lab.",
      });
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    // const result = await addLabResource({
    //   labName: selectedLab,
    //   resourceName: resourceName.trim(),
    //   resourceType,
    //   quantity: Number(quantity) || 1,
    // });
    const result = await addLabResource({
      purchaseId: selectedPurchaseId,
      labName: selectedLab,
      resourceType,
      quantity: Number(quantity) || 1,
    });

    setSubmitting(false);

    if (result.success) {

      const added = result.resources || [];
      const updatedResources = await getAvailableResources();
setAvailableResources(updatedResources);
      setFormMessage({
        type: "success",
        text:
          added.length > 1
            ? `Added ${added.length} units — IDs: ${added
              .map((r) => r.assetId)
              .join(", ")}`
            : `Added — Asset ID: ${added[0]?.assetId}`,
      });

      setSelectedPurchaseId("");
      setSelectedLab("");
      setQuantity(1);
    } else {
      setFormMessage({
        type: "error",
        text: result.message,
      });
    }

    setTimeout(() => setFormMessage(null), 5000);
  };
  return (
    <div className="mb-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-5 flex flex-wrap items-end gap-3"
        style={{ borderColor: "#E3E6DF" }}
      >
        {/* Resource Name */}
        {/* 
        <div className="flex-1 min-w-45">
          <label
            className="block text-xs mb-1"
            style={{ color: "#5B6A5F" }}
          >
            Resource name
          </label>

          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="e.g. Revolving Chair"
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
            style={inputStyle}
          />
        </div>
        */}
        <div className="flex-1 min-w-45">
  <label
    className="block text-xs mb-1"
    style={{ color: "#5B6A5F" }}
  >
    Purchase
  </label>

  <select
    value={selectedPurchaseId}
    onChange={(e) => setSelectedPurchaseId(e.target.value)}
    className="w-full px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
    style={inputStyle}
  >
    <option value="">Select a purchased resource</option>

          {(availableResources || []).map((resource) => (
  <option key={resource._id} value={resource._id}>
    {resource.particulars} — Remaining: {resource.remainingQuantity}
  </option>
))}
  </select>
</div>
        {/* Lab Select */}
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
        </div>

        {/* Resource Type */}
        <div>
          <label
            className="block text-xs mb-1"
            style={{ color: "#5B6A5F" }}
          >
            Type
          </label>

          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm bg-white focus:outline-none"
            style={inputStyle}
          >
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label
            className="block text-xs mb-1"
            style={{ color: "#5B6A5F" }}
          >
            Quantity
          </label>

          <input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm focus:outline-none w-20"
            style={inputStyle}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "#1F2A24" }}
        >
          <Plus size={15} />
          {submitting ? "Adding..." : "Add resource"}
        </button>
      </form>

      {/* Message */}
      {formMessage && (
        <div
          className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-lg text-sm"
          style={{
            backgroundColor:
              formMessage.type === "success" ? "#E3EEE5" : "#FBEAEA",
            color:
              formMessage.type === "success" ? "#2F6F52" : "#B3261E",
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