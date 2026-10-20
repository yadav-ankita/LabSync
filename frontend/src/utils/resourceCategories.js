export const ALL_RESOURCE_CATEGORIES = "All categories";
export const UNCATEGORIZED = "Uncategorized";

export const RESOURCE_CATEGORIES = [
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

// Match the category using the linked Purchase Register record,
// exactly as the Lab Admin resource page does.
export function getResourceCategory(resource) {
  const category =
    typeof resource === "object" && resource !== null
      ? resource.purchase?.category
      : undefined;

  return RESOURCE_CATEGORIES.includes(category)
    ? category
    : UNCATEGORIZED;
}
