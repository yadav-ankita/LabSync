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
    // ---------- student's own complaints ----------
    const [complaints, setComplaints] = useState([]);
    // ---------- admin: all complaints across labs ----------
    const [Allcomplaints, setAllComplaints] = useState([]);
    const [labResorces, setLabResorces] = useState([]);
    const [purchases,setPurchases]=useState([]);

    // ---------- lab manuals ----------
    const [labManuals, setLabManuals] = useState([]);

    //----------lab Admin----------------
    const addPurchase = async (purchaseData) => {
        setError("");

        try {
            const { data } = await axios.post(
                '/admin/purchases',
                purchaseData
            );

            console.log(
                "the data after adding purchase in appcontext is",
                data
            );

            setPurchases((prev) => [data.purchase, ...prev]);

            return {
                success: true,
                purchase: data.purchase
            };

        } catch (err) {
            const message =
                err.response?.data?.msg ||
                err.response?.data?.message ||
                "Could not record purchase.";

            setError(message);

            return {
                success: false,
                message
            };
        }
    };
    const getPurchases = async () => {
    try {
        const { data } = await axios.get('/admin/purchases');

        console.log(
            "the data after fetching purchases in appcontext is",
            data
        );

        setPurchases(data.purchases);

        return data.purchases;

    } catch (error) {
        console.error("Error fetching purchases:", error);
        setPurchases([]);
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
            message:
                error.response?.data?.msg ||
                error.response?.data?.message ||
                "Could not fetch purchase."
        };
    }
};
    const addLabResource = async (resourceData) => {
        setError("");
        try {
            const { data } = await axios.post('/admin/LabResource', resourceData);
            console.log("the data after adding lab resource in appcontext is", data);
            // backend returns { resources: [...], count } — always an array,
            // since quantity can create more than one unit at a time.
            setLabResorces((prev) => [...data.resources, ...prev]);
            return { success: true, resources: data.resources };
        }
        catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not add lab resource.";
            setError(message);
            return { success: false, message };
        }
    };
    const getLabResources = async () => {
        try {
            // was '/admin/LabResources' (extra 's') — route is singular 'LabResource'
            const { data } = await axios.get('/admin/LabResource');
            console.log("the data after calling getLabResources in appcontext is", data);
            setLabResorces(data.resources);
        }
        catch (error) {
            console.error('Error fetching lab resources:', error);
        }
    };
    const getAllComplaints = async () => {
        try {
            const { data } = await axios.get('/admin/complaints');
            // backend returns { complaints, count } — was reading data.Allcomplaints
            // (undefined), which cleared the list on every call.
            setAllComplaints(data.complaints);
        }
        catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };
    const editComplaintStatus = async (complaintId, status) => {
        try {
            const { data } = await axios.patch('/admin/complaints', { complaintId, status });
            console.log("the data after editing complaint status in appcontext is", data);
            setAllComplaints((prevComplaints) =>
                prevComplaints.map((complaint) =>
                    complaint._id === complaintId ? { ...complaint, status: data.complaint.status } : complaint
                )
            );
            return { success: true, complaint: data.complaint };
        } catch (error) {
            console.error('Error editing complaint status:', error);
            return { success: false, message: "Could not edit complaint status." };
        }
    };
    const getComplaintsByLab = async (labName) => {
        try {
            const { data } = await axios.get(`/admin/complaints/lab/${labName}`);
            console.log("the data after calling getComplaintsByLab in appcontext is", data);
            setAllComplaints(data.complaints);
        }
        catch (error) {
            console.error('Error fetching complaints by lab:', error);
        }
    };


    //-----------Add Faculty By Lab Admin-------
    const [faculties, setFaculties] = useState([]);
    // ---------- FACULTIES (lab Incharge) ----------
    const facultyLogin = async (form) => {
        setError("");
        try {
            const { data } = await axios.post('/auth/login', form);
            console.log("the data after adding faculty in appcontext is", data);
            localStorage.setItem(
                'faculty',
                JSON.stringify({ facultyInfo: data.faculty, token: data.token })
            )
            setCurrentUser(data.faculty);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            const message =
                error.response?.data?.msg ||
                error.response?.data?.message ||
                "Failed Faculty Login";
            setError(message);
            return { success: false, message };
        }
    }
    // facultyDetails: { name, email, lab_no }
    const addFaculty = async (facultyDetails) => {
        setError("");
        try {
            const { data } = await axios.post('/admin/faculty/', facultyDetails);
            console.log("the data after adding faculty in appcontext is", data);
            setFaculties((prev) => [data.faculty, ...prev]);
            return { success: true, faculty: data.faculty };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not add faculty.";
            setError(message);
            return { success: false, message };
        }
    };
    const getFaculty = async () => {
        try {
            const { data } = await axios.get('/admin/faculty/');
            console.log("the data after fetching faculties in appcontext is", data);
            setFaculties(data.faculties);
            return data.faculties;
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setFaculties([]);
            return [];
        }
    };
    // credentials: { facultyId }
    const emailCredentialsToFaculty = async (credentials) => {
        setError("");
        try {
            const { data } = await axios.post('/admin/faculty/credentials', credentials);
            console.log("the data after emailing credentials in appcontext is", data);
            return { success: true, message: data.message };
        } catch (err) {
            const message = err.response?.data?.msg || err.response?.data?.message || "Could not send credentials.";
            setError(message);
            return { success: false, message };
        }
    };

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
        localStorage.removeItem('faculty');
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
    // ---------- COMPLAINTS (student's own) ---------- 
    const getComplaints = async () => {
        try {
            const { data } = await axios.get('/student/complaints');
            console.log("the data after calling getcomplaints in appcontext is", data);
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
            console.log("the data we get after raise complaints in app context is", data);
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
    useEffect(() => {
        const user = localStorage.getItem('faculty')
        if (user) {
            const newUser = JSON.parse(user);
            setCurrentUser(newUser.facultyInfo);
            setIsAuthenticated(true);
        }
        setAuthLoading(false);
    }, [])
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
                purchases,
                addPurchase,
                getPurchases,
                getPurchase,
                faculties,
                addFaculty,
                getFaculty,
                emailCredentialsToFaculty,
                facultyLogin,
                Allcomplaints,
                labResorces,
                addLabResource,
                getLabResources,
                getAllComplaints,
                editComplaintStatus,
                getComplaintsByLab
            }}>
            {children}
        </AppContext.Provider>
    )
}
const useAppContext = () => {
    return useContext(AppContext);
};
export { AppProvider, useAppContext }