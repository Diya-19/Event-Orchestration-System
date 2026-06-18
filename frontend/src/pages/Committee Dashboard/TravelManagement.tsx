import { useState } from "react";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Send,
  Flag,
  Download,
  ChevronLeft,
  ChevronRight,
  Plane,
  DollarSign,
  Building,
  Utensils,
  Bus,
  Bold,
  Italic,
  List,
  ListOrdered,
  X
} from "lucide-react";

export default function TravelManagement() {
  const [selectedQuery, setSelectedQuery] = useState<number | null>(1);
  const [replyText, setReplyText] = useState("");

  const stats = [
    { icon: MessageCircle, label: "Total Queries", value: 48, sublabel: "All time", color: "purple" },
    { icon: MessageCircle, label: "Open", value: 12, sublabel: "Require attention", color: "orange" },
    { icon: Clock, label: "Awaiting Response", value: 8, sublabel: "Participant replied", color: "blue" },
    { icon: CheckCircle2, label: "Resolved", value: 28, sublabel: "This event", color: "green" },
  ];

  const queries = [
    {
      id: 1,
      initials: "RS",
      name: "Rahul Sharma",
      team: "Team Alpha",
      category: "Airport Pickup",
      categoryIcon: Plane,
      subject: "Airport pickup time confirmation",
      priority: "Medium",
      submitted: "22 Jun 2026\n09:15 AM",
      status: "Open"
    },
    {
      id: 2,
      initials: "AM",
      name: "Anita Mehta",
      team: "Team Vega",
      category: "Reimbursement",
      categoryIcon: DollarSign,
      subject: "Reimbursement form upload issue",
      priority: "High",
      submitted: "22 Jun 2026\n10:20 AM",
      status: "Awaiting Response"
    },
    {
      id: 3,
      initials: "DK",
      name: "Dev Kumar",
      team: "Team ByteBuilders",
      category: "Hotel Stay",
      categoryIcon: Building,
      subject: "Request for early check-in",
      priority: "Medium",
      submitted: "22 Jun 2026\n11:20 AM",
      status: "Open"
    },
    {
      id: 4,
      initials: "NP",
      name: "Neha Patel",
      team: "Team Nova",
      category: "Food & Dietary",
      categoryIcon: Utensils,
      subject: "Severe nut allergy – meal request",
      priority: "High",
      submitted: "22 Jun 2026\n12:35 PM",
      status: "Open"
    },
    {
      id: 5,
      initials: "AY",
      name: "Arjun Yadav",
      team: "Team Frontend",
      category: "Shuttle Service",
      categoryIcon: Bus,
      subject: "Shuttle schedule for team dinner",
      priority: "Low",
      submitted: "22 Jun 2026\n01:10 PM",
      status: "Resolved"
    },
    {
      id: 6,
      initials: "RS",
      name: "Riya Singh",
      team: "Team Alpha",
      category: "Reimbursement",
      categoryIcon: DollarSign,
      subject: "Clarification on eligible expenses",
      priority: "Medium",
      submitted: "22 Jun 2026\n02:05 PM",
      status: "Awaiting Response"
    },
    {
      id: 7,
      initials: "VS",
      name: "Vivek Sinha",
      team: "Team CodeCrafters",
      category: "Hotel Stay",
      categoryIcon: Building,
      subject: "Extra pillow request",
      priority: "Low",
      submitted: "22 Jun 2026\n03:18 PM",
      status: "Resolved"
    },
    {
      id: 8,
      initials: "KB",
      name: "Kavya Bhat",
      team: "Team InnovateX",
      category: "Airport Pickup",
      categoryIcon: Plane,
      subject: "Landing late night – pickup arrangement",
      priority: "High",
      submitted: "22 Jun 2026\n04:40 PM",
      status: "Open"
    }
  ];

  const selectedQueryData = queries.find(q => q.id === selectedQuery);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Awaiting Response": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Resolved": return "bg-green-50 text-green-700 border border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700 border border-red-200";
      case "Medium": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Low": return "bg-green-50 text-green-700 border border-green-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Travel Queries Management</h1>
        <p className="text-gray-600 mt-1">View participant travel-related queries and provide timely responses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === "purple" ? "bg-purple-50" :
                stat.color === "orange" ? "bg-orange-50" :
                stat.color === "blue" ? "bg-blue-50" : "bg-green-50"
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === "purple" ? "text-purple-600" :
                  stat.color === "orange" ? "text-orange-600" :
                  stat.color === "blue" ? "text-blue-600" : "text-green-600"
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.sublabel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: All Travel Queries Table */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">All Travel Queries</h3>
            
            {/* Filters */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by participant, team, subject..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Categories</option>
                <option>Airport Pickup</option>
                <option>Reimbursement</option>
                <option>Hotel Stay</option>
                <option>Food & Dietary</option>
                <option>Shuttle Service</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Status</option>
                <option>Open</option>
                <option>Awaiting Response</option>
                <option>Resolved</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-medium">Participant / Team</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Priority</th>
                  <th className="p-4 font-medium">Submitted</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queries.map((query) => (
                  <tr
                    key={query.id}
                    onClick={() => setSelectedQuery(query.id)}
                    className={`hover:bg-gray-50 transition cursor-pointer ${
                      selectedQuery === query.id ? "bg-purple-50 border-l-4 border-l-purple-600" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                          {query.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{query.name}</p>
                          <p className="text-xs text-gray-500">{query.team}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <query.categoryIcon size={16} className="text-gray-600" />
                        <span className="text-gray-700 text-sm">{query.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 text-sm max-w-[200px] truncate">{query.subject}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                        {query.priority}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-xs whitespace-pre-line">{query.submitted}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                        {query.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing 1 to 8 of 48 entries</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"><ChevronLeft size={16} /></button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">3</button>
              <span className="px-2 py-1 text-gray-500">...</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">6</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right: Query Detail Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-900">Query Detail</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {selectedQueryData ? (
            <>
              {/* User Info */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                    {selectedQueryData.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{selectedQueryData.name}</p>
                    <p className="text-xs text-gray-500">{selectedQueryData.team}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQueryData.status)}`}>
                  {selectedQueryData.status}
                </span>
              </div>

              {/* Category & Submitted */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Plane size={12} /> Category
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedQueryData.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Clock size={12} /> Submitted
                  </p>
                  <p className="text-sm font-medium text-gray-900 whitespace-pre-line text-xs">{selectedQueryData.submitted}</p>
                </div>
              </div>

              {/* Participant Question */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Participant Question</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                  Hello HackFlow team,<br /><br />
                  I will be landing at BLR Airport (T1) on 21 June at 11:45 PM. Can you please confirm the pickup time and location for the organised shuttle?<br /><br />
                  Thanks!
                </div>
              </div>

              {/* Your Reply */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Your Reply</p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply to the participant..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-2"
                ></textarea>
                
                {/* Formatting Toolbar - Removed Link and Paperclip */}
                <div className="flex items-center gap-1 p-2 border border-gray-200 rounded-lg mb-3">
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Bold size={14} /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Italic size={14} /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded"><List size={14} /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded"><ListOrdered size={14} /></button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm">
                    <Send size={16} />
                    Send Reply
                  </button>
                  <button className="px-3 py-2 border border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-50 transition flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} />
                    Mark Resolved
                  </button>
                  <button className="px-3 py-2 border border-orange-300 text-orange-700 font-medium rounded-lg hover:bg-orange-50 transition flex items-center gap-2 text-sm">
                    <Flag size={16} />
                    Escalate
                  </button>
                </div>
              </div>

              {/* Response History */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-3">Response History</p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs flex-shrink-0">
                      AS
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900">Aarav Sharma (You)</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Committee</span>
                        <span className="text-xs text-gray-500 ml-auto text-right">22 Jun 2026<br />09:28 AM</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                        Hi Rahul,<br /><br />
                        Thanks for sharing the details. The shuttle from BLR Airport (T1) will be available at 11:30 PM near Gate 4.<br /><br />
                        Please look for the HackFlow signage.<br /><br />
                        Safe travels!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a query to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}