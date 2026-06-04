import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { api } from "../../lib/api";
import { getAssignedTeams, mergeAssignmentStatus, calculateEvaluationMetrics } from "../../lib/teamAssignmentService";

export default function MyEvaluation() {
  const navigate = useNavigate();
  const [teamsData, setTeamsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Teams");

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const { data } = await api.get("/api/judge/evaluations");
        setTeamsData(data);
      } catch (err) {
        console.error("Failed to fetch evaluations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const mergedTeams = mergeAssignmentStatus(getAssignedTeams(), teamsData);
  const { assignedCount, completedCount, draftCount, pendingCount } = calculateEvaluationMetrics(mergedTeams);

  const getUIStatus = (backendStatus: string) => {
    switch (backendStatus) {
      case "Submitted":
      case "submitted":
        return "Completed";
      case "Draft":
      case "draft":
      case "In Progress":
      case "in_progress":
        return "In Progress";
      case "Not Started":
      case "not_started":
      default:
        return "Pending";
    }
  };

  const getStatusColor = (uiStatus: string) => {
    switch (uiStatus) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const getActionButton = (teamId: string, uiStatus: string) => {
    if (uiStatus === "Completed") {
      return (
        <button
          onClick={() => navigate(`/judge/evaluation/${teamId}`)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          View
        </button>
      );
    }

    if (uiStatus === "In Progress") {
      return (
        <button
          onClick={() => navigate(`/judge/evaluation/${teamId}`)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Continue
        </button>
      );
    }

    return (
      <button
        onClick={() => navigate(`/judge/evaluation/${teamId}`)}
        className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
      >
        Evaluate
      </button>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading evaluations...</p>
      </div>
    );
  }

  const filteredTeams = mergedTeams.filter(team => {
    const matchesSearch = team.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const uiStatus = getUIStatus(team.status);
    let matchesFilter = true;
    if (activeFilter === "Completed") matchesFilter = (uiStatus === "Completed");
    else if (activeFilter === "Draft / In Progress") matchesFilter = (uiStatus === "In Progress");
    else if (activeFilter === "Pending Evaluation") matchesFilter = (uiStatus === "Pending");
    
    return matchesSearch && matchesFilter;
  });

  const filterOptions = ["All Teams", "Pending Evaluation", "Completed", "Draft / In Progress"];

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
        <div 
          className="bg-white rounded-xl border p-5 cursor-pointer hover:border-violet-300 transition-colors"
          onClick={() => setActiveFilter("All Teams")}
        >
          <Users className="text-violet-600 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Assigned Teams
          </h3>
          <p className="text-3xl font-bold">{assignedCount}</p>
        </div>

        <div 
          className="bg-white rounded-xl border p-5 cursor-pointer hover:border-orange-300 transition-colors"
          onClick={() => setActiveFilter("Pending Evaluation")}
        >
          <Clock className="text-orange-500 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Pending Evaluations
          </h3>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>

        <div 
          className="bg-white rounded-xl border p-5 cursor-pointer hover:border-green-300 transition-colors"
          onClick={() => setActiveFilter("Completed")}
        >
          <CheckCircle className="text-green-600 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Completed
          </h3>
          <p className="text-3xl font-bold">{completedCount}</p>
        </div>

        <div 
          className="bg-white rounded-xl border p-5 cursor-pointer hover:border-blue-300 transition-colors"
          onClick={() => setActiveFilter("Draft / In Progress")}
        >
          <Clock className="text-blue-600 mb-3" />
          <h3 className="text-gray-500 text-sm">
            Draft / In Progress
          </h3>
          <p className="text-3xl font-bold">{draftCount}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by team name..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-violet-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map(option => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === option
                  ? "bg-violet-600 text-white border border-violet-600"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-violet-300 hover:bg-violet-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Result Count */}
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-600">
          Showing {filteredTeams.length} of {mergedTeams.length} teams
        </p>
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
            {filteredTeams.map((team) => {
              const uiStatus = getUIStatus(team.status);
              
              return (
                <tr
                  key={team.teamId}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {team.teamName}
                  </td>

                  <td className="p-4 text-gray-600">
                    {team.trackName}
                  </td>

                  <td className="p-4">Round 1</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        uiStatus
                      )}`}
                    >
                      {uiStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    {getActionButton(team.teamId, uiStatus)}
                  </td>
                </tr>
              );
            })}
            {filteredTeams.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No evaluations match your search/filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}