import { api } from "../../lib/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CalendarDays, Users, Scale, Shield, Info, Search,
  Pencil, Trash2, X, Save, Bold, Italic,
  Underline, List, Link, Quote
} from 'lucide-react';

type Rule = {
  id: string;
  title: string;
  category: string;
  description: string;
  updated_at: string;
};

export interface DistributionRules {
  id?: string;
  team_size: number;
  min_team_size: number;
  max_per_institution: number;
  required_skills: string[];
  balance_by: string[];
  exclusions: Record<string, any>;
  custom_rules: Record<string, any>;
}

const CATEGORY_ICONS: Record<string, { icon: React.ElementType, bg: string, color: string }> = {
  'Submission': { icon: CalendarDays, bg: 'bg-purple-100', color: 'text-purple-600' },
  'Eligibility': { icon: Users, bg: 'bg-green-100', color: 'text-green-600' },
  'Team Rules': { icon: Users, bg: 'bg-orange-100', color: 'text-orange-600' },
  'Judging': { icon: Scale, bg: 'bg-purple-100', color: 'text-purple-600' },
  'Conduct': { icon: Shield, bg: 'bg-red-100', color: 'text-red-600' },
  'Miscellaneous': { icon: Info, bg: 'bg-blue-100', color: 'text-blue-600' },
};

