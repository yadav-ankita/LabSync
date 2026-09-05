import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../axios";
import { useAppContext } from "./AppContext";
const FacultyContext = createContext();
const FacultyProvider = ({ children }) => {
    const {currentUser,setCurrentUser,setIsAuthenticated}=useAppContext();
    const [facultyResources, setFacultyResources] = useState([]); 
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
     return (
        <FacultyContext.Provider
            value={{
                facultyResources,
                getAssignedLabResources,
                getFacultyProfile,
                editFacultyProfile
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