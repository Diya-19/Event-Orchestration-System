// frontend/src/pages/Judge/sidebar.tsx

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckCircle, LogOut } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/judge" },
  { icon: CheckCircle, label: "My Evaluations", path: "/judge/evaluations" },
];

export default function JudgeSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col flex-shrink-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white flex items-center justify-center shadow-md text-lg">
                ✦
              </div>
        <span className="text-xl font-bold text-gray-800">HackFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          // Check if current path matches or starts with the path
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} className={isActive ? "text-purple-700" : "text-gray-500"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}