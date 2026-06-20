import { useState, useEffect } from "react";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Send,
  Flag,
  ChevronLeft,
  ChevronRight,
  Plane,
  Building,
  Bold,
  Italic,
  List,
  ListOrdered,
  X
} from "lucide-react";
import { api } from "../../lib/api";

export default function TravelManagement() {
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchQueries = async () => {
    try {
      const res = await api.get("/api/travel-logistics/queries");
      setQueries(res.data.queries || []);
      if (!selectedQuery && res.data.queries && res.data.queries.length > 0) {
        setSelectedQuery(res.data.queries[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch queries", err);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const stats = [
    { icon: MessageCircle, label: "Total Queries", value: queries.length, sublabel: "All time", color: "purple" },
    { icon: MessageCircle, label: "Open", value: queries.filter(q => q.status === "Submitted").length, sublabel: "Require attention", color: "orange" },
    { icon: Clock, label: "In Progress", value: queries.filter(q => q.status === "In Progress").length, sublabel: "Committee replied", color: "blue" },
    { icon: CheckCircle2, label: "Resolved", value: queries.filter(q => q.status === "Resolved").length, sublabel: "This event", color: "green" },
  ];

  const selectedQueryData = queries.find(q => q.id === selectedQuery);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "bg-orange-50 text-orange-700 border border-orange-200";
      case "In Progress": return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Resolved": return "bg-green-50 text-green-700 border border-green-200";
      case "Escalated": return "bg-red-50 text-red-700 border border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleReply = async () => {
    if (!selectedQueryData || !replyText.trim()) return;
    try {
      await api.post(`/api/travel-logistics/queries/${selectedQueryData.id}/reply`, { message: replyText });
      setReplyText("");
      fetchQueries();
    } catch (err) {
      console.error("Failed to reply", err);
    }
  };

  const handleResolve = async () => {
    if (!selectedQueryData) return;
    try {
      await api.patch(`/api/travel-logistics/queries/${selectedQueryData.id}/resolve`);
      fetchQueries();
    } catch (err: any) {
      if (err.response?.status === 400) {
        alert(err.response.data.detail || "Please reply before resolving.");
      } else {
        console.error("Failed to resolve", err);
      }
    }
  };

  const handleEscalate = async () => {
    if (!selectedQueryData) return;
    try {
      await api.patch(`/api/travel-logistics/queries/${selectedQueryData.id}/escalate`);
      fetchQueries();
    } catch (err) {
      console.error("Failed to escalate", err);
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}\n${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Travel Queries Management</h1>
        <p className="text-gray-600 mt-1">View participant travel-related queries and provide timely responses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === "purple" ? "bg-purple-50" :
                stat.color === "orange" ? "bg-orange-50" :
                stat.color === "blue" ? "bg-blue-50" : "bg-green-50"
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === "purple" ? "text-purple-600" :
                  stat.color === "orange" ? "text-orange-600" :
                  stat.color === "blue" ? "text-blue-600" : "text-green-600"
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-900">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.sublabel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: All Travel Queries Table */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">All Travel Queries</h3>
            
            {/* Filters */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by participant, team, subject..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Categories</option>
                <option>Airport Pickup</option>
                <option>Reimbursement</option>
                <option>Hotel Stay</option>
                <option>Food & Dietary</option>
                <option>Shuttle Service</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option>All Status</option>
                <option>Submitted</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-medium">Participant / Team</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Subject</th>
                  <th className="p-4 font-medium">Submitted</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queries.map((query) => (
                  <tr
                    key={query.id}
                    className={`hover:bg-purple-50/50 cursor-pointer transition ${selectedQuery === query.id ? "bg-purple-50/50" : ""}`}
                    onClick={() => setSelectedQuery(query.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                          {query.participant_name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{query.participant_name}</p>
                          <p className="text-xs text-gray-500">{query.team_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        {query.category}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{query.subject}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-500 whitespace-pre-line text-xs">{formatDate(query.created_at)}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                        {query.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Showing {queries.length} entries</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"><ChevronLeft size={16} /></button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right: Query Detail Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-900">Query Detail</h3>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedQuery(null)}>
              <X size={20} />
            </button>
          </div>

          {selectedQueryData ? (
            <>
              {/* User Info */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                    {selectedQueryData.participant_name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{selectedQueryData.participant_name}</p>
                    <p className="text-xs text-gray-500">{selectedQueryData.team_name}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQueryData.status)}`}>
                  {selectedQueryData.status}
                </span>
              </div>

              {/* Category & Submitted */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Plane size={12} /> Category
                  </p>
                  <p className="text-sm font-medium text-gray-900">{selectedQueryData.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Clock size={12} /> Submitted
                  </p>
                  <p className="text-sm font-medium text-gray-900 whitespace-pre-line text-xs">{formatDate(selectedQueryData.created_at)}</p>
                </div>
              </div>

              {/* Participant Question */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Participant Question</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap">
                  {selectedQueryData.message}
                </div>
              </div>

              {/* Your Reply */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Your Reply</p>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply to the participant..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-2"
                ></textarea>
                
                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 p-2 border border-gray-200 rounded-lg mb-3">
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Bold size={14} /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded"><Italic size={14} /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded"><List size={14} /></button>
                  <button className="p-1.5 hover:bg-gray-100 rounded"><ListOrdered size={14} /></button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button onClick={handleReply} className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm">
                    <Send size={16} />
                    Send Reply
                  </button>
                  <button onClick={handleResolve} className="px-3 py-2 border border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-50 transition flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} />
                    Mark Resolved
                  </button>
                  <button onClick={handleEscalate} className="px-3 py-2 border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition flex items-center gap-2 text-sm">
                    <Flag size={16} />
                    Escalate
                  </button>
                </div>
              </div>

              {/* Response History */}
              {selectedQueryData.conversation && selectedQueryData.conversation.length > 1 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-3">Response History</p>
                  <div className="space-y-3">
                    {selectedQueryData.conversation.slice(1).map((msg: any, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs flex-shrink-0">
                          {msg.sender === "committee" ? "C" : selectedQueryData.participant_name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900">{msg.sender === "committee" ? "Committee (You)" : selectedQueryData.participant_name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${msg.sender === "committee" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
                              {msg.sender === "committee" ? "Committee" : "Participant"}
                            </span>
                            <span className="text-xs text-gray-500 ml-auto text-right">{formatDate(msg.timestamp || msg.time)}</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap">
                            {msg.message || msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Select a query to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
