
import { SectionCard } from "../../components/SectionCard";
import { DonutChart } from "../../components/DonutChart";

const STATUSES = [
  { label: "Available", color: "#45C3A0" },
  { label: "Borrowed", color: "#F5CD57" },
  { label: "Open Complaints", color: "#F36F52" },
  { label: "Scrapped", color: "#D95D5D" },
];

export function ResourceStatusChart({
  resources,
  scrappedCount,
  openComplaints = 0,
  animationKey = 0,
}) {
  const counts = {};

  resources.forEach((resource) => {
    const status = (resource.status || "").trim().toLowerCase();
    const key =
      status === "maintenance" ? "under maintenance" : status;

    counts[key] = (counts[key] || 0) + 1;
  });

  const data = STATUSES.map((status) => ({
    ...status,
    value:
      status.label === "Open Complaints"
        ? openComplaints
        : status.label === "Scrapped" &&
            scrappedCount !== undefined
          ? scrappedCount
          : counts[status.label.toLowerCase()] || 0,
  }));

  const known = new Set(
    STATUSES.map((status) => status.label.toLowerCase())
  );

  const otherCount = Object.entries(counts)
    .filter(
      ([key]) =>
        !known.has(key) &&
        !["maintenance", "under maintenance"].includes(key)
    )
    .reduce((sum, [, count]) => sum + count, 0);

  if (otherCount > 0) {
    data.push({
      label: "Other",
      value: otherCount,
      color: "#D9DEE5",
    });
  }

  return (
    <SectionCard title="Resource status">
      {resources.length === 0 && !scrappedCount ? (
        <p
          className="text-sm text-center py-10"
          style={{ color: "#7B8490" }}
        >
          No resources yet.
        </p>
      ) : (
        <DonutChart
          data={data}
          animationKey={animationKey}
        />
      )}
    </SectionCard>
  );
}
