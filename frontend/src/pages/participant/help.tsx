// frontend/src/pages/participant/help.tsx

import { useState } from "react";
import {
  Shield,
  FileText,
  Briefcase,
  Heart,
  HelpCircle,
  Calendar,
  Clock,
  UploadCloud,
  Bell,
  Send,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock3,
  MoreHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from "lucide-react";

export default function HelpPage() {
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [notifyAdmin, setNotifyAdmin] = useState(true);

  const submittedRequests = [
    {
      id: 1,
      type: "Exam Conflict - Mid Sem",
      icon: FileText,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      description: "I have my mid sem examination scheduled on May 31 which clashes with the submission.",
      date: "May 31, 2026",
      duration: "1 Day",
      submittedDate: "May 20, 2026 at 10:30 AM",
      status: "Under Review",
      statusColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      id: 2,
      type: "Internship Timing Clash",
      icon: Briefcase,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      description: "My internship work hours overlap with the team meeting and mentor review.",
      date: "Jun 3 - Jun 15, 2026",
      duration: "13 Days",
      submittedDate: "May 18, 2026 at 04:15 PM",
      status: "Approved",
      statusColor: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: 3,
      type: "Medical Issue",
      icon: Heart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "Medical check-up and treatment requires time during build phase.",
      date: "May 22 - May 24, 2026",
      duration: "3 Days",
      submittedDate: "May 19, 2026 at 11:20 AM",
      status: "Resolved",
      statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      id: 4,
      type: "Other - Personal Emergency",
      icon: MoreHorizontal,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      description: "Family emergency; need some time to manage things.",
      date: "Jun 7, 2026",
      duration: "1 Day",
      submittedDate: "May 21, 2026 at 09:10 AM",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700 border-red-200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Facing an issue during the hackathon? Let us know and we'll help.
          </p>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-[1600px] mx-auto w-full">
        
        {/* Info Banner */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 flex items-start gap-4">
          <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
            <Headphones className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Your request will be reviewed by the support team.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You will receive updates via email and dashboard notifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-purple-700 mb-2">Raise New Support Request</h2>
              <p className="text-sm text-gray-600">
                Provide details about your issue. Our team will review it and get back to you.
              </p>
            </div>

            <div className="space-y-5">
              {/* Issue Type & Priority */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                      <option>Select issue type</option>
                      <option>Technical Issue</option>
                      <option>Team Conflict</option>
                      <option>Submission Problem</option>
                      <option>Account Access</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p as any)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          priority === p
                            ? p === "Low"
                              ? "bg-blue-100 border-blue-300 text-blue-700"
                              : p === "Medium"
                              ? "bg-yellow-100 border-yellow-300 text-yellow-700"
                              : "bg-red-100 border-red-300 text-red-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Select date"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Resolution Time
                  </label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-500">
                      <option>Select duration</option>
                      <option>Within 24 hours</option>
                      <option>Within 3 days</option>
                      <option>Within 1 week</option>
                      <option>No rush</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Please describe your issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{description.length}/1000 characters</p>
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Notify Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notify Support Team</p>
                    <p className="text-xs text-gray-500">Enable to instantly notify support about this request</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifyAdmin(!notifyAdmin)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notifyAdmin ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifyAdmin ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Clear
                </button>
                <button className="flex-1 px-6 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  Submit Request
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Submitted Requests */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-purple-700 mb-2">My Support Tickets</h2>
              <p className="text-sm text-gray-600">Track the status of your submitted requests</p>
            </div>

            {/* Filter */}
            <div className="flex justify-end mb-4">
              <div className="relative">
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:ring-2 focus:ring-purple-500 outline-none">
                  <option>All Status</option>
                  <option>Under Review</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {submittedRequests.map((request) => (
                <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${request.iconBg} rounded-xl flex items-center justify-center`}>
                        <request.icon className={`w-6 h-6 ${request.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.type}</h3>
                        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{request.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${request.statusColor}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{request.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock3 className="w-3.5 h-3.5" />
                      <span>{request.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Submitted on {request.submittedDate}
                    </p>
                    <button className="px-4 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-purple-600 text-white text-sm font-medium rounded-lg">1</button>
              <button className="w-9 h-9 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">2</button>
              <span className="px-2 text-gray-400">•</span>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
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