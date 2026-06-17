// frontend/src/pages/Committee Dashboard/ActivityLogs.tsx

import {
  Search,
  Download,
  MoreVertical,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  ChevronRight
} from "lucide-react";

export default function ActivityLogs() {
  const stats = [
    {
      title: "Total Participants",
      value: "524",
      change: "+12%",
      trend: "up",
      icon: Users,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      title: "Submissions Received",
      value: "186",
      change: "+18%",
      trend: "up",
      icon: FileText,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Evaluations Completed",
      value: "142",
      change: "+22%",
      trend: "up",
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      title: "Pending Requests",
      value: "18",
      change: "-8%",
      trend: "down",
      icon: AlertTriangle,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  const activities = [
    {
      time: "10:45 AM",
      date: "18 May 2026",
      user: "Rahul Sharma",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?img=11",
      activity: "uploaded Final Presentation",
      team: "Team Alpha",
      module: "Submission",
      details: "Final_Presentation.pdf (12.4 MB)",
      status: "Completed"
    },
    {
      time: "10:40 AM",
      date: "18 May 2026",
      user: "Judge #4",
      role: "Judge",
      avatar: "https://i.pravatar.cc/150?img=3",
      activity: "completed evaluation",
      team: "Team Delta",
      module: "Evaluation",
      details: "Round 2 • Score: 85/100",
      status: "Completed"
    },
    {
      time: "10:28 AM",
      date: "18 May 2026",
      user: "Disha Singh",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?img=5",
      activity: "raised Internship Conflict",
      team: "Team Gamma",
      module: "Conflict Request",
      details: "Request ID: CR-0832",
      status: "Pending"
    },
    {
      time: "10:10 AM",
      date: "18 May 2026",
      user: "Admin User",
      role: "Administrator",
      avatar: "https://i.pravatar.cc/150?img=8",
      activity: "published Round 2 Results",
      team: "All Teams",
      module: "Announcement",
      details: "Results are now live",
      status: "Completed"
    },
    {
      time: "09:52 AM",
      date: "18 May 2026",
      user: "Team Beta",
      role: "Team Member",
      avatar: "https://i.pravatar.cc/150?img=12",
      activity: "updated project details",
      team: "Team Beta",
      module: "Team",
      details: "Project description updated",
      status: "Completed"
    },
    {
      time: "09:35 AM",
      date: "18 May 2026",
      user: "Amit Verma",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?img=13",
      activity: "uploaded Abstract Document",
      team: "Team Phoenix",
      module: "Submission",
      details: "Abstract.pdf (2.1 MB)",
      status: "Completed"
    },
    {
      time: "09:20 AM",
      date: "18 May 2026",
      user: "Neha Pillai",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?img=9",
      activity: "invited new team member",
      team: "Team Innovators",
      module: "Team",
      details: "Invited: Rohit Mehta",
      status: "Completed"
    },
    {
      time: "09:05 AM",
      date: "18 May 2026",
      user: "Judge #2",
      role: "Judge",
      avatar: "https://i.pravatar.cc/150?img=4",
      activity: "added feedback",
      team: "Team Zenith",
      module: "Evaluation",
      details: "Feedback added for Round 1",
      status: "Completed"
    },
    {
      time: "08:50 AM",
      date: "18 May 2026",
      user: "Admin User",
      role: "Administrator",
      avatar: "https://i.pravatar.cc/150?img=8",
      activity: "created announcement",
      team: "All Participants",
      module: "Announcement",
      details: "Title: Reminder: Round 3 Starts Tomorrow",
      status: "Completed"
    },
    {
      time: "08:30 AM",
      date: "18 May 2026",
      user: "Riya Mehta",
      role: "Participant",
      avatar: "https://i.pravatar.cc/150?img=10",
      activity: "uploaded Demo Video",
      team: "Team CodeCrafters",
      module: "Submission",
      details: "Demo.mp4 (45.6 MB)",
      status: "Completed"
    }
  ];

  const recentSubmissions = [
    { team: "Team Alpha", file: "Final Presentation", time: "10:45 AM", icon: FileText, color: "text-purple-600", bgColor: "bg-purple-50" },
    { team: "Team Delta", file: "Demo Video", time: "10:32 AM", icon: Upload, color: "text-green-600", bgColor: "bg-green-50" },
    { team: "Team Phoenix", file: "Abstract Document", time: "10:15 AM", icon: FileText, color: "text-purple-600", bgColor: "bg-purple-50" },
    { team: "Team Innovators", file: "Project Report", time: "09:58 AM", icon: FileText, color: "text-red-600", bgColor: "bg-red-50" },
    { team: "Team CodeCrafters", file: "Presentation Slides", time: "09:40 AM", icon: FileText, color: "text-green-600", bgColor: "bg-green-50" }
  ];

  const pendingReviews = [
    { type: "Conflict Requests", count: 8, icon: AlertTriangle, color: "text-orange-600" },
    { type: "Judge Reviews", count: 4, icon: Users, color: "text-purple-600" },
    { type: "Approvals", count: 6, icon: CheckCircle2, color: "text-green-600" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={16} className="text-green-600" />;
      case "Pending":
        return <AlertTriangle size={16} className="text-orange-600" />;
      default:
        return <CheckCircle2 size={16} className="text-green-600" />;
    }
  };

  const getModuleColor = (module: string) => {
    const colors: { [key: string]: string } = {
      "Submission": "bg-purple-100 text-purple-700",
      "Evaluation": "bg-green-100 text-green-700",
      "Conflict Request": "bg-orange-100 text-orange-700",
      "Announcement": "bg-blue-100 text-blue-700",
      "Team": "bg-gray-100 text-gray-700"
    };
    return colors[module] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp size={16} className="text-green-600" />
                  ) : (
                    <TrendingDown size={16} className="text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last 7 days</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities, users, teams..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>All Roles</option>
            <option>Participant</option>
            <option>Judge</option>
            <option>Administrator</option>
          </select>
          <select className="px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>All Modules</option>
            <option>Submission</option>
            <option>Evaluation</option>
            <option>Conflict Request</option>
            <option>Announcement</option>
            <option>Team</option>
          </select>
          <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl">
            <Calendar size={16} className="text-gray-400" />
            <input type="text" className="outline-none text-sm w-28" defaultValue="18 May 2026" />
            <span className="text-gray-400">-</span>
            <input type="text" className="outline-none text-sm w-28" defaultValue="18 May 2026" />
          </div>
          <button className="px-5 py-2.5 border border-purple-600 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition flex items-center gap-2">
            <Download size={18} />
            Export Logs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Activity Table */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">All Activities</h3>
                <p className="text-sm text-gray-600 mt-1">42 activities found</p>
              </div>
              <button className="text-purple-600 font-medium hover:text-purple-700 flex items-center gap-1">
                View All Activities
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Time</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">User</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Activity</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Module</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3">Details</th>
                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">Status</th>
                    <th className="px-5 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activities.map((activity, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{activity.time}</span>
                          <span className="text-xs text-gray-500 mt-0.5">{activity.date}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={activity.avatar} alt={activity.user} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{activity.user}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{activity.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 leading-tight">{activity.activity}</span>
                          <span className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">{activity.team}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${getModuleColor(activity.module)}`}>
                          {activity.module}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600 truncate block max-w-[200px]">{activity.details}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(activity.status)}
                          <span className={`text-sm font-semibold ${activity.status === "Completed" ? "text-green-600" : "text-orange-600"}`}>
                            {activity.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-5 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">Showing 1 to 10 of 42 activities</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Previous</button>
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm">1</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">2</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">3</button>
                <span className="text-gray-400 px-2">...</span>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">5</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Submissions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Recent Submissions</h3>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1">
                View All
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {recentSubmissions.map((submission, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className={`w-10 h-10 rounded-lg ${submission.bgColor} flex items-center justify-center ${submission.color} flex-shrink-0`}>
                    <submission.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{submission.team}</p>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{submission.file}</p>
                    <p className="text-xs text-gray-500 mt-1">{submission.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Pending Reviews</h3>
              <button className="text-purple-600 text-sm font-medium hover:text-purple-700 flex items-center gap-1">
                View All
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {pendingReviews.map((review, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center`}>
                      <review.icon size={16} className={review.color} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{review.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${review.color}`}>{review.count}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Today's Summary</h3>
              <span className="text-xs text-gray-500">18 May 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="#7c3aed" strokeWidth="8" fill="none" strokeDasharray="201" strokeDashoffset="100" />
                  <circle cx="48" cy="48" r="40" stroke="#22c55e" strokeWidth="8" fill="none" strokeDasharray="201" strokeDashoffset="150" />
                  <circle cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" strokeDasharray="201" strokeDashoffset="180" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">42</p>
                    <p className="text-xs text-gray-500">Activities</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                    <span className="text-sm text-gray-600">Submissions</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">15 (36%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <span className="text-sm text-gray-600">Evaluations</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">21 (50%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-gray-600">Announcements</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">4 (10%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                    <span className="text-sm text-gray-600">Team Activities</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">2 (4%)</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2.5 text-purple-600 text-sm font-medium hover:bg-purple-50 rounded-xl transition">
              More insights in Reports →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}