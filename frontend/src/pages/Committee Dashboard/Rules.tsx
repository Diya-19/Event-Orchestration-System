import { useState } from 'react';
import {
  CalendarDays, Users, Building2, Scale, Shield, Info, Search,
  Filter, GripVertical, Pencil, Trash2, X, Save, Bold, Italic,
  Underline, List, Link, Quote, ToggleLeft, ToggleRight, Check
} from 'lucide-react';

type Rule = {
  id: string;
  title: string;
  category: string;
  description: string;
  updatedAt: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
};

// Mock Data
const initialRules: Rule[] = [
  { id: '1', title: 'Submission Deadline', category: 'Submission', description: 'All teams must submit their projects before the official deadline.\n• The final submission must include all required deliverables.\n• No further changes will be accepted after submission.', updatedAt: 'May 18, 2025', icon: CalendarDays, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { id: '2', title: 'Team Eligibility', category: 'Eligibility', description: 'Teams must be formed according to the eligibility criteria set by the organizers.', updatedAt: 'May 18, 2025', icon: Users, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { id: '3', title: 'Team Size', category: 'Team Rules', description: 'Teams must maintain a size between 3 and 5 members throughout the event.', updatedAt: 'May 18, 2025', icon: Users, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  { id: '4', title: 'Judging Criteria', category: 'Judging', description: 'Projects will be evaluated based on innovation, technical complexity, UI/UX, and presentation.', updatedAt: 'May 18, 2025', icon: Scale, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { id: '5', title: 'Code of Conduct', category: 'Conduct', description: 'All participants must adhere to the code of conduct. Violations may result in disqualification.', updatedAt: 'May 18, 2025', icon: Shield, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  { id: '6', title: 'General Guidelines', category: 'Miscellaneous', description: 'Follow all event schedules, communicate with mentors, and submit feedback forms after the event.', updatedAt: 'May 18, 2025', icon: Info, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
];

export default function RulesPage() {
  const [rules, setRules] = useState(initialRules);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(initialRules[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [flexibleTeamSize, setFlexibleTeamSize] = useState(true);
  
  // Edit state
  const [editForm, setEditForm] = useState(selectedRule || initialRules[0]);

  // Filter logic
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || rule.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Update edit form when selection changes
  const handleSelectRule = (rule: Rule) => {
    setSelectedRule(rule);
    setEditForm(rule);
  };

  const handleSave = () => {
    if (!selectedRule) return;
    setRules(prev => prev.map(r => r.id === selectedRule.id ? { ...r, ...editForm } : r));
    setSelectedRule({ ...selectedRule, ...editForm });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rules & Guidelines</h1>
          <p className="text-sm text-gray-500 mt-1">Create, manage and organize the rules for your hackathon.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <span>+ Add Rule</span>
        </button>
      </div>

      {/* Team Size Settings */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Users className="text-purple-600" size={20} />
          </div>
          <span className="font-semibold text-purple-700">Team Size Settings</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {[
            { label: 'Minimum Members', value: 3, id: 'min' },
            { label: 'Maximum Members', value: 5, id: 'max' },
            { label: 'Max per Institution', value: 2, id: 'inst' }
          ].map(({ label, value, id }) => (
            <div key={id} className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{label}</span>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                <button className="text-gray-400 hover:text-gray-600">-</button>
                <span className="font-medium w-4 text-center">{value}</span>
                <button className="text-gray-400 hover:text-gray-600">+</button>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-500">Allow flexible team size</span>
            <button
              onClick={() => setFlexibleTeamSize(!flexibleTeamSize)}
              className={`w-10 h-5 rounded-full relative transition-colors ${flexibleTeamSize ? 'bg-purple-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${flexibleTeamSize ? 'left-6' : 'left-1'}`} />
            </button>
            <span className="text-[10px] text-gray-400">Teams may have members within the range above.</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-800">Rules List</h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">{rules.length} Rules</span>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option>All Categories</option>
              <option>Submission</option>
              <option>Eligibility</option>
              <option>Team Rules</option>
              <option>Judging</option>
              <option>Conduct</option>
              <option>Miscellaneous</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredRules.map(rule => (
              <div
                key={rule.id}
                onClick={() => handleSelectRule(rule)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedRule?.id === rule.id
                    ? 'border-purple-300 bg-purple-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${rule.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <rule.icon size={20} className={rule.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{rule.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{rule.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Updated on {rule.updatedAt}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><Pencil size={16} className="text-gray-400" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><Trash2 size={16} className="text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Rule Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Edit Rule</h2>
            <button onClick={() => setSelectedRule(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18} className="text-gray-400" /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Title *</label>
              <input
                type="text"
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={editForm.category}
                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option>Submission</option>
                <option>Eligibility</option>
                <option>Team Rules</option>
                <option>Judging</option>
                <option>Conduct</option>
                <option>Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Description *</label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                  {[Bold, Italic, Underline, List, Link, Quote].map((Icon, i) => (
                    <button key={i} className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Icon size={14} /></button>
                  ))}
                </div>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  rows={8}
                  className="w-full p-3 text-sm focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Save size={16} /> Save Rule
              </button>
              <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors">
                Cancel
              </button>
              <button className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}