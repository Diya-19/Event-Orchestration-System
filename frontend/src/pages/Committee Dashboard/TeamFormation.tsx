import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";

// --- Types ---
type TeamMember = {
  participant_id: string;
  name: string;
  role: string;
  skills: string[];
};

type Team = {
  id: string;
  name: string;
  status: string;
  rationale?: string;
  members: TeamMember[];
};

type Summary = {
  total_participants: number;
  total_teams: number;
  target_team_size: number;
  generated_on: string | null;
};

export default function TeamFormation() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  // --- State ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [generationMethod, setGenerationMethod] = useState<"random" | "ai">("random");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // NEW: Selection State
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  // --- Data Fetching ---
  const fetchTeamsAndSummary = async () => {
    if (!eventId) return;
    try {
      const [teamsRes, summaryRes] = await Promise.all([
        api.get(`/api/events/${eventId}/teams/`),
        api.get(`/api/events/${eventId}/teams/summary`)
      ]);
      setTeams(teamsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error("Failed to load teams", err);
    }
  };

  useEffect(() => {
    fetchTeamsAndSummary();
  }, [eventId]);

  // --- Filtering ---
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.members.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Handlers ---
  const handleGenerate = async () => {
    if (!eventId) return;
    setIsLoading(true);
    setSelectedTeamIds([]); // Clear selection on new generation
    try {
      await api.post(`/api/events/${eventId}/teams/generate?method=${generationMethod}`);
      await fetchTeamsAndSummary();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to generate teams.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!eventId) return;
    if (!window.confirm("This will delete all current teams and generate a fresh batch. Are you sure?")) {
      return;
    }
    setIsLoading(true);
    setSelectedTeamIds([]); // Clear selection
    try {
      await api.delete(`/api/events/${eventId}/teams/`);
      await api.post(`/api/events/${eventId}/teams/generate?method=${generationMethod}`);
      await fetchTeamsAndSummary();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to regenerate teams.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!eventId || selectedTeamIds.length === 0) return;
    try {
      await api.post(`/api/events/${eventId}/teams/approve`, { team_ids: selectedTeamIds });
      await fetchTeamsAndSummary(); 
      setSelectedTeamIds([]); // Clear selection after successful approval
    } catch (err) {
      alert("Failed to approve teams.");
    }
  };

  const handleClear = async () => {
    if (!eventId) return;
    if (!window.confirm("Are you sure you want to delete all generated teams?")) return;
    try {
      await api.delete(`/api/events/${eventId}/teams/`);
      await fetchTeamsAndSummary();
      setSelectedTeamIds([]); // Clear selection
    } catch (err) {
      alert("Failed to clear teams.");
    }
  };

  // --- Selection Handlers ---
  const handleSelectAll = () => {
    // Only select draft teams, as approved teams don't need re-approving
    const draftTeams = filteredTeams.filter(t => t.status === "draft");
    if (selectedTeamIds.length === draftTeams.length && draftTeams.length > 0) {
      setSelectedTeamIds([]);
    } else {
      setSelectedTeamIds(draftTeams.map(t => t.id));
    }
  };

  const handleSelectTeam = (id: string) => {
    setSelectedTeamIds(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  if (!eventId) return <div className="p-7 text-gray-500">Please select an event first.</div>;

  const draftCount = filteredTeams.filter(t => t.status === "draft").length;
  const isAllSelected = draftCount > 0 && selectedTeamIds.length === draftCount;

  return (
    <div className="min-h-screen bg-[#f7f5fb] px-7 py-7">
      
      {/* HEADER */}
      <div>
        <h1 className="text-[44px] font-bold text-slate-900 tracking-[-1px]">Team Formation</h1>
        <p className="text-[#667085] mt-2 text-[15px]">
          Generate and manage teams automatically or with AI to ensure balanced and effective collaboration.
        </p>
      </div>

      {/* GENERATE CARD */}
      <div className="bg-white border border-[#ece8f3] rounded-[26px] p-8 mt-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div>
          <h2 className="text-[28px] font-bold text-slate-900">Generate Teams</h2>
          <p className="text-[#667085] mt-1 text-sm">Choose a method to generate teams for the participants.</p>
          
          <div className="flex gap-5 mt-6">
            {/* RANDOM CARD */}
            <div 
              onClick={() => setGenerationMethod("random")}
              className={`w-[340px] border-2 rounded-[22px] p-6 relative cursor-pointer transition-all ${
                generationMethod === "random" ? "border-[#8b5cf6] bg-[#fcfaff]" : "border-[#e7e4ef] bg-white hover:border-[#d4c5f9]"
              }`}
            >
              {generationMethod === "random" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#8b5cf6] text-white text-[11px] flex items-center justify-center">✓</div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-[#f3e8ff] flex items-center justify-center text-[24px]">👥</div>
              <h3 className="mt-5 text-[28px] font-bold">Random</h3>
              <p className="text-[#667085] mt-2 leading-7 text-[15px]">Randomly generate teams based on constraints.</p>
            </div>

            {/* AI CARD */}
            <div 
              onClick={() => setGenerationMethod("ai")}
              className={`w-[340px] border-2 rounded-[22px] p-6 relative cursor-pointer transition-all ${
                generationMethod === "ai" ? "border-[#8b5cf6] bg-[#fcfaff]" : "border-[#e7e4ef] bg-white hover:border-[#d4c5f9]"
              }`}
            >
              {generationMethod === "ai" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#8b5cf6] text-white text-[11px] flex items-center justify-center">✓</div>
              )}
              <div className="w-14 h-14 rounded-2xl bg-[#f3e8ff] flex items-center justify-center text-[24px]">✨</div>
              <h3 className="mt-5 text-[28px] font-bold">AI Powered</h3>
              <p className="text-[#667085] mt-2 leading-7 text-[15px]">Use AI to form optimal teams based on skills and rules.</p>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="text-center">
          <button 
            onClick={handleGenerate}
            disabled={isLoading || teams.length > 0}
            className="bg-gradient-to-r from-[#7c3aed] to-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-5 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition text-[17px]"
          >
            {isLoading && teams.length === 0 ? "Generating..." : "✨ Generate Teams"}
          </button>
          <p className="text-[#667085] text-sm mt-4 max-w-[230px] leading-6">
            {teams.length > 0 ? "Clear existing teams to regenerate." : "AI mode will provide rationale for each team."}
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 gap-6 mt-7">
        
        {/* LEFT: TEAM CARDS */}
        <div className="col-span-9">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-4">
              <h2 className="text-[34px] font-bold tracking-[-1px]">Generated Teams</h2>
              <div className="bg-[#f3e8ff] text-[#7c3aed] px-4 py-1 rounded-full text-sm font-medium">
                {teams.length} Teams
              </div>
            </div>
            
            {/* SEARCH, SELECT ALL & REGENERATE */}
            <div className="flex gap-4 items-center">
              
              {/* ALWAYS VISIBLE SELECT ALL BUTTON */}
              <label className={`flex items-center gap-2 cursor-pointer bg-white border border-[#ebe7f2] rounded-2xl px-4 py-3 transition ${draftCount === 0 ? 'opacity-50' : 'hover:bg-gray-50'}`}>
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={draftCount === 0}
                  className="w-4 h-4 text-[#7c3aed] rounded focus:ring-[#7c3aed] cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-sm font-medium text-slate-700">Select All Drafts</span>
              </label>

              <input 
                placeholder="🔍 Search teams..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px] border border-[#ebe7f2] bg-white rounded-2xl px-5 py-3 outline-none text-sm"
              />
              <button 
                onClick={handleRegenerate}
                disabled={isLoading || teams.length === 0}
                className="border border-[#ebe7f2] bg-white rounded-2xl px-6 py-3 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && teams.length > 0 ? "Generating..." : "↻ Regenerate"}
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {teams.length === 0 ? (
              <div className="bg-white border border-[#ebe7f2] rounded-[28px] p-12 text-center text-gray-500">
                No teams generated yet. Click Generate Teams to begin.
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="bg-white border border-[#ebe7f2] rounded-[28px] p-12 text-center text-gray-500">
                No teams match your search.
              </div>
            ) : (
              filteredTeams.map((team, index) => (
                <div 
                  key={team.id} 
                  className={`bg-white border rounded-[28px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-colors ${
                    selectedTeamIds.includes(team.id) ? "border-[#8b5cf6] ring-1 ring-[#8b5cf6]" : "border-[#ebe7f2]"
                  }`}
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      
                      {/* ALWAYS VISIBLE TEAM CHECKBOX */}
                      <input 
                        type="checkbox" 
                        checked={team.status === "approved" || selectedTeamIds.includes(team.id)}
                        onChange={() => handleSelectTeam(team.id)}
                        disabled={team.status === "approved"}
                        className="w-5 h-5 text-[#7c3aed] rounded focus:ring-[#7c3aed] cursor-pointer mr-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      />

                      <div className="w-9 h-9 rounded-xl bg-[#9333ea] text-white text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <h2 className="text-[30px] font-bold tracking-[-0.5px]">{team.name}</h2>
                      {team.status === "approved" && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">Approved</span>
                      )}
                    </div>
                    <div className="flex items-center gap-5 text-[#667085]">
                      <span className="text-sm font-medium">👥 {team.members.length} Members</span>
                    </div>
                  </div>

                  {/* MEMBERS */}
                  <div className="grid grid-cols-4 gap-4 mt-5">
                    {team.members.map((member) => (
                      <div key={member.participant_id} className="border border-[#ebe7f2] rounded-[22px] p-5 hover:shadow-md transition">
                        <div className="w-16 h-16 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[30px]">👤</div>
                        <h3 className="mt-5 text-[18px] font-bold leading-5 truncate" title={member.name}>{member.name}</h3>
                        <p className="text-[#667085] text-sm mt-2">{member.role}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {member.skills?.slice(0,3).map((skill) => (
                            <span key={skill} className="bg-[#f3e8ff] text-[#7c3aed] text-[11px] px-3 py-1 rounded-full font-semibold truncate max-w-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RATIONALE (AI Mode) */}
                  {team.rationale && (
                    <div className="mt-5 bg-[#eefcf0] border border-[#d7f2db] rounded-[22px] p-5 flex justify-between items-center">
                      <div>
                        <h3 className="text-[#16a34a] font-bold">✨ Rationale</h3>
                        <p className="mt-2 text-[#667085] max-w-[760px] leading-7 text-sm">{team.rationale}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: SUMMARY & ACTIONS */}
        <div className="col-span-3 space-y-5">
          
          <div className="bg-white border border-[#ebe7f2] rounded-[28px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <h2 className="text-[34px] font-bold tracking-[-1px]">Formation Summary</h2>
            <div className="mt-8 space-y-7 text-sm">
              <div className="flex justify-between">
                <span className="text-[#667085]">👥 Total Participants</span>
                <span className="font-bold">{summary?.total_participants || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667085]">🧩 Teams Generated</span>
                <span className="font-bold">{summary?.total_teams || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667085]">👨‍💻 Members per Team</span>
                <span className="font-bold">Max {summary?.target_team_size || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667085]">✨ Method Used</span>
                <span className="font-bold capitalize">{generationMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667085]">🕒 Generated On</span>
                <span className="font-bold text-right">
                  {summary?.generated_on ? new Date(summary.generated_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#ebe7f2] rounded-[28px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <h2 className="text-[34px] font-bold tracking-[-1px] mb-6">Actions</h2>
            <div className="space-y-4">
              <button disabled={teams.length === 0} className="w-full border border-[#ebe7f2] rounded-2xl p-4 font-medium hover:bg-gray-50 disabled:opacity-50 transition">
                ⬇ Download Teams
              </button>
              <button 
                onClick={handleApprove}
                disabled={selectedTeamIds.length === 0}
                className="w-full bg-[#dcfce7] text-[#16a34a] rounded-2xl p-4 font-medium hover:bg-[#bbf7d0] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedTeamIds.length > 0 ? `✓ Approve (${selectedTeamIds.length})` : "✓ Approve Teams"}
              </button>
              <button 
                onClick={handleClear}
                disabled={teams.length === 0}
                className="w-full border border-[#fecaca] text-[#ef4444] rounded-2xl p-4 font-medium hover:bg-[#fef2f2] transition disabled:opacity-50"
              >
                🗑 Clear All Teams
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}