import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

 export default function EventsPage() {
  const {id} = useParams();
  const event = Events.find(ev => ev.id === Number(id));

  if (!event){
    return <div>Event not found</div>
  
  }

    return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
      <img src={event.image} alt={event.title} className="w-full rounded mb-4" />
      <p className="mb-2"><strong>Date:</strong> {event.date}</p>
      {/* Μπορείς να προσθέσεις κι άλλες λεπτομέρειες εδώ */}
    </div>
  );
}
  

