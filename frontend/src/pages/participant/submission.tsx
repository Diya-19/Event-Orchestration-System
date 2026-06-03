// frontend/src/pages/participant/submission.tsx

import { useState } from "react";
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

export default function SubmissionPage() {
  const [description, setDescription] = useState("");
  const wordCount = description.split(/\s+/).filter(Boolean).length;

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
          
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <CalendarClock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Round 1 Submission Deadline</p>
              <div className="flex items-center gap-3 text-sm font-bold text-gray-900">
                <span className="flex flex-col items-center"><span className="text-lg">05</span><span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider">Days</span></span>
                <span className="text-gray-400">:</span>
                <span className="flex flex-col items-center"><span className="text-lg">12</span><span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider">Hours</span></span>
                <span className="text-gray-400">:</span>
                <span className="flex flex-col items-center"><span className="text-lg">48</span><span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider">Mins</span></span>
                <span className="text-gray-400">:</span>
                <span className="flex flex-col items-center"><span className="text-lg">32</span><span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider">Secs</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
          <button className="pb-3 text-sm font-semibold text-purple-600 border-b-2 border-purple-600">
            Submit Project
          </button>
          <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent">
            My Submissions
          </button>
        </div>

        <div className="flex gap-8 items-start">
          {/* Main Form Area */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Project Details</h2>
            
            <div className="space-y-6">
              {/* Project Title & Team Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your project title"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                  <input
                    type="text"
                    value="Team Alpha"
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 outline-none"
                  />
                </div>
              </div>

              {/* Problem Statement & GitHub Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problem Statement / Track <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-500">
                      <option>Select problem statement or track</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository Link</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="https://github.com/your-repo"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Describe your project in brief (max 300 words)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-gray-400">{wordCount}/300</span>
                </div>
              </div>

              {/* Tech Stack & Demo Video */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack / Tools Used</label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, MongoDB, Python, etc."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Demo Video Link <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="https://youtu.be/your-demo"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">You can upload multiple files. Max size per file: 100MB</p>
                
                <div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-xl p-8 text-center mb-4 hover:bg-purple-100 transition-colors cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-700">
                    Drag & drop files here or <button className="px-4 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors inline-block mx-2">Browse Files</button>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, PPTX, ZIP, MP4, DOCX, PNG, JPG</p>
                </div>

                {/* Uploaded Files Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Presentation className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Project_Presentation.pptx</p>
                        <p className="text-xs text-gray-500">2.4 MB</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Technical_Documentation.pdf</p>
                        <p className="text-xs text-gray-500">3.1 MB</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Demo_Video.mp4</p>
                        <p className="text-xs text-gray-500">45.6 MB</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <FileCode2 className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Source_Code.zip</p>
                        <p className="text-xs text-gray-500">12.8 MB</p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="flex items-start gap-3 pt-2">
                <div className="mt-0.5">
                  <input type="checkbox" className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                </div>
                <label className="text-sm text-gray-700 cursor-pointer select-none">
                  I confirm that all information provided is accurate and our project is original.
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button className="px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm">
                  Submit Project
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 space-y-6 flex-shrink-0">
            
            {/* Checklist */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Submission Checklist</h3>
              <div className="space-y-3">
                {[
                  { label: "Project title and description", done: true },
                  { label: "Team details", done: true },
                  { label: "Problem statement / Track", done: true },
                  { label: "GitHub repository link (optional)", done: true },
                  { label: "All required files uploaded", done: true },
                  { label: "Final submission", done: false },
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
              <h3 className="text-sm font-bold text-gray-900 mb-4">Submission Status</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                    <circle cx="32" cy="32" r="28" stroke="#7c3aed" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="35" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">80%</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Almost There!</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Complete all required fields and submit your project.</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Previous Submissions */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Previous Submissions</h3>
                <button className="text-xs text-purple-600 font-medium hover:underline">View All</button>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider">Round 1</span>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Submitted</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                    <CalendarClock className="w-3.5 h-3.5" /> May 20, 2026 at 10:30 AM
                  </p>
                  <button className="text-xs text-purple-600 font-medium hover:underline flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> Download Receipt
                  </button>
                </div>

                <div className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">Prototype</span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Draft</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                    <CalendarClock className="w-3.5 h-3.5" /> May 10, 2026 at 04:15 PM
                  </p>
                  <button className="text-xs text-purple-600 font-medium hover:underline flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Continue Editing
                  </button>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-8 h-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-purple-900 mb-1">Need help with submission?</h3>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    Check the submission guidelines or contact our support team.
                  </p>
                </div>
              </div>
              <button className="w-full mt-3 py-2.5 bg-white border border-purple-200 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                View Guidelines
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between text-xs text-gray-500">
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