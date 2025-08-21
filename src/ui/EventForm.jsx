import React, { useState } from "react";
import EventForm from "../ui/EventForm";
import api from "../services/api"; // axios instance με token interceptor
import { useNavigate } from "react-router-dom";

/**
 * CreateEventPage Component
 *
 * Purpose
 * -------
 * Display a form for creating a new event and submit it to the backend.
 *
 * Behavior
 * --------
 * - Renders an EventForm component.
 * - When the form is submitted, sends a POST request to /events/.
 * - Requires a valid JWT token (saved in localStorage from login).
//  * - If successful, could redirect user to /events.
 *
 * State
 * -----
 * error : String
 *     Holds an error message if event creation fails.
 *
 * Returns
 * -------
 * JSX.Element
 * The event creation form and any error messages.
 */
export default function CreateEventPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * handleCreateEvent
   *
   * Submit event data to the backend API.
   *
   * Parameters
   * ----------
   * eventData : Object
   * Form fields: title, description, details, date, image (optional).
   */
  async function handleCreateEvent(eventData) {
    try {
      setError("");
      setSuccess("");

      await api.post("/events/", eventData);
      setSuccess("Event created successfully! 🎉 ");

      // Event created successfully → redirect
      setTimeout(() => navigate("/events"), 1500);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Failed to create event."
      );
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Host Your Event</h1>
      <EventForm onSubmit={handleCreateEvent} />
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
