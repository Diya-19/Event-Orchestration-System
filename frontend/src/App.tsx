
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn } from "./lib/auth";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import OverviewPage from "./pages/dashboard/OverviewPage";
import ParticipantsPage from "./pages/dashboard/ParticipantsPage";


function RequireAuth({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;

}

export default function App() {
    return (
      <BrowserRouter>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
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
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  
  );

}
