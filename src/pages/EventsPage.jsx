// src/pages/EventsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * EventsPage Component
 *
 * Purpose
 * -------
 * Fetch and display a list of events from the backend.
 *
 * Behavior
 * --------
 * - On mount (useEffect), it sends a GET request to /events/
 *   using the axios instance (api.js).
 * - While fetching, it shows a "Loading" message.
 * - If the request fails, it shows an error message.
 * - If successful, it displays the list of events.
 *
 * State
 * -----
 * events : Array
 *   Stores the events returned from the backend.
 * loading : Boolean
 *   True while events are being loaded.
 * error : String
 *   Holds an error message if the request fails.
 *
 * Returns
 * -------
 * JSX.Element
 *   The rendered events list or loading/error messages.
 */
function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * loadEvents
     *
     * Fetch events from the backend.
     *
     * Sends a GET request to /events/ and updates state
     * with the results, or shows an error message.
     */
    const loadEvents = async () => {
      try {
        setError("");
        const res = await api.get("/events/");
        setEvents(res.data || []);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.detail ||
            "Failed to load events."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((ev) => (
            <li key={ev.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">
                {/* Make title clickable without changing visual design */}
                <Link
                  to={`/events/${ev.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {ev.title}
                </Link>
              </h3>

              {ev.description && (
                <p className="text-gray-700">{ev.description}</p>
              )}

              <p className="text-sm text-gray-500">{ev.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventsPage;
