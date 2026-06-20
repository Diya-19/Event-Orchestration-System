import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Plane, MessageSquare } from "lucide-react";

export default function CommitteeTravelLayout() {
  const location = useLocation();

  const tabs = [
    { name: "Travel Logistics", path: "/dashboard/travel/logistics", icon: Plane },
    { name: "Travel Queries Management", path: "/dashboard/travel/queries", icon: MessageSquare },
  ];

  return (
    <div className="font-sans text-slate-800 antialiased">
        <div className="border-b border-gray-200 mb-6 px-6 pt-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <NavLink
                  key={tab.name}
                  to={tab.path}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${isActive
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <Icon
                    className={`
                      mr-2 h-5 w-5
                      ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-500"}
                    `}
                    aria-hidden="true"
                  />
                  {tab.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <Outlet />
        </div>
    </div>
  );
}
