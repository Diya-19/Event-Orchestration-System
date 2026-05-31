import React from "react";
import {
  Search,
  Phone,
  Info,
  Send,
  Plus,
  MoreVertical,
  MessageCircle,
} from "lucide-react";

export default function TeamChatPage() {
  const conversations = [
    {
      name: "General",
      desc: "Team-wide discussions",
      active: true,
      icon: "#",
    },
    {
      name: "Ideas & Brainstorm",
      desc: "Share and discuss ideas",
      icon: "💡",
    },
    {
      name: "Project Discussion",
      desc: "Talk about the build",
      icon: "📁",
    },
    {
      name: "Announcements",
      desc: "Team announcements",
      icon: "📢",
    },
  ];

  const members = [
    {
      name: "Amit Dave",
      role: "Team Lead",
      initials: "AD",
    },
    {
      name: "Riya Sharma",
      role: "Frontend Developer",
      initials: "RS",
    },
    {
      name: "Arjun Mehta",
      role: "Backend Developer",
      initials: "AM",
    },
    {
      name: "Dev Patel",
      role: "UI/UX Designer",
      initials: "DP",
    },
    {
      name: "Kabir Singh",
      role: "ML Engineer",
      initials: "KS",
    },
  ];

  const messages = [
    {
      initials: "AD",
      name: "Amit Dave",
      time: "10:30 AM",
      text: "Hey team! How's the progress on our problem statement?",
    },
    {
      initials: "RS",
      name: "Riya Sharma",
      time: "10:32 AM",
      text: "We've finalized the core idea and working on the architecture.",
    },
    {
      initials: "AM",
      name: "Arjun Mehta",
      time: "10:35 AM",
      text: "Great! I'll start working on the backend APIs. Can you share the flow?",
    },
    {
      mentor: true,
      name: "Mentor - Sneha Iyer",
      time: "10:40 AM",
      text: "Sounds good, team! Make sure your solution is scalable and addresses all the requirements.",
    },
    {
      initials: "DP",
      name: "Dev Patel",
      time: "10:42 AM",
      text: "Sure mentor! We'll ping you if we get stuck anywhere.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top Header */}

      <div className="h-20 bg-white border-b flex items-center justify-between px-8">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Team Alpha
            </h1>

            <span className="bg-violet-100 text-violet-700 text-sm font-medium px-3 py-2 rounded-lg">
              Team ID: TA26
            </span>
          </div>

          <p className="text-gray-500 mt-2">
            Collaborate, discuss ideas and build something amazing! 🚀
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-medium">
            Invite Members
          </button>

          <button className="w-12 h-12 border rounded-xl flex items-center justify-center">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="px-8 pt-6">
        {/* Tabs */}

        <div className="flex gap-12 border-b mb-6">
          {["Overview", "Chat", "Tasks", "Documents", "Settings"].map(
            (tab) => (
              <button
                key={tab}
                className={`pb-4 text-sm font-medium ${
                  tab === "Chat"
                    ? "border-b-2 border-violet-600 text-violet-600"
                    : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Main Grid */}

        <div className="grid grid-cols-[320px_1fr_330px] gap-6">
          {/* Left Panel */}

          <div className="bg-white border rounded-2xl p-5 h-fit">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">
                Conversations
              </h3>

              <button className="w-10 h-10 border rounded-xl flex items-center justify-center">
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {conversations.map((item) => (
                <div
                  key={item.name}
                  className={`p-4 rounded-xl cursor-pointer ${
                    item.active
                      ? "bg-violet-50 border border-violet-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {item.icon} {item.name}
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t my-6"></div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">
                Direct Messages
              </h3>

              <button className="w-10 h-10 border rounded-xl flex items-center justify-center">
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {["Riya Sharma", "Arjun Mehta", "Sneha Iyer", "Dev Patel"].map(
                (name) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-200"></div>

                    <div>
                      <div className="font-medium text-sm">
                        {name}
                      </div>

                      <div className="text-xs text-green-500">
                        Online
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            <button className="w-full border mt-6 py-3 rounded-xl font-medium">
              + New Message
            </button>
          </div>

          {/* Chat Section */}

          <div className="bg-white border rounded-2xl overflow-hidden flex flex-col h-[780px]">
            <div className="h-20 border-b px-6 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-xl">
                  # General
                </h2>

                <p className="text-sm text-gray-500">
                  Team-wide discussions and updates
                </p>
              </div>

              <div className="flex gap-5">
                <Search
                  size={20}
                  className="text-gray-500"
                />
                <Phone
                  size={20}
                  className="text-gray-500"
                />
                <Info
                  size={20}
                  className="text-gray-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="flex gap-4"
                >
                  {!msg.mentor && (
                    <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold">
                      {msg.initials}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {msg.name}
                      </span>

                      <span className="text-sm text-gray-400">
                        {msg.time}
                      </span>
                    </div>

                    <div
                      className={`mt-2 ${
                        msg.mentor
                          ? "bg-violet-50 border border-violet-100 p-4 rounded-xl"
                          : ""
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="border rounded-xl flex items-center px-4 py-3">
                <input
                  placeholder="Type a message..."
                  className="flex-1 outline-none"
                />

                <button className="bg-violet-600 text-white p-3 rounded-lg">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}

          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-5">
              <h3 className="font-semibold text-lg mb-5">
                Team Members (5)
              </h3>

              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.name}
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold">
                        {member.initials}
                      </div>

                      <div>
                        <div className="font-medium">
                          {member.name}
                        </div>

                        <div className="text-sm text-gray-500">
                          {member.role}
                        </div>
                      </div>
                    </div>

                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                ))}
              </div>

              <button className="text-violet-600 font-medium mt-5">
                View All Members →
              </button>
            </div>

            <div className="bg-white border rounded-2xl p-5">
              <h3 className="font-semibold mb-4">
                Mentor
              </h3>

              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-violet-200"></div>

                <div>
                  <div className="font-semibold">
                    Sneha Iyer
                  </div>

                  <div className="text-sm text-gray-500">
                    Senior AI Engineer
                  </div>

                  <div className="text-green-500 text-sm">
                    ● Online
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button className="border border-violet-600 text-violet-600 rounded-xl py-2">
                  Message
                </button>

                <button className="border rounded-xl py-2">
                  View Profile
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-5">
              <h3 className="font-semibold mb-5">
                Quick Actions
              </h3>

              <div className="space-y-5">
                <Action
                  title="Create Group Chat"
                  desc="Start a new group discussion"
                />

                <Action
                  title="Share Files"
                  desc="Upload and share documents"
                />

                <Action
                  title="Team Settings"
                  desc="Manage team preferences"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Action({ title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
        <MessageCircle
          size={18}
          className="text-violet-600"
        />
      </div>

      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">
          {desc}
        </div>
      </div>
    </div>
  );
}