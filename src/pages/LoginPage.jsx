import React, { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      console.log("Logged in with:", response.data);
    } catch (error) {
      console.error("Log in failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-950 to-indigo-300 animate-gradient">
      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-lg shadow-md w-full max-w-md space-y-4 "
      >
        <h2 className="text-2xl font-bold text-center mb-4">Log in!</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-slate-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-200"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-slate-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-200"
        />
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded transition duration-200 hover:bg-purple-600"
        >
          Connect
        </button>
      </form>
    </div>
  );
}
