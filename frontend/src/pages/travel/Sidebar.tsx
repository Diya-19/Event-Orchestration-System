import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Bell, AlertCircle, LogOut, Plane, ChevronDown } from "lucide-react";
import { clearToken } from "../../lib/auth";

const NAV = [
  { to: "/travel", label: "Travel Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/travel/notifications", label: "Notifications", icon: <Bell size={18} /> },
  { to: "/travel/emergency", label: "Emergency Card", icon: <AlertCircle size={18} /> },
];

export default function TravelSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-[#faf8fc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 px-6 flex items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center">
              <Plane className="text-white" size={18} />
            </div>
            <h1 className="text-lg font-bold text-gray-900">HackFlow</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/travel"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                RS
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Rahul Sharma</p>
                <p className="text-xs text-gray-500">Team Alpha</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Travel & Logistics</h2>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-600 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                RS
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Rahul Sharma</p>
                <p className="text-xs text-gray-500">Team Alpha</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}