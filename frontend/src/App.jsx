import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Pro from "./pages/Pro";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";

import AdminFeedbackDashboard from "./components/AdminFeedbackDashboard";

import UserProtectedRoute from "./routes/UserProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* User Protected Routes */}

        <Route element={<UserProtectedRoute />}>
          <Route path="/" element={<Pro />} />
        </Route>

        {/* Admin Protected Routes */}

        <Route element={<AdminProtectedRoute />}>
          <Route
            path="/admin/dashboard"
            element={<AdminFeedbackDashboard />}
          />
        </Route>

        {/* Invalid Route */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;