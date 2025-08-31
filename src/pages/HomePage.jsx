// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../services/api";

// /**
//  * HomePage Component
//  *
//  * Purpose
//  * -------
//  * Render a grid of upcoming events fetched from the backend.
//  * Serves as the landing page, showing users the latest events
//  * in a visual, card-based layout.
//  *
//  * Behavior
//  * --------
//  * - On mount (useEffect), it sends a GET request to /events/.
//  * - While loading, it shows a "Loading events…" message.
//  * - If the request fails, it shows an error message.
//  * - If successful, it displays a list of events as cards
//  *   (image, title, date), each linking to its details page.
//  *
//  * State
//  * -----
//  * events : Array
//  *   Stores the events returned from the backend.
//  * loading : Boolean
//  *   True while events are being fetched.
//  * error : String
//  *   Holds an error message if the request fails.
//  *
//  * Helpers
//  * -------
//  * isAbsoluteUrl(v : string) : boolean
//  *   Check if a string is an absolute URL (starts with http/https).
//  *
//  * imgSrc(image : string) : string
//  *   Return a usable image path (absolute URL or fallback /imgs/default.jpg).
//  *
//  * Returns
//  * -------
//  * JSX.Element
//  *   - A loading indicator, or
//  *   - An error message, or
//  *   - A responsive list of event cards with title, date, and image.
//  */
// export default function HomePage() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Fetch events on mount
//   useEffect(() => {
//     let mounted = true;

//     const fetchOnce = async () => {
//       try {
//         setError("");
//         const res = await api.get("/events/", {params:{_: Date.now()}});
//         if (mounted) setEvents(res.data || []);
//       }catch (e){
//         console.error(e);
//         if (mounted) setError ("Failed to load events.");
//       }finally{
//           if (mounted) setLoading(false);
//       }
//     };

//     fetchOnce();

//     //Reload every 30"
//     const id = setInterval(fetchOnce, 30000);

//     //Stop polling
//     return() => {
//       mounted = false;
//     clearInterval(id);
//  };
// }, []);


//   /**
//    * Check if given string is an absolute URL.
//    */
//   const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);

//   /**
//    * Resolve an image path.
//    * - If empty, return default placeholder.
//    * - If absolute URL, return as-is.
//    * - Otherwise assume local /imgs/ path.
//    */
//   const imgSrc = (image) => {
//     if (!image) return "/imgs/default.jpg";
//     return isAbsoluteUrl(image) ? image : `/imgs/${image}`;
//   };

//   return (
//     <div className="w- min-h-screen flex flex-col items-center p-10 overflow-auto relative">
//       <h2 className="text-4xl mb-6 text-gold">Upcoming Events</h2>

//       {loading && <p className="text-white">Loading events…</p>}
//       {error && <p className="text-red-200">{error}</p>}

//       {!loading && !error && (
//         <ul className="space-y-6 w-full max-w-2xl px-4 sm:px-6 lg:px-8">
//           {events.map((event) => (
//             <li
//               key={event.id}
//               className="rounded-2xl shadow-md overflow-hidden bg bg-indigo-600 transition-transform hover:scale-100 duration-300"
//             >
//               <Link to={`/events/${event.id}`} className="block">
//                 <div className="relative w-full aspect-[16/9] overflow-hidden object-cover">
//                   <img
//                     src={imgSrc(event.image)}
//                     alt={"Image for event: " + event.title}
//                     className="w-full h-full 
//                     "
//                   />
//                 </div>

//                 <div className="p-4">
//                   <h3 className="text-black text-lg font-semibold mb-1">{event.title}</h3>
//                   <p className="text-sm text-black">{event.date}</p>
//                 </div>
//               </Link>
//             </li>
//           ))}

//           {events.length === 0 && (
//             <li className="text-white">No events yet.</li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// }@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import UpcomingEventsCarousel from "../components/UpcomingEventsCarousel";
import Typewriter from "../components/TypeWriter";

/**
 * HomePage
 * - Hero + intro + gallery
 * - Events grid (από backend) + slideshow από κάτω
 */
export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);
  const imgSrc = (image) =>
    !image ? "/imgs/default.jpg" : isAbsoluteUrl(image) ? image : `/imgs/${image}`;

  // Fetch events (mount + κάθε 30")
  useEffect(() => {
    let mounted = true;

    const fetchOnce = async () => {
      try {
        setError("");
        const res = await api.get("/events/", { params: { _: Date.now() } });
        if (mounted) setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load events.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOnce();
    const id = setInterval(fetchOnce, 30000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="text-white">
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <img
          src="/imgs/img1.jpg"
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 max-w-[70ch] mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ..:: Welcome to Shero ::..
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            "Gather. Create. Empower."
          </p>
          <Link
            to="/events"
            className="inline-block rounded-2xl bg-indigo-800 px-6 py-3 text-sm font-semibold shadow-lg transition hover:bg-indigo-700"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Section 2: Intro (typewriter) */}
      <section className="px-6 py-10">
        <p className="text-lg text-white mb-6 max-w-[70ch] mx-auto leading-relaxed">
          <Typewriter
            text={`Welcome to Shero — the space where technology meets community. This is our space in tech: we rise, we code, we lead. We host friendly, practical tech events centered on femininities. We learn, connect, and give visibility to ideas and people. Choose an event to join or create your own — this space is yours.`}
            caret={false}
          />
        </p>
      </section>

      {/* Section 3: Gallery */}
      <section className="py-16 px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["slide1.jpg", "slide2.jpg", "slide3.jpg"].map((f) => (
            <img
              key={f}
              src={`/imgs/${f}`}
              alt={f}
              className="rounded-xl object-cover h-60 w-full"
            />
          ))}
        </div>
      </section>

      {/* Section 4: Upcoming Events */}
      <section id="upcoming" className="relative py-16 px-6">
        <img
          src="/imgs/backslide.jpg"
          alt="background-photo"
          className="absolute inset-0 w-full h-full object-cover -z-10" />

          <div className="absolute inset-0 bg-black/50 -z-10"/>

          <h2 className="text-2xl font-bold text-center mb-10 text-white">Upcoming Events</h2>

        {loading && <p className="text-center text-gray-300">Loading events…</p>}
        {error && !loading && <p className="text-center text-red-200">{error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="text-center text-gray-300">No events yet.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            {/* Grid με κάρτες
            <ul className="mx-auto grid gap-6 w-full max-w-6xl px-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, i) => (
                <li
                  key={event.id || event._id || i}
                  className="rounded-2xl shadow-md overflow-hidden bg-indigo-600/80 backdrop-blur transition-transform hover:scale-[1.01] duration-300"
                >
                  <Link to={`/events/${event.id || event._id}`} className="block">
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <img
                        src={imgSrc(event.image)}
                        alt={`Image for event: ${event.title || "Event"}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-black text-lg font-semibold mb-1 line-clamp-1">
                        {event.title || "Event"}
                      </h3>
                      {event.date && (
                        <p className="text-sm text-black/90">{event.date}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul> */}

            {/* Slideshow */}
            <div className=" mt-6 w-full content-between">
              <UpcomingEventsCarousel events={events} intervalMs={5000} auto />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
