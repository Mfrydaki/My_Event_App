import React, { useState } from "react";
import LoginForm from "../ui/LoginForm";
import RegistrationForm from "../ui/RegistrationForm";
import axios from "axios";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // "Log in"
  const handleLogin = async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      // "Save token to localStorage so the user stays logged in"
      localStorage.setItem("token", res.data.token);

      console.log("Successful log in:", res.data);
      alert("Successfully logged in!");
    } catch (err) {
      console.error("Log in failed", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  // "Register"
  const handleRegister = async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        email,
        password,
      });

      console.log("Welcome", res.data);
      alert("Registration successful! You can now log in.");
      setIsLogin(true); // "After registration, go to login"
    } catch (err) {
      console.log("Registration failed", err);
      alert("Registration failed. Please try again.");
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
