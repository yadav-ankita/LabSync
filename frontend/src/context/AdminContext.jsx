import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../axios";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    // ---------- Labs ----------
    const [labName, setLabName] = useState([]);
    const AddLabs = async (LabName) => {
        try {
            const { data } = await axios.post("/lab", LabName);
            console.log("Lab added:", data);
            setLabName((prev) => [
                ...prev,
                data.lab
            ]);
            return {
                success: true,
                lab: data.lab
            };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not add lab.";
            return {
                success: false,
                message
            };
        }
    };
    const getLabs = async () => {
        try {
            const { data } = await axios.get("/lab");
            console.log("Labs received from backend:", data.labs);
            setLabName(data.labs);
            return {
                success: true,
                labs: data.labs
            };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not find Labs.";
            return {
                success: false,
                message
            };
        }
    };
    // ---------- FACULTIES ----------
    const [faculties, setFaculties] = useState([]);
    const addFaculty = async (facultyDetails) => {
        try {
            const { data } = await axios.post("/admin/faculty/", facultyDetails);
            console.log("the data after adding faculty in appcontext is", data);
            setFaculties((prev) => [
                data.faculty,
                ...prev
            ]);
            return {
                success: true,
                faculty: data.faculty
            };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not add faculty.";
            return {
                success: false,
                message
            };
        }
    };
    const getFaculty = async () => {
        try {
            const { data } = await axios.get("/admin/faculty/");
            console.log("the data after fetching faculties in appcontext is", data);
            setFaculties(data.faculties);
            return data.faculties;
        } catch (error) {
            console.error("Error fetching faculties:", error);
            setFaculties([]);
            return [];
        }
    };
    const deleteFaculty = async (id) => {
        try {
            const { data } = await axios.delete(`/admin/faculty/${id}`);
            setFaculties((prev) => prev.filter((faculty) => faculty._id !== id));
            setLabName((prev) => prev.map((lab) => (
                lab.AssignFaculty?._id === id || lab.AssignFaculty === id
                    ? { ...lab, AssignFaculty: null }
                    : lab
            )));
            return {
                success: true,
                faculty: data.faculty,
                message: data.message
            };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.msg || err.response?.data?.message || "Could not delete faculty."
            };
        }
    };
    const emailCredentialsToFaculty = async (credentials) => {
        try {
            const { data } = await axios.post("/admin/faculty/credentials", credentials);
            console.log("the data after emailing credentials in appcontext is", data);
            return {
                success: true,
                message: data.message
            };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not send credentials.";
            return {
                success: false,
                message
            };
        }
    };
    // ---------- purchases ----------
    const [purchases, setPurchases] = useState([]);
    const addPurchase = async (purchaseData) => {
        try {
            const { data } = await axios.post("/admin/purchases", purchaseData);
            console.log("the data after adding purchase in appcontext is", data);
            setPurchases((prev) => [data.purchase, ...prev]);
            return {
                success: true,
                purchase: data.purchase
            };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not record purchase.";
            return {
                success: false,
                message
            };
        }
    };
    const getPurchases = async () => {
        try {
            const { data } = await axios.get("/admin/purchases");
            console.log("the data after fetching purchases in appcontext is", data);
            setPurchases(data.purchases);
            return data.purchases;
        } catch (error) {
            console.error("Error fetching purchases:", error);
            setPurchases([]);
            return [];
        }
    };
    const getAvailableResources = async () => {
        try {
            const { data } = await axios.get("/admin/purchases/resources");
            return data.resources;
        } catch (error) {
            console.error("Error fetching available resources:", error);
            return [];
        }
    };
    const getPurchase = async (id) => {
        try {
            const { data } = await axios.get(`/admin/purchases/${id}`);
            return {
                success: true,
                purchase: data.purchase
            };
        } catch (error) {
            console.error("Error fetching purchase:", error);
            return {
                success: false,
                message: error.response?.data?.msg || error.response?.data?.message || "Could not fetch purchase."
            };
        }
    };
    //------------Lab Resources----------------
    const [labResorces, setLabResorces] = useState([]);  
    const addLabResource = async (resourceData) => {
        try {
            const { data } = await axios.post("/admin/LabResource",resourceData);
            console.log("the data after adding labs in appcontext is",data);
            setLabResorces((prev) => [
                ...data.resources,
                ...prev
            ]);
            // Update remaining quantity immediately
        setPurchases((prev) =>
            prev.map((purchase) =>
                purchase._id === data.purchaseId
                    ? {
                        ...purchase,
                        remainingQuantity: data.remainingQuantity,
                      }
                    : purchase
            )
        );
            return {
                success: true,
                resources: data.resources
            };
        } catch (err) {
            const message =err.response?.data?.msg || err.response?.data?.message || "Could not add lab resource.";
            return {
                success: false,
                message
            };
        }
    };
    const getLabResources = async () => {
        try {
            const { data } = await axios.get("/admin/LabResource");
            console.log("the data after calling getLabResources in appcontext is",data);
            setLabResorces(data.resources);
        } catch (error) {
            console.error( "Error fetching lab resources:", error);
        }
    };
    const deleteLabResource = async (id) => {
        try {
            const { data } = await axios.delete(`/admin/LabResource/${id}`);
            setLabResorces((prev) => prev.filter((resource) => resource._id !== id));
            return {
                success: true,
                resource: data.resource
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.msg || error.response?.data?.message || "Could not delete lab resource."
            };
        }
    };
    return (
        <AdminContext.Provider
            value={{
                labName,
                AddLabs,
                getLabs,
                faculties,
                addFaculty,
                getFaculty,
                deleteFaculty,
                emailCredentialsToFaculty,
                purchases,
                addPurchase,
                getPurchases,
                getAvailableResources,
                getPurchase,
                labResorces,
                addLabResource,
                getLabResources,
                deleteLabResource
                
            }}>
            {children}
        </AdminContext.Provider>
    )
}
const useAdminContext = () => {
    return useContext(AdminContext);
};

export {
    AdminProvider,
    useAdminContext
};
