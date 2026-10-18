import { CheckCircle2, Wrench, Archive } from "lucide-react";
import { ResourceTag } from "../../components/ResourceTag";

const getStatusLabel = (status) => {
  if (status === "Maintenance") {
    return "Under Maintenance";
  }

  if (status === "Scrapped") {
    return "Scrapped";
  }

  return "Available";
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Under Maintenance":
      return {
        backgroundColor: "#FEF0C7",
        color: "#92400E",
        border: "1px solid #F59E0B",
      };

    case "Scrapped":
      return {
        backgroundColor: "#FCE8E6",
        color: "#B3261E",
        border: "1px solid #F2B8B5",
      };

    default:
      return {
        backgroundColor: "#E3EEE5",
        color: "#246B45",
        border: "1px solid transparent",
      };
  }
};


export function ResourceRow({ resource }) {
  const status = getStatusLabel(resource.status);

  return (
    <div
      className="grid grid-cols-9 items-center px-5 py-3.5 border-t first:border-t-0"
      style={{ borderColor: "#E3E6DF" }}
    >
      <span className="col-span-2">
        <ResourceTag id={resource.assetId} />
      </span>

      <span
        className="col-span-4 text-sm truncate"
        style={{ color: "#1F2A24" }}
      >
        {resource.resourceName}
      </span>

      <span className="col-span-3 flex justify-end">
        <span
          className="inline-flex items-center  gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
          style={getStatusStyle(status)}
        >
          {status === "Available" && <CheckCircle2 size={14} />}
    {status === "Under Maintenance" && <Wrench size={14} />}
    {status === "Scrapped" && <Archive size={14} />}
          {status}
        </span>
      </span>
    </div>
  );
}
