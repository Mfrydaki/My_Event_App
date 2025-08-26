import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ✅ CRA uses REACT_APP_ prefix
});

// Request interceptor: attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 Unauthorized globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Unauthorized (401) — probably missing/expired token.");
      // Optional: clear session + redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
