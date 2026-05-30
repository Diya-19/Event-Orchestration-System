
// import { useEffect, useState } from "react";
// import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
// import { clearToken } from "../../lib/auth";
// // ⚠️ Uncomment when backend is ready:
// // import { api } from "../../lib/api";
// // import { Event } from "../../types";

// type Event = { id: string; name: string }; // Fallback type for now

// const NAV = [
//   { to: "/dashboard",                       label: "Overview",               end: true  },
//   { to: "/dashboard/participants",          label: "Participants",           end: false },
//   { to: "/dashboard/rules",                 label: "Rules",                  end: false },
//   { to: "/dashboard/participant-dashboard", label: "Participant Dashboard",  end: false },
// ];

// export default function DashboardLayout() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const eventId = searchParams.get("event_id") ?? "";
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

//   useEffect(() => {
//     if (!eventId) { setSelectedEvent(null); return; }
    
//     // ⚠️ TEMPORARY: Mock until backend API is live
//     setSelectedEvent({ id: eventId, name: "HackFlow 2026" });
    
//     /* Uncomment when backend is ready:
//     api.get<Event>(`/api/events/${eventId}`)
//       .then(({ data }) => setSelectedEvent(data))
//       .catch(() => setSelectedEvent(null));
//     */
//   }, [eventId]);

//   function navTo(base: string) {
//     return eventId ? `${base}?event_id=${eventId}` : base;
//   }
// import { useEffect, useState } from "react";
// import { NavLink, Outlet, useNavigate, useSearchParams } from "react-router-dom";
// import { clearToken } from "../../lib/auth";
// import { api } from "../../lib/api";
// import { Event } from "../../types";

// const NAV = [
//   { to: "/dashboard",              label: "Overview",      end: true  },
//   { to: "/dashboard/participants", label: "Participants",  end: false },
// ];

// export default function DashboardLayout() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const eventId = searchParams.get("event_id") ?? "";
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

//   useEffect(() => {
//     if (!eventId) { setSelectedEvent(null); return; }
//     api.get<Event>(`/api/events/${eventId}`)
//       .then(({ data }) => setSelectedEvent(data))
//       .catch(() => setSelectedEvent(null));
//   }, [eventId]);

//   // Append ?event_id= to every nav link so the selection persists across pages
//   function navTo(base: string) {
//     return eventId ? `${base}?event_id=${eventId}` : base;
//   }

//   function logout() {
//     clearToken();
//     navigate("/login");
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
//         <div className="px-5 py-6 border-b border-gray-100">
//           <p className="font-bold text-gray-900 text-sm">Event Orchestration</p>
//           <p className="text-xs text-gray-400 mt-0.5">Committee Portal</p>
//         </div>

//         {/* Active event banner */}
//         {selectedEvent ? (
//           <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
//             <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide">Active Event</p>
//             <p className="text-sm font-semibold text-indigo-800 truncate mt-0.5">{selectedEvent.name}</p>
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="text-xs text-indigo-400 hover:text-indigo-600 mt-1"
//             >
//               Change →
//             </button>
//           </div>
//         ) : (
//           <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
//             <p className="text-xs font-medium text-amber-600">No event selected</p>
//             <p className="text-xs text-amber-400 mt-0.5">Pick one from Overview</p>
//           </div>
//         )}

//         <nav className="flex-1 px-3 py-4 space-y-1">
//           {NAV.map(({ to, label, end }) => (
//             <NavLink
//               key={to}
//               to={navTo(to)}
//               end={end}
//               className={({ isActive }) =>
//                 `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   isActive
//                     ? "bg-indigo-50 text-indigo-700"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`
//               }
//             >
//               {label}
//             </NavLink>
//           ))}
//         </nav>
//         <div className="p-3 border-t border-gray-100">
//           <button
//             onClick={logout}
//             className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
//           >
//             Log out
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 overflow-y-auto p-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
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
  Outlet
} from "react-router-dom";

const NAV = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />
  },

  {
    to: "/dashboard/current-event",
    label: "Current Event",
    icon: <CalendarDays size={18} />
  },


  {
    to: "/dashboard/multiple-events",
    label: "Multiple Events",
    icon: <FolderKanban size={18} />
  },

  {
    to: "/dashboard/participants",
    label: "Participants",
    icon: <Users size={18} />
  },

  {
  to: "/dashboard/communication",
  label: "Communication",
  icon: <Send size={18} />
  },

  {
    to: "/dashboard/scoring",
    label: "Scoring",
    icon: <FolderKanban size={18} />
  },

  {
    to: "/dashboard/results",
    label: "Results",
    icon: <Trophy size={18} />
  },

  {
    to: "/dashboard/rules",
    label: "Rules",
    icon: <Shield size={18} />
  },

  {
    to: "/dashboard/team-formation",
    label: "Team Formation",
    icon: <Sparkles size={18} />
  },

];

