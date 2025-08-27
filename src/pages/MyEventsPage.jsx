// import React, { useEffect, useState } from "react";
// import axios from "axios";

// /**
//  * MyEventsPage Component
//  *
//  * Purpose
//  * -------
//  * Show a list of events that the current user has attended.
//  *
//  * Behavior
//  * --------
//  * - On mount (useEffect), fetches attended events from the backend.
//  *   Example endpoint: GET /api/users/me/events/attending
//  * - Requires a valid JWT token (stored in localStorage).
//  * - Displays event cards with title, date, description, image, etc.
//  *
//  * State
//  * -----
//  * events : Array
//  *   The list of events the user has attended.
//  * loading : Boolean
//  *   True while events are being fetched.
//  * error : String
//  *   Holds an error message if fetching fails.
//  *
//  * Returns
//  * -------
//  * JSX.Element
//  *   The list of attended events or loading/error messages.
//  */
// export default function MyEventsPage() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     /**
//      * fetchAttendedEvents
//      *
//      * Fetch all events the current user has attended.
//      */
//     async function fetchAttendedEvents() {
//       try {
//         setError("");
//         const res = await axios.get(
//           "http://localhost:8000/api/users/me/events/attending",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setEvents(res.data);
//       } catch (err) {
//         console.error("Error fetching attended events:", err);
//         setError("Failed to load your events.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAttendedEvents();
//   }, []);

//   if (loading) return <p>Loading your events...</p>;
//   if (error) return <p className="text-red-600">{error}</p>;

//   return (
//     <div className="min-h-screen bg-indigo-100 flex flex-col items-center p-6">
//       <h1 className="text-3xl font-bold mb-6">My Events</h1>

//       {events.length === 0 ? (
//         <p>You haven't attended any events yet.</p>
//       ) : (
//         <ul className="space-y-6 w-full max-w-2xl">
//           {events.map((event) => (
//             <li
//               key={event.id}
//               className="rounded-2xl shadow-md overflow-hidden bg-white"
//             >
//               <div className="relative h-64 w-full overflow-hidden">
//                 <img
//                   src={event.image}
//                   alt={"Image for event: " + event.title}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
//                 <p className="text-sm text-gray-600">{event.date}</p>
//                 {event.description && (
//                   <p className="text-gray-700 mt-2">{event.description}</p>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
