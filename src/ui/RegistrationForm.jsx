import { useState } from "react";

/**
 * RegistrationForm Component
 *
 * Purpose
 * -------
 * Display a user registration form and submit credentials
 * (email + password) to the parent component.
 *
 * Behavior
 * --------
 * - User enters email, password, confirm password.
 * - On submit:
 *   * If passwords do not match, show an error message.
 *   * Otherwise, call the onRegister function passed via props.
 *
 * Props
 * -----
 * onRegister : Function
 * Callback function that receives { email, password }.
 *
 * State
 * -----
 * email : String
 * User email input.
 * password : String
 * User password input.
 * confirmPassword : String
 * User confirmation password input.
 * error : String
 * Error message for mismatched passwords.
 *
 * Returns
 * -------
 * JSX.Element
 *     The registration form.
 */
function RegistrationForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    onRegister({ email, password });
  };

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

      {error && <p className="text-red-600 text-sm">{error}</p>}

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
