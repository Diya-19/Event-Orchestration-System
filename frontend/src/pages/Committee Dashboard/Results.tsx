import {
  Trophy,
  Users,
  FileCheck,
  Calendar,
  Download,
  Share2,
  ArrowRight,
} from "lucide-react";

const leaderboard = [
  { rank: 4, team: "DevDynamos", score: 84.1, prize: "₹15,000" },
  { rank: 5, team: "Byte Builders", score: 81.75, prize: "₹10,000" },
  { rank: 6, team: "Tech Titans", score: 78.4, prize: "₹7,500" },
  { rank: 7, team: "Quantum Quest", score: 74.15, prize: "-" },
  { rank: 8, team: "Logic Legends", score: 72.3, prize: "-" },
  { rank: 9, team: "Null Packers", score: 69.8, prize: "-" },
  { rank: 10, team: "Stack Smashers", score: 67.4, prize: "-" },
];

const winners = [
  {
    rank: 1,
    team: "CodeCrafters",
    prize: "₹50,000",
    tag: "Winner",
  },
  {
    rank: 2,
    team: "Pixel Pioneers",
    prize: "₹30,000",
    tag: "1st Runner Up",
  },
  {
    rank: 3,
    team: "AI Avengers",
    prize: "₹20,000",
    tag: "2nd Runner Up",
  },
];

export default function Results() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Results</h1>
          <p className="mt-2 text-gray-600">
            Explore winners, rankings and evaluation summary.
          </p>
        </div>

        <div className="bg-white border rounded-2xl px-6 py-5 shadow-sm flex items-center gap-4 w-full lg:w-[520px]">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <Trophy className="text-yellow-500" size={32} />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Congratulations to all teams!
            </h3>
            <p className="text-gray-500 text-sm">
              Thank you for building the future with your ideas.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 mt-8 border-b">
        <button className="pb-4 border-b-2 border-violet-600 text-violet-600 font-medium">
          Overview
        </button>
        <button className="pb-4 text-gray-500">Leaderboard</button>
        <button className="pb-4 text-gray-500">Winners</button>
        <button className="pb-4 text-gray-500">Evaluation Summary</button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Top Teams */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold">Top Teams</h2>
            <p className="text-gray-500 text-sm mt-1">
              Top performing teams based on overall scores.
            </p>

            <div className="grid md:grid-cols-3 gap-5 mt-8">
              {/* 2nd */}
              <div className="relative border rounded-xl p-5 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>

                <div className="w-16 h-16 mx-auto mb-4">
                    <img
                    src="/pixelpioneers.png"
                    alt="Pixel Pioneers"
                    className="w-full h-full rounded-full object-cover border"
                    />
                </div>

                <h3 className="font-semibold">Pixel Pioneers</h3>

                <p className="text-4xl font-bold mt-3">
                  89.30
                  <span className="text-base text-gray-500"> /100</span>
                </p>

                <span className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm">
                  1st Runner Up
                </span>
              </div>

              {/* Winner */}
              <div className="relative border-2 border-yellow-300 bg-yellow-50 rounded-xl p-5 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>

                <div className="w-20 h-20 mx-auto mb-4">
                    <img
                    src="/codecrafters.png"
                    alt="CodeCrafters"
                    className="w-full h-full rounded-full object-cover border-2 border-yellow-300"
                    />
                </div>

                <h3 className="font-semibold text-lg">CodeCrafters</h3>

                <p className="text-4xl font-bold mt-3">
                  92.45
                  <span className="text-base text-gray-500"> /100</span>
                </p>

                <span className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 text-sm">
                  <Trophy size={14} />
                  Winner
                </span>
              </div>

              {/* 3rd */}
              <div className="relative border rounded-xl p-5 text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  3
                </div>

                <div className="w-16 h-16 mx-auto mb-4">
                    <img
                    src="/aiavengers.png"
                    alt="AI Avengers"
                    className="w-full h-full rounded-full object-cover border"
                    />
                </div>

                <h3 className="font-semibold">AI Avengers</h3>

                <p className="text-4xl font-bold mt-3">
                  86.20
                  <span className="text-base text-gray-500"> /100</span>
                </p>

                <span className="inline-block mt-4 px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm">
                  2nd Runner Up
                </span>
              </div>
            </div>

            <button className="flex items-center gap-2 mx-auto mt-6 text-violet-600 font-medium">
              View Full Leaderboard
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Leaderboard</h2>

            <table className="w-full">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="pb-3">Rank</th>
                  <th className="pb-3">Team Name</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3 text-right">Prize</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((team) => (
                  <tr
                    key={team.rank}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="py-4">{team.rank}</td>

                    <td className="py-4 font-medium">{team.team}</td>

                    <td className="py-4">{team.score}/100</td>

                    <td className="py-4 text-right">{team.prize}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="flex items-center gap-2 mx-auto mt-6 text-violet-600 font-medium">
              View Full Leaderboard
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Highlights */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              Result Highlights
            </h2>

            <div className="space-y-5">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Users />
                  <span>Total Teams</span>
                </div>
                <span className="font-semibold">138</span>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-3">
                  <FileCheck />
                  <span>Submissions Evaluated</span>
                </div>
                <span className="font-semibold">89</span>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Trophy />
                  <span>Winners Announced</span>
                </div>
                <span className="font-semibold">3</span>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Calendar />
                  <span>Completed On</span>
                </div>
                <span className="font-semibold">June 15, 2026</span>
              </div>
            </div>

            <button className="w-full mt-6 border rounded-xl py-3 text-violet-600 font-medium">
              View Evaluation Summary
            </button>
          </div>

          {/* Winners */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex justify-between mb-5">
              <h2 className="text-xl font-semibold">Winners</h2>
              <button className="text-violet-600">View All</button>
            </div>

            <div className="space-y-4">
              {winners.map((winner) => (
                <div
                  key={winner.rank}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center font-bold">
                      {winner.rank}
                    </div>

                    <span className="font-medium">{winner.team}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs bg-yellow-100 px-3 py-1 rounded-full">
                      {winner.tag}
                    </span>

                    <span className="font-semibold">
                      {winner.prize}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold">
              Download Results
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <button className="border rounded-xl p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h4 className="font-medium">Results PDF</h4>
                  <p className="text-xs text-gray-500">
                    Full results and rankings
                  </p>
                </div>
                <Download size={18} />
              </button>

              <button className="border rounded-xl p-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <h4 className="font-medium">
                    Participation Certificate
                  </h4>
                  <p className="text-xs text-gray-500">
                    For all participants
                  </p>
                </div>
                <Download size={18} />
              </button>
            </div>
          </div>

          {/* Share */}
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold">Share Results</h2>

            <p className="text-sm text-gray-500 mt-1">
              Celebrate the achievements.
            </p>

            <div className="flex gap-3 mt-5">
              <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                <img
                src="/Twitter.png"
                alt="Twitter"
                className="w-5 h-5 object-contain"
                />
                </button>
                <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                    <img
                    src="/Linkedin.png"
                    alt="LinkedIn"
                    className="w-5 h-5 object-contain"
                    />
                    </button>

              <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}