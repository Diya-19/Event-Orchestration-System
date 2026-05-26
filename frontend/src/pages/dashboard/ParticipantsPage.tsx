import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Participant, UploadResult } from "../../types";

export default function ParticipantsPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!eventId) return;
    api.get(`/api/events/${eventId}/participants`)
      .then(({ data }) => setParticipants(data.participants))
      .catch(() => setError("Failed to load participants"));
  }, [eventId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !eventId) return;
    setUploading(true);
    setError("");
    setUploadResult(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const { data } = await api.post<UploadResult>(
        `/api/events/${eventId}/participants/upload`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadResult(data);
      // Refresh list
      const { data: list } = await api.get(`/api/events/${eventId}/participants`);
      setParticipants(list.participants);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    await api.delete(`/api/events/${eventId}/participants/${id}`);
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }

  if (!eventId) {
    return <p className="text-gray-500 text-sm">Select an event from the Overview page first.</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Participants <span className="text-gray-400 font-normal text-base ml-1">({participants.length})</span>
        </h1>
        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          {uploading ? "Uploading…" : "Upload CSV"}
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Upload result banner */}
      {uploadResult && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
          Loaded <strong>{uploadResult.loaded}</strong>, skipped <strong>{uploadResult.skipped}</strong>
          {uploadResult.errors.length > 0 && (
            <span className="text-red-700 ml-2">
              — {uploadResult.errors.length} error(s):&nbsp;
              {uploadResult.errors.map((e) => `row ${e.row}: ${e.reason}`).join(", ")}
            </span>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Email", "Institution", "Skills", "Experience", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {participants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No participants yet — upload a CSV to get started.
                </td>
              </tr>
            )}
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.email}</td>
                <td className="px-4 py-3 text-gray-500">{p.institution ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(p.skills ?? []).map((s) => (
                      <span key={s} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 capitalize">{p.experience ?? "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
