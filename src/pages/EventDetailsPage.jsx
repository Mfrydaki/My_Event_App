import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * EventDetailsPage
 *
 * Purpose
 * -------
 * Fetch and display details of a single event by its Mongo ObjectId.
 *
 * Behavior
 * --------
 * - Reads `:id` from route params.
 * - GET /events/:id/ to fetch event details (title, date, description, attendees).
 * - Shows event image (with gradient overlay and fallback if missing).
 * - Displays attendees count and whether the logged-in user is attending.
 * - POST /events/:id/attend/ when clicking "Attend" (requires JWT).
 * - POST /events/:id/unattend/ when clicking "Unattend" (requires JWT).

 */
export default function EventDetailsPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();


  const [event, setEvent] = useState(null); 
  const [attending, setAttending] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false); 
  const [error, setError] = useState(""); 

  /**
   * Helper: check if URL is absolute
   */
  const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

  /**
   * Helper: resolve image path (absolute or local fallback)
   */
  const imgSrc = (image) => {
    if (!image) return "/imgs/default.jpg";
    return isAbsoluteUrl(image) ? image : `/imgs/${image}`;
  };

  /**
   * Helper: decode JWT (client-side only for UI) to get user id
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

  /**
   * Effect: Fetch event when id changes
   */
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

        // If backend gives "attending" flag use it, otherwise infer from attendees
        if (typeof ev.attending === "boolean") {
          setAttending(ev.attending);
        } else {
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

  /**
   * Helper: refetch event after attend/unattend
   */
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

  /**
   * Handle: Attend event (requires JWT)
   */
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

  /**
   * Handle: Unattend event (requires JWT)
   */
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

  // Loading state
  if (loading) return <div className="min-h-screen p-6">Loading…</div>;

  // Error state
  if (error)
    return (
      <div className="min-h-screen p-6 text-red-600 bg-[#0c0a09]">
        {error}{" "}
        <button className="underline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );

  // Not found
  if (!event)
    return (
      <div className="min-h-screen p-6 bg-[#0c0a09]">Event not found.</div>
    );

  // Extract info
  const text =
    event.description ?? event.details ?? "No description available yet.";
  const attendeesCount = Number(
    Array.isArray(event?.attendees)
      ? event.attendees.length
      : event?.attendees_count || 0
  );

  return (
    <div className="min-h-screen p-6 bg-[#0c0a09] text-white">
      <div className="max-w-3xl mx-auto rounded-2xl shadow overflow-hidden bg-[#1a1a1f]">
        {/* Image with gradient overlay */}
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

        {/* Event details */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">About this event:</h2>
          <p className="text-gray-300 leading-relaxed">{text}</p>

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

            <span className="text-sm text-gray-400">
              {attendeesCount} {attendeesCount === 1 ? "person" : "people"}{" "}
              attending
            </span>

            <Link
              to="/"
              className="ml-auto px-5 py-2.5 rounded border border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
