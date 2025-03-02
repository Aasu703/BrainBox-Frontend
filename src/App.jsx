import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VideoCallPage from "./pages/VideoCallPage";
import LandingPage from "./pages/LandingPage";
import Materials from "./components/material/Materials";
import Calendar from "./components/Calendar/Calendar";
import TaskProgress from "./components/TaskProgress/TaskProgress";
import TaskTimeline from "./components/TaskTimeline/TaskTimeline";
import ErrorBoundary from "./components/ErrorBoundary";

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    return token ? element : <Navigate to="/landing" replace />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/video-call" element={<ProtectedRoute element={<ErrorBoundary><VideoCallPage /></ErrorBoundary>} />} />
                    <Route path="/materials" element={<ProtectedRoute element={<Materials />} />} />
                    <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} />} />
                    <Route path="/task-progress" element={<ProtectedRoute element={<TaskProgress />} />} />
                    <Route path="/task-timeline" element={<ProtectedRoute element={<TaskTimeline />} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
