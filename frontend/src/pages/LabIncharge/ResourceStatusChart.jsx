
import { SectionCard } from "../../components/SectionCard";
import { DonutChart } from "../../components/DonutChart";

const STATUSES = [
  { label: "Available", color: "#45C3A0" },
  { label: "Open Complaints", color: "#F36F52" },
  { label: "Scrapped", color: "#D95D5D" },
];

export function ResourceStatusChart({
  resources = [],
  complaints = [],
  animationKey = 0,
}) {
  const openComplaintResourceIds = new Set(
    complaints
      .filter((c) => c.status !== "Resolved")
      .map((c) => String(c.resourceId))
  );

  const isScrapped = (resource) =>
    (resource.status || "").trim().toLowerCase() === "scrapped";

  const hasOpenComplaint = (resource) =>
    openComplaintResourceIds.has(String(resource.assetId)) ||
    openComplaintResourceIds.has(String(resource._id));

  const availableCount = resources.filter(
    (resource) =>
      (resource.status || "").trim().toLowerCase() === "available" &&
      !isScrapped(resource) &&
      !hasOpenComplaint(resource)
  ).length;

  const openComplaintCount = resources.filter(
    (resource) =>
      !isScrapped(resource) && hasOpenComplaint(resource)
  ).length;

  const scrappedCount = resources.filter(isScrapped).length;

  const data = [
    { ...STATUSES[0], value: availableCount },
    { ...STATUSES[1], value: openComplaintCount },
    { ...STATUSES[2], value: scrappedCount },
  ];

  return (
    <SectionCard title="Resource status">
      {resources.length === 0 ? (
        <p
          className="text-sm text-center py-10"
          style={{ color: "#7B8490" }}
        >
          No resources yet.
        </p>
      ) : (
        <DonutChart data={data} animationKey={animationKey} />
      )}
    </SectionCard>
  );
}
