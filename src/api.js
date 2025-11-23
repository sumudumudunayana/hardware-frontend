import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Adjust if your backend uses a different path
});

export default api;
