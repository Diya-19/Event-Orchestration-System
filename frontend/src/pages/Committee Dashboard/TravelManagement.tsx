import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Paperclip, 
  Calendar, 
  Tag, 
  Download,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Send,
  ArrowUpRight
} from 'lucide-react';

// --- Type Definitions ---
interface QueryItem {
  id: string;
  initials: string;
  name: string;
  team: string;
  category: 'Airport Pickup' | 'Reimbursement' | 'Hotel Stay' | 'Food & Dietary' | 'Shuttle Service';
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  submittedAt: string;
  status: 'Open' | 'Awaiting Response' | 'Resolved';
  message: string;
  attachment?: {
    name: string;
    size: string;
  };
}

// --- Mock Data ---
const initialQueries: QueryItem[] = [
  {
    id: '1',
    initials: 'RS',
    name: 'Rahul Sharma',
    team: 'Team Alpha',
    category: 'Airport Pickup',
    subject: 'Airport pickup time confirmation',
    priority: 'Medium',
    submittedAt: '22 Jun 2026, 09:15 AM',
    status: 'Open',
    message: 'Hello HackFlow team,\n\nI will be landing at BLR Airport (T1) on 21 June at 11:45 PM. Can you please confirm the pickup time and location for the organised shuttle?\n\nThanks!',
    attachment: { name: 'Flight_IndiGo_6E-2134.pdf', size: '210 KB' }
  },
  {
    id: '2',
    initials: 'AM',
    name: 'Anita Mehta',
    team: 'Team Vega',
    category: 'Reimbursement',
    subject: 'Reimbursement form upload issue',
    priority: 'High',
    submittedAt: '22 Jun 2026, 10:20 AM',
    status: 'Awaiting Response',
    message: 'Hi, I am trying to upload my travel receipts but the portal throws a 500 error consistently. Please assist.'
  },
  {
    id: '3',
    initials: 'DK',
    name: 'Dev Kumar',
    team: 'Team ByteBuilders',
    category: 'Hotel Stay',
    subject: 'Request for early check-in',
    priority: 'Medium',
    submittedAt: '22 Jun 2026, 11:20 AM',
    status: 'Open',
    message: 'Hey, our flight lands early in the morning. Is it possible to arrange an early check-in at the hotel?'
  },
  {
    id: '4',
    initials: 'NP',
    name: 'Neha Patel',
    team: 'Team Nova',
    category: 'Food & Dietary',
    subject: 'Severe nut allergy - meal request',
    priority: 'High',
    submittedAt: '22 Jun 2026, 12:35 PM',
    status: 'Open',
    message: 'Hello, I wanted to formally update that I have a severe peanut allergy. Please ensure the catering crew is informed.'
  },
  {
    id: '5',
    initials: 'AY',
    name: 'Arjun Yadav',
    team: 'Team Frontend',
    category: 'Shuttle Service',
    subject: 'Shuttle schedule for team dinner',
    priority: 'Low',
    submittedAt: '22 Jun 2026, 01:10 PM',
    status: 'Resolved',
    message: 'Can someone share the exact timing for the shuttle leaving to the dinner venue?'
  },
  {
    id: '6',
    initials: 'RS',
    name: 'Riya Singh',
    team: 'Team Alpha',
    category: 'Reimbursement',
    subject: 'Clarification on eligible expenses',
    priority: 'Medium',
    submittedAt: '22 Jun 2026, 02:05 PM',
    status: 'Awaiting Response',
    message: 'Are local cab fares to the venue covered under the reimbursement policy?'
  },
  {
    id: '7',
    initials: 'VS',
    name: 'Vivek Sinha',
    team: 'Team CodeCrafters',
    category: 'Hotel Stay',
    subject: 'Extra pillow request',
    priority: 'Low',
    submittedAt: '22 Jun 2026, 03:18 PM',
    status: 'Resolved',
    message: 'Need an extra pillow in room 405. Thanks.'
  },
  {
    id: '8',
    initials: 'KB',
    name: 'Kavya Bhat',
    team: 'Team InnovateX',
    category: 'Airport Pickup',
    subject: 'Landing late night - pickup arrangement',
    priority: 'High',
    submittedAt: '22 Jun 2026, 04:40 PM',
    status: 'Open',
    message: 'My flight got delayed and I will now land at 2:00 AM. Will the shuttle still be running?'
  }
];

