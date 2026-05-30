import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import { isLoggedIn } from "./lib/auth";
// import { isLoggedIn } from "./lib/auth";

import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/Committee Dashboard/Sidebar";
import OverviewPage from "./pages/Committee Dashboard/Dashboard";
import ParticipantsPage from "./pages/Committee Dashboard/ParticipantsPage";
import TeamFormation from "./pages/Committee Dashboard/TeamFormation";
import RulesPage from "./pages/Committee Dashboard/Rules";
import MultipleEvent from "./pages/Committee Dashboard/MultipleEvent";

// import ParticipantDashboard from "./pages/participant/ParticipantDashboard";

// TEMP AUTH BYPASS

function RequireAuth({ children }: { children: JSX.Element }) {
  return children;
}

/*
// ORIGINAL AUTH

function RequireAuth({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}
*/

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >

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
      </Routes>

    </BrowserRouter>

  );

}