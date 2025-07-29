 import React from "react";
 import EventCard from "../ui/EventCard";

 const dummyEvents = [
   {
     id: 1,
     title: "OWW",
     date: "2025-08-01",
     description: "wowowowow",
   },
 ];

 export default function EventsPage() {
   return (
     <div className="p-4">
       <h1>Events</h1>
       {dummyEvents.map((event) => (
         <EventCard key={event.id} event={event} />
       ))}
     </div>
   );
 }
