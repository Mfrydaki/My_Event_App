import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

/**
 * AuthContext
 *
 * Purpose
 * -------
 * - Provides authentication state and functions to all components.
 * - Replaces isolated hooks so that the whole app shares the same auth state.
 *
 * Behavior
 * --------
 * - Stores JWT token in React state and localStorage.
 * - Exposes login/logout functions for any component to use.
 * - Derives `isAuthenticated` from the presence of a token.
 * - Listens to localStorage changes (multi-tab sync).
 *
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 *
 * Purpose
 * -------
 * - Wraps the entire application.
 * - Makes `AuthContext` available so all components can access
 *   authentication state and login/logout methods.
 *
 * Props
 * -----
 * - children: React nodes that will have access to the AuthContext.
 */
export function AuthProvider({ children }) {
    
  /** JWT token stored in state (null if no token exists). */
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  /** Flag indicating whether a login request is currently in progress. */
  const [loading, setLoading] = useState(false);

  /**
   * login
   *
   * Sends a POST request to the backend with email & password.
   * On success:
   * - Saves the JWT in localStorage.
   * - Updates the local React state (token).
   *
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{ok: boolean, error?: string}>}
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login/", { email, password });

      // Expected backend response: { access: "JWT_TOKEN" }
      const access = res?.data?.access;
      if (!access) throw new Error("No access token in response");

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
   * logout
   *
   * Removes the JWT from localStorage and clears the state.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  /**
   * Effect: synchronize token across tabs.
   *
   * If the token changes in another browser tab,
   * update the local state here as well.
   */
  useEffect(() => {
    const handler = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /** Derived value: true if a token exists. */
  const isAuthenticated = useMemo(() => !!token, [token]);

  /** Pack all exposed values into a single object. */
  const value = useMemo(
    () => ({ login, logout, isAuthenticated, loading, token }),
    [login, logout, isAuthenticated, loading, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
