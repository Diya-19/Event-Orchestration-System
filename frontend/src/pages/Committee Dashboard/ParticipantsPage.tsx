import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { api } from "../../lib/api";
import { Participant, UploadResult } from "../../types";

export default function ParticipantsPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  // --- Data State ---
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // --- Filter & Search State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("All Institutions");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");

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

  // --- Derived Filter Data ---
  // Extract unique, non-null institutions and skills for the dropdowns
  const uniqueInstitutions = Array.from(
    new Set(participants.map(p => p.institution).filter(Boolean))
  ).sort() as string[];

  const uniqueSkills = Array.from(
    new Set(participants.flatMap(p => p.skills || []))
  ).sort() as string[];

  // Apply Search and Filters
  const filteredParticipants = participants.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchLower) || 
      p.email?.toLowerCase().includes(searchLower);
    
    const matchesInstitution = 
      selectedInstitution === "All Institutions" || p.institution === selectedInstitution;
    
    const matchesSkill = 
      selectedSkill === "All Skills" || (p.skills && p.skills.includes(selectedSkill));

    return matchesSearch && matchesInstitution && matchesSkill;
  });

  if (!eventId) {
    return (
      <div className="p-6">
        <p className="text-gray-500 py-8 text-center">
          Select an event from the Overview page first.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Participants 
          <span className="text-gray-400 font-normal text-lg ml-2">
            ({participants.length})
          </span>
        </h1>
        
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
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

      {/* Upload Result Banner */}
      {uploadResult && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 shadow-sm">
          Loaded <strong>{uploadResult.loaded}</strong>, skipped <strong>{uploadResult.skipped}</strong>
          {uploadResult.errors.length > 0 && (
            <span className="text-red-700 ml-2">
              — {uploadResult.errors.length} error(s):&nbsp;
              {uploadResult.errors.map((e) => `row ${e.row}: ${e.reason}`).join(", ")}
            </span>
          )}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <p className="text-red-500 text-sm mb-6">{error}</p>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-[200px]"
          >
            <option>All Institutions</option>
            {uniqueInstitutions.map(inst => (
              <option key={inst} value={inst}>{inst}</option>
            ))}
          </select>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 max-w-[200px]"
          >
            <option>All Skills</option>
            {uniqueSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Institution</th>
              <th className="px-4 py-3 text-left">Skills</th>
              <th className="px-4 py-3 text-left">Experience</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No participants found — upload a CSV to get started.
                </td>
              </tr>
            ) : filteredParticipants.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No participants match your search and filter criteria.
                </td>
              </tr>
            ) : (
              filteredParticipants.map((participant) => (
                <tr key={participant.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-gray-800">{participant.name}</td>
                  <td className="px-4 py-3 text-gray-600">{participant.email}</td>
                  <td className="px-4 py-3 text-gray-600">{participant.institution ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(participant.skills ?? []).map((s) => (
                        <span key={s} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{participant.experience ?? "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(participant.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}