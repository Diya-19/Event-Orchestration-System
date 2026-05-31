import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  Users,
  ClipboardCheck,
  Trophy,
  Star,
  Eye,
} from "lucide-react";

type Team = {
  id: string;
  rank: number;
  teamName: string;
  project: string;
  panel1: number;
  panel2: number;
  panel3: number;
  panel4: number;
};

export default function Scoring() {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAnomalyModal, setShowAnomalyModal] = useState(false);

  const teams: Team[] = [
    {
      id: "TEAM-001",
      rank: 1,
      teamName: "Team Alpha",
      project: "AI Event Manager",
      panel1: 93,
      panel2: 91,
      panel3: 94,
      panel4: 92,
    },
    {
      id: "TEAM-002",
      rank: 2,
      teamName: "Innovators",
      project: "Smart Campus",
      panel1: 88,
      panel2: 86,
      panel3: 90,
      panel4: 87,
    },
    {
      id: "TEAM-003",
      rank: 3,
      teamName: "Tech Titans",
      project: "Healthcare AI",
      panel1: 84,
      panel2: 82,
      panel3: 85,
      panel4: 83,
    },
    {
      id: "TEAM-004",
      rank: 4,
      teamName: "Code Wizards",
      project: "Blockchain Voting",
      panel1: 80,
      panel2: 81,
      panel3: 79,
      panel4: 82,
    },
    {
      id: "TEAM-005",
      rank: 5,
      teamName: "Visionary Labs",
      project: "Fintech Platform",
      panel1: 78,
      panel2: 76,
      panel3: 80,
      panel4: 79,
    },
  ];

  const getAverage = (team: Team) =>
    (
      (team.panel1 +
        team.panel2 +
        team.panel3 +
        team.panel4) /
      4
    ).toFixed(2);

  const filteredTeams = useMemo(() => {
    return teams.filter(
      (team) =>
        team.teamName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        team.project
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search]);

  const totalTeams = teams.length;
  const evaluatedTeams = teams.length;

  const averageScore =
    (
      teams.reduce(
        (acc, team) =>
          acc + Number(getAverage(team)),
        0
      ) / teams.length
    ).toFixed(2);

  const highestScore = Math.max(
    ...teams.map((t) => Number(getAverage(t)))
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Scoring Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Evaluate teams and identify scoring
            anomalies.
          </p>
        </div>

        <button
          onClick={() => setShowAnomalyModal(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <AlertTriangle size={18} />
          Check Anomalies
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <StatCard
          icon={<Users size={20} />}
          title="Total Teams"
          value={totalTeams}
        />

        <StatCard
          icon={<ClipboardCheck size={20} />}
          title="Evaluated Teams"
          value={evaluatedTeams}
        />

        <StatCard
          icon={<Star size={20} />}
          title="Average Score"
          value={averageScore}
        />

        <StatCard
          icon={<Trophy size={20} />}
          title="Highest Score"
          value={highestScore}
        />

        <StatCard
          icon={<AlertTriangle size={20} />}
          title="Anomalies"
          value="3"
        />
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />
          </div>

          <button className="border rounded-lg px-4 flex items-center gap-2">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">
            Team Scores
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Rank</th>
              <th className="text-left p-4">Team</th>
              <th className="text-left p-4">Project</th>
              <th className="text-left p-4">Panel 1</th>
              <th className="text-left p-4">Panel 2</th>
              <th className="text-left p-4">Panel 3</th>
              <th className="text-left p-4">Panel 4</th>
              <th className="text-left p-4">Average</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeams.map((team) => (
              <tr
                key={team.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">
                  #{team.rank}
                </td>

                <td className="p-4">
                  <div>
                    <p className="font-medium">
                      {team.teamName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {team.id}
                    </p>
                  </div>
                </td>

                <td className="p-4">
                  {team.project}
                </td>

                <td className="p-4">
                  {team.panel1}
                </td>

                <td className="p-4">
                  {team.panel2}
                </td>

                <td className="p-4">
                  {team.panel3}
                </td>

                <td className="p-4">
                  {team.panel4}
                </td>

                <td className="p-4 font-semibold">
                  {getAverage(team)}
                </td>

                <td className="p-4">
                  <button
                    onClick={() =>
                      setSelectedTeam(team)
                    }
                    className="flex items-center gap-2 text-violet-600 hover:text-violet-700"
                  >
                    <Eye size={16} />
                    View Breakdown
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PART 2 WILL ADD THESE */}
      {selectedTeam && (
        <ScoreDrawer
          team={selectedTeam}
          onClose={() =>
            setSelectedTeam(null)
          }
        />
      )}

      {showAnomalyModal && (
        <AnomalyModal
          onClose={() =>
            setShowAnomalyModal(false)
          }
        />
      )}
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
  value: string | number;
}) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-3">
        {icon}
      </div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-1">
        {value}
      </h3>
    </div>
  );
}
function ScoreDrawer({
  team,
  onClose,
}: {
  team: Team;
  onClose: () => void;
}) {
  const average =
    (
      (team.panel1 +
        team.panel2 +
        team.panel3 +
        team.panel4) /
      4
    ).toFixed(2);

  const criteria = [
    {
      name: "Problem Understanding",
      weight: "20%",
      avg: 18.5,
    },
    {
      name: "Innovation",
      weight: "25%",
      avg: 23.2,
    },
    {
      name: "Technical Implementation",
      weight: "30%",
      avg: 27.1,
    },
    {
      name: "Presentation",
      weight: "25%",
      avg: 21.6,
    },
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <div className="absolute right-0 top-0 h-full w-[420px] bg-white shadow-xl border-l overflow-y-auto">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Score Breakdown
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <div className="bg-violet-50 rounded-xl p-4 mb-5">
            <h3 className="font-bold text-lg">
              {team.teamName}
            </h3>

            <p className="text-gray-500 text-sm">
              {team.id}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">
                  Average Score
                </p>

                <h3 className="text-2xl font-bold">
                  {average}
                </h3>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Rank
                </p>

                <h3 className="text-2xl font-bold">
                  #{team.rank}
                </h3>
              </div>
            </div>
          </div>

          <h4 className="font-semibold mb-3">
            Criteria Breakdown
          </h4>

          <div className="space-y-3 mb-6">
            {criteria.map((item) => (
              <div
                key={item.name}
                className="border rounded-lg p-3"
              >
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.weight}</span>
                </div>

                <div className="mt-2">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-violet-600 h-2 rounded-full"
                      style={{
                        width: `${(item.avg / 30) * 100}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    Avg: {item.avg}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-semibold mb-3">
            Panel Scores
          </h4>

          <div className="space-y-3">
            <PanelScore
              panel="Panel 1"
              score={team.panel1}
            />

            <PanelScore
              panel="Panel 2"
              score={team.panel2}
            />

            <PanelScore
              panel="Panel 3"
              score={team.panel3}
            />

            <PanelScore
              panel="Panel 4"
              score={team.panel4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelScore({
  panel,
  score,
}: {
  panel: string;
  score: number;
}) {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between">
        <span>{panel}</span>
        <span className="font-semibold">
          {score}
        </span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
        <div
          className="h-2 bg-green-500 rounded-full"
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}

function detectAnomalies() {
  return [
    {
      team: "Team Alpha",
      panel: "Panel 3",
      score: 94,
      average: 88.25,
      deviation: "+5.75",
      severity: "High",
    },
    {
      team: "Innovators",
      panel: "Panel 4",
      score: 85.5,
      average: 79.1,
      deviation: "+6.4",
      severity: "High",
    },
    {
      team: "Tech Titans",
      panel: "Panel 2",
      score: 70,
      average: 78.3,
      deviation: "-8.3",
      severity: "Medium",
    },
  ];
}

function AnomalyModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const anomalies = detectAnomalies();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[1000px] rounded-xl shadow-xl">
        <div className="p-5 border-b flex justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Scoring Anomalies
            </h2>

            <p className="text-gray-500 text-sm">
              Potential scoring inconsistencies
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">
                  Team
                </th>
                <th className="text-left p-3">
                  Panel
                </th>
                <th className="text-left p-3">
                  Score
                </th>
                <th className="text-left p-3">
                  Average
                </th>
                <th className="text-left p-3">
                  Deviation
                </th>
                <th className="text-left p-3">
                  Severity
                </th>
              </tr>
            </thead>

            <tbody>
              {anomalies.map(
                (item, index) => (
                  <tr
                    key={index}
                    className="border-t"
                  >
                    <td className="p-3">
                      {item.team}
                    </td>

                    <td className="p-3">
                      {item.panel}
                    </td>

                    <td className="p-3">
                      {item.score}
                    </td>

                    <td className="p-3">
                      {item.average}
                    </td>

                    <td className="p-3">
                      {item.deviation}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.severity ===
                          "High"
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-violet-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}