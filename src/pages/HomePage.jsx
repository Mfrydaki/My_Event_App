import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * HomePage Component
 *
 * Purpose
 * -------
 * Render a grid of upcoming events fetched from the backend.
 * Serves as the landing page, showing users the latest events
 * in a visual, card-based layout.
 *
 * Behavior
 * --------
 * - On mount (useEffect), it sends a GET request to /events/.
 * - While loading, it shows a "Loading events…" message.
 * - If the request fails, it shows an error message.
 * - If successful, it displays a list of events as cards
 *   (image, title, date), each linking to its details page.
 *
 * State
 * -----
 * events : Array
 *   Stores the events returned from the backend.
 * loading : Boolean
 *   True while events are being fetched.
 * error : String
 *   Holds an error message if the request fails.
 *
 * Helpers
 * -------
 * isAbsoluteUrl(v : string) : boolean
 *   Check if a string is an absolute URL (starts with http/https).
 *
 * imgSrc(image : string) : string
 *   Return a usable image path (absolute URL or fallback /imgs/default.jpg).
 *
 * Returns
 * -------
 * JSX.Element
 *   - A loading indicator, or
 *   - An error message, or
 *   - A responsive list of event cards with title, date, and image.
 */
export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        const res = await api.get("/events/");
        if (!mounted) return;
        setEvents(res.data || []);
      } catch (e) {
        setError("Failed to load events.");
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  /**
   * Check if given string is an absolute URL.
   */
  const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

  /**
   * Resolve an image path.
   * - If empty, return default placeholder.
   * - If absolute URL, return as-is.
   * - Otherwise assume local /imgs/ path.
   */
  const imgSrc = (image) => {
    if (!image) return "/imgs/default.jpg";
    return isAbsoluteUrl(image) ? image : `/imgs/${image}`;
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center p-6 overflow-auto relative">
      <h2 className="text-4xl mb-6 text-gold">Upcoming Events</h2>

      {loading && <p className="text-white">Loading events…</p>}
      {error && <p className="text-red-200">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-6 mb-8 w-full max-w-xl">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-2xl shadow-md overflow-hidden bg-white transition-transform hover:scale-105 duration-300"
            >
              <Link to={`/events/${event.id}`} className="block">
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={imgSrc(event.image)}
                    alt={"Image for event: " + event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.date}</p>
                </div>
              </Link>
            </li>
          ))}

          {events.length === 0 && (
            <li className="text-white">No events yet.</li>
          )}
        </ul>
      )}
    </div>
  );
}
