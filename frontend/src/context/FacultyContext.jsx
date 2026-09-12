import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../axios";
import { useAppContext } from "./AppContext";
const FacultyContext = createContext();
const FacultyProvider = ({ children }) => {
    const { currentUser, setCurrentUser, setIsAuthenticated } = useAppContext();
    const [facultyResources, setFacultyResources] = useState([]);
    const [facultyManuals, setFacultyManuals] = useState([]);
    const getAssignedLabResources = async () => {
        try {
            const { data } = await axios.get("/faculty/labResource");
            setFacultyResources(data.resources || []);
            return {
                success: true,
                resources: data.resources || [],
                labName: data.labName || currentUser?.lab_name || ""
            };
        } catch (error) {
            console.error("Error fetching assigned lab resources:", error);
            setFacultyResources([]);
            return {
                success: false,
                message: error.response?.data?.msg || "Could not fetch assigned lab resources."
            };
        }
    };
    const getResourceAssignmentRequests = async () => {
    try {
        const { data } = await axios.get(
            "/faculty/resourceAssignmentRequests"
        );

        return {
            success: true,
            requests: data.requests || [],
        };
    } catch (error) {
        console.error(
            "Error fetching resource assignment requests:",
            error
        );

        return {
            success: false,
            requests: [],
            message:
                error.response?.data?.msg ||
                error.response?.data?.message ||
                "Could not fetch resource assignment requests.",
        };
    }
};
const respondToResourceAssignmentRequest = async (
    requestId,
    status,
    rejectionReason = ""
) => {
    try {
        const { data } = await axios.patch(
            `/faculty/resourceAssignmentRequests/${requestId}`,
            {
                status,
                rejectionReason,
            }
        );

        return {
            success: true,
            request: data.request,
            message: data.message,
        };
    } catch (error) {
        console.error(
            "Error responding to resource assignment request:",
            error
        );

        return {
            success: false,
            message:
                error.response?.data?.msg ||
                error.response?.data?.message ||
                "Could not process resource assignment request.",
        };
    }
};
    const getFacultyManuals = async () => {
        try {
            const { data } = await axios.get("/faculty/labManuals");
            setFacultyManuals(data.manuals || []);
            return { success: true, manuals: data.manuals || [] };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Could not fetch lab manuals." };
        }
    };
    const removeFacultyManual = async (id) => {
        try {
            await axios.delete(`/faculty/labManuals/${id}`);
            setFacultyManuals((manuals) => manuals.filter((manual) => manual._id !== id));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Could not delete manual." };
        }
    };
    const getFacultyProfile = useCallback(async () => {
        try {
            const { data } = await axios.get("/faculty/myprofile");
            const faculty = data.faculty;
            localStorage.setItem("faculty", JSON.stringify({ facultyInfo: faculty, token: JSON.parse(localStorage.getItem("faculty") || "{}")?.token || "" }));
            setCurrentUser(faculty);
            setIsAuthenticated(true);
            return faculty;
        } catch (error) {
            console.error("Error fetching faculty profile:", error);
            return null;
        }
    }, []);
    const editFacultyProfile = async (updates) => {
        try {
            const { data } = await axios.patch("/faculty/myprofile", updates);
            const faculty = data.faculty;
            const stored = JSON.parse(localStorage.getItem("faculty") || "{}");
            localStorage.setItem("faculty", JSON.stringify({ ...stored, facultyInfo: faculty }));
            setCurrentUser(faculty);
            return {
                success: true,
                faculty,
                message: data.message
            };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not update profile.";
            return {
                success: false,
                message
            };
        }
    };
    const uploadLabManual = async (formData) => {
        try {
            const response = await axios.post('/faculty/labManuals', formData, {
            });
            const manual = response.data.manual;
            setFacultyManuals((manuals) => [manual, ...manuals]);
            return { success: true, manual, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.msg || error.response?.data?.message || "Could not upload manual.";
            return {
                success: false,
                message
            };
        }
    };
    return (
        <FacultyContext.Provider
            value={{
                facultyResources,
                facultyManuals,
                getAssignedLabResources,
                getResourceAssignmentRequests,
                respondToResourceAssignmentRequest,
                getFacultyProfile,
                editFacultyProfile,
                uploadLabManual,
                getFacultyManuals,
                removeFacultyManual
            }}
        >
            {children}
        </FacultyContext.Provider>
    );
}
const useFacultyContext = () => {
    return useContext(FacultyContext);
};
export {
    FacultyProvider,
    useFacultyContext
};