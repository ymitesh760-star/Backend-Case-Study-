import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Assets from "./pages/Assets.jsx";
import Assignments from "./pages/Assignments.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function PrivateLayout() {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*" element={<PrivateLayout />} />
    </Routes>
  );
}
