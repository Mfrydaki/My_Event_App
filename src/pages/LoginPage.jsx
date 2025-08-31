// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoginForm from "../ui/LoginForm";
import RegistrationForm from "../ui/RegistrationForm";

/**
 * LoginPage Component
 *
 * Purpose
 * -------
 * Handle user authentication (login & registration).
 *
 * Behavior
 * --------
 * - Toggles between login form and registration form.
 * - On login:
 *   - Sends credentials { email, password } to /auth/login/.
 *   - Saves JWT access token in localStorage.
 *   - Saves user object (if returned).
 *   - Dispatches "storage" event to sync authentication across tabs.
 *   - Navigates user to homepage ("/").
 * - On register:
 *   - Sends new user data { first_name, last_name, email, password } to /auth/register/.
 *   - If successful, switches back to login form.
 * - Shows error message if backend responds with error.
 *
 * State
 * -----
 * isLogin : Bool
 *   If true, show login form; if false, show registration form.
 * error : String
 *   Error message to display if login/register fails.
 *
 * Returns
 * -------
 * JSX.Element
 *   The authentication page with login/registration forms.
 */
function LoginPage() {
  // State: whether user is on Login (true) or Register (false)
  const [isLogin, setIsLogin] = useState(true);

  // State: error message (shown under form)
  const [error, setError] = useState("");

  // React Router navigation
  const navigate = useNavigate();

  /**
   * Handle user login.
   *
   * @param {Object} payload - User credentials.
   * @param {string} payload.email - User email.
   * @param {string} payload.password - User password.
   */
  const handleLogin = async ({ email, password }) => {
    try {
      setError("");

      // POST to backend
      const res = await api.post(
        "/auth/login/",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { access, user } = res.data || {};
      if (!access) throw new Error("No access token returned from server.");

      // Save token & user in localStorage
      localStorage.setItem("token", access);
      window.dispatchEvent(new Event("storage")); // sync across tabs
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Redirect to homepage
      navigate("/");
    } catch (err) {
      // Show error message
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          err?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  /**
   * Handle new user registration.
   *
   * @param {Object} payload - Registration data.
   * @param {string} payload.first_name - User's first name.
   * @param {string} payload.last_name - User's last name.
   * @param {string} payload.email - User email.
   * @param {string} payload.password - User password.
   */
  const handleRegister = async (payload) => {
    try {
      setError("");

      console.log("PAYLOAD:", payload, typeof payload);
      console.log("JSON →", JSON.stringify(payload));

      // POST to backend
      const res = await api.post("/auth/register/", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("REGISTER OK:", res.data);

      // Switch back to login form after success
      setIsLogin(true);
    } catch (err) {
      console.log("REGISTER ERROR STATUS:", err?.response?.status);
      console.log("REGISTER ERROR BODY:", err?.response?.data);

      // Show error message
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <img
        src="/imgs/login.jpg"
        alt="login image"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className=" text-black relative z-10  backdrop-blur-md p-6 rounded shadow-md w-full max-w-md mx-4">

        {/* Show login or registration form */}
        {isLogin ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <RegistrationForm onRegister={handleRegister} />
        )}

        {/* Show error if exists */}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        {/* Toggle login/register */}
        <p className="mt-4 text-center text-sm text-black">
          {isLogin ? "New in Shero_hub" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-black font-semibold hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
