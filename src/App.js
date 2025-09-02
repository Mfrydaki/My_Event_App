import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import LoginPage from "./pages/LoginPage";
import CreateEventPage from "./pages/CreateEventPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/**
 * App Component
 *
 * Purpose
 * -------
 * Define the root router and layout of the application.
 *
 * Behavior
 * --------
 * - Wraps the app in a React Router <Router>.
 * - Defines all routes.
 * - Displays Navbar at the top and Footer at the bottom.
 * - Uses flexbox so <main> grows to fill the viewport height.
 *
 * Returns
 * -------
 * JSX.Element
 *   The application root with routing and layout.
 */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create" element={<CreateEventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
