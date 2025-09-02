import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * Navbar
 *
 * Purpose
 * -------
 * Top navigation bar with auth-aware actions.
 *
 * Behavior
 * --------
 * - Reads JWT token from localStorage to determine authentication.
 * - Listens to "storage" events to sync auth status across tabs/windows.
 * - If authenticated:
 *    - On /profile page: show "Create your event" (to /create).
 *    - On any other page: show "Profile" (to /profile).
 *    - Always show "Logout" button.
 * - If not authenticated:
 *    - Show "Login" link.
 *
 * Returns
 * -------
 * JSX.Element
 *   The navigation bar.
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(Boolean(localStorage.getItem("token")));

  // Keep auth state in sync when token changes elsewhere
  useEffect(() => {
    const onStorage = () => setAuthed(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // notify other tabs
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  }

  const onProfilePage = location.pathname.startsWith("/profile");

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-white font-semibold tracking-wide">
          ..:: Shero_hub ::..
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {!authed ? (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border
                text-white
                hover:text-white transition"
            >
              Login
            </Link>
          ) : (
            <>
              {onProfilePage ? (
                <Link
                  to="/create"
                  className="px-2 py-2 rounded-lg border
                text-white
                hover:text-white transition"
                >
                  Create your event
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="px-2 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
                >
                  Profile
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="px-2 py-2 rounded-lg border
                text-white
                hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}