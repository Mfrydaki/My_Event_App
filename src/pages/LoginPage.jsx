import React, { useState } from "react";
import LoginForm from "../ui/LoginForm";
import RegistrationForm from "../ui/RegistrationForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Log in
  const handleLogin = async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const token = res.data.token;

      if (token) {
        localStorage.setItem("token", token); // Αποθήκευση JWT
        alert("Επιτυχής σύνδεση!");
        navigate("/"); // Προώθηση στην αρχική σελίδα
      } else {
        alert("Δεν ελήφθη token από τον server");
      }
    } catch (err) {
      console.error("Login failed", err);
      alert("Λάθος email ή κωδικός");
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
      alert("Επιτυχής εγγραφή! Μπορείς τώρα να συνδεθείς.");
      setIsLogin(true); // μετά την εγγραφή δείχνει φόρμα login
    } catch (err) {
      console.log("Registration failed", err);
      alert("Αποτυχία εγγραφής");
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
