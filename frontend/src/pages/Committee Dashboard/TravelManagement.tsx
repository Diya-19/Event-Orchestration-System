import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Plane,
  Train,
  Bus,
  Search,
  ChevronDown,
  MoreVertical,
  Upload,
  AlertTriangle,
  Home,
  MapPin,
  Info
} from "lucide-react";
import { useState } from "react";

export default function TravelManagement() {
  const [selectedTab, setSelectedTab] = useState("All Requests");

  const tabs = ["All Requests", "Submitted", "Under Review", "Approved", "Rejected"];

  const teams = [
    { name: "Team Innovators", rep: "Rahul Sharma", status: "Submitted", mode: "Flight", date: "21 Jun 2026\n11:45 AM", accommodation: true, members: 4, ticket: true },
    { name: "CodeNinjas", rep: "Ananya Iyer", status: "Under Review", mode: "Flight", date: "21 Jun 2026\n02:30 PM", accommodation: true, members: 3, ticket: true },
    { name: "Tech Mavericks", rep: "Rohit Verma", status: "Submitted", mode: "Train", date: "22 Jun 2026\n09:15 AM", accommodation: false, members: 3, ticket: true },
    { name: "Byte Builders", rep: "Aditya Singh", status: "Approved", mode: "Flight", date: "21 Jun 2026\n10:10 AM", accommodation: true, members: 4, ticket: true },
    { name: "Algo Titans", rep: "Neha Pillai", status: "Under Review", mode: "Bus", date: "22 Jun 2026\n07:00 AM", accommodation: true, members: 3, ticket: true },
    { name: "Circuit Breakers", rep: "Karan Mehta", status: "Rejected", mode: "Flight", date: "21 Jun 2026\n01:20 PM", accommodation: false, members: 4, ticket: true },
    { name: "Debug Dynasty", rep: "Isha Patel", status: "Submitted", mode: "Train", date: "22 Jun 2026\n11:30 AM", accommodation: true, members: 3, ticket: false },
    { name: "The Optimizers", rep: "Vivek Nair", status: "Approved", mode: "Flight", date: "21 Jun 2026\n05:40 PM", accommodation: true, members: 4, ticket: true },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-blue-100 text-blue-700";
      case "Under Review": return "bg-orange-100 text-orange-700";
      case "Approved": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "Flight": return <Plane size={16} className="text-blue-600" />;
      case "Train": return <Train size={16} className="text-gray-600" />;
      case "Bus": return <Bus size={16} className="text-orange-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Users className="text-purple-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">25</p>
          <p className="text-sm text-gray-600">Total Teams</p>
          <p className="text-xs text-gray-500 mt-1">Qualified for Round 3</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="text-blue-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">18</p>
          <p className="text-sm text-gray-600">Submitted Requests</p>
          <p className="text-xs text-gray-500 mt-1">72% of total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Clock className="text-orange-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">6</p>
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-xs text-gray-500 mt-1">24% of total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">14</p>
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-xs text-gray-500 mt-1">56% of total</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle className="text-red-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">2</p>
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-xs text-gray-500 mt-1">8% of total</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="px-6 pt-4 border-b border-gray-200">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                    selectedTab === tab
                      ? "text-purple-700 border-purple-700"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search team name..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option>All Status</option></select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option>All Travel Modes</option></select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"><option>All Accommodation</option></select>
            <button className="px-3 py-2 text-purple-700 font-medium border border-purple-200 rounded-lg hover:bg-purple-50 text-sm">Bulk Actions</button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 font-medium w-10"><input type="checkbox" className="rounded" /></th>
                  <th className="p-4 font-medium">Team Name</th>
                  <th className="p-4 font-medium">Travel Status</th>
                  <th className="p-4 font-medium">Travel Mode</th>
                  <th className="p-4 font-medium">Arrival Date</th>
                  <th className="p-4 font-medium">Accommodation</th>
                  <th className="p-4 font-medium">Members</th>
                  <th className="p-4 font-medium">Ticket</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teams.map((team, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-4"><input type="checkbox" className="rounded" /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 font-bold text-xs">
                          <Users size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{team.name}</p>
                          <p className="text-xs text-gray-500">Rep: {team.rep}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(team.status)}`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getModeIcon(team.mode)}
                        <span className="text-gray-700">{team.mode}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 whitespace-pre-line text-xs">{team.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${team.accommodation ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {team.accommodation ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-center">{team.members}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {team.ticket ? (
                          <><CheckCircle2 size={14} className="text-green-600" /> <span className="text-xs text-green-700 font-medium">Uploaded</span></>
                        ) : (
                          <><AlertTriangle size={14} className="text-orange-600" /> <span className="text-xs text-orange-700 font-medium">Not Uploaded</span></>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="text-purple-700 text-xs font-medium hover:underline">View</button>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1 to 8 of 18 entries</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">Previous</button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">3</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">Next</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pie Chart Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Travel Status Overview</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="#3b82f6" strokeWidth="16" fill="none" strokeDasharray="280" strokeDashoffset="80" />
                  <circle cx="64" cy="64" r="56" stroke="#f97316" strokeWidth="16" fill="none" strokeDasharray="280" strokeDashoffset="220" />
                  <circle cx="64" cy="64" r="56" stroke="#22c55e" strokeWidth="16" fill="none" strokeDasharray="280" strokeDashoffset="260" />
                  <circle cx="64" cy="64" r="56" stroke="#ef4444" strokeWidth="16" fill="none" strokeDasharray="280" strokeDashoffset="270" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-gray-900">25</span>
                  <span className="text-xs text-gray-500">Total Teams</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-gray-600">Submitted</span><span className="font-semibold ml-auto">18 (72%)</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-gray-600">Under Review</span><span className="font-semibold ml-auto">6 (24%)</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-gray-600">Approved</span><span className="font-semibold ml-auto">14 (56%)</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-gray-600">Rejected</span><span className="font-semibold ml-auto">2 (8%)</span></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><FileText size={14} className="text-blue-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">Team Innovators</p><p className="text-xs text-gray-500">Submitted travel request</p></div>
                <div className="ml-auto text-xs text-gray-500 text-right"><p>10:30 AM</p><p>Today</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0"><CheckCircle2 size={14} className="text-green-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">Byte Builders</p><p className="text-xs text-gray-500">Travel request approved</p></div>
                <div className="ml-auto text-xs text-gray-500 text-right"><p>Yesterday</p><p>06:15 PM</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0"><XCircle size={14} className="text-red-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">Circuit Breakers</p><p className="text-xs text-gray-500">Travel request rejected</p></div>
                <div className="ml-auto text-xs text-gray-500 text-right"><p>19 Jun 2026</p><p>04:20 PM</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0"><Upload size={14} className="text-purple-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">CodeNinjas</p><p className="text-xs text-gray-500">Uploaded travel ticket</p></div>
                <div className="ml-auto text-xs text-gray-500 text-right"><p>19 Jun 2026</p><p>11:40 AM</p></div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0"><Home size={14} className="text-orange-600" /></div>
                <div><p className="text-sm font-medium text-gray-900">Algo Titans</p><p className="text-xs text-gray-500">Updated accommodation info</p></div>
                <div className="ml-auto text-xs text-gray-500 text-right"><p>18 Jun 2026</p><p>09:10 PM</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <Info className="text-purple-600" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-purple-900">Important Information</h4>
          <ul className="mt-1 text-sm text-purple-800 list-disc list-inside space-y-1">
            <li>Please review all travel requests carefully before approval.</li>
            <li>Ensure all tickets are uploaded and details are correct before approval.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}