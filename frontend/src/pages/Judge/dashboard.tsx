// frontend/src/pages/Judge/dashboard.tsx

import { 
  Users, 
  CheckCircle, 
  Hourglass, 
  Clock, 
  ArrowRight, 
  CalendarDays, 
  Bell  // ✅ Changed from AlertCircle to Bell
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// --- Data ---
const statsData = [
  { title: "Assigned Teams", value: "12", icon: Users, color: "bg-purple-100 text-purple-600" },
  { title: "Evaluations Completed", value: "5", icon: CheckCircle, color: "bg-green-100 text-green-600" },
  { title: "Pending Evaluations", value: "7", icon: Hourglass, color: "bg-orange-100 text-orange-600" },
  { title: "Average Time per Team", value: "18m", icon: Clock, color: "bg-blue-100 text-blue-600" },
];

const progressData = [
  { name: "Completed", value: 42, color: "#8b5cf6" },
  { name: "Remaining", value: 58, color: "#f3f4f6" },
];

const upcomingDeadlines = [
  { title: "Round 2 Evaluation", date: "May 12, 2025 11:30 AM", tag: "Due in 2 days", color: "bg-orange-50 text-orange-700" },
  { title: "Final Evaluation", date: "Jun 1, 2025 11:59 PM", tag: "Due in 22 days", color: "bg-blue-50 text-blue-700" },
];

const recentActivity = [
  { title: "You evaluated Team Nova", subtitle: "Score: 8.5/10", time: "4 hours ago" },
  { title: "You provided feedback for Team Beta", subtitle: "Score: 7.0/10", time: "Yesterday" },
];

export default function JudgeDashboard() {
  return (
    <div className="flex-1 bg-gray-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-1">Welcome back,</p>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Dr. Ananya Sharma <span>👋</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">Here's an overview of your evaluation tasks.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* ✅ Bell Icon with Notification Dot */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              <Bell size={24} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
              <img 
                src="https://i.pravatar.cc/150?img=5" 
                alt="Dr. Ananya Sharma" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Progress & Activity */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Evaluation Progress Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Evaluation Progress</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Donut Chart */}
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        stroke="none"
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold text-gray-900">42%</p>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="flex-1 space-y-6 w-full">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-700 font-medium">Overall Progress</p>
                      <p className="text-purple-600 font-bold">42%</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">You've completed 5 out of 12 evaluations.</p>
                  </div>

                  {/* Recent Activity */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-gray-900 font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                            <CheckCircle size={16} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-medium text-sm">{activity.title}</p>
                            <p className="text-gray-500 text-xs">{activity.subtitle}</p>
                          </div>
                          <span className="text-gray-400 text-xs">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 text-purple-600 text-sm font-medium hover:underline flex items-center gap-1">
                      View all activity <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Deadlines */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Deadlines</h2>
            <div className="space-y-6">
              {upcomingDeadlines.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <CalendarDays size={20} className="text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-bold text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{item.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.color}`}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2 text-purple-600 font-medium text-sm hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-center gap-1">
              View all deadlines <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}