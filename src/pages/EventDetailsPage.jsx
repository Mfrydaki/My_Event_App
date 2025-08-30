import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * EventDetailsPage
 * Fetch and display a single event; allows attend/unattend (JWT).
 */
export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [attending, setAttending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);
  const imgSrc = (image) =>
    !image
      ? "/imgs/default.jpg"
      : isAbsoluteUrl(image)
      ? image
      : `/imgs/${image}`;

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

  // --- FETCH EVENT (με cache-bust) ---
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        setLoading(true);
        const res = await api.get(`/events/${id}/`, {
          params: { _: Date.now() },
        });
        if (!mounted) return;
        const ev = res.data;
        setEvent(ev);
        if (typeof ev.attending === "boolean") setAttending(ev.attending);
        else {
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
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function refetch() {
    const res = await api.get(`/events/${id}/`, { params: { _: Date.now() } });
    const ev = res.data;
    setEvent(ev);
    if (typeof ev.attending === "boolean") setAttending(ev.attending);
    else {
      const uid = getUserIdFromToken();
      const attendees = Array.isArray(ev?.attendees)
        ? ev.attendees.map(String)
        : [];
      setAttending(uid ? attendees.includes(uid) : false);
    }
  }

  async function handleAttend() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to connect.");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    try {
      setSaving(true);
      await api.post(`/events/${id}/attend/`, {});
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

  async function handleUnattend() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to connect.");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    try {
      setSaving(true);
      await api.post(`/events/${id}/unattend/`, {});
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

  if (loading) return <div className="min-h-screen p-6">Loading…</div>;
  if (error)
    return (
      <div className="min-h-screen p-6 text-red-600 bg-[#0c0a09]">
        {error}{" "}
        <button className="underline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  if (!event)
    return (
      <div className="min-h-screen p-6 bg-[#0c0a09]">Event not found.</div>
    );

  // ✅ Δείξε description ή details (fallback)
  const aboutText =
    (event.details || "").trim() ||
    "No description available yet.";
  const attendeesCount = Number(
    Array.isArray(event?.attendees)
      ? event.attendees.length
      : event?.attendees_count || 0
  );

  return (
    <div className="min-h-min p-6 bg-[#0c0a09] text-white">
      <div className="max-w-3xl mx-auto rounded-2xl shadow overflow-hidden bg-[#1a1a1f]">
        {/* ✅ Εικόνα: aspect ratio + object-cover + cache-bust */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <img
            src={`${imgSrc(event.image)}?v=${event.updated_at || Date.now()}`}
            alt={`Image for event: ${event.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5 text-white">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="opacity-90">{event.date}</p>
          </div>
        </div>

        {/* ✅ Details: σωστό heading (χωρίς h-80) + κείμενο */}
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this event:</h2>
          {event.description && (
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          )}
          {event.details && (
            <p className="text-gray-400 leading-relaxed whitespace-pre-line mt-2">
              {event.details}
            </p>
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
                className="px-5 py-2.5 bg-indigo-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
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
              className="ml-auto px-5 py-2.5 rounded border border-indigo-600 text-gray-300 hover:bg-gray-800"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
