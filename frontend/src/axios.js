  //frontend/axios.js
import axios from 'axios';
//Set base URL
axios.defaults.baseURL = 'http://localhost:4000/api/v1';
 //Add request interceptor
axios.interceptors.request.use(
    (req) => {
        const user = localStorage.getItem('student');
        if (user) {
            try {
                const { token } = JSON.parse(user);
                req.headers.Authorization = `Bearer ${token}`;
                console.log('Added Authorization header to request:', req);
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