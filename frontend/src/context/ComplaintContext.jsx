import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../axios";

const ComplaintContext = createContext();

const ComplaintProvider = ({ children }) => {
    // ---------- student's own complaints ----------
    const [complaints, setComplaints] = useState([]);
    // ---------- admin: all complaints across labs ----------
    const [Allcomplaints, setAllComplaints] = useState([]);
    const getAllComplaints = async () => {
        try {
            const { data } = await axios.get("/admin/complaints");
            setAllComplaints(data.complaints);
        } catch (error) {
            console.error("Error fetching complaints:",error);
        }
    };
    const editComplaintStatus = async (complaintId, status) => {
        try {
            const { data } = await axios.patch("/admin/complaints", { complaintId, status });
            console.log("the data after editing complaint status in appcontext is", data);
            setAllComplaints((prevComplaints) =>
                prevComplaints.map((complaint) =>
                    complaint._id === complaintId
                        ? {
                            ...complaint,
                            status: data.complaint.status
                        }
                        : complaint
                )
            );
            return {
                success: true,
                complaint: data.complaint
            };
        } catch (error) {
            console.error("Error editing complaint status:", error);
            return {
                success: false,
                message: "Could not edit complaint status."
            };
        }
    };
    const getComplaintsByLab = async (labName) => {
        try {
            const { data } = await axios.get(`/admin/complaints/lab/${labName}`);
            console.log("the data after calling getComplaintsByLab in appcontext is", data);
            setAllComplaints(data.complaints);
        } catch (error) {
            console.error("Error fetching complaints by lab:", error);
        }
    };
    // =========================================================
    // STUDENT COMPLAINTS
    // =========================================================
    const getComplaints = async () => {
        try {
            const { data } = await axios.get("/student/complaints");
            console.log("the data after calling getcomplaints in app context is", data);
            setComplaints(data.complaints);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    };
    const raiseComplaint = async (complaintData) => {
        try {
            const { data } = await axios.post("/student/complaints", complaintData);
            console.log("the data we get after raise complaints in app context is", data);
            setComplaints((prev) => [
                data.complaint,
                ...prev
            ]);
            return {
                success: true,
                complaint: data.complaint
            };
        } catch (err) {
            const message = err.response?.data?.msg || "Could not submit complaint.";
            return {
                success: false,
                message
            };
        }
    };
    return (
        <ComplaintContext.Provider 
         value={{
                complaints,
                Allcomplaints,
                getAllComplaints,
                editComplaintStatus,
                getComplaintsByLab,
                getComplaints,
                raiseComplaint
            }}>
            {children}
        </ComplaintContext.Provider>
    )
}
const useComplaintContext = () => {
    return useContext(ComplaintContext);
};

export {
    ComplaintProvider,
    useComplaintContext
};
