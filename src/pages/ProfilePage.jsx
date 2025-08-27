import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * ProfilePage
 *
 * Purpose
 * -------
 * Display the authenticated user's profile and the list of events they attend.
 *
 * Behavior
 * --------
 * - Parallel fetch:
 *   GET /auth/profile/ → user details (requires JWT)
 *   GET /api/users/me/events/attending → attending events list (requires JWT)
 * - Redirects to /login if unauthorized or if missing token.
 */

const isAbsoluteUrl = (v) => typeof v === "string" && /^https?:\/\//i.test(v);
const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, ""); 
const buildImageUrl = (image) => {
  if (!image) return "/imgs/default.jpg";
  if (isAbsoluteUrl(image)) return image;
  if (image.startsWith("/media") || image.startsWith("media/")) {
    const path = image.startsWith("/media") ? image : `/${image}`;
    return API_BASE ? `${API_BASE}${path}` : "/imgs/default.jpg";
  }
  return `/imgs/${image}`;
};
const imgSrc = (image) => buildImageUrl(image);

const prettyDate = (d) => {
  try {
    // Accepts "YYYY-MM-DD" or ISO; falls back to raw string
    const date = new Date(d);
    return isNaN(date)
      ? d
      : date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  } catch {
    return d || "";
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;


    // If not token go to login
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/myprofile" } });
      return;
    }

    (async () => {
      try {
        setError("");
        setLoading(true);

        const [meRes, attendingRes] = await Promise.all([
          api.get("/auth/profile/"),
          api.get("/api/users/me/events/attending"),
        ]);

        if (!mounted) return;
        setProfile(meRes.data?.user || meRes.data || null);
        setEvents(Array.isArray(attendingRes.data) ? attendingRes.data : []);
      } catch (e) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) {
          
          navigate("/login", { state: { from: "/profile" } });
          return;
        }
        setError(e?.response?.data?.error || "Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (loading) return <div className="min-h-screen p-6">Loading…</div>;

  if (error)
    return (
      <div className="min-h-screen p-6 text-red-600">
        {error}{" "}
        <button className="underline" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );

  if (!profile)
    return <div className="min-h-screen p-6">No profile data found.</div>;

  const fullName =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") || null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile card  */}
        <div className="rounded-2xl shadow bg-white/85 backdrop-blur">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-1">My Profile</h1>
            <p className="text-gray-700">Email: {profile.email}</p>
            {fullName && <p className="text-gray-700">Name: {fullName}</p>}
            {profile.date_of_birth && (
              <p className="text-gray-700">
                Date of Birth: {profile.date_of_birth}
              </p>
            )}
          </div>
        </div>

        {/* Attending events */}
        <div className="rounded-2xl shadow bg-white/85 backdrop-blur">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Attending Events</h2>
              <Link
                to="/"
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </Link>
            </div>

            {events.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-gray-700">
                You have not attended any events yet.
              </div>
            ) : (
              <ul className="grid md:grid-cols-2 gap-6">
                {events.map((ev) => {
                  const description =
                    ev.description || ev.details || "No description.";
                  return (
                    <li
                      key={ev.id}
                      className="rounded-2xl shadow overflow-hidden bg-white"
                    >
                      <Link to={`/events/${ev.id}`} className="block">
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={imgSrc(ev.image)}
                            alt={"Image for event: " + ev.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4 text-white">
                            <h3 className="text-lg font-semibold truncate">
                              {ev.title}
                            </h3>
                            <p className="opacity-90 text-sm">{ev.date}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-800 line-clamp-3">
                            {description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
