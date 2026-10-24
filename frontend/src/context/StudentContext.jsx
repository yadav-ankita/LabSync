import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import "../axios";
import { useAppContext } from "./AppContext";
const StudentContext = createContext();

const readSession = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key) || "null");
    } catch (error) {
        console.error(`Could not read ${key} session:`, error);
        return null;
    }
};

const saveStudentProfile = (student) => {
    const studentSession = readSession("student");
    const userSession = readSession("user");
    const storedStudent = { ...student };
    delete storedStudent.password;

    if (studentSession?.token) {
        localStorage.setItem(
            "student",
            JSON.stringify({ ...studentSession, studentInfo: storedStudent })
        );
    } else if (userSession?.token) {
        localStorage.setItem(
            "user",
            JSON.stringify({ ...userSession, UserInfo: storedStudent })
        );
    } else {
        localStorage.setItem(
            "student",
            JSON.stringify({ ...(studentSession || {}), studentInfo: storedStudent })
        );
    }
};

const StudentProvider = ({ children }) => {
    const { setCurrentUser, setIsAuthenticated } = useAppContext();
    // ---------- lab manuals ----------
    const [labManuals, setLabManuals] = useState([]);
    const getStudentData = useCallback(async () => {
        try {
            const { data } = await axios.get("/student/profile");
            const student = { ...data.student, role: "student" };
            saveStudentProfile(student);
            setCurrentUser(student);
            setIsAuthenticated(true);
            return student;
        } catch (error) {
            console.error("Error fetching student data:", error);
            return null;
        }
    }, [setCurrentUser, setIsAuthenticated]);
    const editProfile = async (updates) => {
        try {
            const { data } = await axios.patch("/student/profile", updates);
            const student = {
                ...data.student,
                role: data.student?.role || "student",
            };
            saveStudentProfile(student);
            setCurrentUser(student);
            setIsAuthenticated(true);
            return {
                success: true,
                student,
                message: data.message,
            };
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data?.msg ||
                "Could not update profile.";
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