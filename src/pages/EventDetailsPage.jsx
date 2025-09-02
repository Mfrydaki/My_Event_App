import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * EventDetailsPage Component
 *
 * Purpose
 * -------
 * Display a single event with rich details and allow the user to
 * toggle attendance (Attend / Unattend).
 *
 * Behavior
 * --------
 * - On mount and when `id` changes:
 *   - Fetches the event via GET /events/:id/?_={cache_bust}.
 *   - Determines if the current user is attending (from response or JWT).
 * - Provides actions to:
 *   - POST /events/:id/attend/
 *   - POST /events/:id/unattend/
 * - Handles loading, error, and not-found states with user feedback.
 *
 * Data Flow
 * ---------
 * - Reads JWT from localStorage ("token") when performing protected actions.
 * - Re-fetches the event after attend/unattend to keep UI in sync.
 *
 * UI
 * --
 * - Full-bleed background with a centered card layout.
 * - Cover image (16:9), title, date, description/details.
 * - Attend/Unattend button, attendees counter, and Back link.
 *
 * Routing
 * -------
 * - Expects a route param `:id` (Mongo ObjectId string or numeric id).
 *
 * Returns
 * -------
 * JSX.Element
 *   The event details page with actions and status handling.
 */

/**
 * Check if a string looks like an absolute URL.
 *
 * @param {unknown} v - Value to check.
 * @returns {boolean} True if it's a string starting with http/https.
 */
function isAbsoluteUrl(v) {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}

/**
 * Normalize an image source.
 * - If falsy, returns a local default.
 * - If absolute URL, returns as is.
 * - Otherwise, assumes filename under /imgs/.
 *
 * @param {string|undefined|null} image - Image path or URL.
 * @returns {string} A usable src for <img>.
 */
function imgSrc(image) {
  return !image
    ? "/imgs/default.jpg"
    : isAbsoluteUrl(image)
    ? image
    : `/imgs/${image}`;
}

