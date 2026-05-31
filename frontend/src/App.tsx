// frontend/src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
<<<<<<< HEAD
import { isLoggedIn } from "./lib/auth";

// Auth & Layout Pages
import LoginPage from "./pages/LoginPage";

// Committee Dashboard Pages
import DashboardLayout from "./pages/Committee Dashboard/Sidebar";

import ParticipantsPage from "./pages/Committee Dashboard/ParticipantsPage";
import RulesPage from "./pages/Committee Dashboard/Rules";

// Participant Pages
import ParticipantDashboard from "./pages/participant/ParticipantDashboard";
=======

// import { isLoggedIn } from "./lib/auth";
// import { isLoggedIn } from "./lib/auth";

import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/Committee Dashboard/Sidebar";
import OverviewPage from "./pages/Committee Dashboard/Dashboard";
import ParticipantsPage from "./pages/Committee Dashboard/ParticipantsPage";
import TeamFormation from "./pages/Committee Dashboard/TeamFormation";
import RulesPage from "./pages/Committee Dashboard/Rules";
import MultipleEvent from "./pages/Committee Dashboard/MultipleEvent";
import CurrentEvent from "./pages/Committee Dashboard/CurrentEvent";
import Communication from "./pages/Committee Dashboard/Communication";
import Scoring from "./pages/Committee Dashboard/Scoring";

// import ParticipantDashboard from "./pages/participant/ParticipantDashboard";

// TEMP AUTH BYPASS

function RequireAuth({ children }: { children: JSX.Element }) {
  return children;
}

/*
// ORIGINAL AUTH
>>>>>>> 598c501d6225fbcd4318a8a3f82f28a74230298f

function RequireAuth({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}
*/

export default function App() {

  return (

    <BrowserRouter>

      <Routes>
<<<<<<< HEAD
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
=======

        {/* LOGIN */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* DASHBOARD */}

>>>>>>> 598c501d6225fbcd4318a8a3f82f28a74230298f
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
<<<<<<< HEAD
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
=======

          {/* DEFAULT DASHBOARD */}

          <Route
            index
            element={<OverviewPage />}
          />

          {/* PARTICIPANTS */}

          <Route
            path="participants"
            element={<ParticipantsPage />}
          />

          {/* TEAM FORMATION */}

          <Route
            path="team-formation"
            element={<TeamFormation />}
          />

          {/* RULES */}

          <Route
            path="rules"
            element={<RulesPage />}
          />

          {/* Multiple Event */}

          <Route
           path="multiple-events"
          element={<MultipleEvent />}
          />

          <Route
           path="current-event"
           element={<CurrentEvent />}
          />

          <Route
          path="communication"
          element={<Communication />}
          />

          <Route
          path="scoring"
          element={<Scoring />}
          />

        </Route>

        {/* DEFAULT REDIRECT */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard/team-formation"
              replace
            />
          }
        />
>>>>>>> 598c501d6225fbcd4318a8a3f82f28a74230298f
      </Routes>

    </BrowserRouter>

  );

}