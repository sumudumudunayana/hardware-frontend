import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:5500/api"
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 FLAG TO PREVENT MULTIPLE ALERTS
let isSessionExpiredHandled = false;

// ✅ RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401 && !isSessionExpiredHandled) {
      isSessionExpiredHandled = true;

      console.log("Token expired or invalid");

      // 🔔 Show toast ONLY ONCE
      toast.error("Session expired. Please login again");

      // ❌ Remove token
      localStorage.removeItem("token");

      // 🔁 Delay redirect slightly (so user sees toast)
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default api;