export function GuidelinesPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");

  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [flexibleTeamSize, setFlexibleTeamSize] = useState(true);

  const [teamSize, setTeamSize] = useState(3);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxPerInstitution, setMaxPerInstitution] = useState(1);
  const [distRuleId, setDistRuleId] = useState<string | null>(null);

  // Edit state
  const [editForm, setEditForm] = useState<Partial<Rule>>({});

  useEffect(() => {
    if (!eventId) return;
    
    // Load distribution rules (team size)
    api.get<DistributionRules>(`/api/events/${eventId}/distribution_rules`)
      .then(({ data }) => {
        setDistRuleId(data.id || null);
        setTeamSize(data.team_size);
        setMinTeamSize(data.min_team_size);
        setMaxPerInstitution(data.max_per_institution);
      })
      .catch(() => {}); // ignore if it doesn't exist yet

    // Load textual rules
    api.get<Rule[]>(`/api/events/${eventId}/rules`)
      .then(({ data }) => setRules(data))
      .catch(e => console.error("Failed to load rules", e));
  }, [eventId]);

  const updateTeamSetting = async (field: string, newValue: number) => {
    if (!eventId) return;
    
    // Optimistic update
    let payload = { team_size: teamSize, min_team_size: minTeamSize, max_per_institution: maxPerInstitution };
    if (field === 'min') { setMinTeamSize(newValue); payload.min_team_size = newValue; }
    if (field === 'max') { setTeamSize(newValue); payload.team_size = newValue; }
    if (field === 'inst') { setMaxPerInstitution(newValue); payload.max_per_institution = newValue; }

    try {
      if (distRuleId) {
        await api.put(`/api/events/${eventId}/distribution_rules`, payload);
      } else {
        const res = await api.post(`/api/events/${eventId}/distribution_rules`, payload);
        setDistRuleId(res.data.id || null);
      }
    } catch (e) {
      console.error("Failed to save team size setting", e);
    }
  };

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

  const handleAddRule = () => {
    const newRule: Rule = {
      id: 'new',
      title: 'New Rule',
      category: 'Miscellaneous',
      description: '',
      updated_at: new Date().toISOString()
    };
    setSelectedRule(newRule);
    setEditForm(newRule);
  };

  const handleSave = async () => {
    if (!eventId || !selectedRule || !editForm.title || !editForm.category) return;

    try {
      if (selectedRule.id === 'new') {
        const res = await api.post<Rule>(`/api/events/${eventId}/rules`, {
          title: editForm.title,
          category: editForm.category,
          description: editForm.description || ""
        });
        setRules([...rules, res.data]);
        setSelectedRule(res.data);
      } else {
        const res = await api.put<Rule>(`/api/events/rules/${selectedRule.id}`, {
          title: editForm.title,
          category: editForm.category,
          description: editForm.description || ""
        });
        setRules(rules.map(r => r.id === selectedRule.id ? res.data : r));
        setSelectedRule(res.data);
      }
    } catch (e) {
      console.error("Failed to save rule", e);
      alert("Failed to save rule.");
    }
  };

  const handleDelete = async (id: string) => {
    if (id === 'new') {
      setSelectedRule(null);
      return;
    }
    
    if (!confirm("Are you sure you want to delete this rule?")) return;
    
    try {
      await api.delete(`/api/events/rules/${id}`);
      setRules(rules.filter(r => r.id !== id));
      if (selectedRule?.id === id) setSelectedRule(null);
    } catch (e) {
      console.error("Failed to delete rule", e);
      alert("Failed to delete rule.");
    }
  };

  if (!eventId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">No Event Selected</h2>
        <p className="text-gray-500 mt-2">Please select an event from the Dashboard to view and manage its rules.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rules & Guidelines</h1>
          <p className="text-sm text-gray-500 mt-1">Create, manage and organize the rules for your hackathon.</p>
        </div>
        <button onClick={handleAddRule} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
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
            { label: 'Minimum Members', value: minTeamSize, id: 'min' },
            { label: 'Maximum Members', value: teamSize, id: 'max' },
            { label: 'Max per Institution', value: maxPerInstitution, id: 'inst' }
          ].map(({ label, value, id }) => (
            <div key={id} className="flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{label}</span>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1 border border-gray-200">
                <button 
                  onClick={() => updateTeamSetting(id, Math.max(1, value - 1))}
                  disabled={!eventId}
                  className="text-gray-400 hover:text-gray-600 px-1 disabled:opacity-50"
                >-</button>
                <span className="font-medium w-4 text-center">{value}</span>
                <button 
                  onClick={() => updateTeamSetting(id, value + 1)}
                  disabled={!eventId}
                  className="text-gray-400 hover:text-gray-600 px-1 disabled:opacity-50"
                >+</button>
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
            {filteredRules.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p>No rules found.</p>
              </div>
            )}
            {filteredRules.map(rule => {
              const iconData = CATEGORY_ICONS[rule.category] || CATEGORY_ICONS['Miscellaneous'];
              const Icon = iconData.icon;
              return (
              <div
                key={rule.id}
                onClick={() => handleSelectRule(rule)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedRule?.id === rule.id
                    ? 'border-purple-300 bg-purple-50/50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconData.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={iconData.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{rule.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{rule.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Updated on {new Date(rule.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><Pencil size={16} className="text-gray-400" /></button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(rule.id); }} 
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Edit Rule Panel */}
        {selectedRule && (
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
              <button onClick={() => setSelectedRule(null)} className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors">
                Cancel
              </button>
              {selectedRule.id !== 'new' && (
                <button onClick={() => handleDelete(selectedRule.id)} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}



export function DistributionRulesForm() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");

  const [rules, setRules] = useState<DistributionRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [teamSize, setTeamSize] = useState(3);
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxPerInstitution, setMaxPerInstitution] = useState(1);
  const [requiredSkills, setRequiredSkills] = useState("");
  const [balanceBy, setBalanceBy] = useState("");
  const [exclusions, setExclusions] = useState("{}");
  const [customRules, setCustomRules] = useState("{}");

  useEffect(() => {
    if (!eventId) {
      setError("No event selected.");
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get<DistributionRules>(`/api/events/${eventId}/distribution_rules`)
      .then(({ data }) => {
        setRules(data);
        setTeamSize(data.team_size);
        setMinTeamSize(data.min_team_size);
        setMaxPerInstitution(data.max_per_institution);
        setRequiredSkills(data.required_skills?.join(", ") || "");
        setBalanceBy(data.balance_by?.join(", ") || "");
        setExclusions(JSON.stringify(data.exclusions || {}, null, 2));
        setCustomRules(JSON.stringify(data.custom_rules || {}, null, 2));
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          setError("Failed to load distribution rules.");
        }
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!eventId) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let parsedExclusions = {};
      let parsedCustomRules = {};
      try {
        parsedExclusions = JSON.parse(exclusions || "{}");
        parsedCustomRules = JSON.parse(customRules || "{}");
      } catch (parseError) {
        throw new Error("Invalid JSON format in Exclusions or Custom Rules");
      }

      const payload = {
        team_size: teamSize,
        min_team_size: minTeamSize,
        max_per_institution: maxPerInstitution,
        required_skills: requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
        balance_by: balanceBy.split(",").map(s => s.trim()).filter(Boolean),
        exclusions: parsedExclusions,
        custom_rules: parsedCustomRules,
      };

      let response;
      if (rules?.id) {
        response = await api.put<DistributionRules>(`/api/events/${eventId}/distribution_rules`, payload);
      } else {
        response = await api.post<DistributionRules>(`/api/events/${eventId}/distribution_rules`, payload);
      }

      setRules(response.data);
      setSuccess("Rules saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save rules.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!eventId || !rules?.id) return;
    if (!confirm("Are you sure you want to delete these distribution rules?")) return;

    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/events/${eventId}/distribution_rules`);
      setRules(null);
      setSuccess("Rules deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
      // Reset form to defaults
      setTeamSize(3);
      setMinTeamSize(1);
      setMaxPerInstitution(1);
      setRequiredSkills("");
      setBalanceBy("");
      setExclusions("{}");
      setCustomRules("{}");
    } catch (err) {
      setError("Failed to delete rules.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div className="p-6 text-gray-500 animate-pulse">Loading rules...</div>;

  if (!eventId) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold text-gray-800">No Event Selected</h2>
        <p className="text-gray-500 mt-2">Please select an event from the Dashboard to view its rules.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Distribution Rules</h1>
          <p className="text-sm text-gray-500 mt-2">
            Configure how teams are formed and validated for this event.
          </p>
        </div>
        {rules?.id && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
          >
            {deleting ? "Deleting..." : "Delete Rules"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded shadow-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Team Size & Limits</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Min Team Size</label>
              <input
                type="number"
                min="1"
                value={minTeamSize}
                onChange={(e) => setMinTeamSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Team Size</label>
              <input
                type="number"
                min={minTeamSize}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Per Institution</label>
              <input
                type="number"
                min="1"
                value={maxPerInstitution}
                onChange={(e) => setMaxPerInstitution(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Skill & Balance Rules */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Requirements & Balancing</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Required Skills (comma-separated)</label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="e.g. React, Python, UI/UX"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Balance By (comma-separated)</label>
              <input
                type="text"
                value={balanceBy}
                onChange={(e) => setBalanceBy(e.target.value)}
                placeholder="e.g. Year of Study, Department"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Advanced JSON Rules */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Advanced Configurations (JSON)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Exclusions</label>
              <textarea
                value={exclusions}
                onChange={(e) => setExclusions(e.target.value)}
                rows={6}
                className="w-full font-mono text-sm px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Custom Rules</label>
              <textarea
                value={customRules}
                onChange={(e) => setCustomRules(e.target.value)}
                rows={6}
                className="w-full font-mono text-sm px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-indigo-100"
          >
            {saving ? "Saving Changes..." : rules?.id ? "Update Rules" : "Create Rules"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function RulesPage() {
  const [activeTab, setActiveTab] = useState<'guidelines' | 'distribution'>('guidelines');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 shadow-sm">
        <button
          onClick={() => setActiveTab('guidelines')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'guidelines' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          General Guidelines
        </button>
        <button
          onClick={() => setActiveTab('distribution')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'distribution' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Distribution Rules Configuration
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'guidelines' ? <GuidelinesPage /> : <DistributionRulesForm />}
      </div>
    </div>
  );
}
