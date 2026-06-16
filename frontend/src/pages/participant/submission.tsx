// frontend/src/pages/participant/submission.tsx

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  CheckCircle,
  Circle,
  CalendarClock,
  AlertCircle,
  Link2,
  FileText,
  Video,
  FileCode2,
  Presentation,
  X,
  ChevronDown,
  UploadCloud,
  Send,
  Check,
  FileCheck,
  Clock,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { participantService, SubmissionResponse, DashboardResponse } from "../../lib/participantService";

export default function SubmissionPage() {
  const [data, setData] = useState<SubmissionResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoVideo, setDemoVideo] = useState("");
  const [presentation, setPresentation] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const location = useLocation();
  const githubRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const presentationRef = useRef<HTMLInputElement>(null);
  const demoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      participantService.getDashboard(),
      participantService.getSubmission()
    ])
    .then(([dashRes, subRes]) => {
      setDashboard(dashRes);
      if (subRes) {
        setData(subRes);
        setDescription(subRes.project_description || "");
        setGithubLink(subRes.github_link || "");
        setDemoVideo(subRes.demo_video_url || "");
        setPresentation(subRes.presentation_url || "");
        setNotes(subRes.participant_notes || "");
      }
    })
    .catch((err) => setError(err.message || "Failed to load data"))
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      const params = new URLSearchParams(location.search);
      const focus = params.get("focus");
      if (focus) {
        setTimeout(() => {
          let targetRef = null;
          if (focus === "github") targetRef = githubRef;
          if (focus === "description") targetRef = descriptionRef;
          if (focus === "presentation") targetRef = presentationRef;
          if (focus === "demo") targetRef = demoRef;
          
          if (targetRef?.current) {
            targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            targetRef.current.focus();
          }
        }, 300);
      }
    }
  }, [loading, location.search]);

  const handleSave = async (isFinal = false) => {
    if (isFinal && !confirmed) {
      alert("Please confirm the submission by checking the box.");
      return;
    }

    setSaving(true);
    try {
      const res = await participantService.saveSubmission({
        github_link: githubLink,
        project_description: description,
        demo_video_url: demoVideo,
        presentation_url: presentation,
        participant_notes: notes,
        is_final_submitted: isFinal
      });
      setData(res);
      if (isFinal) {
        alert("Project submitted successfully!");
      } else {
        alert("Draft saved successfully!");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save submission");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading submission data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const wordCount = description.split(/\s+/).filter(Boolean).length;
  
  // Calculate progress locally for the checklist
  let progress = 0;
  if (githubLink) progress += 25;
  if (description) progress += 25;
  if (presentation) progress += 25;
  if (demoVideo) progress += 25;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Submit your project and all related materials before the deadline.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">
        
        {/* Alert & Countdown Banner */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Make sure all files and links are working properly before final submission.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                You can edit your submission until the deadline.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
          <button className="pb-3 text-sm font-semibold text-purple-600 border-b-2 border-purple-600">
            Submit Project
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Form Area */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-8 shadow-sm w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Project Details</h2>
              {data?.status === "SUBMITTED" && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  SUBMITTED
                </span>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Project Title & Team Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={dashboard?.team?.name || "Unassigned"}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Waiting for PPT, Video uploading..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={data?.status === "SUBMITTED"}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presentation URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Presentation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={presentationRef}
                      type="text"
                      placeholder="https://docs.google.com/presentation/..."
                      value={presentation}
                      onChange={(e) => setPresentation(e.target.value)}
                      disabled={data?.status === "SUBMITTED"}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository Link <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      ref={githubRef}
                      type="text"
                      placeholder="https://github.com/your-repo"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      disabled={data?.status === "SUBMITTED"}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    ref={descriptionRef}
                    rows={4}
                    placeholder="Describe your project..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={data?.status === "SUBMITTED"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none disabled:opacity-60"
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-gray-400">{wordCount} words</span>
                </div>
              </div>

              {/* Demo Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Demo Video Link <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={demoRef}
                    type="text"
                    placeholder="https://youtu.be/your-demo"
                    value={demoVideo}
                    onChange={(e) => setDemoVideo(e.target.value)}
                    disabled={data?.status === "SUBMITTED"}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              {data?.status !== "SUBMITTED" && (
                <>
                  <div className="flex items-start gap-3 pt-2">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" 
                      />
                    </div>
                    <label className="text-sm text-gray-700 cursor-pointer select-none" onClick={() => setConfirmed(!confirmed)}>
                      I confirm that all information provided is accurate and our project is original.
                    </label>
                  </div>

                  {progress < 100 && (
                    <div className="text-sm text-red-500 font-medium pb-2 text-right">
                      Complete all deliverables before final submission
                    </div>
                  )}
                  <div className="flex justify-end gap-4 pt-4">
                    <button 
                      onClick={() => handleSave(false)}
                      disabled={saving}
                      className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                      Save Draft
                    </button>
                    <button 
                      onClick={() => handleSave(true)}
                      disabled={saving || !confirmed || progress < 100}
                      className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {saving ? "Submitting..." : "Submit Final Project"}
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
            {/* Checklist */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Submission Checklist</h3>
              <div className="space-y-3">
                {[
                  { label: "Project description", done: !!description },
                  { label: "GitHub link", done: !!githubLink },
                  { label: "Presentation link", done: !!presentation },
                  { label: "Demo video link", done: !!demoVideo },
                  { label: "Final submission", done: data?.status === "SUBMITTED" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {item.done ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${item.done ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Status */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Current Progress</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                    <circle cx="32" cy="32" r="28" stroke="#7c3aed" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset={175 - (175 * progress) / 100} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">{progress}%</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{progress === 100 ? "Ready to Submit" : "Keep going!"}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Complete all required fields.</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-purple-900 mb-1">Need help?</h3>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    Check the submission guidelines or contact our support team.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between text-xs text-gray-500 mt-auto">
        <span>© 2026 HackFlow. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-700">Privacy Policy</button>
          <span>|</span>
          <button className="hover:text-gray-700">Terms of Service</button>
        </div>
      </footer>
    </div>
  );
}