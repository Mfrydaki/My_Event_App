import React from "react";
import EventForm from "../ui/EventForm";

export default function CreateEventPage() {
  function handleCreateEvent(eventData) {
    console.log("Νέο event:", eventData);
    // Εδώ μπορείς να το στείλεις στο backend
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Δημιουργία Εκδήλωσης</h1>
      <EventForm onSubmit={handleCreateEvent} />
    </div>
  );
}
