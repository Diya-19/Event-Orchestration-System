import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Users,
  UserCheck,
  ClipboardList,
  Clock3,
  Search,
  Plus,
  Send,
  Eye,
  UserPlus,
  Trash2,
  ChevronDown,
  Loader2
} from "lucide-react";
import { api } from "../../lib/api"; // Adjust import path as needed to your axios instance

// --- Types ---
type Judge = {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  organization?: string;
  expertise: string;
  teams: number;
  evaluations: string;
  completion: number;
  status: string;
  created_at: string;
};

export default function JudgeManagement() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  // --- States ---
  const [showPanel, setShowPanel] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [totalTeams, setTotalTeams] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Action States
  const [isAdding, setIsAdding] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  // --- Fetch Data ---
  const fetchData = async () => {
    if (!eventId) return;
    setIsLoading(true);
    
    try {
      // NOTE: No trailing slash!
      const res = await api.get(`/api/events/${eventId}/evaluators`);
      
      const fetchedTotalTeams = res.data.total_teams || 0;
      setTotalTeams(fetchedTotalTeams);

      const transformedData = res.data.evaluators.map((ev: any) => {
        const completed = ev.completed_evaluations || 0;
        
        const completionPct = fetchedTotalTeams > 0 
          ? Math.round((completed / fetchedTotalTeams) * 100) 
          : 0;

        return {
          id: ev.id,
          name: ev.name,
          email: ev.email,
          phone_number: ev.phone_number,
          organization: ev.organization,
          expertise: ev.expertise || "N/A",
          teams: fetchedTotalTeams, 
          evaluations: `${completed} / ${fetchedTotalTeams}`,
          completion: completionPct,
          status: completionPct > 0 ? "Active" : "Pending",
          created_at: ev.created_at
        };
      });

      setJudges(transformedData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setEditingId(null);
    setName(""); setEmail(""); setExpertise(""); setPhone(""); setOrganization("");
    setShowPanel(true);
  };

  const handleOpenEdit = (judge: Judge) => {
    setEditingId(judge.id);
    setName(judge.name);
    setEmail(judge.email);
    setExpertise(judge.expertise === "N/A" ? "" : judge.expertise);
    setPhone(judge.phone_number || "");
    setOrganization(judge.organization || "");
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setEditingId(null);
    setName(""); setEmail(""); setExpertise(""); setPhone(""); setOrganization("");
  };

  const handleSaveJudge = async () => {
    if (!name || !email) return alert("Name and Email are required.");
    setIsAdding(true);
    
    try {
      if (editingId) {
        // EDIT MODE
        const payload = { 
          name, 
          email, 
          expertise,
          phone_number: phone,
          organization: organization
        };
        await api.put(`/api/events/${eventId}/evaluators/${editingId}`, payload);
        alert("Judge updated successfully!");
      } else {
        // ADD MODE
        const payload = { 
          evaluators: [{ 
            name, 
            email, 
            expertise,
            phone_number: phone,
            organization: organization
          }] 
        };
        // NOTE: No trailing slash!
        const res = await api.post(`/api/events/${eventId}/evaluators`, payload);
        
        if (res.data.skipped && res.data.skipped.length > 0) {
          return alert(`Judge with email ${email} already exists!`);
        }
        alert("Judge added successfully!");
      }
      
      handleClosePanel();
      fetchData(); // Refresh the grid
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to save judge.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleNotifyAll = async () => {
    setIsNotifying(true);
    try {
      const res = await api.post(`/api/events/${eventId}/evaluators/notify`);
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to notify evaluators. (Ensure challenges are assigned first)");
    } finally {
      setIsNotifying(false);
    }
  };

  const handleDeleteJudge = async (judgeId: string) => {
    // Standard browser confirmation to prevent accidental clicks
    if (!window.confirm("Are you sure you want to remove this judge? This action cannot be undone.")) {
      return;
    }
    
    try {
      // NOTE: No trailing slash!
      await api.delete(`/api/events/${eventId}/evaluators/${judgeId}`);
      fetchData(); // Refresh the grid silently
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to delete judge.");
    }
  };

  // --- UI Helpers ---
  const getProgressColor = (value: number) => {
    if (value >= 100) return "bg-green-500";
    if (value >= 50) return "bg-orange-400";
    return "bg-red-400";
  };

  // Derived Stats
  const activeCount = judges.filter(j => j.status === "Active").length;
  const pendingCount = judges.filter(j => j.status === "Pending").length;
  const totalAssignments = judges.length * totalTeams; 

  if (!eventId) return <div className="p-6 text-gray-500">Please select an event first.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Judge Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage judges, assignments and send notifications.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-3 border border-violet-500 text-violet-600 rounded-xl hover:bg-violet-50 transition"
          >
            <Plus size={18} />
            Add Judge
          </button>

          <button 
            onClick={handleNotifyAll}
            disabled={isNotifying || judges.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition disabled:opacity-50"
          >
            {isNotifying ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Notify All Judges
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="text-violet-600" />}
          title="Total Judges"
          value={judges.length.toString()}
        />
        <StatCard
          icon={<UserCheck className="text-green-600" />}
          title="Active Judges"
          value={activeCount.toString()}
        />
        <StatCard
          icon={<ClipboardList className="text-blue-600" />}
          title="Total Assignments"
          value={totalAssignments.toString()}
        />
        <StatCard
          icon={<Clock3 className="text-orange-500" />}
          title="Pending Invitations"
          value={pendingCount.toString()}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Section */}
        <div className={`transition-all duration-300 ${showPanel ? 'col-span-9' : 'col-span-12'}`}>
          {/* Search */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search judge by name, email or expertise..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="w-56">
              <button className="w-full flex justify-between items-center border border-gray-200 bg-white rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50">
                All
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="p-4 w-[180px] font-medium">Judge</th>
                    <th className="w-[220px] font-medium">Email</th>
                    <th className="w-[150px] font-medium">Expertise</th>
                    <th className="w-[70px] font-medium">Teams</th>
                    <th className="w-[100px] font-medium">Evaluations</th>
                    <th className="w-[180px] font-medium">Completion</th>
                    <th className="w-[100px] font-medium">Status</th>
                    <th className="w-[180px] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">Loading judges...</td>
                    </tr>
                  ) : judges.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">No judges found. Add one to get started.</td>
                    </tr>
                  ) : (
                    judges.map((judge) => (
                      <tr
                        key={judge.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                       <td className="p-4 font-medium text-gray-900 whitespace-nowrap truncate">
                          {judge.name}
                        </td>
                        <td className="text-gray-600 truncate pr-4" title={judge.email}>
                          {judge.email}
                        </td>
                        <td>
                          <span className="inline-flex whitespace-nowrap px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                            {judge.expertise}
                          </span>
                        </td>
                        <td className="text-gray-600">{judge.teams}</td>
                        <td className="text-gray-600">{judge.evaluations}</td>
                        <td>
                          <div className="flex items-center gap-3 pr-4">
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(judge.completion)}`}
                                style={{ width: `${judge.completion}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-9">
                              {judge.completion}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              judge.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {judge.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <button 
                              onClick={() => handleOpenEdit(judge)}
                              className="border border-gray-200 px-3 py-2 rounded-lg text-violet-600 hover:bg-violet-50 transition"
                              title="Edit Judge"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                               onClick={() => handleDeleteJudge(judge.id)}
                               className="border border-gray-200 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 transition"
                               title="Remove Judge"
                            >
                            <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
              <span className="text-sm text-gray-500">
                Showing {judges.length > 0 ? 1 : 0} to {judges.length} of {judges.length} judges
              </span>
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">‹</button>
                <button className="h-9 w-9 rounded-lg bg-violet-600 text-white font-medium">1</button>
                <button className="h-9 w-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">›</button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Judge Panel */}
        {showPanel && (
          <div className="col-span-3 bg-white border border-gray-200 rounded-2xl p-5 h-fit sticky top-6 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              {editingId ? "Edit Judge" : "Add New Judge"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none transition"
                  placeholder="e.g. Dr. Vikram Sharma"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none transition"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone Number (Optional)</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none transition" 
                  placeholder="Enter phone number" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Organization (Optional)</label>
                <input 
                  type="text" 
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none transition" 
                  placeholder="Enter organization" 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Expertise</label>
                <select 
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 outline-none transition"
                >
                  <option value="">Select Expertise</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI / UX Design">UI / UX Design</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClosePanel}
                  className="flex-1 border border-gray-300 rounded-xl py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button 
                  onClick={handleSaveJudge}
                  disabled={isAdding}
                  className="flex-1 bg-violet-600 text-white rounded-xl py-2.5 font-medium hover:bg-violet-700 transition flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isAdding ? <Loader2 size={18} className="animate-spin" /> : (editingId ? "Save Changes" : "Add Judge")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-components ---
function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="mb-3 w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-1 text-gray-900">{value}</h3>
    </div>
  );
}