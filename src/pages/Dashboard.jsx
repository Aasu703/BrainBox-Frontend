import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import TodayTasks from "../components/TodayTasks/TodayTasks";
import TaskProgress from "../components/TaskProgress/TaskProgress";
import TaskTimeline from "../components/TaskTimeline/TaskTimeline";
import Calendar from "../components/Calendar/Calendar";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import { FaUser, FaTasks, FaChartBar, FaCalendarAlt, FaVideo, FaSignOutAlt, FaHome, FaComments } from "react-icons/fa";
import "../css/Dashboard.css";
import Materials from "../components/material/Materials";
import VideoCallPage from "./VideoCallPage";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(1);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) {
                setError("Please log in to view tasks.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            try {
                const fetchedTasks = await getTasks();
                console.log("Fetched tasks:", fetchedTasks);
                setTasks(fetchedTasks || []);
                setError(null);
            } catch (err) {
                setError(`Failed to fetch tasks: ${err.response?.status === 404 ? "Tasks endpoint not found." : err.message || "Unknown error"}`);
                console.error("Fetch error:", err.response?.status, err.response?.data || err);
            }
        };
        fetchTasks();
    }, [user]);

    const addTask = async (taskData) => {
        if (!user) {
            setError("Please log in to add tasks.");
            return;
        }
        try {
            const newTask = {
                title: taskData.title,
                dueDate: new Date().toISOString().split('T')[0],
                status: "pending",
                assignedTo: user.id,
                assignedBy: user.id,
            };
            console.log('Task to create:', newTask);
            const createdTask = await createTask(newTask);
            setTasks([...tasks, createdTask]);
            setError(null);
        } catch (error) {
            setError(`Failed to add task: ${error.response?.status === 404 ? "Create task endpoint not found." : error.message || "Try again."}`);
            console.error("Add task error:", error.response?.status, error.response?.data || error);
        }
    };

    const deleteTask = async (taskId) => {
        if (!user) {
            setError("Please log in to delete tasks.");
            return;
        }

        try {
            await deleteTask(taskId);
            setTasks(tasks.filter((task) => task.id !== taskId));
            setError(null);
        } catch (error) {
            setError(`Failed to delete task: ${error.message || "Try again."}`);
            console.error("Delete task error:", error.response?.status, error.response?.data || error);
        }
    };

    const toggleTaskCompletion = async (taskId) => {
        if (!user) {
            setError("Please log in to update tasks.");
            return;
        }

        const task = tasks.find(t => t.id === taskId);
        const newStatus = task.status === "completed" ? "pending" : "completed";
        
        try {
            const updatedTask = await updateTask(taskId, { status: newStatus });
            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
            setError(null);
        } catch (error) {
            setError(`Failed to update task: ${error.message || "Try again."}`);
            console.error("Update task error:", error.response?.status, error.response?.data || error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/landing-page");
        setTasks([]);
        setError(null);
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <div className="welcome-header">
                    <FaUser className="welcome-icon" />
                    <h2>Welcome, {user ? user.name : "Guest"} {error && <span className="error-message">{error}</span>}</h2>
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
                <div className="materials-section">
                    <h2 className="section-title">Upload Study Materials <FaTasks className="section-icon" /></h2>
                    <Materials />
                </div>
                <div className="video-call-section">
                    <h2 className="section-title">Start a Meeting <FaVideo className="section-icon" /></h2>
                    <VideoCallPage roomId={selectedRoom} />
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