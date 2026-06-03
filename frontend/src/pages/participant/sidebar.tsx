import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Headphones,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/participant" },
  { icon: MessageSquare, label: "Chat", path: "/participant/chat" },
  { icon: FileText, label: "Submission", path: "/participant/submission" },
  { icon: Headphones, label: "Support Centre", path: "/participant/support" },
];

export default function ParticipantSidebar() {
  const location = useLocation();

  // ✅ FIXED: Only highlights the exact current route
 const isActive = (path: string) => {
  return location.pathname === path;
};

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white flex items-center justify-center shadow-md text-lg">
            ✦
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">HackFlow</h1>
            <p className="text-xs text-gray-500">Participant Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={20} className={active ? "text-purple-700" : "text-gray-500"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-purple-50 rounded-xl p-4 mb-3">
          <p className="text-sm font-semibold text-purple-900 mb-1">Need Help?</p>
          <p className="text-xs text-purple-700 mb-3">
            Facing any issue? Our support team is here to help you.
          </p>
          <button className="w-full py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}