export default function TravelQueries() {
  const [queries, setQueries] = useState<QueryItem[]>(initialQueries);
  const [selectedQuery, setSelectedQuery] = useState<QueryItem | null>(initialQueries[0]);
  const [replyText, setReplyText] = useState('');

  // Styling Helpers
  const getPriorityStyles = (priority: QueryItem['priority']) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-600 border border-red-100';
      case 'Medium': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'Low': return 'bg-green-50 text-green-600 border border-green-100';
    }
  };

  const getStatusStyles = (status: QueryItem['status']) => {
    switch (status) {
      case 'Open': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Awaiting Response': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  const getCategoryBg = (category: QueryItem['category']) => {
    switch (category) {
      case 'Airport Pickup': return 'bg-purple-50 text-purple-600';
      case 'Reimbursement': return 'bg-indigo-50 text-indigo-600';
      case 'Hotel Stay': return 'bg-blue-50 text-blue-600';
      case 'Food & Dietary': return 'bg-rose-50 text-rose-600';
      case 'Shuttle Service': return 'bg-cyan-50 text-cyan-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans antialiased text-slate-800">
      
      {/* --- Top Header --- */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Travel Queries Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">View participant travel-related queries and provide timely responses.</p>
      </div>

      {/* --- Metrics Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">48</span>
            </div>
            <p className="text-xs font-semibold text-slate-800">Total Queries</p>
            <p className="text-[11px] text-slate-400">All time</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900">12</span>
            <p className="text-xs font-semibold text-slate-800">Open</p>
            <p className="text-[11px] text-slate-400">Require attention</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900">8</span>
            <p className="text-xs font-semibold text-slate-800">Awaiting Response</p>
            <p className="text-[11px] text-slate-400">Participant replied</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900">28</span>
            <p className="text-xs font-semibold text-slate-800">Resolved</p>
            <p className="text-[11px] text-slate-400">This event</p>
          </div>
        </div>
      </div>

      {/* --- Main Dashboard Container --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* --- Left / Center Column: Table View --- */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 mb-4">All Travel Queries</h2>
            
            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by participant, team, subject..." 
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                />
              </div>

              <select className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none">
                <option>All Categories</option>
              </select>

              <select className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none">
                <option>All Status</option>
              </select>

              <select className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none">
                <option>All Priority</option>
              </select>

              <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors ml-auto">
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Participant / Team</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4 whitespace-nowrap">Submitted</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {queries.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedQuery?.id === item.id ? 'bg-purple-50/30' : ''}`}
                    onClick={() => setSelectedQuery(item)}
                  >
                    {/* User profile identifier block */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center text-xs shrink-0">
                          {item.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 whitespace-nowrap">{item.name}</div>
                          <div className="text-xs text-slate-400 whitespace-nowrap">{item.team}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Category Label */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${getCategoryBg(item.category)}`}>
                        {item.category}
                      </span>
                    </td>

                    {/* Subject copy line */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate font-medium text-slate-700">
                      {item.subject}
                    </td>

                    {/* Priority metrics label */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide ${getPriorityStyles(item.priority)}`}>
                        {item.priority}
                      </span>
                    </td>

                    {/* Date stamp representation */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {item.submittedAt.split(',')[0]}
                      <span className="block text-[10px] text-slate-400">{item.submittedAt.split(',')[1]}</span>
                    </td>

                    {/* Status badge element container */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions button */}
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => setSelectedQuery(item)}
                        className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-purple-600 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination Controls */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Showing 1 to 8 of 48 entries</span>
            
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button className="w-7 h-7 bg-purple-600 text-white rounded-md flex items-center justify-center font-bold">1</button>
              <button className="w-7 h-7 border border-slate-200 hover:bg-slate-50 rounded-md flex items-center justify-center text-slate-600">2</button>
              <button className="w-7 h-7 border border-slate-200 hover:bg-slate-50 rounded-md flex items-center justify-center text-slate-600">3</button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-7 h-7 border border-slate-200 hover:bg-slate-50 rounded-md flex items-center justify-center text-slate-600">6</button>
              <button className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        {/* --- Right Column: Detail Panel View --- */}
        <div className="xl:col-span-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden sticky top-6">
          {selectedQuery ? (
            <div>
              {/* Context Panel Top bar header layout */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Query Detail</h3>
                <button 
                  onClick={() => setSelectedQuery(null)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Profile layout inside panel detailed info summary block */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                      {selectedQuery.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">{selectedQuery.name}</h4>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{selectedQuery.team}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded-md border border-amber-200">
                    {selectedQuery.status}
                  </span>
                </div>

                {/* Meta details segment for tags */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 mb-1 font-medium">
                      <Tag className="w-3 h-3" /> Category
                    </span>
                    <span className="font-bold text-slate-700">{selectedQuery.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1 mb-1 font-medium">
                      <Calendar className="w-3 h-3" /> Submitted
                    </span>
                    <span className="font-bold text-slate-700 block whitespace-nowrap">{selectedQuery.submittedAt}</span>
                  </div>
                </div>

                {/* Original inquiry message display container */}
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-wide uppercase block mb-2">Participant Question</span>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {selectedQuery.message}
                  </div>
                </div>

                {/* Document Attachments layout */}
                {selectedQuery.attachment && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase block mb-2">Attachment</span>
                    <div className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-white hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-rose-50 text-rose-500 rounded-md font-bold text-xs shrink-0">PDF</div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">{selectedQuery.attachment.name}</p>
                          <p className="text-[10px] text-slate-400">{selectedQuery.attachment.size}</p>
                        </div>
                      </div>
                      <button className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded-md">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Administrative action input component text fields */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 tracking-wide uppercase block">Your Reply</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all">
                    {/* Text Styling Bar */}
                    <div className="flex items-center gap-1 bg-slate-50/80 px-2.5 py-1.5 border-b border-slate-200 text-slate-400">
                      <button className="p-1 hover:text-slate-600 rounded"><Bold className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:text-slate-600 rounded"><Italic className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:text-slate-600 rounded"><List className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:text-slate-600 rounded"><ListOrdered className="w-3.5 h-3.5" /></button>
                      <div className="w-px h-3.5 bg-slate-200 mx-1" />
                      <button className="p-1 hover:text-slate-600 rounded"><Link2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1 hover:text-slate-600 rounded"><Paperclip className="w-3.5 h-3.5" /></button>
                    </div>
                    
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply to the participant..."
                      className="w-full text-sm p-3 h-24 border-0 focus:outline-none focus:ring-0 placeholder:text-slate-400 resize-none text-slate-700 bg-white"
                    />
                  </div>
                  
                  {/* Panel Response Submission CTA Group Row */}
                  <div className="flex items-center gap-2 pt-1.5">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium rounded-lg text-xs shadow-sm shadow-purple-600/10 transition-colors">
                      <Send className="w-3.5 h-3.5" />
                      Send Reply
                    </button>
                    <button className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-lg text-xs transition-colors whitespace-nowrap">
                      Mark Resolved
                    </button>
                    <button className="p-2 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors" title="Escalate query">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Historic timeline conversation feed stream component */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 tracking-wide uppercase block mb-3">Response History</span>
                  <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[9px]">AS</span>
                        <span className="font-bold text-slate-800">Aarav Sharma (You)</span>
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-bold rounded">Committee</span>
                      </div>
                      <span className="text-slate-400 font-medium text-[10px]">22 Jun 2026, 09:28 AM</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      Hi Rahul,<br /><br />
                      Thanks for sharing the details. The shuttle from BLR Airport (T1) will be available at 11:30 PM near Gate 4.<br /><br />
                      Please look for the HackFlow signage.<br /><br />
                      Safe travels!
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              Select a query from the table view to view full details and responses.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}