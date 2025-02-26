import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VideoCallPage from "./pages/VideoCallPage";
import LandingPage from "../pages/LandingPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/video-call" element={<VideoCallPage />} />
          <Route path="/landing-page" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
