  //frontend/axios.js
import axios from 'axios';
//Set base URL
axios.defaults.baseURL = 'http://localhost:4000/api/v1';
 // Add the token from whichever session is currently active.
axios.interceptors.request.use(
    (req) => {
        const session = localStorage.getItem('user') || localStorage.getItem('student');
        //console.log("the session in axios is this",session)
        if (session) {
            try {
                const { token } = JSON.parse(session);
                if (token) {
                    req.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            }
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default axios;