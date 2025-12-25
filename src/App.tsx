import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Auth from "./pages/Auth/Auth";
import TopUp from "./pages/TopUp/TopUp";
import Transactions from "./pages/Transactions/Transactions";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Provider from "./Provider";

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topup"
            element={
              <ProtectedRoute>
                <TopUp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
