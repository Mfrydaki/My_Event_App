import { useState } from "react";
import PropTypes from "prop-types";

/**
 * RegistrationForm Component
 *
 * Purpose
 * -------
 * Display a user registration form and submit credentials
 * (first name, last name, email, password) to the parent component.
 *
 * Behavior
 * --------
 * - User enters details.
 * - User can toggle password visibility.
 * - On submit:
 *   * If passwords do not match, show an error message.
 *   * Otherwise, call onRegister({ first_name, last_name, email, password }).
 *
 * Props
 * -----
 * onRegister : Function
 *   Callback invoked with the new user's data.
 *
 * Returns
 * -------
 * JSX.Element
 *   Registration form with basic validation and password toggle.
 */
function RegistrationForm({ onRegister }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handle form submission.
   * - Validates that passwords match.
   * - Trims fields and calls parent with the payload.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple required check (HTML 'required' also helps)
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Passwords must match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");

    onRegister({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      password, // keep as-is
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 bg-white p-6 rounded shadow"
      noValidate
    >
      <h2 className="text-xl font-bold mb-4">Sign up</h2>

      {/* First name */}
      <input
        type="text"
        name="first_name"
        autoComplete="given-name"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      {/* Last name */}
      <input
        type="text"
        name="last_name"
        autoComplete="family-name"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      {/* Email */}
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
          autoComplete="new-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 pr-16"
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-indigo-600 hover:underline"
          aria-pressed={showPassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Confirm password */}
      <input
        type={showPassword ? "text" : "password"}
        name="confirm_password"
        autoComplete="new-password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      {/* Inline error */}
      {error && (
        <p className="text-red-600 text-sm" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
      >
        Sign up
      </button>
    </form>
  );
}

RegistrationForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default RegistrationForm;
