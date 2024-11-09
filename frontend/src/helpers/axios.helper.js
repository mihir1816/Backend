import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";
import "axios-progress-bar/dist/nprogress.css";

// const baseURL = "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  withCredentials: true,
});

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

loadProgressBar({}, axiosInstance);