import React, { useState } from "react";
import LoginForm from "../ui/LoginForm";
import RegistrationForm from "../ui/RegistrationForm";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

/**
 * LoginPage Component
 *
 * Purpose
 * -------
 * Handle user authentication (login & registration).
 *
 * Behavior
 * --------
 * - Provides a toggle between login form and registration form.
 * - On login, sends a POST request to /auth/login/ with email & password.
 * If successful:
 * Saves the JWT access token to localStorage (key: "access").
 * Saves the user object to localStorage (key: "user").
  * Redirects to the /events page.
 * - On registration, sends a POST request to /auth/register/ with email & password.
 *   If successful:
 * Switches back to the login form.
 *
 * State
 * -----
 * isLogin : Boolean
 * Determines whether to show the login form or the registration form.
 * error : String
 * Holds an error message if login or registration fails.
 *
 * Returns
 * -------
 * JSX.Element
 * The login or registration form with error handling.
 */
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * handleLogin
   *
   * Send credentials to the backend to log in the user.
   * On success, store JWT + user in localStorage and redirect.
   */
  const handleLogin = async ({ email, password }) => {
    try {
      setError("");
      const res = await api.post("/auth/login/", { email, password });
      const { access, user } = res.data;

      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/profile");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    }
  };

  /**
   * handleRegister
   *
   * Send credentials to the backend to register a new user.
   * On success, switch to login form.
   */
  const handleRegister = async ({ email, password }) => {
    try {
      setError("");
      await api.post("/auth/register/", { email, password });
      setIsLogin(true);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-950 to-indigo-300 animate-gradient">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {isLogin ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegistrationForm onRegister={handleRegister} />
        )}

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "New in AP?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-indigo-600 font-semibold hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
