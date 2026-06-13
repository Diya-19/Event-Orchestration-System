import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Event } from "../../types"; // Assuming Event type might have `logo?: string` now

const STAGES = [
  "intake",
  "team_formation",
  "challenge_assigned",
  "evaluation",
  "score_consolidation",
  "completed",
];

// Helper to map event names to your local /public folder icons!
const getEventLogo = (name: string, backendLogo?: string) => {
  if (backendLogo) return backendLogo; // If backend provides a logo, use it
  
  const lowerName = name.toLowerCase();
  if (lowerName.includes("amazon")) return "/Amazon.png";
  if (lowerName.includes("google")) return "/Google.png";
  if (lowerName.includes("microsoft")) return "/Microsoft.png";
  if (lowerName.includes("wise")) return "/Wise.png";
  
  
  // Fallback for custom events you create in the UI
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ede9fe&color=7c3aed&rounded=true&bold=true`;
};

export default function OverviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeEventId = searchParams.get("event_id") ?? "";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<{ events: Event[] } | Event[]>("/api/events")
      .then(({ data }) => {
        setEvents(Array.isArray(data) ? data : (data as any).events ?? []);
      })
      .catch(() => setError("Failed to load events"))
      .finally(() => setLoading(false));
  }, []);

  async function createEvent(name: string) {
    const { data } = await api.post<Event>("/api/events", { name });
    setEvents((prev) => [data, ...prev]);
  }

  function selectEvent(id: string) {
    navigate(`/dashboard/participants?event_id=${id}`);
  }

  if (loading) return <div className="p-8 text-gray-500 font-medium">Loading events...</div>;

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Events Overview
      </h1>

      <CreateEventCard onCreate={createEvent} />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {events.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">No events yet — create one above to get started.</p>
        </div>
      )}

      {/* Event List */}
      <div className="space-y-5">
        {events.map((ev) => {
          const isSelected = ev.id === activeEventId;
          
          return (
            <div
              key={ev.id}
              className={`bg-white rounded-2xl border p-6 flex items-center justify-between shadow-sm transition-all ${
                isSelected
                  ? "border-violet-400 ring-4 ring-violet-50"
                  : "border-gray-200 hover:border-violet-200"
              }`}
            >
              <div className="flex gap-5 items-start">
                {/* Brand Logo Wrapper */}
                <div className="w-14 h-14 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm p-1.5">
                  <img
                    src={getEventLogo(ev.name, ev.logo)}
                    alt={ev.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-xl text-gray-900">
                    {ev.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 capitalize font-medium">
                    Stage: {ev.current_stage.replace(/_/g, " ")}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {STAGES.map((stage) => {
                      const currentIndex = STAGES.indexOf(ev.current_stage);
                      const stageIndex = STAGES.indexOf(stage);
                      
                      let pillClass = "bg-gray-100 text-gray-500"; 
                      if (stage === ev.current_stage) {
                        pillClass = "bg-violet-100 text-violet-700"; 
                      } else if (stageIndex < currentIndex) {
                        pillClass = "bg-green-100 text-green-700"; 
                      }

                      return (
                        <span
                          key={stage}
                          className={`text-xs px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${pillClass}`}
                        >
                          {stage.replace(/_/g, " ")}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => selectEvent(ev.id)}
                className={`px-6 py-2.5 rounded-xl font-semibold transition shrink-0 ml-4 ${
                  isSelected
                    ? "border-2 border-violet-500 text-violet-700 bg-violet-50"
                    : "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                }`}
              >
                {isSelected ? "Selected ✓" : "Select →"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Sub Component ---

function CreateEventCard({ onCreate }: { onCreate: (name: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onCreate(name.trim());
      setName("");
    } catch {
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 mb-8 transition-colors hover:border-violet-300">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-lg">
          +
        </div>
        <h2 className="font-semibold text-lg text-gray-800">
          Create New Event
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Global Hackathon 2026"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-gray-800"
        />

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="px-8 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
    </div>
  );
}