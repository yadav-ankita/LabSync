
import { SectionCard } from "../../components/SectionCard";
import { DonutChart } from "../../components/DonutChart";

const CATEGORIES = [
  "Desktops",
  "Laptops",
  "Monitors",
  "CPUs",
  "Keyboards",
  "Mouse",
  "Printers",
  "Projectors",
  "Networking Equipment",
  "Power Backup",
  "Servers",
  "Raspberry Pi Kits",
  "Furniture",
  "Electrical Equipment",
  "Cameras",
  "Software Licenses",
];

// Fixed, distinct colours for consistent category identification.
const CATEGORY_COLORS = {
  Computers: "#F36F52",             // Coral
  Monitors: "#4E79D9",              // Blue
  CPUs: "#45C3A0",                  // Mint
  Keyboards: "#9B6BD3",              // Purple
  Mouse: "#E5A323",                  // Golden amber
  Printers: "#E56B9F",               // Pink
  Projectors: "#269DB5",             // Teal blue
  "Networking Equipment": "#7C9B3B", // Olive green
  "Power Backup": "#D9534F",         // Red
  Servers: "#6977C5",                // Indigo
  "Raspberry Pi Kits": "#E88935",    // Orange
  Furniture: "#8A6D5A",              // Brown
  "Electrical Equipment": "#C4A72C", // Mustard
  Cameras: "#45C3A0",                // Mint green
  "Software Licenses": "#64748B",    // Slate
};

const OTHERS_COLOR = "#D9DEE5";

export function ResourcesByCategory({
  resources,
  animationKey = 0,
}) {
  const groups = {};

  CATEGORIES.forEach((category) => {
    groups[category] = 0;
  });

  let uncategorizedCount = 0;

 resources.forEach((resource) => {
  // Do not include scrapped assets in category totals
  if ((resource.status || "").trim().toLowerCase() === "scrapped") {
    return;
  }

  const category = resource.purchase?.category;

  if (category && CATEGORIES.includes(category)) {
    groups[category] += 1;
  } else {
    uncategorizedCount += 1;
  }
});

  const data = CATEGORIES
    .filter((category) => groups[category] > 0)
    .map((category) => ({
      label: category,
      value: groups[category],
      color: CATEGORY_COLORS[category],
    }));

  if (uncategorizedCount > 0) {
    data.push({
      label: "Uncategorized",
      value: uncategorizedCount,
      color: OTHERS_COLOR,
    });
  }

  return (
    <SectionCard title="Resources by category">
      {resources.length === 0 ? (
        <p
          className="text-sm text-center py-10"
          style={{ color: "#7B8490" }}
        >
          No resources yet.
        </p>
      ) : data.length === 0 ? (
        <p
          className="text-sm text-center py-10"
          style={{ color: "#7B8490" }}
        >
          No categorized resources yet.
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
