import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

/**
 * useAuth hook
 *
 * Purpose
 * -------
 * Manage authentication state (login, logout, token storage).
 *
 * Behavior
 * --------
 * - Keeps JWT token in React state and localStorage.
 * - Provides functions to login and logout.
 * - Keeps `isAuthenticated` in sync when the token changes.
 * - Listens to storage events (multi-tab sync).
 *
 * Returns
 * -------
 * {
 *   login: Function,        // perform login with email & password
 *   logout: Function,       // clear token and logout
 *   isAuthenticated: Bool,  // true if a token exists
 *   loading: Bool,          // true while login request is in progress
 *   token: String|null      // current token or null
 * }
 */
export default function useAuth() {
  // State: JWT token and loading flag
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  /**
   * Sync token from localStorage into state.
   * Useful if token changes outside this hook (e.g. in another tab).
   */
  const syncAll = useCallback(() => {
    const current = localStorage.getItem("token");
    setToken(current);
  }, []);

  /**
   * Login with email and password.
   * Sends request to backend and saves token if successful.
   *
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{ok: boolean, error?: string}>}
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login/", { email, password });

      // The backend should return { access: "JWT_TOKEN" }
      const access = res?.data?.access;
      if (!access) throw new Error("No access token in response");

      // Save token in localStorage and React state
      localStorage.setItem("token", access);
      setToken(access);

      return { ok: true };
    } catch (e) {
      console.error(e);
      return { ok: false, error: "Invalid credentials or server error." };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout by removing token from storage and state.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  /**
   * Effect: listen for storage changes (multi-tab support).
   * If token changes in another tab, update local state here.
   */
  useEffect(() => {
    const handler = () => syncAll();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [syncAll]);

  /**
   * Derived value: true if token exists
   */
  const isAuthenticated = useMemo(() => !!token, [token]);

  // Return API of the hook
  return { login, logout, isAuthenticated, loading, token };

  
}
