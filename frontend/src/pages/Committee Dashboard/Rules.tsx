import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarDays, Users, Scale, Shield, Info, Search,
  Pencil, Trash2, X, Save, Bold, Italic,
  Underline, List, Link, Quote
} from 'lucide-react';
import { api } from '../../lib/api'; 

type Rule = {
  id: string; // Will be empty string for unsaved new rules
  title: string;
  category: string;
  description: string;
  updated_at?: string;
};

// 1. Icon & Style Mapping based on Category
const CATEGORY_ICONS: Record<string, { icon: React.ElementType, bg: string, color: string }> = {
  'Submission': { icon: CalendarDays, bg: 'bg-purple-100', color: 'text-purple-600' },
  'Eligibility': { icon: Users, bg: 'bg-green-100', color: 'text-green-600' },
  'Team Rules': { icon: Users, bg: 'bg-orange-100', color: 'text-orange-600' },
  'Judging': { icon: Scale, bg: 'bg-purple-100', color: 'text-purple-600' },
  'Conduct': { icon: Shield, bg: 'bg-red-100', color: 'text-red-600' },
  'Miscellaneous': { icon: Info, bg: 'bg-blue-100', color: 'text-blue-600' },
};

// 2. Date Formatter Helper
const formatDate = (dateString?: string) => {
  if (!dateString) return "Just now"; // Fallback for newly created, unsynced rules
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function RulesPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id") ?? "";

  // Decoupled States
  const [rules, setRules] = useState<Rule[]>([]);
  const [teamConfig, setTeamConfig] = useState({
    team_size: 3,
    max_per_institution: 2,
    min_per_institution: 1,
  });

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [editForm, setEditForm] = useState<Rule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  // Fetch data independently
  useEffect(() => {
    if (!eventId) return;
    
    Promise.all([
      api.get(`/api/events/${eventId}/team-settings`),
      api.get(`/api/events/${eventId}/rules`)
    ])
    .then(([settingsRes, rulesRes]) => {
      setTeamConfig(settingsRes.data);
      setRules(rulesRes.data);
    })
    .catch(() => console.error("Failed to load settings or rules"))
    .finally(() => setIsLoading(false));

  }, [eventId]);

  // Handler: Update Team Settings 
  const handleConfigChange = async (key: keyof typeof teamConfig, increment: number) => {
    const newValue = Math.max(1, teamConfig[key] + increment);
    const newConfig = { ...teamConfig, [key]: newValue };
    
    setTeamConfig(newConfig); // Optimistic UI update
    
    try {
      await api.put(`/api/events/${eventId}/team-settings`, newConfig);
    } catch {
      alert("Failed to update team settings.");
    }
  };

  // Handler: Create or Update a Rule
  const handleSaveRule = async () => {
    if (!editForm || !eventId) return;

    try {
      if (editForm.id === "") {
        // CREATE
        const { data: newRule } = await api.post(`/api/events/${eventId}/rules`, editForm);
        setRules([newRule, ...rules]);
      } else {
        // UPDATE
        const { data: updatedRule } = await api.put(`/api/events/${eventId}/rules/${editForm.id}`, editForm);
        setRules(rules.map(r => r.id === editForm.id ? updatedRule : r));
      }
      
      setSelectedRule(null);
      setEditForm(null);
    } catch {
      alert("Failed to save rule.");
    }
  };

  // Handler: Delete Rule
  const handleDeleteRule = async (id: string) => {
    if (!eventId || id === "") {
      setSelectedRule(null);
      setEditForm(null);
      return;
    }

    try {
      await api.delete(`/api/events/${eventId}/rules/${id}`);
      setRules(rules.filter(r => r.id !== id));
      if (selectedRule?.id === id) {
        setSelectedRule(null);
        setEditForm(null);
      }
    } catch {
      alert("Failed to delete rule.");
    }
  };

  // Handler: Prepare UI for Add Rule
  const handleAddNewRule = () => {
    const emptyRule: Rule = { 
      id: "", 
      title: "", 
      category: "Submission", 
      description: "" 
    };
    setSelectedRule(emptyRule);
    setEditForm(emptyRule);
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || rule.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (!eventId) return <div className="p-6 text-gray-500">Please select an event first.</div>;
  if (isLoading) return <div className="p-6 text-gray-500">Loading rules...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rules & Guidelines</h1>
          <p className="text-sm text-gray-500 mt-1">Create, manage and organize the rules for your hackathon.</p>
        </div>
        <button 
          onClick={handleAddNewRule}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
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
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">Team Size</span>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
              <button onClick={() => handleConfigChange('team_size', -1)} className="text-gray-400 hover:text-gray-600">-</button>
              <span className="font-medium w-4 text-center">{teamConfig.team_size}</span>
              <button onClick={() => handleConfigChange('team_size', 1)} className="text-gray-400 hover:text-gray-600">+</button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">Min per Institution</span>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
              <button onClick={() => handleConfigChange('min_per_institution', -1)} className="text-gray-400 hover:text-gray-600">-</button>
              <span className="font-medium w-4 text-center">{teamConfig.min_per_institution}</span>
              <button onClick={() => handleConfigChange('min_per_institution', 1)} className="text-gray-400 hover:text-gray-600">+</button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-500">Max per Institution</span>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
              <button onClick={() => handleConfigChange('max_per_institution', -1)} className="text-gray-400 hover:text-gray-600">-</button>
              <span className="font-medium w-4 text-center">{teamConfig.max_per_institution}</span>
              <button onClick={() => handleConfigChange('max_per_institution', 1)} className="text-gray-400 hover:text-gray-600">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rules List Column */}
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
              {Object.keys(CATEGORY_ICONS).map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredRules.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No rules found. Click "Add Rule" to create one.</p>
            ) : (
              filteredRules.map(rule => {
                // Dynamically fetch icon styling based on category string
                const styling = CATEGORY_ICONS[rule.category] || CATEGORY_ICONS['Miscellaneous'];
                const IconComponent = styling.icon;

                return (
                  <div
                    key={rule.id}
                    onClick={() => { setSelectedRule(rule); setEditForm({ ...rule }); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedRule?.id === rule.id
                        ? 'border-purple-300 bg-purple-50/50 shadow-sm'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${styling.bg} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent size={20} className={styling.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm">{rule.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{rule.category}</span>
                      </div>
                      {/* Formatted Date Rendered Here */}
                      <p className="text-xs text-gray-400 mt-1">Updated on {formatDate(rule.updated_at)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><Pencil size={16} className="text-gray-400" /></button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteRule(rule.id); }}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Edit/Create Form Column */}
        {editForm && (
          <div className="lg:col-span-1 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">{editForm.id === "" ? 'Add Rule' : 'Edit Rule'}</h2>
              <button onClick={() => { setSelectedRule(null); setEditForm(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={18} className="text-gray-400" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Code of Conduct"
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
                  {Object.keys(CATEGORY_ICONS).map(cat => (
                     <option key={cat}>{cat}</option>
                  ))}
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
                    placeholder="Describe the rules here..."
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    rows={8}
                    className="w-full p-3 text-sm focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveRule}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Save size={16} /> Save
                </button>
                <button 
                  onClick={() => handleDeleteRule(editForm.id)}
                  className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} /> 
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}