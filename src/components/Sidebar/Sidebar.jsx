import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const openMeeting = () => {
        window.open("/video-call", "_blank");
    };

    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <nav>
                <NavLink to="/dashboard" end>Dashboard</NavLink>
                <NavLink to="/tasks">My Tasks</NavLink>
                {user?.role === "teacher" && <NavLink to="/manage-tasks">Manage Tasks</NavLink>}
                <NavLink to="/progress">Progress</NavLink>
                <NavLink to="/timeline">Timeline</NavLink>
                <NavLink to="/calendar">Calendar</NavLink>
                <NavLink to="/materials">Materials</NavLink>
                <NavLink to="/chat">Chat</NavLink>
                <button onClick={openMeeting} className="meeting-button">
                    Start Meeting
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;