import {
  Send,
  Clock3,
  AlertTriangle,
  Calendar,
  Users,
  ClipboardCheck,
  Bell,
  Trophy,
  ArrowRight,
  MoreVertical,
} from "lucide-react";

export default function Communication() {
  const communications = [
    {
      title: "Welcome & Team Assignment",
      subtitle: "Welcome and team details for participants",
      audience: "Participants",
      recipients: "120 recipients",
      status: "Sent",
      time: "May 10, 2025 | 10:30 AM",
      icon: <Users size={18} />,
    },
    {
      title: "Evaluation Request - Round 1",
      subtitle: "Request evaluations from judges",
      audience: "Judges",
      recipients: "32 recipients",
      status: "Scheduled",
      time: "May 12, 2025 | 09:00 AM",
      icon: <ClipboardCheck size={18} />,
    },
    {
      title: "Deadline Reminder",
      subtitle: "Reminder for submission deadline",
      audience: "Participants",
      recipients: "120 recipients",
      status: "Sent",
      time: "May 9, 2025 | 06:00 PM",
      icon: <Bell size={18} />,
    },
    {
      title: "Results Announcement",
      subtitle: "Notify participants about results",
      audience: "Participants",
      recipients: "120 recipients",
      status: "Sent",
      time: "May 18, 2025 | 11:00 AM",
      icon: <Trophy size={18} />,
    },
    {
      title: "Final Round Invitation",
      subtitle: "Invite qualified teams to next round",
      audience: "Teams",
      recipients: "25 recipients",
      status: "Draft",
      time: "--",
      icon: <ArrowRight size={18} />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="col-span-12 xl:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Communications
              </h1>
              <p className="text-gray-500 mt-1">
                Automate and send contextual messages throughout the event.
              </p>
            </div>

            <button className="bg-violet-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-violet-700">
              + New Communication
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Send size={20} />}
              title="Messages Sent"
              value="248"
              subtitle="Total delivered"
            />

            <StatCard
              icon={<Clock3 size={20} />}
              title="Pending"
              value="12"
              subtitle="Awaiting delivery"
            />

            <StatCard
              icon={<AlertTriangle size={20} />}
              title="Failed"
              value="3"
              subtitle="Delivery failed"
            />

            <StatCard
              icon={<Calendar size={20} />}
              title="Scheduled"
              value="5"
              subtitle="Upcoming messages"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="font-semibold text-gray-800">
                Recent Communications
              </h2>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="text-left p-4">Communication</th>
                  <th className="text-left p-4">Audience</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Sent / Scheduled</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {communications.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                          {item.icon}
                        </div>

                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p>{item.audience}</p>
                      <p className="text-sm text-gray-500">
                        {item.recipients}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Sent"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-sm">{item.time}</td>

                    <td className="p-4">
                      <MoreVertical size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-5 text-center">
              <button className="border px-5 py-2 rounded-lg text-violet-600">
                View All Communications →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-5">
            <h2 className="font-bold text-xl mb-6">
              New Communication
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium">
                  Communication Type
                </label>

                <select className="w-full mt-2 border rounded-lg p-3">
                  <option>Welcome & Team Assignment</option>
                  <option>Reminder</option>
                  <option>Evaluation Request</option>
                  <option>Results Announcement</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Recipients
                </label>

                <select className="w-full mt-2 border rounded-lg p-3">
                  <option>Participants (120)</option>
                  <option>Judges</option>
                  <option>Mentors</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Template
                </label>

                <select className="w-full mt-2 border rounded-lg p-3">
                  <option>Welcome Template</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Preview Message
                </label>

                <textarea
                  rows={10}
                  className="w-full mt-2 border rounded-lg p-3"
                  defaultValue={`Welcome to {{event_name}}

Hi {{name}},

You are excitedly invited to participate.

Team: {{team_name}}
Code: {{team_code}}

Regards,
Organizing Committee`}
                />
              </div>

              <div className="flex gap-3">
                <button className="flex-1 border rounded-lg py-3">
                  Cancel
                </button>

                <button className="flex-1 bg-violet-600 text-white rounded-lg py-3">
                  Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
        {icon}
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-3xl font-bold mt-2">{value}</h3>

      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}