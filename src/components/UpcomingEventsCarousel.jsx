// src/components/UpcomingEventsCarousel.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function isAbsoluteUrl(v) {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}
function imgSrc(image) {
  return !image
    ? "/imgs/default.jpg"
    : isAbsoluteUrl(image)
    ? image
    : `/imgs/${image}`;
}

export default function UpcomingEventsCarousel({
  events = [],
  intervalMs = 5000,
  auto = true,
  className = "",
  slideHeight = "h-[260px] md:h-[360px]",
}) {
  const [idx, setIdx] = useState(0);
  const [hovered, setHovered] = useState(false);

  const hasMany = events.length > 1;
  const next = () => events.length && setIdx((i) => (i + 1) % events.length);
  const prev = () =>
    events.length && setIdx((i) => (i - 1 + events.length) % events.length);

  useEffect(() => {
    if (!auto || hovered || !hasMany) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [auto, hovered, intervalMs, hasMany, events.length]);

  // 🔎 βοήθεια στο debug
  console.log("[Carousel] events:", events.length, "idx:", idx);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Upcoming events carousel"
    >
      {/* Αν δεν υπάρχουν events, δείξε placeholder αντί να κρύβεσαι */}
      {events.length === 0 ? (
        <div className="h-64 grid place-items-center text-gray-300">
          No events for the slideshow.
        </div>
      ) : (
        <>
          {/* Slides track */}
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {events.map((ev, i) => {
              const id = ev.id || ev._id || i;
              return (
                <Link
                  key={id}
                  to={`/events/${ev.id || ev._id}`}
                  className="w-full shrink-0 relative h-[260px] md:h-[360px]"
                >
                  <img
                    src={imgSrc(ev.image)}
                    alt={`Image for event: ${ev.title || "Event"}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    imageFit= "contain"
                    imagePosition ="center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-white text-lg md:text-xl font-semibold line-clamp-2">
                      {ev.title || "Event"}
                    </h3>
                    {ev.date && (
                      <p className="text-white/80 text-sm mt-1">{ev.date}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Controls + dots */}
          {hasMany && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Next"
              >
                ›
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {events.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === idx ? "bg-white" : "bg-white/40"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* 🔴 Ορατό περίγραμμα για να δεις ότι υπάρχει (βγάλ' το μετά) */}
      <div className="pointer-events-none absolute inset-0 ring-2 ring-fuchsia-500/50" />
    </div>
  );
}
