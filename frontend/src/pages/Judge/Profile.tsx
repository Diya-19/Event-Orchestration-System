import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Users, CheckCircle2, Hourglass, Calendar, Bell, Eye, LayoutDashboard, Target, Settings, Check, Award, Lightbulb, Edit2, X, Plus, Camera, ArrowLeft } from 'lucide-react';

import { getProfileData, saveProfileData, saveProfileAvatar } from '../../lib/profileService';
import { useRef } from 'react';

export default function JudgeProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dashboardData, setDashboardData] = useState({
    assigned_teams: 0,
    completed_evaluations: 0,
    pending_evaluations: 0
  });
  const [evaluationsList, setEvaluationsList] = useState<any[]>([]);
  const [draftsCount, setDraftsCount] = useState(0);

  // LocalStorage Preferences
  const [prefs, setPrefs] = useState(() => {
    const saved = localStorage.getItem('judge_prefs');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      deadlineReminders: true,
      autoSaveDrafts: true
    };
  });
  
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Profile Data stored via profileService
  const [profileData, setProfileData] = useState(() => getProfileData());

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [newSkill, setNewSkill] = useState("");

  const mockAchievements = ["⭐ Hackathon Demo Gold", "🏆 Top Evaluator", "🎯 100+ Evaluations", "🥇 Innovation Judge", "📜 Certified Mentor"];

  useEffect(() => {
    localStorage.setItem('judge_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = () => {
    setProfileData(editForm);
    saveProfileData(editForm);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      alert("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedProfile = { ...profileData, avatar: base64String };
      setProfileData(updatedProfile);
      setEditForm(prev => ({ ...prev, avatar: base64String }));
      saveProfileAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelEdit = () => {
    setEditForm(profileData);
    setNewSkill("");
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter((s: string) => s !== skillToRemove) });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, evalRes] = await Promise.all([
          api.get('/api/judge/dashboard'),
          api.get('/api/judge/evaluations')
        ]);
        setDashboardData(dashRes.data);
        setEvaluationsList(evalRes.data);
        const drafts = evalRes.data.filter((e: any) => e.status === "Draft" || e.status === "In Progress").length;
        setDraftsCount(drafts);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const eventName = "Not Available";
  const memberSince = "Not Available";
  const lastLogin = "Not Available";

  const assignedTracks = Array.from(new Set(evaluationsList.map(e => e.challenge).filter(Boolean)));

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen font-sans text-[#1E293B]">
      <div className="w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button 
              onClick={() => navigate('/judge')}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors mb-3 outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Judge Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your profile information and preferences.</p>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => { setIsEditing(true); setEditForm(profileData); }}
              className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCancelEdit}
                className="text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* PROFILE OVERVIEW CARD (Merging Profile + Account Info + About Me) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar Section */}
            <div className="relative group shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp" 
                onChange={handleAvatarUpload} 
              />
              <div 
                className={`w-28 h-28 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-3xl font-bold overflow-hidden border-4 border-white shadow-md ${isEditing ? 'cursor-pointer' : ''}`}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profileData.name !== "Not Available" ? profileData.name.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase() : "NA"
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700 transition-colors cursor-pointer"
                  title="Change Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Information & About Me */}
            <div className="flex-1 w-full">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Name</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium text-slate-800" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Designation / Role</label>
                    <input type="text" value={editForm.designation} onChange={(e) => setEditForm({...editForm, designation: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium text-slate-800" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium text-slate-800" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Organization</label>
                    <input type="text" value={editForm.organization} onChange={(e) => setEditForm({...editForm, organization: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium text-slate-800" />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{profileData.name}</h2>
                  <p className="text-sm font-medium text-purple-600 mt-1">{profileData.designation}</p>
                  
                  <div className="flex flex-wrap gap-x-8 gap-y-3 mt-5 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Email</span>
                      <span className="font-medium text-slate-800">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Org</span>
                      <span className="font-medium text-slate-800">{profileData.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">ID</span>
                      <span className="font-medium text-slate-800">Not Available</span>
                    </div>
                  </div>
                </div>
              )}

              {/* About Me Section integrated */}
              <div className="mt-2">
                <h3 className="text-sm font-bold text-slate-800 mb-2">About Me</h3>
                {isEditing ? (
                  <textarea 
                    value={editForm.bio} 
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={3}
                    className="w-full text-sm border border-slate-200 rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-700 resize-none"
                    placeholder="Write a short professional bio..."
                  />
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap max-w-3xl">
                    {profileData.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* ROW 1: Assigned Tracks & Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section: Assigned Tracks */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Assigned Tracks
              </h3>
            </div>
            <div className="p-6 flex-1">
              {assignedTracks.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {assignedTracks.slice(0, 8).map((track, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100">
                        {track as string}
                      </span>
                    ))}
                  </div>
                  
                  {assignedTracks.length > 8 && (
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAllTracks ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                      <div className="flex flex-wrap gap-2">
                        {assignedTracks.slice(8).map((track, idx) => (
                          <span key={idx + 8} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100">
                            {track as string}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {assignedTracks.length > 8 && (
                    <button 
                      onClick={() => setShowAllTracks(!showAllTracks)}
                      className="mt-4 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {showAllTracks ? "Show Less" : `+${assignedTracks.length - 8} More Tracks`}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No tracks assigned yet.</p>
              )}
            </div>
          </div>

          {/* Section: Preferences & Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                Preferences
              </h3>
            </div>
            <div className="p-6 space-y-6 flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Email Notifications</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Receive updates about new evaluations.</p>
                </div>
                <button 
                  onClick={() => togglePref('emailNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${prefs.emailNotifications ? 'bg-purple-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${prefs.emailNotifications ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Deadline Reminders</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Alerts before scoring closes.</p>
                </div>
                <button 
                  onClick={() => togglePref('deadlineReminders')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${prefs.deadlineReminders ? 'bg-purple-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${prefs.deadlineReminders ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">Auto Save Drafts</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Automatically save your scoring progress.</p>
                </div>
                <button 
                  onClick={() => togglePref('autoSaveDrafts')}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${prefs.autoSaveDrafts ? 'bg-purple-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${prefs.autoSaveDrafts ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Expertise & Skills and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section: Expertise & Skills */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                Expertise & Skills
              </h3>
            </div>
            <div className="p-6 flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="Add a skill..."
                      className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                    <button 
                      onClick={handleAddSkill}
                      className="bg-purple-100 text-purple-700 p-2 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {editForm.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100 flex items-center gap-2">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="hover:text-purple-900 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                profileData.skills.length > 0 ? (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.slice(0, 10).map((skill: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100 hover:bg-purple-100 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    {profileData.skills.length > 10 && (
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAllSkills ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.slice(10).map((skill: string, idx: number) => (
                            <span key={idx + 10} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100 hover:bg-purple-100 transition-colors">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profileData.skills.length > 10 && (
                      <button 
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="mt-4 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        {showAllSkills ? "Show Less" : `+${profileData.skills.length - 10} More Skills`}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No skills added yet.</p>
                )
              )}
            </div>
          </div>

          {/* Section: Judge Achievements */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Achievements
              </h3>
            </div>
            <div className="p-6 flex-1">
              {mockAchievements.length > 0 ? (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {mockAchievements.slice(0, 4).map((achievement, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100 hover:bg-amber-100 transition-colors">
                        {achievement}
                      </span>
                    ))}
                  </div>
                  
                  {mockAchievements.length > 4 && (
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAllAchievements ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
                      <div className="flex flex-wrap gap-2">
                        {mockAchievements.slice(4).map((achievement, idx) => (
                          <span key={idx + 4} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100 hover:bg-amber-100 transition-colors">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {mockAchievements.length > 4 && (
                    <button 
                      onClick={() => setShowAllAchievements(!showAllAchievements)}
                      className="mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      {showAllAchievements ? "Show Less" : `+${mockAchievements.length - 4} More`}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Achievements will appear here as you participate in events.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
