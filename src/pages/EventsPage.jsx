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
       <div className="bg-white rounded-3xl shadow-xl max-w-5xl w-full overflow-hidden flex-col md:flex-row">
         {/* Picture */}
         <div className="p-2 h-full w-full">
           <img
             src={event.image}
             alt={event.title}
             className="w-full max-w-[1000px] max-h-[400px] object-cover mx-auto rounded-lg"
           />
         </div>
         <div className="p-2 h-full w-full">
           <div>
             <h1 className="text-2xl font-bold text-indigo-800 mb-4">
               {event.title}
             </h1>
             <p className="text-gray-600 mb-2">
               <strong className="text-indigo-700">Date:</strong> {event.date}
             </p>
             <p className="text-gray-600 mb-2">
               <strong className="text-indigo-700"></strong> {event.description}
             </p>

             <p className="text-sm text-gray-500 mt-4"></p>
           </div>
           <div className="p-1.5 w-full h-full">{event.details}</div>

           {/* Attend Button */}
           <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
             Attend Event
           </button>
         </div>
       </div>
     </div>
   );
 }