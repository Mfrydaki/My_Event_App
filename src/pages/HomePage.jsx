
import React from "react";
import { Link } from "react-router-dom";
import {Events} from "../data/events";

export default function HomePage() {
  return (
    <div className="w-screen h-screen bg-indigo-200 flex flex-col items-center p-6 overflow-auto relative">
     
      <button className="absolute top-6 right-6 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-blue-700 cursor-pointer">
        Sign in
      </button>

      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

      <ul className="space-y-6 mb-8 w-full max-w-xl">
        {Events.map((event) => (
          <li
            key={event.id}
            className="rounded-2xl shadow-md overflow-hidden bg-gray-200 transition-transform hover:scale-105 duration-300"
          >
            <Link to={`/events/${event.id}`} className="block">
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={"Image for event: " + event.title}
                  className="w-full h-full object-fill"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
