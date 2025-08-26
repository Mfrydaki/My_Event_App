import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * EventDetailsPage
 *
 * Purpose
 * -------
 * Fetch and display a single event by id from the backend (title, date, description, image).
 *
 * Behavior
 * --------
 * - Reads :id from route params.
 * - GET /events/:id/ to fetch event.
 * - POST /events/:id/attend/ on "Attend" click (requires JWT).
 */
export default function EventDetailsPage() {
  const { id } = useParams(); // Mongo ObjectId string
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * Helper: check if a string is an absolute URL
   */
  const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

  /**
   * Helper: resolve image source (absolute URL or local /imgs/* fallback)
   */
  const imgSrc = (image) => {
    if (!image) return "/imgs/default.jpg"; // fallback image in public/imgs
    return isAbsoluteUrl(image) ? image : `/imgs/${image}`;
  };

  /**
   * Load event on mount or when id changes
   */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await api.get(`/events/${id}/`);
        if (!mounted) return;
        setEvent(res.data);
      } catch (e) {
        setError(e?.response?.data?.error || "Failed to load event.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  /**
   * Handle "Attend" click
   * - Requires JWT token in localStorage (key: "token").
   * - Uses axios instance (api) which should attach Authorization automatically (interceptor).
   * - On success, shows a toast/alert and refreshes the event.
   */
  async function handleAttend() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please sign in first.");
        navigate("/login");
        return;
      }
      setSaving(true);
      await api.post(`/events/${id}/attend/`, {}); // Authorization header via interceptor
      // Re-fetch to reflect any updated fields (e.g., attendees count)
      const res = await api.get(`/events/${id}/`);
      setEvent(res.data);
      alert("You're attending this event!");
    } catch (e) {
      const msg =
        e?.response?.status === 401
          ? "Unauthorized. Please sign in again."
          : e?.response?.data?.error || "Failed to attend.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <div className="min-h-screen p-6 text-white">Loading…</div>;

  if (error)
    return (
      <div className="min-h-screen p-6 text-red-200">
        {error}{" "}
        <button className="underline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );

  if (!event)
    return <div className="min-h-screen p-6 text-white">Event not found.</div>;

  const text =
    event.description ?? event.details ?? "No description available yet.";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto rounded-2xl shadow overflow-hidden bg-white/85 backdrop-blur">
        <div className="relative h-80 w-full overflow-hidden">
          <img
            src={imgSrc(event.image)}
            alt={"Image for event: " + event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="opacity-90">{event.date}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">About this event</h2>
          <p className="text-gray-800 leading-relaxed">{text}</p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              onClick={handleAttend}
            >
              {saving ? "Joining…" : "Attend"}
            </button>

            <Link
              to="/"
              className="px-5 py-2.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