export default function DashboardLayout() {

  return (

    <div className="
    flex
    h-screen
    bg-[#faf8fc]
    overflow-hidden
    ">

      {/* SIDEBAR */}

      <aside className="
      w-[210px]
      bg-white
      border-r
      border-[#ece8f3]
      flex
      flex-col
      justify-between
      shrink-0
      ">

        {/* TOP */}

        <div>

          {/* LOGO */}

          <div className="
          h-[66px]
          px-5
          flex
          items-center
          border-b
          border-[#f2edf8]
          ">

            <div className="
            flex
            items-center
            gap-3
            ">

              <div className="
              w-11
              h-11
              rounded-2xl
              bg-gradient-to-r
              from-[#7c3aed]
              to-[#9333ea]
              text-white
              flex
              items-center
              justify-center
              shadow-md
              text-lg
              ">

                ✦

              </div>

              <h2 className="
              text-[20px]
              font-bold
              tracking-[-0.5px]
              ">

                HackFlow

              </h2>

            </div>

          </div>

          {/* ADMIN */}

          <div className="
          px-5
          py-5
          border-b
          border-[#f2edf8]
          ">

            <div className="
            flex
            items-start
            justify-between
            ">

              <div>

                <p className="
                text-[12px]
                text-[#667085]
                ">

                  Admin Panel

                </p>

                <h3 className="
                text-[18px]
                font-bold
                leading-7
                mt-1
                ">

                  Event
                  <br />
                  Management

                </h3>

              </div>

              <button className="
              text-[#98a2b3]
              mt-1
              ">

                <MoreHorizontal size={18} />

              </button>

            </div>

          </div>

          {/* NAV */}

          <nav className="
          px-3
          py-5
          space-y-2
          ">

            {

              NAV.map((item) => (

                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `

                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  text-[15px]
                  font-medium
                  transition-all

                  ${

                    isActive

                    ?

                    "bg-[#f3e8ff] text-[#7c3aed]"

                    :

                    "text-[#667085] hover:bg-[#f8f5fc]"

                  }

                  `}
                >

                  {item.icon}

                  <span>

                    {item.label}

                  </span>

                </NavLink>

              ))

            }

          </nav>

        </div>

        {/* PROFILE */}

        <div className="
        p-4
        border-t
        border-[#f2edf8]
        ">

          <div className="
          flex
          items-center
          justify-between
          ">

            <div className="
            flex
            items-center
            gap-3
            ">

              <div className="
              w-11
              h-11
              rounded-full
              bg-[#f3e8ff]
              flex
              items-center
              justify-center
              text-[#7c3aed]
              font-bold
              text-sm
              ">

                A

              </div>

              <div>

                <h3 className="
                text-[14px]
                font-bold
                ">

                  Admin Access

                </h3>

                <p className="
                text-[12px]
                text-[#667085]
                mt-0.5
                ">

                  Super Admin

                </p>

              </div>

            </div>

            <button className="
            text-[#667085]
            hover:text-red-500
            transition
            ">

              <LogOut size={18} />

            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <div className="
      flex-1
      overflow-y-auto
      ">

        {/* TOPBAR */}

        <div className="
        h-[66px]
        bg-white
        border-b
        border-[#ece8f3]
        px-6
        flex
        items-center
        justify-end
        sticky
        top-0
        z-50
        ">

          <div className="
          flex
          items-center
          gap-5
          ">

            <button className="
            relative
            text-[#111827]
            ">

              <Bell size={20} />

              <div className="
              absolute
              -top-1
              -right-1
              w-2
              h-2
              rounded-full
              bg-[#9333ea]
              " />

            </button>

            <div className="
            w-12
            h-12
            rounded-full
            bg-gradient-to-r
            from-[#7c3aed]
            to-[#9333ea]
            text-white
            flex
            items-center
            justify-center
            font-bold
            ">

              A

            </div>

          </div>

        </div>

        {/* PAGE */}

        <main className="
        px-12
        py-6
        w-full
        ">

          <Outlet />

        </main>

      </div>

    </div>

  );

}