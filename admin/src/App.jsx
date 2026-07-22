import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Projects from "./pages/Projects.jsx";
import Messages from "./pages/Messages.jsx";
import Applications from "./pages/Applications.jsx";
import { toastOptions } from "./lib/toast.js";

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/projects" element={<Protected><Projects /></Protected>} />
        <Route path="/messages" element={<Protected><Messages /></Protected>} />
        <Route path="/applications" element={<Protected><Applications /></Protected>} />
      </Routes>
      <Toaster position="bottom-right" toastOptions={toastOptions} />
    </>
  );
}
