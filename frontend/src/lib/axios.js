import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
});

// // Add request interceptor to include auth token
// axiosInstance.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );
  
//   // Add response interceptor to handle common errors
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         // Handle unauthorized access
//         localStorage.removeItem('token');
//         window.location.href = '/login';
//       }
//       return Promise.reject(error);
//     }
//   );