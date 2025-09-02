import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

/**
 * EventsPage Component
 *
 * Purpose
 * -------
 * Render a list of events as clickable cards that link to each event's details page.
 *
 * Behavior
 * --------
 * - On mount, fetches events via GET /events/ and stores them in local state.
 * - Each card shows the event's image, title, formatted date, and attendees_count.
 * - Handles loading and error states gracefully.
 *
 * Data Contract
 * -------------
 * Backend returns an array of events with:
 * { id, title, date, image, attendees_count }.
 *
 * Image Handling
 * --------------
 * `image` may be:
 * - Base64 data URL ("data:image/png;base64,...")
 * - Full http(s) URL
 * - Absolute path ("/imgs/...") or a simple filename ("event1.jpg")
 * Use `resolveImageSrc()` so all cases work consistently.
 *
 * Returns
 * -------
 * JSX.Element
 *   A full-page background with a vertical list of event cards.
 */

const resolveImageSrc = (img) => {
  if (!img) return "/imgs/placeholder.jpg";
  const s = String(img);
  if (s.startsWith("data:")) return s; // Base64 data URL
  if (s.startsWith("http")) return s; // external URL
  if (s.startsWith("/")) return s; // absolute path in public
  return `/imgs/${s}`; // simple filename -> public/imgs/
};

const formatEventDate = (s) => {
  if (!s) return "—";
  const norm = String(s).trim().replace(/[\/.]/g, "-"); // 2026/10/10 -> 2026-10-10
  const parts = norm.split("-");
  if (parts.length !== 3) return s;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return s;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setError("");
        const res = await api.get("/events/");
        if (!mounted) return;
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(
          "GET /events/ error:",
          err?.response?.status,
          err?.response?.data
        );
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.detail ||
            "Failed to fetch events."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-white/80">
        Loading events…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imgs/events.jpg')" }}
    >
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {events.length === 0 && (
            <p className="text-white/70">No events yet.</p>
          )}

          {events.map((ev) => (
            <Link
              key={ev.id}
              to={`/events/${ev.id}`}
              // ίδια κάρτα με gradient + border
              className="block rounded-2xl bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-white/40 p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={resolveImageSrc(ev.image)} // ✅ image handling
                  alt={`Image for ${ev.title}`}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "/imgs/placeholder.jpg";
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {ev.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-white/80">
                    {formatEventDate(ev.date)} {/* ✅ date formatting */}
                  </p>
                  {typeof ev.attendees_count === "number" && (
                    <p className="text-xs text-white/70 mt-1">
                      {ev.attendees_count} attending
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
