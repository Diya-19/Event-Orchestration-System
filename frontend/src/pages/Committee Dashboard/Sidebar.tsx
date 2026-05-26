import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { clearToken } from "../../lib/auth";
import { api } from "../../lib/api";
import { Event } from "../../types";

const NAV = [
  { to: "/dashboard",              label: "Overview",      end: true  },
  { to: "/dashboard/participants", label: "Participants",  end: false },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!eventId) { setSelectedEvent(null); return; }
    api.get<Event>(`/api/events/${eventId}`)
      .then(({ data }) => setSelectedEvent(data))
      .catch(() => setSelectedEvent(null));
  }, [eventId]);

  // Append ?event_id= to every nav link so the selection persists across pages
  function navTo(base: string) {
    return eventId ? `${base}?event_id=${eventId}` : base;
  }

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-6 border-b border-gray-100">
          <p className="font-bold text-gray-900 text-sm">Event Orchestration</p>
          <p className="text-xs text-gray-400 mt-0.5">Committee Portal</p>
        </div>

        {/* Active event banner */}
        {selectedEvent ? (
          <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
            <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide">Active Event</p>
            <p className="text-sm font-semibold text-indigo-800 truncate mt-0.5">{selectedEvent.name}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs text-indigo-400 hover:text-indigo-600 mt-1"
            >
              Change →
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
            <p className="text-xs font-medium text-amber-600">No event selected</p>
            <p className="text-xs text-amber-400 mt-0.5">Pick one from Overview</p>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={navTo(to)}
              end={end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
