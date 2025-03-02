import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VideoCallPage from "./pages/VideoCallPage"; // Import VideoCallPage
import LandingPage from "./pages/LandingPage"; // Import LandingPage if needed
import Materials from "./components/material/Materials"; // Import Material if needed
import Calendar from "./components/Calendar/Calendar";
import TaskProgress from "./components/TaskProgress/TaskProgress";
import TaskTimeline from "./components/TaskTimeline/TaskTimeline";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} /> {/* Add landing page route */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/video-call" element={
                        <ErrorBoundary>
                            <VideoCallPage />
                            </ErrorBoundary>} /> {/* Add video call page route with error boundary */}

                    <Route path="/landing-page" element={<LandingPage />} />
                    <Route path="/materials" element={<Materials />} /> {/* Add materials page route */}
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/task-progress" element={<TaskProgress />} />
                    <Route path="/task-timeline" element={<TaskTimeline />} /> {/* Add task timeline page route */}
                    
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;