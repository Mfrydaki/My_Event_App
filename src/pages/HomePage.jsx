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
      <section className="relative h-[600px] flex items-center justify-center">
        <img
          src="/imgs/img1.jpg"
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center px-6 max-w-[70ch] mx-auto">
          <h1 className="text-base sm:text-xl md:text-4xl lg:text-4xl text-white max-w-2xl mb-8">
            ..:: Welcome to Shero ::..
          </h1>
          <p className="text-lg md:text-xl text-white mb-6">
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
        <p className="text-justify text-white m-6 max-w-[70ch] mx-auto leading-relaxed">
          <Typewriter
            text={`Welcome to Shero — the space where technology meets community. This is our space in tech: we rise, we code, we lead. We host friendly, practical tech events centered on femininities. We learn, connect, and give visibility to ideas and people. Choose an event to join or create your own — this space is ours.`}
            caret={false}
          />
        </p>
      </section>

      {/* Section 3: Gallery */}
      <section className="py-16 px-6 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["slide1.jpg", "slide2.jpg", "slide3.jpg"].map((file) => (
            <img
              key={file}
              src={`/imgs/${file}`}
              alt={file}
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

            {/* Slideshow */}
            <div className=" m-12">
              <UpcomingEventsCarousel events={events} intervalMs={5000} auto />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
