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
 * - GET /events/:id/ to fetch event (expects attendees_count and optionally attending).
 * - POST /events/:id/attend/ on "Attend" click (requires JWT).
 * - POST /events/:id/unattend/ on "Unattend" click (requires JWT).
 */
export default function EventDetailsPage() {
  const { id } = useParams(); // Mongo ObjectId
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [attending, setAttending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Helper: absolute URL?
  const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

  // Helper: resolve image path
  const imgSrc = (image) => {
    if (!image) return "/imgs/default.jpg";
    return isAbsoluteUrl(image) ? image : `/imgs/${image}`;
  };

  // (Optional) fallback: get user id from JWT payload (client-side decode; UI only)
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

  // Fetch event (and attending flag) on mount / id change
  useEffect(() => {
    let mounted = true;

    async function fetchEvent() {
      try {
        setError("");
        setLoading(true);
        const res = await api.get(`/events/${id}/`);
        if (!mounted) return;

        const ev = res.data;
        setEvent(ev);

        // 1) If backend returns attending, use it
        if (typeof ev.attending === "boolean") {
          setAttending(ev.attending);
        } else {
          // 2) Fallback: infer from attendees array (if present)
          const uid = getUserIdFromToken();
          const attendees = Array.isArray(ev?.attendees)
            ? ev.attendees.map(String)
            : [];
          setAttending(uid ? attendees.includes(uid) : false);
        }
      } catch (e) {
        setError(e?.response?.data?.error || "Failed to load event.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchEvent();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Simple refetch helper (keeps everything in sync with server)
  async function refetch() {
    const res = await api.get(`/events/${id}/`);
    const ev = res.data;
    setEvent(ev);
    if (typeof ev.attending === "boolean") {
      setAttending(ev.attending);
    } else {
      const uid = getUserIdFromToken();
      const attendees = Array.isArray(ev?.attendees)
        ? ev.attendees.map(String)
        : [];
      setAttending(uid ? attendees.includes(uid) : false);
    }
  }

  // Attend
  async function handleAttend() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in first.");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    try {
      setSaving(true);
      await api.post(`/events/${id}/attend/`, {});
      await refetch(); 
      alert("You're attending this event!");
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        alert("Please sign in to connect.");
        navigate("/login", { state: { from: `/events/${id}` } });
      } else if (status === 409) {
        alert("You are already attending this event.");
        await refetch();
      } else {
        alert(e?.response?.data?.error || "Failed to attend.");
      }
    } finally {
      setSaving(false);
    }
  }

  // Unattend
  async function handleUnattend() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in first.");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    try {
      setSaving(true);
      await api.post(`/events/${id}/unattend/`, {});
      await refetch();
      alert("You left this event.");
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        alert("Unauthorized. Please sign in.");
        navigate("/login", { state: { from: `/events/${id}` } });
      } else if (status === 409) {
        alert("You are not attending this event.");
        await refetch();
      } else {
        alert(e?.response?.data?.error || "Failed to unattend.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen p-6">Loading…</div>;

  if (error)
    return (
      <div className="min-h-screen p-6 text-red-600">
        {error}{" "}
        <button className="underline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );

  if (!event) return <div className="min-h-screen p-6">Event not found.</div>;

  const text =
    event.description ?? event.details ?? "No description available yet.";
  const attendeesCount = Number(
    Array.isArray(event?.attendees)
      ? event.attendees.length
      : event?.attendees_count || 0
  );

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
          <h2 className="text-xl font-semibold">About this event:</h2>
          <p className="text-gray-800 leading-relaxed">{text}</p>

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
                className="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                onClick={handleAttend}
              >
                {saving ? "Joining…" : "Attend"}
              </button>
            )}

            <span className="text-sm text-gray-700">
              {attendeesCount} {attendeesCount === 1 ? "person" : "people"}{" "}
              attending
            </span>

            <Link
              to="/"
              className="ml-auto px-5 py-2.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
