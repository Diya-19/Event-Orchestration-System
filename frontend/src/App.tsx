// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "./lib/auth";

// Auth & Layout Pages
import LoginPage from "./pages/LoginPage";

// Committee Dashboard Pages
import DashboardLayout from "./pages/Committee Dashboard/Sidebar";

import ParticipantsPage from "./pages/Committee Dashboard/ParticipantsPage";
import RulesPage from "./pages/Committee Dashboard/Rules";

// Participant Pages
import ParticipantDashboard from "./pages/participant/ParticipantDashboard";

function RequireAuth({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          {/* ✅ CurrentEvents is now the main Dashboard page */}
          
          <Route path="participants" element={<ParticipantsPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="participant-dashboard" element={<ParticipantDashboard />} />
          
          {/* Add placeholder routes for other menu items */}
          <Route path="team-space" element={<div className="p-10"><h1 className="text-2xl font-bold">Team Space - Coming Soon</h1></div>} />
          <Route path="submission" element={<div className="p-10"><h1 className="text-2xl font-bold">Submission - Coming Soon</h1></div>} />
          <Route path="results" element={<div className="p-10"><h1 className="text-2xl font-bold">Results - Coming Soon</h1></div>} />
          <Route path="team-formation" element={<div className="p-10"><h1 className="text-2xl font-bold">Team Formation - Coming Soon</h1></div>} />
          <Route path="support" element={<div className="p-10"><h1 className="text-2xl font-bold">Support Centre - Coming Soon</h1></div>} />
        </Route>

        {/* Remove the separate /admin route */}

        {/* Catch-all: Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}