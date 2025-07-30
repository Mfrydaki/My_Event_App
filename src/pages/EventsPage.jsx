import React from "react";
import { useParams } from "react-router-dom";
import { Events } from "../data/events";

 export default function EventsPage() {
   const { id } = useParams();
   const event = Events.find((ev) => ev.id === Number(id));

   if (!event) {
     return <div>Event not found</div>;
   }

   return (
     <div className="min-h-screen bg-gradient-to-r from-purple-950 to-indigo-300 flex items-center justify-center p-6 animate-gradient">
       <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row">
        
         {/* Εικόνα */}
         <div className="md:w-1/2 w-full">
           <img
             src={event.image}
             alt={event.title}
             className="object-cover h-full w-full"
           />
         </div>

         {/* Περιγραφή */}
         <div className="p-6 md:w-1/2 w-full flex flex-col justify-between">
           <div>
             <h1 className="text-2xl font-bold text-indigo-800 mb-4">
               {event.title}
             </h1>
             <p className="text-gray-600 mb-2">
               <strong className="text-indigo-700">Date:</strong> {event.date}
             </p>
             {/* Εδώ μπορείς να προσθέσεις περιγραφή ή περισσότερες λεπτομέρειες */}
             <p className="text-sm text-gray-500 mt-4">
               Join us for an inspiring event where amazing women from the STEM
               world share their journeys, ideas, and knowledge.
             </p>
           </div>

           {/* Κουμπί συμμετοχής */}
           <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
             Attend Event
           </button>
         </div>
       </div>
     </div>
   );
 }