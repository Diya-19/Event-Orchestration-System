import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Upload,
  Trophy,
  Headphones,
  Bell,
  User,
  Flag,
  Clock,
  Calendar,
  ChevronRight,
  Check,
  Layers,
  ClipboardList,
  PieChart,
  Clock3,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Team Space" },
  { icon: Upload, label: "Submission" },
  { icon: Trophy, label: "Result" },
  { icon: Headphones, label: "Support Centre" },
];

const teamMembers = [
  { name: "Rahul", role: "Frontend Dev" },
  { name: "Disha", role: "Backend Dev" },
  { name: "Amit", role: "AI/ML Specialist" },
];

const programOverview = [
  {
    icon: Layers,
    label: "Theme",
    value: "Intelligent Event Orchestration System",
  },
  { icon: Flag, label: "Current Stage", value: "Round - 2 Development" },
  { icon: Clock, label: "Duration", value: "May 18 - May 31" },
  { icon: Calendar, label: "Submission Deadline", value: "May 31, 11:59 PM" },
  { icon: ChevronRight, label: "Evaluation Starts", value: "June 1, 2026" },
];

const yourInfo = [
  { icon: Users, label: "Team", value: "Team Alpha" },
  { icon: ClipboardList, label: "Registration ID", value: "TF26-1T-045H" },
  { icon: Calendar, label: "Submission Status", value: "Pending" },
  {
    icon: PieChart,
    label: "Current Progress",
    value: "40%",
    isProgress: true,
    progress: 40,
  },
  {
    icon: Clock3,
    label: "Pending Deliverables",
    value: null,
    isList: true,
    items: ["Presentation", "Prototype"],
  },
];

const timelineSteps = [
  { label: "Team Assigned", date: "May 18, 2025", status: "done" },
  { label: "Requirements Viewed", date: "May 18, 2025", status: "done" },
  {
    label: "Submission Deadline",
    date: "May 31, 2025\n11:59 PM",
    status: "active",
  },
  { label: "Evaluation", date: "Jun 1 - Jun 5, 2025", status: "upcoming" },
  { label: "Results Announcement", date: "Jun 6, 2025", status: "upcoming" },
];

export default function ParticipantDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F8] font-sans overflow-hidden">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* HackFlow Logo */}
          <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
            <Layers size={20} color="white" />
          </div>
          <span className="text-lg font-bold text-gray-900">HackFlow</span>
          <span className="ml-8 text-base font-semibold text-gray-800">
            Team Alpha
          </span>
        </div>
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell size={22} className="text-gray-700" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col justify-between py-6 px-3 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left ${
                  activeNav === label
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-purple-600" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-800">
                Rahul Sharma
              </p>
              <p className="text-xs text-gray-500">Team Alpha</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-5">
            {/* Welcome Banner */}
            <div className="bg-white rounded-2xl p-6 flex items-center gap-6 shadow-sm">
              <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-purple-50">
                <img
                  src="https://dtvoeevhaseb5.cloudfront.net/user-uploads/8b19b708-cd83-4a54-be02-1e561a3e2da1.png"
                  alt="Welcome"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to HackFlow 2026! 🎉
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  You have been assigned to
                </p>
                <p className="text-purple-600 font-bold text-xl mt-0.5">
                  Team Alpha
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  We are excited to have you on board.
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-5">
                Team Members
              </h2>
              <div className="flex items-center gap-6">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-purple-500" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-xs font-medium text-purple-500 mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="ml-auto">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-purple-600 rounded-full text-sm font-semibold hover:bg-purple-100 transition-colors border border-gray-200">
                    <Users size={15} className="text-purple-500" />
                    View Team
                  </button>
                </div>
              </div>
            </div>

            {/* Program Overview + Your Info */}
            <div className="grid grid-cols-2 gap-5">
              {/* Program Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-purple-600 font-bold text-base mb-4">
                  Program Overview
                </h2>
                <div className="flex flex-col gap-4">
                  {programOverview.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={15} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-400 font-medium">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your INFO */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-purple-600 font-bold text-base mb-4">
                  Your INFO
                </h2>
                <div className="flex flex-col gap-4">
                  {yourInfo.map(
                    ({
                      icon: Icon,
                      label,
                      value,
                      isProgress,
                      progress,
                      isList,
                      items,
                    }) => (
                      <div key={label} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon size={15} className="text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-purple-400 font-medium">
                            {label}
                          </p>
                          {(() => {
                            if (isProgress) {
                              return (
                                <div className="mt-1.5 flex items-center gap-2">
                                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-purple-600 rounded-full"
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-gray-600">
                                    {value}
                                  </span>
                                </div>
                              );
                            }
                            if (isList) {
                              return (
                                <ul className="mt-0.5 list-disc list-inside">
                                  {items.map((item) => (
                                    <li
                                      key={item}
                                      className="text-sm font-semibold text-gray-800"
                                    >
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              );
                            }
                            if (value) {
                              return (
                                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                  {value}
                                </p>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-purple-600 font-bold text-sm tracking-widest uppercase mb-6">
                Event Timeline
              </h2>
              <div className="relative flex items-start justify-between">
                {/* Connector line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 z-0" />

                {timelineSteps.map((step, i) => (
                  <div
                    key={step.label}
                    className="relative flex flex-col items-center flex-1 z-10"
                  >
                    {/* Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        step.status === "done"
                          ? "bg-green-500"
                          : step.status === "active"
                            ? "bg-purple-600"
                            : "bg-gray-200"
                      }`}
                    >
                      {step.status === "done" ? (
                        <Check size={18} color="white" strokeWidth={3} />
                      ) : step.status === "active" ? (
                        <Calendar size={16} color="white" />
                      ) : i === 3 ? (
                        <Trophy size={16} className="text-gray-400" />
                      ) : (
                        <Trophy size={16} className="text-gray-400" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="mt-3 text-center px-1">
                      <p className="text-xs font-semibold text-gray-800 whitespace-pre-line leading-tight">
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-line leading-tight">
                        {step.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
