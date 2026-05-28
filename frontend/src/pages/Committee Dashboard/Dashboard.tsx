import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Event } from "../../types";

const STAGES = [
  "intake",
  "team_formation",
  "challenge_assigned",
  "evaluation",
  "score_consolidation",
  "completed",
];

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
        // Accept both { events: [...] } and bare array
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
    // Navigate to Participants page with the selected event pre-loaded
    navigate(`/dashboard/participants?event_id=${id}`);
  }

  if (loading) return <p className="text-sm text-gray-400 mt-4">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Overview</h1>

      <CreateEventCard onCreate={createEvent} />

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {events.length === 0 && !error && (
        <p className="text-gray-400 text-sm mt-6">No events yet — create one above to get started.</p>
      )}

      <div className="mt-4 space-y-3">
        {events.map((ev) => (
          <div
            key={ev.id}
            className={`bg-white rounded-xl border p-5 transition-colors ${
              ev.id === activeEventId
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">{ev.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">
                  Stage: {ev.current_stage.replace(/_/g, " ")}
                </p>
              </div>
              {ev.id === activeEventId ? (
                <span className="shrink-0 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                  Selected ✓
                </span>
              ) : (
                <button
                  onClick={() => selectEvent(ev.id)}
                  className="shrink-0 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Select →
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {STAGES.map((s) => (
                <span
                  key={s}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s === ev.current_stage
                      ? "bg-indigo-100 text-indigo-700"
                      : STAGES.indexOf(s) < STAGES.indexOf(ev.current_stage)
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      setError("Failed to create event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Create New Event</h2>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hackathon name"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
