import { useEffect } from "react";
import { ComplaintRow } from "./ComplaintRow";
import { TopBar } from "./TopBar";
import { useComplaintContext } from "../../context/ComplaintContext";
 export function MyComplaints() {
  const {complaints,getComplaints}=useComplaintContext()
  useEffect(()=>{
      getComplaints();
  },[])
  return (
    <div>
      <TopBar title="My Complaints" subtitle="Track the status of issues you've reported." />
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#E3E6DF" }}>
        {complaints.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#5B6A5F" }}>
            You haven't raised any complaints yet.
          </div>
        ) : (
          complaints.map((c) => <ComplaintRow key={c._id} complaint={c} />)
        )}
      </div>
    </div>
  );
}