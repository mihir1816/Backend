import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const axiosInstance = axios.create({
  withCredentials: true,
});

// Start NProgress when a request is made
axiosInstance.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

// Complete NProgress when a response is received
axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);
