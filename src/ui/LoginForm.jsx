import { useState } from "react";
import PropTypes from "prop-types";

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
 * - User can toggle password visibility.
 * - On submit, calls `onLogin({ email, password })`.
 * - If fields are empty, shows an inline error message.
 *
 * Props
 * -----
 * onLogin : Function
 *   Callback that receives { email, password } and performs the login action.
 *
 * State
 * -----
 * email : String
 *   User email input.
 * password : String
 *   User password input.
 * error : String
 *   Error message if form validation fails.
 * showPassword : Boolean
 *   Whether the password is visible or hidden.
 *
 * Returns
 * -------
 * JSX.Element
 *   The login form with error handling and password toggle.
 */
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle form submission:
   * - Validates inputs
   * - Calls parent with credentials
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
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
      noValidate
    >
      <h2 className="text-xl font-bold mb-4">Sign in</h2>

      {/* Email input */}
      <input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      {/* Password input with toggle */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 pr-16"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-indigo-600 hover:underline"
          aria-pressed={showPassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Inline error (announced to screen readers) */}
      {error && (
        <p className="text-red-600 text-sm" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="inline-block rounded-2xl bg-indigo-400 px-6 py-3 text-sm font-semibold shadow-lg transition hover:bg-indigo-700"
      >
        Connect
      </button>
    </form>
  );
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
