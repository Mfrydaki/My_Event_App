// src/components/Navbar.js
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

/**
 * Navbar Component
 *
 * Purpose
 * -------
 * Render the top navigation bar of the app.
 *
 * Behavior
 * --------
 * - Displays "Home" link for everyone.
 * - Displays "Profile" and "My Events" links ONLY if authenticated.
 * - Shows "Login" button if not authenticated.
 * - Shows "Logout" button if authenticated.
 */
export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo (clickable link to homepage) */}
          <Link to="/" className="text-2xl font-bold">
            Marika
          </Link>

          {/* Right-side navigation links */}
          <div className="flex items-center gap-3">
            {/**
             * Conditional rendering:
             * "Profile"  only appear if authenticated.
             */}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="hover:bg-indigo-500 px-3 py-2 rounded"
                >
                  Profile
                </Link>
              </>
            )}

            {/* Authentication action: Login or Logout */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded"
              >
                Connect
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
