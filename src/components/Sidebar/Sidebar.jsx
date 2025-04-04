import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";
import { FaComments, FaVideo } from "react-icons/fa"; // For chat and video icons

const Sidebar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const openChat = () => {
        navigate("/chat"); // Navigate to chat page
    };

    const openMeeting = () => {
        window.open("/video-call", "_blank");
    };

    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <nav>
                {/* <NavLink to="/dashboard" end>Dashboard</NavLink> */}
                {/* <NavLink to="/task-progress">My Tasks</NavLink> */}
                {/* {user?.role === "teacher" && <NavLink to="/manage-tasks">Manage Tasks</NavLink>} */}
                {/* <NavLink to="/progress">Progress</NavLink> */}
                {/* <NavLink to="/task-timeline">Timeline</NavLink> */}
                <NavLink to="/calendar">Calendar</NavLink>
                <NavLink to="/materials">Materials</NavLink>
                <button onClick={openChat} className="chat-button">
                    <FaComments /> Chat
                </button>
                <button onClick={openMeeting} className="meeting-button">
                    <FaVideo /> Start Meeting
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;