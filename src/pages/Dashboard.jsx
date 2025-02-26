import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import TodayTasks from "../components/TodayTasks/TodayTasks";
import TaskProgress from "../components/TaskProgress/TaskProgress";
import TaskTimeline from "../components/TaskTimeline/TaskTimeline";
import Calendar from "../components/Calendar/Calendar";
import { useAuth } from "../context/AuthContext";
import VideoCallPage from "./VideoCallPage";
// Import icons from react-icons (install with: npm install react-icons)
import { FaUser, FaTasks, FaChartBar, FaCalendarAlt, FaVideo, FaSignOutAlt, FaHome } from "react-icons/fa";
import "../css/Dashboard.css";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        { id: 1, text: "Sample Task 1", completed: false },
        { id: 2, text: "Sample Task 2", completed: false },
    ]);

    const addTask = (taskText) => {
        const newTask = {
            id: tasks.length + 1,
            text: taskText,
            completed: false,
        };
        setTasks([...tasks, newTask]);
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleLogout = () => {
        logout();
        navigate("/landing-page");
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <div className="welcome-header">
                    <FaUser className="welcome-icon" />
                    <h2>Welcome, {user ? user.name : "Guest"}</h2>
                </div>
                <div className="dashboard-grid">
                    <div className="tasks-section">
                        <TodayTasks
                            tasks={tasks}
                            addTask={addTask}
                            deleteTask={deleteTask}
                            toggleTaskCompletion={toggleTaskCompletion}
                        />
                        <TaskProgress tasks={tasks} />
                    </div>
                    <div className="calendar-section">
                        <TaskTimeline tasks={tasks} />
                        <Calendar tasks={tasks} />
                    </div>
                </div>
                <div className="video-call-section">
                    <h2 className="section-title">Start a Meeting <FaVideo className="section-icon" /></h2>
                    <button onClick={() => window.open("/video-call", "_blank")} className="meeting-button">
                        Start Meeting
                    </button>
                </div>
                <div className="action-buttons">
                    <button onClick={handleLogout} className="logout-button">
                        <FaSignOutAlt className="button-icon" /> Logout
                    </button>
                    <Link to="/landing-page" className="home-button">
                        <FaHome className="button-icon" /> Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;