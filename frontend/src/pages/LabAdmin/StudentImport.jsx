import { useEffect, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import axios from "../../axios";
import { TopBar } from "../../components/TopBar";

const formatStatus = (status) => {
  switch (status) {
    case "valid":
      return "Ready";
    case "duplicate":
      return "Duplicate / skipped";
    case "invalid":
      return "Invalid";
    case "created":
      return "Created; email sent";
    case "email-failed":
      return "Created; email failed";
    case "failed":
      return "Account creation failed";
    default:
      return status;
  }
};

export function StudentImport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [importHistory, setImportHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [expandedImports, setExpandedImports] = useState({});
  const [deletingImport, setDeletingImport] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    axios.get("/admin/students/import/history")
      .then(({ data }) => {
        if (active) setImportHistory(data.imports || []);
      })
      .catch((requestError) => {
        if (active) {
          setHistoryError(
            requestError.response?.data?.message || "Could not load previous imports."
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const uploadFile = async (endpoint) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post(endpoint, formData);
    return data;
  };

  const handlePreview = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Choose an .xlsx or .csv file first.");
      return;
    }

    setProcessing(true);
    setError("");
    setResult(null);
    try {
      setPreview(await uploadFile("/admin/students/import/preview"));
    } catch (requestError) {
      setPreview(null);
      setError(requestError.response?.data?.message || "Could not validate this file.");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!file || !preview?.summary?.valid) return;

    setProcessing(true);
    setError("");
    try {
      const imported = await uploadFile("/admin/students/import/confirm");
      setResult(imported);
      setImportHistory((previous) => [
        imported,
        ...previous.filter((entry) => entry.importId !== imported.importId && entry._id !== imported.importId),
      ]);
      setPreview(null);
      setFile(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not import students.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteImport = async (importId) => {
    if (!window.confirm("Delete this import history report? Student accounts will not be deleted.")) {
      return;
    }

    setDeletingImport(importId);
    setHistoryError("");
    try {
      await axios.delete(`/admin/students/import/history/${importId}`);
      setImportHistory((previous) =>
        previous.filter((entry) => (entry.importId || entry._id) !== importId)
      );
      setExpandedImports((previous) => {
        const next = { ...previous };
        delete next[importId];
        return next;
      });
      if (result?.importId === importId) setResult(null);
    } catch (requestError) {
      setHistoryError(
        requestError.response?.data?.message || "Could not delete the import history report."
      );
    } finally {
      setDeletingImport("");
    }
  };

  const rows = result?.rows || preview?.rows || [];

  return (
    <div>
      <TopBar
        title="Bulk Import Students"
        subtitle="Upload student email and phone numbers, review the validation report, then confirm."
        rightTop="Lab Administrator"
        rightBottom="Student Accounts"
      />

      <section className="rounded-xl border bg-white p-5" style={{ borderColor: "#E3E6DF" }}>
        <form onSubmit={handlePreview} className="flex flex-wrap items-start gap-4">
          <div className="min-w-60 flex-1">
            <label htmlFor="student-import-file" className="mb-1 block text-sm font-medium text-neutral-800">
              Student list (.xlsx or .csv)
            </label>
            <input
              id="student-import-file"
              type="file"
              accept=".xlsx,.csv"
              onChange={(event) => {
                setFile(event.target.files?.[0] || null);
                setPreview(null);
                setResult(null);
                setError("");
              }}
              className="block w-full rounded-lg border border-stone-300 bg-white p-2 text-sm"
            />
            <p className="mt-1 text-xs text-stone-500">Include a header row with “email” and “phone” columns. Maximum 100 students per file.</p>
          </div>
          <button
            type="submit"
            disabled={processing || !file}
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#1F2A24" }}
          >
            <Upload size={16} />
            {processing ? "Processing..." : "Validate and preview"}
          </button>
        </form>

        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </section>

      {preview && (
        <section className="mt-5 rounded-xl border bg-white p-5" style={{ borderColor: "#E3E6DF" }}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={19} color="#9A5F1D" />
              <h2 className="font-semibold text-neutral-900">Import preview</h2>
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={processing || !preview.summary.valid}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#9A5F1D" }}
            >
              {processing ? "Importing..." : `Confirm import (${preview.summary.valid})`}
            </button>
          </div>
          <p className="mb-4 text-sm text-stone-600">
            {preview.summary.valid} valid · {preview.summary.duplicates} duplicate/skipped · {preview.summary.invalid} invalid
          </p>
          <ImportRows rows={rows} />
        </section>
      )}

      {result && (
        <section className="mt-5 rounded-xl border bg-white p-5" style={{ borderColor: "#E3E6DF" }}>
          <h2 className="mb-3 font-semibold text-neutral-900">Import complete</h2>
          <p className="mb-4 text-sm text-stone-700">
            {result.summary.created} accounts created · {result.summary.duplicates} duplicate/skipped ·{" "}
            {result.summary.validationFailures} validation/account failures · {result.summary.emailFailures} email delivery failures
          </p>
          <ImportRows rows={rows} />
        </section>
      )}

      <section className="mt-5 rounded-xl border bg-white p-5" style={{ borderColor: "#E3E6DF" }}>
        <h2 className="mb-3 font-semibold text-neutral-900">Recent import history</h2>
        {historyError && <p role="alert" className="mb-3 text-sm text-red-700">{historyError}</p>}
        {!historyError && importHistory.length === 0 && (
          <p className="text-sm text-stone-600">No student imports have been recorded yet.</p>
        )}
        <div className="space-y-3">
          {importHistory.map((entry) => {
            const importId = entry.importId || entry._id;
            const expanded = Boolean(expandedImports[importId]);
            return (
              <div key={importId} className="rounded-lg border border-stone-200 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedImports((previous) => ({
                      ...previous,
                      [importId]: !previous[importId],
                    }))}
                    className="min-w-0 flex-1 text-left text-sm"
                  >
                    <span className="font-medium text-neutral-900">{entry.fileName || "Student import"}</span>
                    <span className="ml-2 text-stone-500">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "Processing"}
                    </span>
                    <span className="ml-2 text-stone-600">
                      {entry.summary.created} created · {entry.summary.duplicates} skipped ·{" "}
                      {entry.summary.validationFailures} failures · {entry.summary.emailFailures} email failures
                    </span>
                    <span className="ml-2 text-amber-800">{expanded ? "Hide details" : "View details"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={deletingImport === importId}
                    onClick={() => handleDeleteImport(importId)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingImport === importId ? "Deleting..." : "Delete"}
                  </button>
                </div>
                {expanded && (
                  <div className="mt-3">
                    <ImportRows rows={entry.rows || []} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ImportRows({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs uppercase text-stone-500">
            <th className="px-3 py-2">Row</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Phone</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.rowNumber}-${row.email}`} className="border-b border-stone-100">
              <td className="px-3 py-2">{row.rowNumber}</td>
              <td className="px-3 py-2">{row.email || "—"}</td>
              <td className="px-3 py-2">{row.phone || "—"}</td>
              <td className="px-3 py-2">{formatStatus(row.status)}</td>
              <td className="px-3 py-2 text-stone-600">{row.errors?.join(" ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
