import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage"; 
import EventDetailPage from "./pages/EventDetailPage"; 
import LoginPage from "./pages/LoginPage";
import CreateEventPage from "./pages/CreateEventPage";

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<HomePage />} />

      
        <Route path="/events" element={<EventsPage />} />

       
        <Route path="/events/:id" element={<EventDetailPage />} />

       
        <Route path="/login" element={<LoginPage />} />

       
        <Route path="/create" element={<CreateEventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
