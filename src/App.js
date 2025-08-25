import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage"; 
import EventDetailsPage from "./pages/EventDetailsPage"; 
import LoginPage from "./pages/LoginPage";
import CreateEventPage from "./pages/CreateEventPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create" element={<CreateEventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
