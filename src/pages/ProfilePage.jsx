import { useEffect, useState } from "react";
import api from "../api";

/**
 * ProfilePage Component
 *
 * Purpose
 * -------
 * Display the authenticated user's profile and the list of events
 * they are attending.
 *
 * Behavior
 * --------
 * - On mount, fetches two endpoints in parallel:
 *   GET /auth/profile/              → returns user details
 *   GET /api/users/me/events/attending → returns attending events
 * - Requires a valid JWT token stored in localStorage ("token").
 * - If a request fails with 401, you can optionally redirect to /login.
 *
 * State
 * -----
 * profile : Object | null
 *   Authenticated user information (id, email, first_name, last_name, date_of_birth).
 *
 * events : Array
 *   List of attended events, each containing {id, title, date, description, image}.
 *
 * loading : Boolean
 *   True while fetching data.
 *
 * error : String
 *   Error message if fetching fails.
 *
 * Returns
 * -------
 * JSX.Element
 *   Renders the profile header and the list of attended events.
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setError("");
        setLoading(true);

        // Fetch profile + attended events in parallel
        const [profileRes, attendingRes] = await Promise.all([
          api.get("/auth/profile/"),
          api.get("/api/users/me/events/attending"),
        ]);

        if (!mounted) return;

        setProfile(profileRes.data.user);
        setEvents(attendingRes.data);
      } catch (err) {
        console.error("ProfilePage fetch error:", err);
        setError("Failed to load profile or attending events.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <p className="text-gray-700">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 py-8 px-4">
      {/* Profile header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold mb-1">My Profile</h1>
          <p className="text-gray-600">Email: {profile.email}</p>
          {(profile.first_name || profile.last_name) && (
            <p className="text-gray-600">
              Name: {profile.first_name} {profile.last_name}
            </p>
          )}
          {profile.date_of_birth && (
            <p className="text-gray-600">
              Date of Birth: {profile.date_of_birth}
            </p>
          )}
        </div>
      </div>

      {/* Attending events list */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Attending Events</h2>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-700">
              You have not attended any events yet.
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {events.map((event) => (
              <li
                key={event.id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                <div className="relative h-56 w-full">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={"Image for event: " + event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                  {event.description && (
                    <p className="text-gray-700 mt-2">{event.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
