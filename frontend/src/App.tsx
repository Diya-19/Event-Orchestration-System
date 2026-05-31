// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// import { isLoggedIn } from "./lib/auth";

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

// Judge Dashboard Pages
import JudgeSidebar from "./pages/Judge/sidebar";
import JudgeDashboard from "./pages/Judge/dashboard";

// TEMP AUTH BYPASS (for development)
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
        </Route>

        {/* ✅ JUDGE DASHBOARD - NEW ROUTES */}
        <Route
          path="/judge"
          element={
            <RequireAuth>
              <div className="flex min-h-screen bg-gray-50">
                <JudgeSidebar />
                <div className="flex-1 flex flex-col">
                  <Outlet />
                </div>
              </div>
            </RequireAuth>
          }
        >
          <Route index element={<JudgeDashboard />} />
          <Route 
            path="evaluations" 
            element={
              <div className="p-10">
                <h1 className="text-2xl font-bold text-gray-900">My Evaluations</h1>
                <p className="text-gray-600 mt-2">Your assigned evaluations will appear here.</p>
              </div>
            } 
          />
        </Route>

        {/* DEFAULT REDIRECT */}
        <Route
          path="*"
          element={<Navigate to="/dashboard/team-formation" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}