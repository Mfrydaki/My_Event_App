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
 * Provide authentication state and helpers (login, logout) to the whole app.
 *
 * Behavior
 * --------
 * - Stores the JWT token in state + localStorage.
 * - Optionally fetches and stores a `user` object after login.
 * - Derives `isAuthenticated` from the presence of a token.
 * - Listens to `storage` events to sync auth across tabs.
 *
 * Exposed API
 * -----------
 * {
 *   token: string|null,
 *   user: object|null,
 *   isAuthenticated: boolean,
 *   loading: boolean,
 *   login(email, password): Promise<{ok:boolean, error?:string}>,
 *   logout(): void,
 *   refreshProfile(): Promise<void>
 * }
 */
export const AuthContext = createContext(null);

/**
 * AuthProvider Component
 *
 * Purpose
 * -------
 * Wrap the application and make the auth state available via context.
 *
 * Props
 * -----
 * children: ReactNode
 *   The subtree that should have access to the AuthContext.
 */
export function AuthProvider({ children }) {
  /** JWT token (null if absent) */
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  /** Authenticated user object (null if unknown) */
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  /** Whether an auth-related request is in progress */
  const [loading, setLoading] = useState(false);

  /**
   * refreshProfile
   *
   * Fetch the current user's profile from the backend and persist it.
   * Safe to call after login or on app start if token exists.
   */
  const refreshProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await api.get("/auth/profile/");
      const nextUser = res?.data?.user || res?.data || null;
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser || {}));
    } catch {
      // If profile fetch fails (e.g., expired token), leave user as-is;
      // axios interceptor may handle 401 global redirect.
    }
  }, [token]);

  /**
   * login
   *
   * POST credentials to backend; on success, save token and load profile.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ok: boolean, error?: string}>}
   */
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const res = await api.post("/auth/login/", { email, password });
        const access = res?.data?.access;
        if (!access) throw new Error("No access token in response");

        localStorage.setItem("token", access);
        setToken(access);

        // (Optional) if backend returns user here, you can set it directly:
        const maybeUser = res?.data?.user;
        if (maybeUser) {
          setUser(maybeUser);
          localStorage.setItem("user", JSON.stringify(maybeUser));
        } else {
          // Otherwise, fetch profile
          await refreshProfile();
        }

        // Same-tab sync hook (optional, pairs with your existing usage)
        window.dispatchEvent(new Event("storage"));
        return { ok: true };
      } catch (e) {
        console.error(e);
        return { ok: false, error: "Invalid credentials or server error." };
      } finally {
        setLoading(false);
      }
    },
    [refreshProfile]
  );

  /**
   * logout
   *
   * Clear token and user from both state and localStorage.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    // Same-tab sync (optional)
    window.dispatchEvent(new Event("storage"));
  }, []);

  /**
   * Effect: on first mount, if a token exists, try to hydrate user.
   */
  useEffect(() => {
    if (token && !user) {
      // Best-effort: fetch profile once to populate user
      refreshProfile();
    }
  }, [token, user, refreshProfile]);

  /**
   * Effect: keep token in sync across tabs (and with same-tab custom event)
   */
  useEffect(() => {
    const handler = () => {
      const t = localStorage.getItem("token");
      setToken(t);
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  /** Derived flag: authenticated if a token is present */
  const isAuthenticated = useMemo(() => !!token, [token]);

  /** Context value (stable shape) */
  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      refreshProfile,
    }),
    [token, user, isAuthenticated, loading, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
