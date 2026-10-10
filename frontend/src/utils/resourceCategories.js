export const ALL_RESOURCE_CATEGORIES = "All categories";

export function getResourceCategory(resourceName = "") {
  const name = resourceName.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const words = name.split(/\s+/);

  if (name.includes("webcam") || name.includes("web cam") || name.includes("web camera") || name.includes("usb camera")) return "Webcam";
  if (name.includes("computer") || name.includes("desktop") || name.includes("workstation") || name.includes("laptop") || words.includes("pc")) return "Computer";
  if (name.includes("monitor") || name.includes("display")) return "Monitor";
  if (name.includes("keyboard")) return "Keyboard";
  if (name.includes("mouse")) return "Mouse";
  if (name.includes("projector")) return "Projector";
  if (name.includes("printer")) return "Printer";
  if (name.includes("scanner")) return "Scanner";
  if (name.includes("router") || name.includes("switch") || name.includes("access point")) return "Network Equipment";
  if (name.includes("camera")) return "Camera";
  if (name.includes("software") || name.includes("license")) return "Software";
  return "Other";
}