/**
 * Decode a JWT from localStorage and try to extract a user id.
 *
 * @returns {string|null} User id if present, otherwise null.
 */
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return (
      String(payload?.user?.id ?? payload?.user_id ?? payload?.sub ?? "") ||
      null
    );
  } catch {
    return null;
  }
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  /** @type {[any, Function]} */
  const [event, setEvent] = useState(null);
  /** @type {[boolean, Function]} */
  const [attending, setAttending] = useState(false);
  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(true);
  /** @type {[boolean, Function]} */
  const [saving, setSaving] = useState(false);
  /** @type {[string, Function]} */
  const [error, setError] = useState("");

  /**
   * Fetch the event once on mount / whenever id changes.
   *
   * GET
   * ---
   * /events/:id/?_={cache_bust}
   */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError("");
        setLoading(true);

        const res = await api.get(`/events/${encodeURIComponent(id)}/`, {
          params: { _: Date.now() }, // cache-bust to avoid stale CDN/browser cache
        });

        if (!mounted) return;

        const ev = res.data;
        setEvent(ev);

        // Determine "attending" boolean:
        if (typeof ev?.attending === "boolean") {
          setAttending(ev.attending);
        } else {
          const uid = getUserIdFromToken();
          const attendees = Array.isArray(ev?.attendees)
            ? ev.attendees.map(String)
            : [];
          setAttending(uid ? attendees.includes(uid) : false);
        }
      } catch (e) {
        setError(
          e?.response?.data?.error || e?.message || "Failed to load event."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * Re-fetch the current event (used after attend/unattend).
   *
   * @returns {Promise<void>}
   */
  async function refetch() {
    const res = await api.get(`/events/${encodeURIComponent(id)}/`, {
      params: { _: Date.now() },
    });
    const ev = res.data;
    setEvent(ev);

    if (typeof ev?.attending === "boolean") {
      setAttending(ev.attending);
    } else {
      const uid = getUserIdFromToken();
      const attendees = Array.isArray(ev?.attendees)
        ? ev.attendees.map(String)
        : [];
      setAttending(uid ? attendees.includes(uid) : false);
    }
  }

  /**
   * Attend the event.
   *
   * POST
   * ----
   * /events/:id/attend/
   *
   * Side effects
   * ------------
   * - Requires JWT token in localStorage ("token").
   * - On 401, navigates to /login with "from" state.
   */
  async function handleAttend() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to connect.");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    try {
      setSaving(true);
      await api.post(`/events/${encodeURIComponent(id)}/attend/`, {});
      await refetch();
      alert("You're going 💪");
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) {
        alert("Please sign in to connect.");
        navigate("/login", { state: { from: `/events/${id}` } });
      } else if (s === 409) {
        alert("Already attending.");
        await refetch();
      } else {
        alert(e?.response?.data?.error || "Sorry. Failed to attend.");
      }
    } finally {
      setSaving(false);
    }
  }

  /**
   * Unattend the event.
   *
   * POST
   * ----
   * /events/:id/unattend/
   *
   * Side effects
   * ------------
   * - Requires JWT token in localStorage ("token").
   * - On 401, navigates to /login with "from" state.
   */
  async function handleUnattend() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to connect.");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    try {
      setSaving(true);
      await api.post(`/events/${encodeURIComponent(id)}/unattend/`, {});
      await refetch();
      alert("You left this event 👋");
    } catch (e) {
      const s = e?.response?.status;
      if (s === 401) {
        alert("Please sign in to connect.");
        navigate("/login", { state: { from: `/events/${id}` } });
      } else if (s === 409) {
        alert("You are not attending this event.");
        await refetch();
      } else {
        alert(e?.response?.data?.error || "Failed to unattend.");
      }
    } finally {
      setSaving(false);
    }
  }

  // --- Render states ---
  if (loading) {
    return <div className="min-h-screen p-6">Loading…</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 text-red-600 bg-[#0c0a09]">
        {error}{" "}
        <button
          className="underline"
          onClick={() =>
            window.history.length > 1 ? navigate(-1) : navigate("/events")
          }
        >
          Go back
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen p-6 bg-[#0c0a09]">Event not found.</div>
    );
  }

  // Derived values
  const attendeesCount = Number(
    Array.isArray(event?.attendees)
      ? event.attendees.length
      : event?.attendees_count || 0
  );

  // --- Main view ---
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      {/* Background */}
      <img
        src="/imgs/img1.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Optional overlay for contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content card */}
      <div className="mt-16 relative z-10 max-w-3xl w-full mx-auto rounded-2xl shadow overflow-hidden bg-[#1a1a1f]">
        {/* Cover image (fixed aspect ratio) */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <img
            src={`${imgSrc(event?.image)}${
              event?.updated_at
                ? `?v=${encodeURIComponent(event.updated_at)}`
                : ""
            }`}
            alt={`Image for event: ${event?.title || "Event"}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <h1 className="text-2xl font-bold">{event?.title}</h1>
            {event?.date && <p className="opacity-90">{event.date}</p>}
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            About this event:
          </h2>

          {event?.description || event?.details ? (
            <>
              {event?.description && (
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              )}
              {event?.details && (
                <p className="text-gray-400 leading-relaxed whitespace-pre-line mt-2">
                  {event.details}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400">No description available yet.</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            {attending ? (
              <button
                type="button"
                disabled={saving}
                className="px-5 py-2.5 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                onClick={handleUnattend}
              >
                {saving ? "Leaving…" : "Unattend"}
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                className=" px-5 py-2.5 rounded border border-indigo-600 text-gray-300 hover:bg-gray-800"
                onClick={handleAttend}
              >
                {saving ? "Joining…" : "Attend"}
              </button>
            )}

            <span className="text-sm text-gray-400">
              {attendeesCount} {attendeesCount === 1 ? "person" : "people"}{" "}
              attending
            </span>

            <Link
              to="/events"
              className="ml-auto px-5 py-2.5 rounded border border-indigo-600 text-gray-300 hover:bg-gray-800"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
