import axios from "axios";

/**
 * api (Axios instance)
 *
 * Purpose
 * -------
 * Provide a pre-configured Axios client for all API requests.
 *
 * Behavior
 * --------
 * - Uses process.env.REACT_APP_API_URL as the base URL.
 * - Request interceptor:
 *   * Attaches Authorization header if a JWT token exists in localStorage.
 * - Response interceptor:
 *   * If response status is 401 (Unauthorized), clears localStorage,
 *     and redirects the user to /login.
 *
 * Exports
 * -------
 * api : AxiosInstance
 *   Use this instance instead of axios directly.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
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

      // Clear session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
