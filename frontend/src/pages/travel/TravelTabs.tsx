import { NavLink } from "react-router-dom";
import { Plane, Bell, MessageSquare } from "lucide-react";

export default function TravelTabs() {
  const tabs = [
    { name: "Dashboard", path: "/participant/travel", icon: Plane, exact: true },
    { name: "Queries", path: "/participant/travel-queries", icon: MessageSquare, exact: false },
    { name: "Notifications", path: "/participant/notifications", icon: Bell, exact: false },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              end={tab.exact}
              className={({ isActive }) =>
                `group inline-flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-all ${
                  isActive
                    ? "border-purple-600 text-purple-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {tab.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
