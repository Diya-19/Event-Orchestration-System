// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Committee Dashboard Pages
import DashboardLayout from "./pages/Committee Dashboard/Sidebar";
import OverviewPage from "./pages/Committee Dashboard/Dashboard";
import ParticipantsPage from "./pages/Committee Dashboard/ParticipantsPage";
import TeamFormation from "./pages/Committee Dashboard/TeamFormation";
import RulesPage from "./pages/Committee Dashboard/Rules";
import MultipleEvent from "./pages/Committee Dashboard/MultipleEvent";
import CurrentEvent from "./pages/Committee Dashboard/CurrentEvent";
import Communication from "./pages/Committee Dashboard/Communication";
import Scoring from "./pages/Committee Dashboard/Scoring";
import Results from "./pages/Committee Dashboard/Results";
import JudgeManagement from "./pages/Committee Dashboard/JudgeManagent";
import ActivityLogs from "./pages/Committee Dashboard/ActivityLogs";
import TravelManagement from "./pages/Committee Dashboard/TravelManagement"; // ✅ ADDED

// Judge Pages
import JudgeSidebar from "./pages/Judge/sidebar";
import JudgeDashboard from "./pages/Judge/dashboard";
import MyEvaluation from "./pages/Judge/Evaluation";
import EvaluationPage from "./pages/Judge/EvaluationPage";
import JudgeDeadlines from "./pages/Judge/Deadlines";
import JudgeProfile from "./pages/Judge/Profile";

// Participant Pages
import ParticipantSidebar from "./pages/participant/sidebar";
import ParticipantChat from "./pages/participant/chat";
import SubmissionPage from "./pages/participant/submission";
import HelpPage from "./pages/participant/help"; 
import ParticipantDashboard from "./pages/participant/ParticipantDashboard";
import TeamPage from "./pages/participant/TeamPage";

// Travel Pages
import TravelSidebar from "./pages/travel/Sidebar";
import TravelDashboard from "./pages/travel/Dashboard";
import TravelNotifications from "./pages/travel/Notifications";
import TravelEmergency from "./pages/travel/Emergency";

// TEMP AUTH BYPASS
function RequireAuth({ children }: { children: JSX.Element }) {
  return children;
}

// JUDGE AUTH (With DEV_MODE Support)
function RequireJudgeAuth({ children }: { children: JSX.Element }) {
  const isDev = import.meta.env.VITE_DEV_MODE === "true";
  console.log("DEV MODE =", import.meta.env.VITE_DEV_MODE, "isDev =", isDev);
  
  if (isDev) {
    return children;
  }
  
  const token = localStorage.getItem("evaluator_token");
  if (!token) {
    // If no token exists, they shouldn't access the judge pages. 
    // Redirecting to login as fallback, or show unauthorized.
    return <Navigate to="/login" replace />; 
  }
  return children;
}

// PARTICIPANT AUTH
function RequireParticipantAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("participant_token");
  if (!token) {
    return <Navigate to="/login" replace />; 
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* COMMITTEE DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="team-formation" element={<TeamFormation />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="multiple-events" element={<MultipleEvent />} />
          <Route path="current-event" element={<CurrentEvent />} />
          <Route path="communication" element={<Communication />} />
          <Route path="scoring" element={<Scoring />} />
          <Route path="results" element={<Results />} />
          <Route path="judge-management" element={<JudgeManagement />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="travel-management" element={<TravelManagement />} /> {/* ✅ ADDED */}
        </Route>

        {/* JUDGE DASHBOARD */}
        <Route
          path="/judge"
          element={
            <RequireJudgeAuth>
              <div className="flex min-h-screen bg-gray-50">
                <JudgeSidebar />
                <div className="flex-1 overflow-y-auto">
                  <Outlet />
                </div>
              </div>
            </RequireJudgeAuth>
          }
        >
          <Route index element={<JudgeDashboard />} />
          <Route path="evaluations" element={<MyEvaluation />} />
          <Route path="evaluation/:teamId" element={<EvaluationPage />} />
          <Route path="deadlines" element={<JudgeDeadlines />} />
          <Route path="profile" element={<JudgeProfile />} />
        </Route>

        {/* PARTICIPANT DASHBOARD */}
        <Route
        path="/participant"
        element={
        <RequireParticipantAuth>
          <div className="flex min-h-screen bg-gray-50">
            <ParticipantSidebar />
            <div className="flex-1 overflow-y-auto">
              <Outlet />
              </div>
              </div>
              </RequireParticipantAuth>
            }
            >
              <Route index element={<ParticipantDashboard />} />
              <Route path="chat" element={<ParticipantChat />} />
              <Route path="submission" element={<SubmissionPage />} />
              <Route path="support" element={<HelpPage />} />
              <Route path="team" element={<TeamPage />} />
              </Route>
          path="/participant"
          element={
            <RequireAuth>
              <div className="flex min-h-screen bg-gray-50">
                <ParticipantSidebar />
                <div className="flex-1 overflow-y-auto">
                  <Outlet />
                </div>
              </div>
            </RequireAuth>
          }
        >
          <Route index element={<ParticipantDashboard />} />
          <Route path="chat" element={<ParticipantChat />} />
          <Route path="submission" element={<SubmissionPage />} />
          <Route path="support" element={<HelpPage />} />
        </Route>

        {/* TRAVEL & LOGISTICS */}
        <Route
          path="/travel"
          element={
            <RequireAuth>
              <TravelSidebar />
            </RequireAuth>
          }
        >
          <Route index element={<TravelDashboard />} />
          <Route path="notifications" element={<TravelNotifications />} />
          <Route path="emergency" element={<TravelEmergency />} />
        </Route>

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/dashboard/current-event" replace />} />
      </Routes>
    </BrowserRouter>
  );
}