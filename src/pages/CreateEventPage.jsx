// src/pages/CreateEventPage.jsx
import React, { useState } from "react";
import api from "../services/api";
import EventForm from "../ui/EventForm";
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
 * - Renders EventForm inside a centered card.
 * - Full-page background image.
 * - On success, redirects to /events.
 */
export default function CreateEventPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async ({
    title,
    description,
    details,
    date,
    imageFile,
  }) => {
    try {
      setError("");

      const formData = new FormData();
      formData.append("title", title || "");
      formData.append("description", description || "");
      formData.append("details", details || "");
      formData.append("date", date || ""); // date in ISO (from EventForm)
      if (imageFile) formData.append("image", imageFile);

      await api.post("/events/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      style={{ backgroundImage: "url('/imgs/z.jpg')" }} // ✅ βάλε την εικόνα στο public/imgs/z.jpg
    >
    
      {/* Card ΜΠΡΟΣΤΑ από το overlay */}
      <div className="relative z-10 w-full max-w-xl bg-black/60 backdrop-blur-sm p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-white">Submit Event</h1>
        <EventForm onSubmit={handleCreate} />
        {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
