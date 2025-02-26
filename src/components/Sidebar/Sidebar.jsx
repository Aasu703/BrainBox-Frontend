// src/components/Sidebar/Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();

    const openMeeting = () => {
        window.open("/video-call", "_blank");
    };

    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <nav>
                <NavLink to="/tasks">Tasks</NavLink>
                <NavLink to="/progress">Progress</NavLink>
                <NavLink to="/timeline">Timeline</NavLink>
                <NavLink to="/calendar">Calendar</NavLink>
                <NavLink to="/materials">Material</NavLink>
                <NavLink to="/chat">Chat</NavLink> {/* Chat link for /chat route */}
                <button onClick={openMeeting} className="meeting-button">
                    Start Meeting
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;