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

// Judge Pages
import JudgeSidebar from "./pages/Judge/sidebar";
import JudgeDashboard from "./pages/Judge/dashboard";
import MyEvaluation from "./pages/Judge/Evaluation";
import EvaluationPage from "./pages/Judge/EvaluationPage";

// Participant Pages
import ParticipantSidebar from "./pages/participant/sidebar";
import ParticipantChat from "./pages/participant/chat";
import SubmissionPage from "./pages/participant/submission";
import HelpPage from "./pages/participant/help"; // ✅ CHANGED
import ParticipantDashboard from "./pages/participant/ParticipantDashboard";

// TEMP AUTH BYPASS
function RequireAuth({ children }: { children: JSX.Element }) {
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
        </Route>

        {/* JUDGE DASHBOARD */}
        <Route
          path="/judge"
          element={
            <RequireAuth>
              <div className="flex min-h-screen bg-gray-50">
                <JudgeSidebar />
                <div className="flex-1 overflow-y-auto">
                  <Outlet />
                </div>
              </div>
            </RequireAuth>
          }
        >
          <Route index element={<JudgeDashboard />} />
          <Route path="evaluations" element={<MyEvaluation />} />
          <Route path="evaluation/:teamId" element={<EvaluationPage />} />
        </Route>

        {/* PARTICIPANT DASHBOARD */}
        <Route
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
          {/* ✅ UPDATED: Using ParticipantDashboard component */}
          <Route path="chat" element={<ParticipantChat />} />
          <Route path="submission" element={<SubmissionPage />} />
          <Route path="support" element={<HelpPage />} /> {/* ✅ CHANGED to HelpPage */}
          <Route path="participantDashboard" element={<ParticipantDashboard />} />
        </Route>

        {/* DEFAULT REDIRECT */}
        <Route path="*" element={<Navigate to="/dashboard/current-event" replace />} />
      </Routes>
    </BrowserRouter>
  );
}