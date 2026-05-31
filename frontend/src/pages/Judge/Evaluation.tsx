import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

const teams = [
  {
    id: 1,
    name: "Team Alpha",
    project: "Intelligent Event Orchestration System",
    round: "Round 2",
    status: "Pending",
  },
  {
    id: 2,
    name: "Team Beta",
    project: "Smart Resource Allocator",
    round: "Round 2",
    status: "Pending",
  },
  {
    id: 3,
    name: "Team Gamma",
    project: "AI-Powered Event Companion",
    round: "Round 2",
    status: "In Progress",
  },
  {
    id: 4,
    name: "Team Delta",
    project: "Predictive Crowd Management",
    round: "Round 2",
    status: "Completed",
  },
];

export default function MyEvaluation() {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const getActionButton = (team: any) => {
    if (team.status === "Completed") {
      return (
        <button
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          View
        </button>
      );
    }

    if (team.status === "In Progress") {
      return (
        <button
          onClick={() => navigate(`/judge/evaluation/${team.id}`)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Continue
        </button>
      );
    }

    return (
      <button
        onClick={() =>
          navigate(`/judge/evaluation/${team.id}`)
        }
        className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
      >
        Evaluate
      </button>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          My Evaluations
        </h1>
        <p className="text-gray-500 mt-1">
          Review assigned teams and submit evaluations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-xl border p-5">
          <Users className="text-violet-600 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Assigned Teams
          </h3>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <Clock className="text-orange-500 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Pending Evaluations
          </h3>
          <p className="text-3xl font-bold">7</p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <CheckCircle className="text-green-600 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Completed
          </h3>
          <p className="text-3xl font-bold">5</p>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <Clock className="text-blue-600 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Avg Time / Team
          </h3>
          <p className="text-3xl font-bold">18m</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by team name..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Team</th>
              <th className="text-left p-4">Project Title</th>
              <th className="text-left p-4">Round</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">
                  {team.name}
                </td>

                <td className="p-4 text-gray-600">
                  {team.project}
                </td>

                <td className="p-4">{team.round}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      team.status
                    )}`}
                  >
                    {team.status}
                  </span>
                </td>

                <td className="p-4">
                  {getActionButton(team)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}