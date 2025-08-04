import React, { useState } from "react";
import LoginForm from "../ui/LoginForm";
import RegistrationForm from "../ui/RegistrationForm";
import axios from "axios";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Log in
  const handleLogin = async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log("Successful log in:", res.data);
    } catch (err) {
      console.error("Log in failed", err);
    }
  };

  // Register
  const handleRegister = async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        email,
        password,
      });
      console.log("Welcome", res.data);
      setIsLogin(true); // after registration go to log in
    } catch (err) {
      console.log("Registration failed", err);
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
