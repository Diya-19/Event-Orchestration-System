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
  Send,
  Gavel,
  Activity,
  Plane
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
  useSearchParams,
  useLocation
} from "react-router-dom";

import { clearToken } from "../../lib/auth";
import { api } from "../../lib/api";
import { Event } from "../../types";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/dashboard/current-event", label: "Current Event", icon: <CalendarDays size={18} /> },
  { to: "/dashboard/multiple-events", label: "Multiple Events", icon: <FolderKanban size={18} /> },
  { to: "/dashboard/participants", label: "Participants", icon: <Users size={18} /> },
  { to: "/dashboard/judge-management", label: "Judge Management", icon: <Gavel size={18} /> },
  { to: "/dashboard/communication", label: "Communication", icon: <Send size={18} /> },
  { to: "/dashboard/scoring", label: "Scoring", icon: <FolderKanban size={18} /> },
  { to: "/dashboard/results", label: "Results", icon: <Trophy size={18} /> },
  { to: "/dashboard/activity-logs", label: "Activity Logs", icon: <Activity size={18} /> },
  { to: "/dashboard/travel-management", label: "Travel Management", icon: <Plane size={18} /> },
  { to: "/dashboard/rules", label: "Rules", icon: <Shield size={18} /> },
  { to: "/dashboard/team-formation", label: "Team Formation", icon: <Sparkles size={18} /> },
  { to: "/dashboard/travel-logistics", label: "Travel & Logistics", icon: <Plane size={18} />}
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // ✅ Logic to show dynamic Title in Top Bar
  const getPageHeader = () => {
    const path = location.pathname;
    if (path.includes("activity-logs")) return { title: "Activity Logs", subtitle: "Monitor all important activities and actions across the platform" };
    if (path.includes("participants")) return { title: "Participants", subtitle: "Manage all hackathon participants" };
    if (path.includes("current-event")) return { title: "Current Event", subtitle: "Manage the active event" };
    if (path.includes("team-formation")) return { title: "Team Formation", subtitle: "AI-powered team generation and drafting" };
    if (path.includes("scoring")) return { title: "Scoring", subtitle: "Manage evaluation criteria and scores" };
    if (path.includes("results")) return { title: "Results", subtitle: "View and publish final results" };
    if (path.includes("communication")) return { title: "Communication", subtitle: "Send announcements and messages" };
    if (path.includes("judge-management")) return { title: "Judge Management", subtitle: "Assign judges and manage evaluations" };
    if (path.includes("rules")) return { title: "Rules", subtitle: "Configure event rules and policies" };
    if (path.includes("multiple-events")) return { title: "Multiple Events", subtitle: "Manage all your hackathons" };
    if (path.includes("travel-management")) return { title: "Travel Management", subtitle: "Manage and review travel requests for Round 3 qualified teams" }; // ✅ ADDED
    if (path.includes("travel-logistics")) return { title: "Travel & Logistics Management", subtitle: "Manage travel details, hotel accommodations, event schedules and reimbursements" };

    // Default
    return { title: "Dashboard", subtitle: "Overview of event management" };
  };

  const { title, subtitle } = getPageHeader();

  // ✅ Logic to show dynamic Title in Top Bar
  const getPageHeader = () => {
    const path = location.pathname;
    if (path.includes("activity-logs")) return { title: "Activity Logs", subtitle: "Monitor all important activities and actions across the platform" };
    if (path.includes("participants")) return { title: "Participants", subtitle: "Manage all hackathon participants" };
    if (path.includes("current-event")) return { title: "Current Event", subtitle: "Manage the active event" };
    if (path.includes("team-formation")) return { title: "Team Formation", subtitle: "AI-powered team generation and drafting" };
    if (path.includes("scoring")) return { title: "Scoring", subtitle: "Manage evaluation criteria and scores" };
    if (path.includes("results")) return { title: "Results", subtitle: "View and publish final results" };
    if (path.includes("communication")) return { title: "Communication", subtitle: "Send announcements and messages" };
    if (path.includes("judge-management")) return { title: "Judge Management", subtitle: "Assign judges and manage evaluations" };
    if (path.includes("rules")) return { title: "Rules", subtitle: "Configure event rules and policies" };
    if (path.includes("multiple-events")) return { title: "Multiple Events", subtitle: "Manage all your hackathons" };
    if (path.includes("travel-management")) return { title: "Travel Management", subtitle: "Manage and review travel requests for Round 3 qualified teams" }; // ✅ ADDED
    if (path.includes("travel-logistics")) return { title: "Travel & Logistics Management", subtitle: "Manage travel details, hotel accommodations, event schedules and reimbursements"};
    
    // Default
    return { title: "Dashboard", subtitle: "Overview of event management" };
  };

  const { title, subtitle } = getPageHeader();

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


  // 👇 ADD THIS HERE
  useEffect(() => {
    const socket = new WebSocket(
  "ws://localhost:8000/api/participant/ws/support"
);

    socket.onopen = () => {
      console.log("Support websocket connected");
    };

    socket.onerror = (error) => {
      console.log("WebSocket Error", error);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_support_request") {
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    socket.onclose = () => {
      console.log("Support websocket disconnected");
    };

    return () => socket.close();
  }, []);

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
      <aside className="w-[210px] h-screen bg-white border-r border-[#ece8f3] flex flex-col shrink-0">
        {/* FIXED TOP */}
        <div>
          {/* LOGO */}
          <div className="h-[66px] px-5 flex items-center border-b border-[#f2edf8]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white flex items-center justify-center shadow-md text-lg">
                ✦
              </div>
              <h2 className="text-[20px] font-bold tracking-[-0.5px]">
                HackFlow
              </h2>
            </div>
          </div>

          {/* ADMIN */}
          <div className="px-5 py-5 border-b border-[#f2edf8]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] text-[#667085]">
                  Admin Panel
                </p>
                <h3 className="text-[18px] font-bold leading-7 mt-1">
                  Event
                  <br />
                  Management
                </h3>
              </div>
              <button className="text-[#98a2b3] mt-1">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          {/* ACTIVE EVENT */}
          <div className="px-5 py-3 border-b border-[#f2edf8]">
            {selectedEvent ? (
              <div className="p-3 bg-[#f3e8ff] rounded-xl border border-[#e9d5ff]">
                <p className="text-[10px] font-bold text-[#9333ea] uppercase tracking-wider">
                  Active Event
                </p>
                <p
                  className="text-[13px] font-bold text-[#4c1d95] truncate mt-0.5"
                  title={selectedEvent.name}
                >
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
                <p className="text-[12px] font-bold text-[#d97706]">
                  No event selected
                </p>
                <p className="text-[11px] text-[#b45309] mt-0.5">
                  Pick one from Overview
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SCROLLABLE NAV ONLY */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="px-3 py-4 space-y-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={navTo(item.to)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all
                  ${isActive
                    ? "bg-[#f3e8ff] text-[#7c3aed]"
                    : "text-[#667085] hover:bg-[#f8f5fc]"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* FIXED PROFILE */}
        <div className="p-4 border-t border-[#f2edf8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7c3aed] font-bold text-sm">
                A
              </div>
              <div>
                <h3 className="text-[14px] font-bold">
                  Admin Access
                </h3>
                <p className="text-[12px] text-[#667085] mt-0.5">
                  Super Admin
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#667085] hover:text-red-500 transition"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {/* ✅ UPDATED TOPBAR: Now includes Dynamic Title */}
        <div className="h-[66px] bg-white border-b border-[#ece8f3] px-6 flex items-center justify-between sticky top-0 z-50">

          {/* Left Side: Dynamic Title */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>

          <div className="flex items-center gap-4">

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(0);
                }}
                className="w-10 h-10 rounded-xl bg-[#f8f5fc] hover:bg-[#f3e8ff] flex items-center justify-center transition"
              >
                <Bell size={18} className="text-[#667085]" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#7c3aed] text-white text-[10px] flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b">
                   <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Support Requests</h3>

                    <button
                      onClick={() => {
                        setNotifications([]);
                        setUnreadCount(0);
                      }}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-3 text-sm text-gray-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 border-b hover:bg-gray-50 flex justify-between items-start"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {item.issue_type}
                            </p>

                            <p className="text-xs text-gray-500">
                              Priority: {item.priority}
                            </p>

                            <p className="text-xs text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>

                          <button
                            onClick={() =>
                              setNotifications(prev =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="ml-3 text-gray-400 hover:text-red-500 text-lg leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white flex items-center justify-center font-semibold shadow-md">
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
