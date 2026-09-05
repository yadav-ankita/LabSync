import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../axios";
import { useAppContext } from "./AppContext";
const StudentContext = createContext();
const StudentProvider = ({ children }) => {
    const { currentUser, setCurrentUser, setIsAuthenticated } = useAppContext();
    // ---------- lab manuals ----------
    const [labManuals, setLabManuals] = useState([]);
    const getStudentData = useCallback(async () => {
        try {
            const { data } = await axios.get("/student/profile");
            setCurrentUser(data.student);
            setIsAuthenticated(true);
            return data.student;
        } catch (error) {
            console.error("Error fetching student data:", error);
            logout();
            return null;
        }
    }, []);
    const editProfile = async (updates) => {
        try {
            const { data } = await axios.patch("/student/profile",updates);
            console.log("data after edit profile is in appcontext is",data);
            setCurrentUser(data.student);
            return {
                success: true,
                student: data.student
            };
        } catch (err) {
            const message =err.response?.data?.msg ||"Could not update profile.";
            setError(message);
            return {
                success: false,
                message
            };
        }
    };
    const getLabManuals = async () => {
        try {
            const { data } = await axios.get(
                "/student/lab-manuals"
            );

            setLabManuals(data.manuals);

        } catch (error) {
            console.error(
                "Error fetching lab manuals:",
                error
            );

            setLabManuals([]);

        }
    };
    return (
        <StudentContext.Provider
            value={{
                labManuals,
                getLabManuals,
                getStudentData,
                editProfile
            }}
        >
            {children}
        </StudentContext.Provider>
    );
}
const useStudentContext = () => {
    return useContext(StudentContext);
};
export {
    StudentProvider,
    useStudentContext
};