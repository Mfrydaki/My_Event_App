import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

/**
 * EventDetailPage Component
 *
 * Purpose
 * -------
 * Fetch and display detailed information for a single event.
 *
 * Behavior
 * --------
 * - Reads the event ID from the route parameter (:id).
 * - On mount (useEffect), it sends a GET request to /events/:id/
 *   using the axios instance (api.js).
 * - While fetching, it shows a "Loading" message.
 * - If the request fails, it shows an error message.
 * - If successful, it displays the details of the event.
 *
 * State
 * -----
 * event : Object | null
 *   Stores the single event data returned from the backend.
 * loading : Boolean
 *   True while the event data is being loaded.
 * error : String
 *   Holds an error message if the request fails.
 *
 * Returns
 * -------
 * JSX.Element
 *   The rendered event details, or loading/error messages.
 */
function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * loadEvent
     *
     * Fetch a single event by ID from the backend.
     *
     * Sends a GET request to /events/:id/ and updates state
     * with the result, or shows an error message.
     */
    const loadEvent = async () => {
      try {
        setError("");
        const res = await api.get(`/events/${id}/`);
        setEvent(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.detail ||
            "Failed to load event."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-8">Loading event...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-600">{error}</p>;
  }

  if (!event) {
    return <p className="text-center mt-8">Event not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>

      {event.description && (
        <p className="text-gray-700 mb-2">{event.description}</p>
      )}

      <p className="text-sm text-gray-500">{event.date}</p>

      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="mt-4 max-w-full h-auto rounded"
        />
      )}
    </div>
  );
}

export default EventDetailPage;
