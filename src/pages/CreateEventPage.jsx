import React, { useState } from "react";
import api from "../services/api";
import EventForm from "../ui/EventForm";
import { useNavigate } from "react-router-dom";

/**
 * CreateEventPage Component
 *
 * Purpose
 * -------
 * Provide a page for authenticated users to create a new event.
 *
 * Behavior
 * --------
 * - Renders an EventForm for user input (title, description, date, image).
 * - On submit:
 *   - Builds a payload matching backend requirements.
 *   - Sends a POST request to /events/ with JWT authentication if available.
 *   - On success, navigates to the events listing page ("/events").
 * - Displays an error message if the request fails.
 *
 * State
 * -----
 * error : String
 *   Error message to display when event creation fails.
 *
 * Parameters
 * ----------
 * None
 *
 * Returns
 * -------
 * JSX.Element
 *   A full-page background section with a centered form card.
 */
export default function CreateEventPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async ({
    title,
    description,
    details,
    date,
    imageDataUrl,
  }) => {
    try {
      setError("");

      const payload = {
        title: title || "",
        description: description || "",
        date: date || "",
        image: imageDataUrl || "", // backend expects 'image' string
        // details: backend does not store this field
      };

      const token = localStorage.getItem("token");
      await api.post("/events/", payload, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      navigate("/events");
    } catch (err) {
      console.error(
        "Error creating event:",
        err?.response?.status,
        err?.response?.data
      );
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Failed to create event."
      );
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/imgs/z.jpg')" }}
    >
      <div className="relative z-10 w-full max-w-xl bg-black/60 backdrop-blur-sm p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-white">Submit Event</h1>
        <EventForm onSubmit={handleCreate} />
        {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
