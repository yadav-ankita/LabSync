import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios'
import '../axios'
const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState("");
    // const registerUser = async ({ username, email, password }) => {
    //     try {
    //         const { data } = await axios.post
    //             (`/auth/register`,
    //                 {
    //                     username: username, email: email, password: password
    //                 })
    //         console.log("the data we getting after register is", data);
    //         // localStorage.setItem(
    //         //     'user',
    //         //     JSON.stringify({ name: data.user.username, token: data.token, role: data.user.role })
    //         // )
    //         return data;
    //     } catch (error) {
    //         const msg = error?.response?.data?.msg || "Invalid Credentials";
    //         setError(msg);
    //     }
    // }
    // const login = async ({ email, password }) => {
    //     try {
    //         const { data } = await axios.post(`/auth/login`, {
    //             email: email, password: password
    //         })
    //        // console.log("the data we getting after login is", data);
    //         localStorage.setItem(
    //             'user',
    //             JSON.stringify({ name: data.user.username, token: data.token, role: data.user.role })
    //         )
    //         setCurrentUser(data.user.username)
    //         setUserRole(data.user.role);
    //         return data;
    //     } catch (error) {
    //         const msg = error?.response?.data?.message || "Invalid email or password";
    //         setError(msg)
    //         throw error;
    //     }
    // }

    // const logout = () => {
    //     try {
    //         localStorage.removeItem('user');
    //         setCurrentUser(null);
    //         setCartItems([]);
    //     } catch (error) {
    //         setError(error)
    //     }
    // }
    // useEffect(() => {
    //     const user = localStorage.getItem('user')
    //     //console.log("the user in useeffect is", user)
    //     if (user) {
    //         const newUser = JSON.parse(user)
    //         setCurrentUser(newUser.name)
    //         setUserRole(newUser.role);
    //     }
    // }, [currentUser]);
    
    const [student_data, setStudentData] = useState(null);
    const [complaints, setComplaints] = useState(null);
    
    const getStudentData=async () => {
        try {
            const response = await axios.get('/student/profile');
            setStudentData(response.data);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    const postComplaints=async (complaintData) => {
        try {
            const response = await axios.post('/student/complaints', complaintData);
            setComplaints(response.data);
        } catch (error) {
            console.error('Error posting complaint:', error);
        }
    };
    
    
    return (
        <AppContext.Provider
            value=
            {
                {
                    currentUser,
                    userRole,
                    error,
                    // student_data,
                    // complaints,
                    // getStudentData,
                    // postComplaints
                }
            }>
            {children}
        </AppContext.Provider>
    )
}
const useAppContext = () => {
    return useContext(AppContext);
};
export { AppProvider, useAppContext }