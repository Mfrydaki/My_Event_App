import React from "react";
import { Link } from "react-router-dom";
import event1Image from "../imgs/event1.jpg";
import event2Image from "../imgs/event2.jpg";
import event3Image from "../imgs/event3.jpg"

const Events = [
  {
    id: 1,
    title:
      "womENcourage 2025: Computer Science – A Catalyst for Educational Change",
    date: "2025-09-17",
    image: event1Image
  },
  {
     id:2,
    title: "Women of Silicon Role Model Masterclass 2025 Edition > Course 2: Your Passion",
    date: "2025-10-14",
    image: event2Image
  },

{
    id: 3,
    title: "Women in STEM Awards 2025",
    date: "2025-10-23",
    image: event3Image
}
];

export default function HomePage() {
  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col items-center p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome!</h1>

      <h2 className="text-2xl mb-4">Events</h2>

      <ul className="space-y-6 mb-8 w-full max-w-xl">
        {Events.map((event) => (
          <li
            key={event.id}
            className="border rounded shadow-sm overflow-hidden bg-white"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-contain bg-amber-400 "
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.date}</p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/login"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sign in
      </Link>
    </div>
  );
}
