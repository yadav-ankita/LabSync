import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../axios";

const AppContext = createContext();
const AppProvider = ({ children }) => {
    // ---------- auth state ----------
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    // ---------- student lab manuals ----------
const [labManuals, setLabManuals] = useState([]);
const [loadingManuals, setLoadingManuals] = useState(false);
const [manualsError, setManualsError] = useState("");
    const login = async (form) => {
        try {
            const { data } = await axios.post("/auth/login", {
                email: form.email,
                password: form.password,
            });
            const user = data.user || data.faculty;
            localStorage.setItem("user",JSON.stringify({UserInfo: user,token: data.token}));
            localStorage.removeItem("student");
            localStorage.removeItem("faculty");
            setCurrentUser(user);
            setIsAuthenticated(true);
            return {success: true,user};
        } catch (error) {
            const message =error.response?.data?.msg ||error.response?.data?.message ||"Unable to sign in.";
            return {success: false,message};
        }
    };
const getLabManuals = useCallback(async (semester) => {
    setLoadingManuals(true);
    setManualsError("");

    try {
        const studentSession = JSON.parse(
            localStorage.getItem("student") || "null"
        );

        const userSession = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        // Accept either the student-specific session or a student using common login.
        const studentAuthSession =
            studentSession?.token &&
            studentSession.studentInfo?.role === "student"
                ? studentSession
                : userSession?.token &&
                    userSession.UserInfo?.role === "student"
                  ? userSession
                  : null;
        const token = studentAuthSession?.token;

        if (!token) {
            throw new Error(
                "Please log in using your student account to view lab manuals."
            );
        }

        const params = {};
        if (semester) {
            params.semester = semester;
        }

        const { data } = await axios.get("/student/labManuals", {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setLabManuals(data.manuals || []);

        return {
            success: true,
            manuals: data.manuals || [],
        };
    } catch (err) {
        const message =
            err.response?.data?.message ||
            err.response?.data?.msg ||
            err.message ||
            "Failed to fetch lab manuals.";

        setManualsError(message);
        setLabManuals([]);

        return {
            success: false,
            message,
        };
    } finally {
        setLoadingManuals(false);
    }
}, []);

    const logout = () => {
        localStorage.removeItem("student");
        localStorage.removeItem("user");
        localStorage.removeItem("faculty");
        setCurrentUser(null);
        setIsAuthenticated(false);
    };
    const editprofileadmin = async (updates) => {
        try {
            const { data } = await axios.patch("/admin/profile", updates);
            const user = data.user;
            const session = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...session, UserInfo: user }));
            setCurrentUser(user);
            return { success: true, user, message: data.message };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.msg || err.response?.data?.message || "Could not update profile.",
            };
        }
    };
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedStudent = localStorage.getItem("student");
        const storedSession = storedUser || storedStudent;
        if (storedSession) {
            const parsedUser = JSON.parse(storedSession);
            const newUser = parsedUser.UserInfo || parsedUser.studentInfo || parsedUser;
            if (storedStudent && !newUser.role) newUser.role = "student";
            if (storedUser && !newUser.role) newUser.role = "faculty";
            setCurrentUser(newUser);
            setIsAuthenticated(true);
        }
        setAuthLoading(false);
    }, []);
    useEffect(() => {
        if (currentUser && !currentUser.name && currentUser.faculty_name) {
            setCurrentUser((prev) => ({
                ...prev,
                name: currentUser.faculty_name,
                faculty_name: currentUser.faculty_name,
            }));
        }
    }, []);
    return (
        <AppContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                isAuthenticated,
                setIsAuthenticated,
                authLoading,
                login,
                labManuals,
loadingManuals,
manualsError,
getLabManuals,
                logout,
                editprofileadmin
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
const useAppContext = () => {
    return useContext(AppContext);
};
export {
    AppProvider,
    useAppContext
};