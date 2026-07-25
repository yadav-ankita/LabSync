import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios'
import '../axios'

const AppContext = createContext();

const AppProvider = ({ children }) => {
    // ---------- auth state ----------
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [error, setError] = useState("");
    // ---------- complaints ----------
    const [complaints, setComplaints] = useState([]);
  
    // ---------- lab manuals ----------
    const [labManuals, setLabManuals] = useState([]);
    // ---------- AUTH ----------
    const login = async (studentId, password) => {
        setError("");
        try {
            const { data } = await axios.post('/student/login', { studentId, password });
            console.log("data after login is in appcontext is", data);
            localStorage.setItem(
                'student',
                JSON.stringify({ studentInfo: data.student, token: data.token })
            )
            setCurrentUser(data.student);
            console.log('Login successful, student data: in the app context is this', data.student);
            setIsAuthenticated(true);
            return { success: true }; 
        } catch (err) {
            const message = err.response?.data?.msg || "Invalid credentials";
            setError(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('student');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setComplaints([]);
        setLabManuals([]);
    };

    const getStudentData = useCallback(async () => {
        try {
            const { data } = await axios.get('/student/profile');
            setCurrentUser(data.student);
            setIsAuthenticated(true);
            return data.student;
        } catch (error) {
            console.error('Error fetching student data:', error);
            logout();
            return null;
        }
    }, []);

    const editProfile = async (updates) => {
        setError("");
        try {
            const { data } = await axios.patch('/student/profile', updates);
            console.log("data after edit profile is in appcontext is", data);
            setCurrentUser(data.student);
            return { success: true, student: data.student };
        } catch (err) {
            const message = err.response?.data?.msg || "Could not update profile.";
            setError(message);
            return { success: false, message };
        }
    };
    // ---------- COMPLAINTS ---------- 
    const getComplaints = async () => {
       
        try {
            const { data } = await axios.get('/student/complaints');
            console.log("the data after calling getcomplaints in appcontext is",data);
            setComplaints(data.complaints);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            
        }
    };

    const raiseComplaint = async (complaintData) => {
        setError("");
        try {
            const { data } = await axios.post('/student/complaints', complaintData);
            console.log("the data we get after raise complaints in app context is",data);
            setComplaints((prev) => [data.complaint, ...prev]);
            return { success: true, complaint: data.complaint };
        } catch (err) {
            const message = err.response?.data?.msg || "Could not submit complaint.";
            setError(message);
            return { success: false, message };
        }
    };

    // ---------- LAB MANUALS ----------
    const getLabManuals = async () => {
        
        try {
            const { data } = await axios.get('/student/lab-manuals');
            setLabManuals(data.manuals);
        } catch (error) {
            console.error('Error fetching lab manuals:', error);
            setLabManuals([]);
        } finally {
            
        }
    };

    // ---------- restore session on refresh ----------
    useEffect(() => {
        const token = localStorage.getItem('student');
        if (token) {
            getStudentData().finally(() => setAuthLoading(false));
        } else {
            setAuthLoading(false);
        }
    }, [getStudentData]);

    return (
        <AppContext.Provider
            value={{
                currentUser,
                isAuthenticated,
                authLoading,
                error,
                login,
                logout,
                getStudentData,
                editProfile,
                complaints,      
                getComplaints,
                raiseComplaint,
                labManuals,     
                getLabManuals,
            }}>
            {children}
        </AppContext.Provider>
    )
}
const useAppContext = () => {
    return useContext(AppContext);
};
export { AppProvider, useAppContext }