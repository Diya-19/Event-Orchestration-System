// src/pages/participant/ParticipantDashboard.tsx

import {
  Users,
  Flag,
  Clock,
  Calendar,
  FileText,
  ClipboardCheck,
  Trophy,
  CheckCircle,
} from "lucide-react";

export default function ParticipantDashboard() {
  return (
    <div className="p-6 bg-[#f8f6fc] min-h-screen">
      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-xl bg-purple-100 flex items-center justify-center text-5xl">
          📣
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to HackFlow 2026! 🎉
          </h1>

          <p className="text-gray-500 mt-2">
            You have been assigned to
          </p>

          <p className="text-purple-600 font-semibold text-lg">
            Team Alpha
          </p>

          <p className="text-gray-500 text-sm mt-1">
            We are excited to have you on board.
          </p>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">
            Team Members
          </h2>

          <button className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 transition">
            View Team
          </button>
        </div>

        <div className="flex gap-10 flex-wrap">
          {[
            {
              name: "Rahul",
              role: "Frontend",
            },
            {
              name: "Disha",
              role: "Backend",
            },
            {
              name: "Amit",
              role: "AI/ML",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Users
                  size={18}
                  className="text-purple-600"
                />
              </div>

              <div>
                <p className="font-medium text-sm">
                  {member.name}
                </p>

                <p className="text-xs text-gray-500">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overview + Info */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Program Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-purple-600 font-semibold mb-6">
            Program Overview
          </h2>

          <div className="space-y-5">
            <div className="flex gap-3">
              <Flag
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Theme
                </p>
                <p className="text-sm font-medium">
                  Intelligent Event Orchestration System
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Current Stage
                </p>
                <p className="text-sm font-medium">
                  Round 2 - Development
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Duration
                </p>
                <p className="text-sm font-medium">
                  May 18 - May 31
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Submission Deadline
                </p>
                <p className="text-sm font-medium">
                  May 31, 11:59 PM
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ClipboardCheck
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Evaluation Starts
                </p>
                <p className="text-sm font-medium">
                  June 1, 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-purple-600 font-semibold mb-6">
            Your Info
          </h2>

          <div className="space-y-5">
            <div className="flex gap-3">
              <Users
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Team
                </p>
                <p className="text-sm font-medium">
                  Team Alpha
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Registration ID
                </p>
                <p className="text-sm font-medium">
                  TF26-1T-045H
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Calendar
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Submission Status
                </p>
                <p className="text-sm font-medium">
                  In Progress
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">
                  Current Progress
                </span>

                <span className="font-medium">
                  40%
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="w-[40%] h-2 bg-purple-500 rounded-full"></div>
              </div>
            </div>

            <div className="flex gap-3">
              <ClipboardCheck
                className="text-purple-400"
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500">
                  Pending Deliverables
                </p>

                <ul className="text-sm font-medium list-disc ml-4">
                  <li>Presentation</li>
                  <li>Prototype</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-purple-600 font-semibold uppercase text-sm mb-8">
          Event Timeline
        </h2>

        <div className="relative flex justify-between items-start">
          <div className="absolute top-5 left-0 w-full border-t border-dashed border-gray-300"></div>

          {[
            {
              icon: CheckCircle,
              color: "bg-green-500",
              title: "Team Assigned",
              date: "May 18, 2025",
            },
            {
              icon: CheckCircle,
              color: "bg-green-500",
              title: "Requirements Viewed",
              date: "May 18, 2025",
            },
            {
              icon: Calendar,
              color: "bg-purple-500",
              title: "Submission Deadline",
              date: "May 31, 2025",
            },
            {
              icon: ClipboardCheck,
              color: "bg-gray-300",
              title: "Evaluation",
              date: "Jun 1 - Jun 5, 2025",
            },
            {
              icon: Trophy,
              color: "bg-gray-300",
              title: "Results",
              date: "Jun 6, 2025",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center text-center w-32"
            >
              <div
                className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white`}
              >
                <item.icon size={18} />
              </div>

              <p className="mt-3 text-sm font-semibold">
                {item.title}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {item.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}