// src/pages/EventsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * EventsPage
 * ----------
 * List all events fetched from the backend.
 *
 * Behavior
 * --------
 * - On mount, performs GET /events/ (with a small cache-busting param).
 * - Handles loading, error, and empty states.
 * - Renders event cards with thumbnail, title, optional description/date.
 * - Each card links to /events/:id (id | _id | _id.$oid supported).
 *
 * State
 * -----
 * events : Array<object>
 * loading : boolean
 * error : string
 *
 * Returns
 * -------
 * JSX.Element
 *   The events listing page.
 */

/** Resolve a stable id from common SQL/Mongo shapes. */
function getEventId(ev) {
  return ev?.id || ev?._id?.$oid || ev?._id || null;
}

/** Is value an absolute http(s) URL? */
function isAbsoluteUrl(v) {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}

/** Normalize image src (default | absolute | /imgs/<file>). */
function imgSrc(image) {
  return !image
    ? "/imgs/default.jpg"
    : isAbsoluteUrl(image)
    ? image
    : `/imgs/${image}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * loadEvents
     * ----------
     * GET /events/?_={cache_bust}
     * Accept arrays or wrapped payloads: {results:[...]}, {data:[...]}.
     */
    const loadEvents = async () => {
      try {
        setError("");
        const res = await api.get("/events/", { params: { _: Date.now() } });
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.results)
          ? raw.results
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        setEvents(list);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.detail ||
            err?.message ||
            "Failed to load events."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Render states
  if (loading) return <p className="p-6 text-center">Loading events…</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <section className="relative min-h-screen">
      {/* Background image */}
      <img
        src="/imgs/events.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Optional dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Events:</h2>

        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((ev, i) => {
              const id = getEventId(ev);
              const linkId = id ? encodeURIComponent(String(id)) : "";
              const dateStr =
                ev?.date &&
                new Date(ev.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });

              return (
                <li
                  key={id || i}
                  className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                >
                  <Link
                    to={id ? `/events/${linkId}` : "#"}
                    className="flex gap-4 p-4 hover:bg-white/10 transition"
                  >
                    {/* Thumbnail */}
                    <div className="w-32 h-20 shrink-0 rounded-md overflow-hidden bg-black/20">
                      <img
                        src={imgSrc(ev?.image)}
                        alt={
                          ev?.title ? `Image for ${ev.title}` : "Event image"
                        }
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Texts */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold truncate">
                        {ev?.title || "Event"}
                      </h3>

                      {ev?.description && (
                        <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                          {ev.description}
                        </p>
                      )}

                      {dateStr && (
                        <p className="text-xs text-gray-300 mt-2">{dateStr}</p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
