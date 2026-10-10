import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { useAdminContext } from "../../context/AdminContext";

export const AddFund = () => {
  const { fundTypes, getFundTypes, addFundType } = useAdminContext();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getFundTypes().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const result = await addFundType({ code });
    setSubmitting(false);
    if (result.success) {
      setCode("");
      setMessage({ type: "success", text: result.message });
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div>
      <TopBar
        title="Fund Types"
        subtitle="Manage the codes available in purchase records and asset IDs."
        rightTop="Lab Administrator"
        rightBottom="Computer Engineering"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-5 mb-4 flex flex-wrap items-end gap-3"
        style={{ borderColor: "#E3E6DF" }}
      >
        <div className="flex-1 min-w-45">
          <label htmlFor="fund-code" className="block text-xs mb-1" style={{ color: "#5B6A5F" }}>
            Fund code
          </label>
          <input
            id="fund-code"
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            placeholder="e.g. RUSA"
            minLength={2}
            maxLength={12}
            pattern="[A-Za-z0-9]{2,12}"
            required
            className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
            style={{ borderColor: "#D8DCD4", color: "#1F2A24" }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || code.length < 2}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: "#1F2A24" }}
        >
          <Plus size={15} /> {submitting ? "Adding..." : "Add fund type"}
        </button>
      </form>

      {message && (
        <div
          role="status"
          className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg text-sm"
          style={{
            backgroundColor: message.type === "success" ? "#E3EEE5" : "#FBEAEA",
            color: message.type === "success" ? "#2F6F52" : "#B3261E",
          }}
        >
          {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <section className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        <h2 className="px-5 py-3 text-sm font-medium" style={{ color: "#1F2A24", borderBottom: "1px solid #E3E6DF" }}>
          Available fund types
        </h2>
        {loading ? (
          <p className="p-5 text-sm" style={{ color: "#5B6A5F" }}>Loading fund types...</p>
        ) : fundTypes.length === 0 ? (
          <p className="p-5 text-sm" style={{ color: "#5B6A5F" }}>No fund types available.</p>
        ) : (
          <ul className="divide-y" style={{ borderColor: "#E3E6DF" }}>
            {fundTypes.map((fundType) => (
              <li key={fundType._id || fundType.code} className="px-5 py-3 text-sm" style={{ color: "#1F2A24" }}>
                {fundType.code}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
