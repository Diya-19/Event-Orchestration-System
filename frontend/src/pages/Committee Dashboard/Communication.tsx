import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Send,
  Clock3,
  AlertTriangle,
  Calendar,
  Users,
  ClipboardCheck,
  Bell,
  Trophy,
  ArrowRight,
  MoreVertical,
  Wand2,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { api } from "../../lib/api";

// --- Types ---
type CommunicationLog = {
  id: string;
  subject: string;
  stage: string;
  audience: string;
  status: string;
  recipients: number;
  created_at: string;
};

type Stats = {
  sent: number;
  queued: number;
  failed: number;
  scheduled: number;
};

export default function Communication() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  // --- States ---
  const [stats, setStats] = useState<Stats>({ sent: 0, queued: 0, failed: 0, scheduled: 0 });
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApprovingId, setIsApprovingId] = useState<string | null>(null);

  // Draft Lifecycle States
  const [stage, setStage] = useState("Welcome & Team Assignment");
  const [recipientType, setRecipientType] = useState("Participants");
  const [subject, setSubject] = useState("");
  const [customContext, setCustomContext] = useState("");
  
  const [generatedBody, setGeneratedBody] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");
  
  const [isDrafting, setIsDrafting] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // --- Data Fetching ---
  const fetchCommunications = async () => {
    if (!eventId) return;
    try {
      const [statsRes, commsRes] = await Promise.all([
        api.get(`/api/events/${eventId}/communications/stats`),
        api.get(`/api/events/${eventId}/communications/`)
      ]);
      
      setStats({
        sent: statsRes.data.sent || 0,
        queued: statsRes.data.queued || 0,
        failed: statsRes.data.failed || 0,
        scheduled: statsRes.data.scheduled || 0,
      });
      setCommunications(commsRes.data);
    } catch (err) {
      console.error("Failed to fetch communications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [eventId]);

  // --- Handlers ---
  const handleGenerateDraft = async () => {
    if (!subject) return alert("Please enter a subject line.");
    setIsDrafting(true);
    try {
      const res = await api.post(`/api/events/${eventId}/communications/draft`, {
        stage,
        recipient_type: recipientType,
        subject,
        context: customContext
      });
      
      setGeneratedBody(res.data.template);
      setDraftId(res.data.id);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to generate draft.");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleDispatch = async () => {
    if (!draftId) return;
    setIsDispatching(true);
    try {
      const payload: any = { final_template: generatedBody };
      
      if (scheduledFor) {
        payload.scheduled_for = new Date(scheduledFor).toISOString();
      }

      const res = await api.post(`/api/events/${eventId}/communications/${draftId}/dispatch`, payload);
      alert(res.data.message);
      
      handleCancel();
      fetchCommunications();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to dispatch communication.");
    } finally {
      setIsDispatching(false);
    }
  };

  const handleQuickApprove = async (comm: CommunicationLog) => {
    setIsApprovingId(comm.id);
    try {
      // 1. Fetch pending approvals to link the target workflow ID
      const res = await api.get(`/api/approvals/?event_id=${eventId}&status=pending`);
      const approval = res.data.find((a: any) => a.payload?.communication_id === comm.id);

      if (!approval) {
        alert("Approval action reference not found for this message.");
        return;
      }

      // 2. Dispatch approval confirmation
      await api.post(`/api/approvals/${approval.id}/approve?event_id=${eventId}`, {
        notes: "Quick approved directly from Communications control panel."
      });
      
      fetchCommunications();
    } catch (err) {
      console.error("Approval error", err);
      alert("Failed to submit approval choice.");
    } finally {
      setIsApprovingId(null);
    }
  };

  const handleCancel = () => {
    setGeneratedBody("");
    setDraftId(null);
    setSubject("");
    setCustomContext("");
    setScheduledFor("");
  };

  // --- Helpers ---
  const getIconForStage = (stage: string) => {
    if (stage.includes("Welcome") || stage.includes("Team")) return <Users size={18} />;
    if (stage.includes("Evaluat")) return <ClipboardCheck size={18} />;
    if (stage.includes("Result")) return <Trophy size={18} />;
    if (stage.includes("Reminder")) return <Bell size={18} />;
    return <ArrowRight size={18} />;
  };

  if (!eventId) return <div className="p-6 text-gray-500">Please select an event first.</div>;
  if (isLoading) return <div className="p-6 text-gray-500">Loading communications...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT SIDE (Dashboard & Table) */}
        <div className="col-span-12 xl:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Communications</h1>
              <p className="text-gray-500 mt-1">Automate and send contextual messages throughout the event.</p>
            </div>
            <button 
              onClick={handleCancel}
              className="bg-violet-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-violet-700 transition"
            >
              + New Communication
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Send size={20} />} title="Messages Sent" value={stats.sent} subtitle="Total delivered" />
            <StatCard icon={<Clock3 size={20} />} title="Pending / Queued" value={stats.queued} subtitle="Awaiting delivery" />
            <StatCard icon={<AlertTriangle size={20} className={stats.failed > 0 ? "text-red-500" : ""} />} title="Failed" value={stats.failed} subtitle="Delivery failed" />
            <StatCard icon={<Calendar size={20} />} title="Scheduled" value={stats.scheduled} subtitle="Upcoming messages" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b">
              <h2 className="font-semibold text-gray-800">Recent Communications</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="text-left p-4 font-medium">Communication</th>
                    <th className="text-left p-4 font-medium">Audience</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Sent / Scheduled</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {communications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">No communications found. Create one to get started.</td>
                    </tr>
                  ) : (
                    communications.map((item) =>{ 
                      const isPendingApproval = item.status.toLowerCase().replace(/_/g, " ") === "pending approval";
                      return (
                      <tr key={item.id} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                              {getIconForStage(item.stage)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.subject}</p>
                              <p className="text-sm text-gray-500">{item.stage}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="text-gray-900">{item.audience}</p>
                          <p className="text-sm text-gray-500">{item.recipients} recipients</p>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              item.status === "Sent" ? "bg-green-100 text-green-700" : 
                              item.status === "Scheduled" ? "bg-blue-100 text-blue-700" : 
                              isPendingApproval ? "bg-orange-100 text-orange-700" : 
                              item.status === "Failed" ? "bg-red-100 text-red-700" : 
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="p-4 text-sm text-gray-600">
                          {new Date(item.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </td>

                        <td className="p-4">
                          {isPendingApproval ? (
                            <button
                              onClick={() => handleQuickApprove(item)}
                              disabled={isApprovingId === item.id}
                              className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                            >
                              {isApprovingId === item.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              Approve Now
                            </button>
                          ) : (
                            <button className="text-gray-400 hover:text-gray-700">
                              <MoreVertical size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (LLM Draft & Dispatch) */}
        <div className="col-span-12 xl:col-span-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6 shadow-sm">
            <h2 className="font-bold text-xl mb-6">New Communication</h2>

            <div className="space-y-5">
              
              {/* STEP 1: CONFIGURATION */}
              <div>
                <label className="text-sm font-medium text-gray-700">Communication Purpose (Stage)</label>
                <select 
                  className="w-full mt-1.5 border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  disabled={!!draftId}
                >
                  <option>Welcome & Team Assignment</option>
                  <option>Reminder</option>
                  <option>Evaluation Request</option>
                  <option>Results Announcement</option>
                  <option>Custom Update</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Recipients</label>
                <select 
                  className="w-full mt-1.5 border border-gray-300 rounded-lg p-2.5 text-gray-800 bg-white"
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  disabled={!!draftId}
                >
                  <option value="Participants">Participants</option>
                  <option value="Judges">Judges (Evaluators)</option>
                  <option value="Mentors">Mentors</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Subject Line</label>
                <input 
                  type="text"
                  placeholder="e.g. Action Required: Round 1 Evaluations"
                  className="w-full mt-1.5 border border-gray-300 rounded-lg p-2.5 text-gray-800"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!!draftId}
                />
              </div>

              {!draftId && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Additional Instructions (Optional)</label>
                  <textarea 
                    placeholder="Tell the AI what specific points to mention..."
                    rows={2}
                    className="w-full mt-1.5 border border-gray-300 rounded-lg p-2.5 text-gray-800 text-sm"
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                  />
                  
                  <button 
                    onClick={handleGenerateDraft}
                    disabled={isDrafting || !subject}
                    className="w-full mt-4 bg-gray-900 hover:bg-black text-white rounded-lg py-3 flex items-center justify-center gap-2 font-medium disabled:opacity-50 transition"
                  >
                    {isDrafting ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                    {isDrafting ? "Drafting..." : "✨ Generate AI Draft"}
                  </button>
                </div>
              )}

              {/* STEP 2: REVIEW & DISPATCH */}
              {draftId && (
                <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <label className="text-sm font-medium text-gray-700 flex justify-between items-end mb-1.5">
                    Preview Message
                    <span className="text-xs text-violet-600 font-medium bg-violet-50 px-2 py-0.5 rounded">Editable</span>
                  </label>
                  <textarea
                    rows={12}
                    className="w-full border border-violet-200 rounded-lg p-3 text-sm text-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-mono"
                    value={generatedBody}
                    onChange={(e) => setGeneratedBody(e.target.value)}
                  />
                  
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Schedule (Optional)</label>
                    <input 
                      type="datetime-local" 
                      className="w-full mt-1.5 border border-gray-300 rounded-lg p-2.5 text-gray-800 text-sm"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Leave blank to send (or request approval) immediately.</p>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button 
                      onClick={handleCancel}
                      disabled={isDispatching}
                      className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Discard
                    </button>

                    <button 
                      onClick={handleDispatch}
                      disabled={isDispatching}
                      className="flex-[2] bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2.5 font-medium flex justify-center items-center gap-2 transition disabled:opacity-50 shadow-sm"
                    >
                      {isDispatching ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      {scheduledFor ? "Schedule Dispatch" : "Dispatch Now"}
                    </button>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Sub-components ---
function StatCard({ icon, title, value, subtitle }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-1 text-gray-900">{value}</h3>
      <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>
    </div>
  );
}