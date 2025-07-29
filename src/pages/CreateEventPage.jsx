import React from "react";
import EventForm from "../ui/EventForm";

export default function CreateEventPage() {
  const handleCreate = (eventData) => {
    console.log("Event submitted:", eventData);
    // Εδώ θα στείλεις τα δεδομένα στο backend με fetch/axios
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Event</h1>
      <EventForm onSubmit={handleCreate} />
    </div>
  );
}
