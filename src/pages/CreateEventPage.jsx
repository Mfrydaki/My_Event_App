import React from "react";
import api from "../services/api"; // axios instance with baseURL and token interceptor
import EventForm from "../ui/EventForm";

/**
 * Create a new event page.
 *
 * POST
 * ----
 * Protected page. Requires JWT token.
 * Submits a new event to the backend API.
 *
 * Parameters
 * ----------
 * eventData : Object
 *     Event form data including:
 *     - title : string
 *     - description : string
 *     - details : string
 *     - date : string (YYYY-MM-DD)
 *     - image : string (optional)
 *
 * Returns
 * -------
 * JsonResponse
 * Created event object (if success) or error message (if failure).
 */
export default function CreateEventPage() {
  const handleCreate = async (eventData) => {
    try {
      // Send POST request to backend with event data
      const response = await api.post("/events/", eventData);

      console.log("✅ Event created successfully:", response.data);

      // Optionally redirect user to events list after successful creation
      // Example if using react-router-dom:
      // navigate("/events");
    } catch (error) {
      // Handle errors from backend or network issues
      if (error.response) {
        console.error("❌ Error creating event:", error.response.data);
        alert("Error: " + JSON.stringify(error.response.data));
      } else {
        console.error("❌ Request failed:", error.message);
        alert("Request failed: " + error.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Event</h1>
      <EventForm onSubmit={handleCreate} />
    </div>
  );
}
