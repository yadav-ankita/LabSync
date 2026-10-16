/* =========================================================
   Shared helpers for every report screen
   ========================================================= */
const DAY = 86400000;
const pad = (n) => String(n).padStart(2, "0");

export const getId = (value) => (value?._id || value || "").toString();

export const toInputDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fmtDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export const isInDateRange = (value, fromDate, toDate) => {
  const date = value ? new Date(value) : null;
  if (fromDate && (!date || date < new Date(`${fromDate}T00:00:00`))) return false;
  if (toDate && (!date || date > new Date(`${toDate}T23:59:59.999`))) return false;
  return true;
};

/* ---------- date presets ---------- */
export const DATE_PRESETS = [
  { id: "all", label: "All time" },
  { id: "month", label: "This month" },
  { id: "last", label: "Last month" },
  { id: "semester", label: "This semester" },
];

export const getPresetRange = (id) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  if (id === "month") return { from: toInputDate(new Date(y, m, 1)), to: toInputDate(new Date(y, m + 1, 0)) };
  if (id === "last") return { from: toInputDate(new Date(y, m - 1, 1)), to: toInputDate(new Date(y, m, 0)) };
  if (id === "semester") {
    const start = m < 6 ? 0 : 6; // Jan–Jun / Jul–Dec
    return { from: toInputDate(new Date(y, start, 1)), to: toInputDate(new Date(y, start + 6, 0)) };
  }
  return { from: "", to: "" };
};

/* ---------- resource status (one place to normalise the enum) ---------- */
export const isAvailable = (r) => r.status === "Available";
export const isInUse = (r) => ["In Use", "Borrowed"].includes(r.status);
export const isMaintenance = (r) => ["Maintenance", "Under Maintenance"].includes(r.status);
export const isScrapped = (r) => r.status === "Scrapped";

/* ---------- complaint metrics ---------- */
export const daysBetween = (a, b = new Date()) => Math.floor((new Date(b) - new Date(a)) / DAY);
export const isOpen = (c) => c.status !== "Resolved";
export const isAging = (c, limit = 7) => isOpen(c) && daysBetween(c.createdAt) > limit;
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

// needs `resolvedAt` on the complaint (set it in the backend when status -> Resolved)
export const avgResolutionDays = (list) => {
  const done = list.filter((c) => c.status === "Resolved" && c.resolvedAt);
  if (!done.length) return null;
  const total = done.reduce((s, c) => s + (new Date(c.resolvedAt) - new Date(c.createdAt)) / DAY, 0);
  return Math.round((total / done.length) * 10) / 10;
};

export const complaintStats = (list) => {
  const resolved = list.filter((c) => c.status === "Resolved").length;
  return {
    total: list.length,
    pending: list.filter((c) => c.status === "Pending").length,
    inProgress: list.filter((c) => c.status === "In Progress").length,
    resolved,
    open: list.length - resolved,
    rate: pct(resolved, list.length),
    avgDays: avgResolutionDays(list) ?? "—",
    aging: list.filter((c) => isAging(c)).length,
  };
};

// number of resources that have `min` or more complaints (replacement candidates)
export const repeatResources = (list, min = 3) => {
  const counts = {};
  list.forEach((c) => {
    if (c.resourceId) counts[c.resourceId] = (counts[c.resourceId] || 0) + 1;
  });
  return Object.values(counts).filter((n) => n >= min).length;
};

/* ---------- CSV ---------- */
const csvValue = (value) => {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const exportCsv = (columns, rows, filename) => {
  const csvRows = [columns.map((c) => c.label), ...rows.map((r) => columns.map((c) => r[c.key]))];
  const csv = csvRows.map((row) => row.map(csvValue).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
