export default function EventCard({ event, onAttend }) {
  return (
    <div className="border rounded-xl p-4 shadow-md bg-white">
      <h2 className="text-lg font-semibold">{event.title}</h2>
      <p className="text-sm text-gray-600">{event.date}</p>
      <p className="mt-2">{event.description}</p>
      <button
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        onClick={() => onAttend(event.id)}
      >
        Δήλωσε συμμετοχή
      </button>
    </div>
  );
}
