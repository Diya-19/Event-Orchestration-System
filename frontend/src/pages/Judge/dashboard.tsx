import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Hourglass, 
  Calendar, 
  ChevronRight, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Megaphone,
  Sparkles,
  BarChart3
} from 'lucide-react';

// Mock Data matching the image interface exactly
const topStats = [
  { id: 1, title: 'Assigned Teams', value: '12', trend: '+ 2 from last week', trendType: 'up', icon: Users, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', strokeColor: '#8B5CF6' },
  { id: 2, title: 'Evaluations Completed', value: '5', trend: '+ 1 from last week', trendType: 'up', icon: CheckCircle2, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', strokeColor: '#10B981' },
  { id: 3, title: 'Pending Evaluations', value: '7', trend: '- 1 from last week', trendType: 'down', icon: Hourglass, iconBg: 'bg-orange-50', iconColor: 'text-orange-600', strokeColor: '#F97316' },
  { id: 4, title: 'In Progress Teams', value: '3', trend: '0 from last week', trendType: 'neutral', icon: Calendar, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', strokeColor: '#3B82F6' },
];

const assignedTeams = [
  { id: 'TN', name: 'Team Nova', track: 'AI/ML Track', date: 'May 10, 2025', evalCount: '2 / 3', progress: 67, status: 'In Progress', statusColor: 'bg-purple-50 text-purple-600' },
  { id: 'TA', name: 'Team Alpha', track: 'Web Dev Track', date: 'May 9, 2025', evalCount: '1 / 2', progress: 50, status: 'In Progress', statusColor: 'bg-emerald-50 text-emerald-600' },
  { id: 'TB', name: 'Team Beta', track: 'AI/ML Track', date: 'May 8, 2025', evalCount: '1 / 3', progress: 33, status: 'In Progress', statusColor: 'bg-orange-50 text-orange-600' },
  { id: 'TG', name: 'Team Gamma', track: 'Blockchain Track', date: 'May 8, 2025', evalCount: '0 / 2', progress: 0, status: 'Not Started', statusColor: 'bg-gray-100 text-gray-600' },
  { id: 'TD', name: 'Team Delta', track: 'UI/UX Track', date: 'May 7, 2025', evalCount: '1 / 2', progress: 50, status: 'In Progress', statusColor: 'bg-purple-50 text-purple-600' },
];

const deadlines = [
  { title: 'Round 2 Evaluation', date: 'May 12, 2025 • 11:30 AM', remaining: 'Due in 2 days', color: 'bg-orange-50 text-orange-700 border-orange-100' },
  { title: 'Final Evaluation', date: 'Jun 1, 2025 • 11:59 PM', remaining: 'Due in 22 days', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { title: 'Feedback Submission', date: 'Jun 5, 2025 • 05:00 PM', remaining: 'Due in 26 days', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
];

const announcements = [
  { title: 'Round 2 Guidelines Updated', desc: 'Please review the updated guidelines for Round 2 evaluation.', date: 'May 9, 2025', icon: Megaphone, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { title: 'Judging Criteria Clarification', desc: 'New clarifications have been added to the judging criteria.', date: 'May 6, 2025', icon: Sparkles, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { title: 'System Maintenance Notice', desc: 'System will be down for maintenance on May 14, 10:00 PM - 11:00 PM.', date: 'May 5, 2025', icon: Megaphone, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
];

// Simple SVG mini sparkline chart generator component to match the top cards
const MiniSparkline = ({ color }: { color: string }) => (
  <svg className="w-full h-8 mt-4" viewBox="0 0 100 20" preserveAspectRatio="none">
    <path
      d="M0,15 Q15,5 30,12 T60,8 T90,14 L100,10"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased p-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Welcome back, <span className="text-slate-900">Dr. Ananya Sharma</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here's an overview of your evaluation tasks.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative p-2 bg-white rounded-full border border-slate-100 shadow-sm cursor-pointer">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=120&auto=format&fit=crop" 
              alt="Dr. Ananya Sharma" 
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {topStats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 tracking-wide">{stat.title}</span>
                  <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                </div>
                <div className={`${stat.iconBg} p-2.5 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {stat.trendType === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
                  {stat.trendType === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                  {stat.trendType === 'neutral' && <Minus className="w-3.5 h-3.5 text-blue-500" />}
                  <span className={
                    stat.trendType === 'up' ? 'text-emerald-600' : 
                    stat.trendType === 'down' ? 'text-red-600' : 'text-blue-600'
                  }>
                    {stat.trend}
                  </span>
                </div>
                <MiniSparkline color={stat.strokeColor} />
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION: ASSIGNED TEAMS & EVALUATION PROGRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ASSIGNED TEAMS TABLE */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-5">Assigned Teams</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      <th className="pb-3 pl-2">Team</th>
                      <th className="pb-3">Project / Track</th>
                      <th className="pb-3">Assigned On</th>
                      <th className="pb-3">Evaluations</th>
                      <th className="pb-3">Progress</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                    {assignedTeams.map((team, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 pl-2 flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                            {team.id}
                          </span>
                          <span className="font-semibold text-slate-800 whitespace-nowrap">{team.name}</span>
                        </td>
                        <td className="py-3.5 text-slate-500 whitespace-nowrap">{team.track}</td>
                        <td className="py-3.5 text-slate-500 whitespace-nowrap">{team.date}</td>
                        <td className="py-3.5 font-medium text-slate-800">{team.evalCount}</td>
                        <td className="py-3.5 w-24">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full ${
                                team.progress > 50 ? 'bg-purple-600' : team.progress === 50 ? 'bg-emerald-500' : 'bg-orange-500'
                              }`} 
                              style={{ width: `${team.progress}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${team.statusColor}`}>
                            {team.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          {team.status === 'Not Started' ? (
                            <button className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5 mx-auto">
                              Evaluate <ChevronRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <button className="text-slate-600 font-semibold hover:text-slate-900 border border-slate-200 px-2 py-1 rounded-md bg-white hover:bg-slate-50 flex items-center gap-0.5 mx-auto shadow-sm">
                              Continue <ChevronRight className="w-3 h-3 text-slate-400" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <button className="mt-5 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1 w-full pt-4 border-t border-slate-50">
              View all assigned teams <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* EVALUATION PROGRESS DONUT */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-6">Evaluation Progress</h2>
              
              <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 my-2">
                {/* SVG Donut Chart */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                    <circle 
                      cx="18" 
                      cy="18" 
                      r="15.915" 
                      fill="none" 
                      stroke="#8B5CF6" 
                      strokeWidth="3" 
                      strokeDasharray="42 58" 
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-bold text-slate-800 block">42%</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Overall Progress</span>
                  </div>
                </div>

                {/* Legend list metrics */}
                <div className="flex-1 w-full space-y-3 text-xs">
                  <p className="text-slate-500 font-medium mb-1 text-center sm:text-left lg:text-center">
                    You've completed <span className="font-bold text-slate-700">5 out of 12</span> evaluations.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      <span className="text-slate-600 font-medium">Completed</span>
                    </div>
                    <span className="font-semibold text-slate-800">5 <span className="text-slate-400 font-normal">(42%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                      <span className="text-slate-600 font-medium">In Progress</span>
                    </div>
                    <span className="font-semibold text-slate-800">3 <span className="text-slate-400 font-normal">(25%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <span className="text-slate-600 font-medium">Pending</span>
                    </div>
                    <span className="font-semibold text-slate-800">4 <span className="text-slate-400 font-normal">(33%)</span></span>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl py-2.5 px-4 text-xs flex items-center justify-center gap-2 transition-colors w-full">
              <BarChart3 className="w-4 h-4" />
              <span>View detailed report</span>
              <ChevronRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>

        </div>

        {/* BOTTOM SECTION: UPCOMING DEADLINES & ANNOUNCEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* UPCOMING DEADLINES */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-slate-900">Upcoming Deadlines</h2>
                <button className="text-xs font-bold text-purple-600 hover:underline">View all</button>
              </div>

              <div className="space-y-4">
                {deadlines.map((deadline, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                        <Calendar className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{deadline.title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{deadline.date}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${deadline.color}`}>
                      {deadline.remaining}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-slate-900">Announcements</h2>
                <button className="text-xs font-bold text-purple-600 hover:underline">View all</button>
              </div>

              <div className="space-y-4">
                {announcements.map((ann, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`${ann.iconBg} p-2 rounded-xl mt-0.5`}>
                        <ann.icon className={`w-4 h-4 ${ann.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{ann.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{ann.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap pt-1">
                      {ann.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-5 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1 w-full pt-4 border-t border-slate-50">
              View all announcements <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}