import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle, AlertCircle, Info, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllDeadlines, getRemainingTime, getPriority, Deadline } from '../../lib/deadlineService';

const DeadlineModal = ({ isOpen, onClose, deadline }: any) => {
  if (!isOpen || !deadline) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Deadline Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</span>
            <p className="text-base font-bold text-slate-800 mt-1">{deadline.title}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</span>
            <p className="text-slate-700 font-medium mt-1">{deadline.date}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remaining Time</span>
            <p className={`font-semibold mt-1 ${deadline.isExpired ? 'text-red-600' : 'text-slate-800'}`}>
              {deadline.countdown}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</span>
              <p className="mt-1">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${deadline.priorityStyle}`}>
                  {deadline.priority}
                </span>
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
              <p className="mt-1">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${deadline.isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {deadline.isExpired ? 'Expired' : 'Active'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Deadlines() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'upcoming' | 'expired'>('all');
  const [selectedDeadline, setSelectedDeadline] = useState<any>(null);

  useEffect(() => {
    // In the future, this is where the API call to GET /api/committee/deadlines will happen.
    const fetchDeadlines = async () => {
      try {
        const rawDeadlines = getAllDeadlines();
        
        const processed = rawDeadlines.map((d: Deadline) => {
          const isExpired = d.status === "expired" || new Date(d.dueDate).getTime() < Date.now();
          const countdown = getRemainingTime(d);
          const priority = getPriority(d);
          
          let priorityStyle = 'bg-blue-100 text-blue-700 border-blue-200';
          let icon = Calendar;
          
          if (isExpired) {
            priorityStyle = 'bg-red-100 text-red-700 border-red-200';
            icon = AlertCircle;
          } else if (priority === 'critical') {
            priorityStyle = 'bg-rose-100 text-rose-700 border-rose-200';
            icon = AlertTriangle;
          } else if (priority === 'high') {
            priorityStyle = 'bg-orange-100 text-orange-700 border-orange-200';
            icon = AlertTriangle;
          } else if (priority === 'medium') {
            priorityStyle = 'bg-amber-100 text-amber-700 border-amber-200';
            icon = Clock;
          }

          return {
            ...d,
            date: new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date(d.dueDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isExpired,
            countdown,
            priority: priority.charAt(0).toUpperCase() + priority.slice(1),
            priorityStyle,
            Icon: icon
          };
        });

        setDeadlines(processed);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch deadlines", err);
        setError("Failed to load deadlines data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeadlines();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <p className="text-slate-500">Loading deadlines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const missedDeadlines = deadlines.filter(d => d.isExpired);
  
  let filteredDeadlines = deadlines;
  if (filter === 'critical') filteredDeadlines = deadlines.filter(d => d.priority === 'Critical' && !d.isExpired);
  if (filter === 'upcoming') filteredDeadlines = deadlines.filter(d => !d.isExpired);
  if (filter === 'expired') filteredDeadlines = deadlines.filter(d => d.isExpired);

  const DeadlineCard = ({ d }: any) => (
    <div 
      onClick={() => setSelectedDeadline(d)}
      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border ${d.priorityStyle}`}>
          <d.Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">{d.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs text-slate-500">{d.date}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:items-end w-full sm:w-auto">
        <p className={`text-sm font-bold ${d.isExpired ? 'text-red-600' : 'text-slate-800'}`}>
          {d.countdown}
        </p>
        <span className={`mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${d.priorityStyle}`}>
          {d.priority} Priority
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased p-8">
      <DeadlineModal 
        isOpen={!!selectedDeadline} 
        onClose={() => setSelectedDeadline(null)} 
        deadline={selectedDeadline} 
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/judge')}
            className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Deadlines</h1>
            <p className="text-slate-500 text-sm mt-1">Track your upcoming evaluations and milestones.</p>
          </div>
        </div>

        {missedDeadlines.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="font-bold text-red-800">Missed Deadlines</h2>
            </div>
            <div className="space-y-3">
              {missedDeadlines.map((d, idx) => <DeadlineCard key={idx} d={d} />)}
            </div>
          </div>
        )}

        <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex flex-wrap gap-1 mb-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${filter === 'all' ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            All Deadlines
          </button>
          <button 
            onClick={() => setFilter('critical')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${filter === 'critical' ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Critical
          </button>
          <button 
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${filter === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${filter === 'expired' ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Expired
          </button>
        </div>

        <div className="space-y-3">
          {filteredDeadlines.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500">No deadlines available.</p>
            </div>
          ) : (
            filteredDeadlines.map((d, idx) => <DeadlineCard key={idx} d={d} />)
          )}
        </div>
      </div>
    </div>
  );
}