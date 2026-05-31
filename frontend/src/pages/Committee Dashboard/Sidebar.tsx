// frontend/src/pages/Committee Dashboard/Sidebar.tsx

import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom"; // ✅ Add Outlet
import {
  LayoutGrid,
  Users,
  Calendar,
  Trophy,
  Shield,
  UserPlus,
  Headphones,
  MoreVertical,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Team Space", path: "/dashboard/team-space" },
  { icon: Calendar, label: "Submission", path: "/dashboard/submission" },
  { icon: Trophy, label: "Results", path: "/dashboard/results" },
  { icon: Shield, label: "Rules", path: "/dashboard/rules" },
  { icon: UserPlus, label: "Team Formation", path: "/dashboard/team-formation" },
  { icon: Headphones, label: "Support Centre", path: "/dashboard/support" },
];

export default function Sidebar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    // ✅ Flex container for sidebar + main content
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Top Menu Button */}
        <div className="p-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="text-gray-600" size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setActiveItem(item.label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} className={active ? "text-purple-600" : "text-gray-500"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Main Content Area - This is where nested routes render */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}