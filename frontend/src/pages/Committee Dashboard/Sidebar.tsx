
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Trophy,
  Shield,
  Bell,
  MoreHorizontal,
  LogOut,
  Sparkles,
  CalendarDays,
  Send
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import { clearToken } from "../../lib/auth";
import { api } from "../../lib/api";
import { Event } from "../../types";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/dashboard/current-event", label: "Current Event", icon: <CalendarDays size={18} /> },
  { to: "/dashboard/multiple-events", label: "Multiple Events", icon: <FolderKanban size={18} /> },
  { to: "/dashboard/participants", label: "Participants", icon: <Users size={18} /> },
  { to: "/dashboard/communication", label: "Communication", icon: <Send size={18} /> },
  { to: "/dashboard/scoring", label: "Scoring", icon: <FolderKanban size={18} /> },
  { to: "/dashboard/results", label: "Results", icon: <Trophy size={18} /> },
  { to: "/dashboard/rules", label: "Rules", icon: <Shield size={18} /> },
  { to: "/dashboard/team-formation", label: "Team Formation", icon: <Sparkles size={18} /> }
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch the active event details
  useEffect(() => {
    if (!eventId) { 
      setSelectedEvent(null); 
      return; 
    }
    api.get<Event>(`/api/events/${eventId}`)
      .then(({ data }) => setSelectedEvent(data))
      .catch(() => setSelectedEvent(null));
  }, [eventId]);

  // Append ?event_id= to every nav link so the selection persists across pages
  function navTo(base: string) {
    return eventId ? `${base}?event_id=${eventId}` : base;
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-[#faf8fc] overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-[210px] bg-white border-r border-[#ece8f3] flex flex-col justify-between shrink-0">
        
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="h-[66px] px-5 flex items-center border-b border-[#f2edf8]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white flex items-center justify-center shadow-md text-lg">
                ✦
              </div>
              <h2 className="text-[20px] font-bold tracking-[-0.5px]">HackFlow</h2>
            </div>
          </div>

          {/* ADMIN */}
          <div className="px-5 py-5 border-b border-[#f2edf8]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] text-[#667085]">Admin Panel</p>
                <h3 className="text-[18px] font-bold leading-7 mt-1">
                  Event<br />Management
                </h3>
              </div>
              <button className="text-[#98a2b3] mt-1">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* ACTIVE EVENT BANNER (Injected from Code 2, Styled for Code 1) */}
          <div className="px-5 py-3 border-b border-[#f2edf8]">
            {selectedEvent ? (
              <div className="p-3 bg-[#f3e8ff] rounded-xl border border-[#e9d5ff]">
                <p className="text-[10px] font-bold text-[#9333ea] uppercase tracking-wider">Active Event</p>
                <p className="text-[13px] font-bold text-[#4c1d95] truncate mt-0.5" title={selectedEvent.name}>
                  {selectedEvent.name}
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-[12px] font-medium text-[#7c3aed] hover:text-[#5b21b6] transition mt-1"
                >
                  Change →
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[#fffbeb] rounded-xl border border-[#fef3c7]">
                <p className="text-[12px] font-bold text-[#d97706]">No event selected</p>
                <p className="text-[11px] text-[#b45309] mt-0.5">Pick one from Overview</p>
              </div>
            )}
          </div>

          {/* NAV */}
          <nav className="px-3 py-4 space-y-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={navTo(item.to)} // <-- Uses dynamic routing function
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all
                  ${isActive ? "bg-[#f3e8ff] text-[#7c3aed]" : "text-[#667085] hover:bg-[#f8f5fc]"}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* PROFILE */}
        <div className="p-4 border-t border-[#f2edf8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7c3aed] font-bold text-sm">
                A
              </div>
              <div>
                <h3 className="text-[14px] font-bold">Admin Access</h3>
                <p className="text-[12px] text-[#667085] mt-0.5">Super Admin</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} // <-- Fully wired logout
              className="text-[#667085] hover:text-red-500 transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

      </aside>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto">
        
        {/* TOPBAR */}
        <div className="h-[66px] bg-white border-b border-[#ece8f3] px-6 flex items-center justify-end sticky top-0 z-50">
          <div className="flex items-center gap-5">
            <button className="relative text-[#111827]">
              <Bell size={20} />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#9333ea]" />
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </div>

        {/* PAGE */}
        <main className="px-12 py-6 w-full">
          <Outlet />
        </main>

      </div>
    </div>
  );
}