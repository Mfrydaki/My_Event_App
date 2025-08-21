import { useState } from "react";

/**
 * LoginForm Component
 *
 * Purpose
 * -------
 * Display a login form and submit user credentials (email + password)
 * to the parent component.
 *
 * Behavior
 * --------
 * - User enters email and password.
 * - On submit, call the onLogin function passed via props.
 * - If fields are empty, show an error message.
 *
 * Props
 * -----
 * onLogin : Function
 * Callback function that receives { email, password }.
 *
 * State
 * -----
 * email : String
 * User email input.
 * password : String
 * User password input.
 * error : String
 * Error message if form validation fails.
 *
 * Returns
 * -------
 * JSX.Element
 *  The login form with error handling.
 */
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    onLogin({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Sign in</h2>

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

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Sign in
      </button>
    </form>
  );
}

export default LoginForm;
