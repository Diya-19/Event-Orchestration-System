import { useState } from "react";
import {
  Users,
  UserCheck,
  ClipboardList,
  Clock3,
  Search,
  Plus,
  Send,
  Eye,
  UserPlus,
  ChevronDown,
} from "lucide-react";

const judges = [
  {
    id: 1,
    name: "Dr. Vikram Sharma",
    email: "drvikramsharma@gmail.com",
    expertise: "AI / ML",
    teams: 5,
    evaluations: "8 / 10",
    completion: 80,
    status: "Active",
  },
  {
    id: 2,
    name: "Mr. Rajat Gupta",
    email: "rajat.gupta@example.com",
    expertise: "Web Development",
    teams: 4,
    evaluations: "6 / 8",
    completion: 75,
    status: "Active",
  },
  {
    id: 3,
    name: "Ms. Neha Patel",
    email: "neha.patel@example.com",
    expertise: "UI / UX Design",
    teams: 3,
    evaluations: "5 / 7",
    completion: 71,
    status: "Active",
  },
  {
    id: 4,
    name: "Prof. Ankit Verma",
    email: "ankit.verma@example.com",
    expertise: "Cyber Security",
    teams: 2,
    evaluations: "2 / 5",
    completion: 40,
    status: "Active",
  },
  {
    id: 5,
    name: "Dr. Pooja Singh",
    email: "pooja.singh@example.com",
    expertise: "Data Science",
    teams: 1,
    evaluations: "0 / 4",
    completion: 0,
    status: "Pending",
  },
];

export default function JudgeManagement() {
  const [showPanel, setShowPanel] = useState(true);

  const getProgressColor = (value: number) => {
    if (value >= 75) return "bg-green-500";
    if (value >= 50) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Judge Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage judges, assignments and send notifications.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPanel(true)}
            className="flex items-center gap-2 px-5 py-3 border border-violet-500 text-violet-600 rounded-xl hover:bg-violet-50"
          >
            <Plus size={18} />
            Add Judge
          </button>

          <button className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700">
            <Send size={18} />
            Notify All Judges
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="text-violet-600" />}
          title="Total Judges"
          value="12"
        />
        <StatCard
          icon={<UserCheck className="text-green-600" />}
          title="Active Judges"
          value="10"
        />
        <StatCard
          icon={<ClipboardList className="text-blue-600" />}
          title="Assigned Judges"
          value="8"
        />
        <StatCard
          icon={<Clock3 className="text-orange-500" />}
          title="Pending Invitations"
          value="2"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Section */}
        <div className="col-span-9">
          {/* Search */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search judge by name, email or expertise..."
                className="w-full pl-11 pr-4 py-3 border rounded-xl bg-white"
              />
            </div>

            <div className="w-56">
              <button className="w-full flex justify-between items-center border bg-white rounded-xl px-4 py-3">
                All
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-sm">
                    <th className="p-4 w-[180px]">Judge</th>
                    <th className="w-[220px]">Email</th>
                    <th className="w-[150px]">Expertise</th>
                    <th className="w-[70px]">Teams</th>
                    <th className="w-[100px]">Evaluations</th>
                    <th className="w-[180px]">Completion</th>
                    <th className="w-[100px]">Status</th>
                    <th className="w-[180px]">Actions</th>
                    </tr>
                </thead>
              <tbody>
                {judges.map((judge) => (
                  <tr
                    key={judge.id}
                    className="border-b hover:bg-gray-50"
                  >
                   <td className="p-4 font-medium whitespace-nowrap">
                      {judge.name}
                    </td>

                    <td>{judge.email}</td>

                    <td>
                      <span className="inline-flex whitespace-nowrap px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs">
                        {judge.expertise}
                      </span>
                    </td>

                    <td>{judge.teams}</td>

                    <td>{judge.evaluations}</td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 h-2 rounded-full">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(
                              judge.completion
                            )}`}
                            style={{
                              width: `${judge.completion}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm">
                          {judge.completion}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          judge.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {judge.status}
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button className="border px-3 py-2 rounded-lg text-violet-600">
                          <Eye size={16} />
                        </button>

                        <button className="border px-3 py-2 rounded-lg text-gray-600">
                          <UserPlus size={16} />
                        </button>

                        <button className="border px-3 py-2 rounded-lg text-violet-600">
                          <Send size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4 border-t bg-white">
                <span className="text-sm text-gray-500">
                    Showing 1 to 5 of 12 judges
                </span>
                <div className="flex items-center gap-2">
                    <button className="h-9 w-9 rounded-lg border text-gray-500">
                        ‹
                    </button>
                    <button className="h-9 w-9 rounded-lg bg-violet-600 text-white font-medium">
                        1
                    </button>
                    <button className="h-9 w-9 rounded-lg border">
                        2
                    </button>
                    <button className="h-9 w-9 rounded-lg border">
                        3
                    </button>
                    <button className="h-9 w-9 rounded-lg border text-gray-500">
                        ›
                    </button>
                    </div>
                    </div>
          </div>
        </div>

        {/* Add Judge Panel */}
        {showPanel && (
          <div className="col-span-3 bg-white border rounded-2xl p-5 h-fit sticky top-6">
            <h2 className="text-xl font-semibold mb-6">
              Add New Judge
            </h2>

            <div className="space-y-4">
              <Input label="Full Name" />
              <Input label="Email Address" />
              <Input label="Phone Number" />
              <Input label="Organization (Optional)" />
              <select className="w-full border rounded-xl px-4 py-3">
                <option>Select Expertise</option>
                <option>AI / ML</option>
                <option>Web Development</option>
                <option>UI / UX Design</option>
                <option>Cyber Security</option>
                <option>Data Science</option>
             </select>
             <select className="w-full border rounded-xl px-4 py-3">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
             </select>
              <Input label="Password (Temporary)" />

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPanel(false)}
                  className="flex-1 border rounded-xl py-3"
                >
                  Cancel
                </button>

                <button className="flex-1 bg-violet-600 text-white rounded-xl py-3">
                  Add Judge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="mb-3">{icon}</div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function Input({ label }: { label: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">
        {label}
      </label>

      <input
        type="text"
        className="w-full border rounded-xl px-4 py-3"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}