import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

/**
 * View a single event and toggle attendance.
 *
 * GET
 * ---
 * Public endpoint.
 * Fetches an event by its ID.
 *
 * POST (Attend/Unattend)
 * ----------------------
 * Protected endpoints. Require JWT token (handled by axios interceptor).
 * - POST /events/{id}/attend/   : mark current user as attending
 * - POST /events/{id}/unattend/ : remove current user from attendees
 *
 * Parameters
 * ----------
 * id : string
 *     URL path parameter (MongoDB ObjectId) identifying the event.
 *
 * Returns
 * -------
 * JsonResponse
 *     Event object on GET. On attend/unattend, returns updated event with attendees.
 */

export default function EventsPage() {
  const { id } = useParams(); // MongoDB ObjectId as string
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Read current user id (saved at login) to compute "attending" client-side
  const currentUserId = useMemo(
    () => localStorage.getItem("user_id") || "",
    []
  );

  const attending = useMemo(() => {
    if (!event || !Array.isArray(event.attendees)) return false;
    return currentUserId
      ? event.attendees.includes(String(currentUserId))
      : false;
  }, [event, currentUserId]);

  // Fetch single event from backend (with abort safety)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}/`, {
          signal: controller.signal,
        });
        setEvent(res.data);
        setErrorMsg("");
      } catch (err) {
        // Ignore aborted request errors
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          const msg = err?.response?.data?.error || "Failed to load event";
          setErrorMsg(msg);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id]);

  // Toggle attend/unattend without extra busy state
  const handleToggleAttend = useCallback(async () => {
    if (!event) return;
    try {
      const endpoint = attending ? "unattend" : "attend";
      const res = await api.post(`/events/${id}/${endpoint}/`);
      setEvent(res.data); // backend returns updated event
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        (attending
          ? "Unable to unattend right now."
          : "Unable to attend right now.");
      alert(msg);
    }
  }, [attending, event, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div>Loading event…</div>
      </div>
    );
  }

  if (errorMsg || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div>{errorMsg || "Event not found"}</div>
      </div>
    );
  }

  // Fallback image (optional): replace with your placeholder path if needed
  const imageSrc =
    event.image || "https://via.placeholder.com/1000x400?text=Event+Image";

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-950 to-indigo-300 flex items-center justify-center p-6 animate-gradient">
      <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full overflow-hidden flex-col md:flex-row">
        <div className="p-2 h-full w-full">
          <img
            src={imageSrc}
            alt={event.title}
            className="w-full max-w-[1000px] max-h-[400px] object-cover mx-auto rounded-lg"
          />
        </div>

        <div className="p-2 h-full w-full">
          <h1 className="text-2xl font-bold text-indigo-800 mb-4">
            {event.title}
          </h1>
          <p className="text-gray-600 mb-2">
            <strong className="text-indigo-700">Date:</strong> {event.date}
          </p>
          <p className="text-gray-600 mb-2">{event.description}</p>
          <div className="p-1.5 w-full h-full whitespace-pre-wrap">
            {event.details}
          </div>

          <button
            onClick={handleToggleAttend}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            {attending ? "You're attending (Unattend)" : "Attend Event"}
          </button>

          {/* Optional: attendees count */}
          <div className="mt-3 text-sm text-gray-600">
            Attendees:{" "}
            {Array.isArray(event.attendees) ? event.attendees.length : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
