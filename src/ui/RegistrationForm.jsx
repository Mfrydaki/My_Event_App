import { useState } from "react";

function RegistrationForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit =(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Wrong Password!");
      return;
    }
    onRegister({ email, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Sign up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      <button 
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Sign up
      </button>
    </form>
  );
}
export default RegistrationForm;
