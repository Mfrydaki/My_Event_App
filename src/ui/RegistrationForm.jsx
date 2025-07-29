import { useState } from "react";

export default function RegistrationForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Οι κωδικοί δεν ταιριάζουν!");
      return;
    }
    onRegister({ email, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Εγγραφή</h2>

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
        placeholder="Κωδικός"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        placeholder="Επιβεβαίωση Κωδικού"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Εγγραφή
      </button>
    </form>
  );
}
