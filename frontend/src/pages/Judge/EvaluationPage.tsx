import { ArrowLeft, Download, GitBranch, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function EvaluationPage() {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const [scores, setScores] = useState({
    understanding: 8,
    implementation: 9,
    communication: 8,
    innovation: 9,
    impact: 8,
  });

  const total =
    scores.understanding * 0.2 +
    scores.implementation * 0.3 +
    scores.communication * 0.2 +
    scores.innovation * 0.2 +
    scores.impact * 0.1;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <button
        onClick={() => navigate("/judge/evaluations")}
        className="flex items-center gap-2 text-violet-600 font-medium mb-6"
      >
        <ArrowLeft size={18} />
        Back to My Evaluations
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Team Alpha
          </h1>

          <p className="text-gray-500 mt-2">
            Intelligent Event Orchestration System
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            Round 2
          </p>
          <p className="text-gray-500">
            Team ID #{teamId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left */}
        <div className="col-span-8 space-y-6">
          {/* Project Details */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Project Summary
            </h2>

            <p className="text-gray-600 leading-relaxed">
              A centralized platform that automates
              event orchestration, communication,
              evaluation, and attendee engagement.
            </p>
          </div>

          {/* Deliverables */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Submitted Deliverables
            </h2>

            <div className="space-y-3">
              <button className="flex items-center gap-3 w-full border rounded-lg p-3 hover:bg-gray-50">
                <Download size={18} />
                Project Presentation.pdf
              </button>

              <button className="flex items-center gap-3 w-full border rounded-lg p-3 hover:bg-gray-50">
                <Download size={18} />
                System Architecture.pdf
              </button>

              <button className="flex items-center gap-3 w-full border rounded-lg p-3 hover:bg-gray-50">
                <GitBranch size={18} />
                GitHub Repository
              </button>

              <button className="flex items-center gap-3 w-full border rounded-lg p-3 hover:bg-gray-50">
                <Play size={18} />
                Demo Video
              </button>
            </div>
          </div>

          {/* Evaluation */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-6">
              Evaluation Form
            </h2>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Criteria
                  </th>
                  <th className="text-left py-3">
                    Weight
                  </th>
                  <th className="text-left py-3">
                    Score
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="py-4">
                    Problem Understanding
                  </td>
                  <td>20%</td>
                  <td>
                    <select className="border rounded-lg px-3 py-2">
                      {[...Array(11)].map((_, i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="py-4">
                    Technical Implementation
                  </td>
                  <td>30%</td>
                  <td>
                    <select className="border rounded-lg px-3 py-2">
                      {[...Array(11)].map((_, i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="py-4">
                    Communication
                  </td>
                  <td>20%</td>
                  <td>
                    <select className="border rounded-lg px-3 py-2">
                      {[...Array(11)].map((_, i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="py-4">
                    Innovation
                  </td>
                  <td>20%</td>
                  <td>
                    <select className="border rounded-lg px-3 py-2">
                      {[...Array(11)].map((_, i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="py-4">
                    Impact
                  </td>
                  <td>10%</td>
                  <td>
                    <select className="border rounded-lg px-3 py-2">
                      {[...Array(11)].map((_, i) => (
                        <option key={i}>{i}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 text-right">
              <span className="text-xl font-bold text-green-600">
                Total Score: {total.toFixed(2)} / 10
              </span>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">
              Feedback
            </h2>

            <textarea
              rows={6}
              placeholder="Write your feedback..."
              className="w-full border rounded-lg p-4"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button className="px-6 py-3 border rounded-lg">
                Save Draft
              </button>

              <button className="px-6 py-3 bg-violet-600 text-white rounded-lg">
                Submit Evaluation
              </button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="col-span-4">
          <div className="bg-white rounded-xl border p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">
              Evaluation Criteria
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Problem Understanding</span>
                <span>20%</span>
              </div>

              <div className="flex justify-between">
                <span>Technical Implementation</span>
                <span>30%</span>
              </div>

              <div className="flex justify-between">
                <span>Communication</span>
                <span>20%</span>
              </div>

              <div className="flex justify-between">
                <span>Innovation</span>
                <span>20%</span>
              </div>

              <div className="flex justify-between">
                <span>Impact</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}