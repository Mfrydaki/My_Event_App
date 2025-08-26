import { useCallback, useMemo, useState } from "react";
import api from "../services/api";

export default function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login/", { email, password });
      const token = res?.data?.access;
      if (!token) throw new Error("No access token in response");
      localStorage.setItem("token", token);
      return { ok: true };
    } catch (e) {
      console.error(e);
      return { ok: false, error: "Invalid credentials or server error." };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
  }, []);

  const isAuthenticated = useMemo(() => !!localStorage.getItem("token"), []);

  return { login, logout, isAuthenticated, loading };
}
