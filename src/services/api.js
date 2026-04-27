import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  // baseURL: "https://hardware-backend-express.onrender.com/api",
  baseURL: "http://localhost:5100/api",
  timeout: 10000,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// PREVENT MULTIPLE SESSION TOASTS
let isSessionExpiredHandled = false;

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isSessionExpiredHandled) {
      isSessionExpiredHandled = true;

      console.log("Token expired or invalid");

      toast.error("Session expired. Please login again");

      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }

    return Promise.reject(error);
  },
);

export default api;
