import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EventsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [attending, setAttending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get(`http://localhost:8000/api/events/${id}`);
        setEvent(res.data); // Save data
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  async function handleAttend() {
    try {
      await axios.post(
        `http://localhost:8000/api/events/${id}/attend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttending(true);
    } catch (err) {
      console.error("Attend failed", err);
      alert("Something went wrong!");
    }
  }

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Sorry! Event not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-950 to-indigo-300 flex items-center justify-center p-6 animate-gradient">
      <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full overflow-hidden flex-col md:flex-row">
        <div className="p-2 h-full w-full">
          <img
            src={event.image}
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
          <div className="p-1.5 w-full h-full">{event.details}</div>

          <button
            onClick={handleAttend}
            disabled={attending}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {attending ? "You're attending!" : "Attend Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
