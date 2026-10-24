  //frontend/axios.js
import axios from 'axios';
//Set base URL
axios.defaults.baseURL = 'http://localhost:4000/api/v1';
 // Add the token from whichever session is currently active.
axios.interceptors.request.use(
    (req) => {
        const readSession = (key) => {
            try {
                return JSON.parse(localStorage.getItem(key) || "null");
            } catch (error) {
                console.error(`Error parsing ${key} session:`, error);
                return null;
            }
        };
        const studentSession = readSession("student");
        const userSession = readSession("user");
        const session =
            studentSession?.token &&
            studentSession.studentInfo?.role === "student"
                ? studentSession
                : userSession?.token
                  ? userSession
                  : studentSession;
        if (session?.token && !req.headers.Authorization) {
            req.headers.Authorization = `Bearer ${session.token}`;
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default axios;