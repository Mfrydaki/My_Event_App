import React, { useState } from "react";
import api from "../services/api"; // axios instance with baseURL and token interceptor
import EventForm from "../ui/EventForm";

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
 * - Requires a valid JWT token (set in localStorage by Login).
 * - If successful, could redirect user to /events (optional).
 *
 * State
 * -----
 * error : String
 *     Holds an error message if event creation fails.
 *
 * Returns
 * -------
 * JSX.Element
 *     The event creation form and any error messages.
 */
export default function CreateEventPage() {
  const [error, setError] = useState("");

  /**
   * handleCreate
   *
   * Submit event data to the backend API.
   *
   * Parameters
   * ----------
   * eventData : Object
   *   Form fields: title, description, details, date, image (optional).
   *
   * Behavior
   * --------
   * - Sends POST request to /events/.
   * - Updates error state if the request fails.
   */
  const handleCreate = async (eventData) => {
    try {
      setError("");
      await api.post("/events/", eventData);

      // ✅ Event created successfully
      // TODO: Optionally navigate to /events after creation
      // navigate("/events");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Failed to create event."
      );
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Event</h1>
      <EventForm onSubmit={handleCreate} />
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
