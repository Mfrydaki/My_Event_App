import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * HomePage
 *
 * Purpose
 * -------
 * Render a grid of upcoming events from the backend.
 *
 * Behavior
 * --------
 * - GET /events/ on mount.
 * - Renders Tailwind cards (image, title, date).
 */
export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);
  const imgSrc = (image) => {
    if (!image) return "/imgs/default.jpg"; 
    return isAbsoluteUrl(image) ? image : `/imgs/${image}`; 
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center p-6 overflow-auto relative">
      {/* <Link
        to="/login"
        className="absolute top-6 right-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Sign in
      </Link> */}

      {/* <h1 className="text-3xl font-bold mb-2 text-gold">Welcome!</h1> */}
      <h2 className="text-4xl mb-6 text-gold ">Upcoming Events</h2>

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
