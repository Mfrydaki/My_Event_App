import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";
import LoginPage from "./pages/LoginPage";
import CreateEventPage from "./pages/CreateEventPage";
import MyEventsPage from './pages/MyEventsPage'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create_event" element={<CreateEventPage /> }/>
        <Route path="/my_events" element={<MyEventsPage />}/>

      </Routes>
    </BrowserRouter>
  );
}
