import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <nav className="bg-purple-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">My Events App</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Αρχική
        </Link>
        <Link to="/events" className="hover:underline">
          Εκδηλώσεις
        </Link>
        {user ? (
          <>
            <Link to="/create" className="hover:underline">
              Δημιουργία
            </Link>
            <button
              className="hover:underline"
              onClick={() => alert("Logout logic εδώ")}
            >
              Αποσύνδεση
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">
            Σύνδεση
          </Link>
        )}
      </div>
    </nav>
  );
}
