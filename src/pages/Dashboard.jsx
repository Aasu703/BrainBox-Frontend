import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import TodayTasks from "../components/TodayTasks/TodayTasks";
import TaskProgress from "../components/TaskProgress/TaskProgress";
import TaskTimeline from "../components/TaskTimeline/TaskTimeline";
import Calendar from "../components/Calendar/Calendar";
import { useAuth } from "../context/AuthContext";
import VideoCallPage from "./VideoCallPage";
import { FaUser, FaTasks, FaChartBar, FaCalendarAlt, FaVideo, FaSignOutAlt, FaHome, FaPlus, FaTrash } from "react-icons/fa";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import "../css/Dashboard.css";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", assignedTo: user?.id || null });

    // Fetch tasks from database on mount and user change
    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const data = await getTasks();
                    setTasks(data);
                } catch (err) {
                    setError("Failed to load tasks. Please try again.");
                    console.error("Error fetching tasks:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchTasks();
    }, [user]);

    // Handle task creation (teacher only)
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!user || user.role !== "teacher") {
            setError("Only teachers can create tasks.");
            return;
        }
        try {
            const taskData = {
                ...newTask,
                dueDate: new Date(newTask.dueDate).toISOString(),
                assignedTo: parseInt(newTask.assignedTo), // Ensure assignedTo is an integer
            };
            const response = await createTask(taskData);
            setTasks([...tasks, response.task]);
            setNewTask({ title: "", description: "", dueDate: "", assignedTo: user?.id || null });
            setError(null);
        } catch (err) {
            setError("Failed to create task. " + err.message);
            console.error("Error creating task:", err);
        }
    };

    // Handle task update (student or teacher)
    const handleUpdateTask = async (taskId, updates) => {
        if (!user) return;
        try {
            const updatedTask = await updateTask(taskId, updates);
            setTasks(tasks.map(task => task.id === taskId ? updatedTask.task : task));
            setError(null);
        } catch (err) {
            setError("Failed to update task. " + err.message);
            console.error("Error updating task:", err);
        }
    };

    // Handle task deletion (teacher only)
    const handleDeleteTask = async (taskId) => {
        if (!user || user.role !== "teacher") {
            setError("Only teachers can delete tasks.");
            return;
        }
        try {
            await deleteTask(taskId);
            setTasks(tasks.filter(task => task.id !== taskId));
            setError(null);
        } catch (err) {
            setError("Failed to delete task. " + err.message);
            console.error("Error deleting task:", err);
        }
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
                {error && <p className="error-message">{error}</p>}
                {loading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <>
                        <div className="dashboard-grid">
                            <div className="tasks-section">
                                {user?.role === "teacher" && (
                                    <form onSubmit={handleCreateTask} className="task-form">
                                        <input
                                            type="text"
                                            name="title"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            placeholder="Task Title"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="description"
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            placeholder="Description"
                                        />
                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="assignedTo"
                                            value={newTask.assignedTo}
                                            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                            placeholder="Assign to User ID"
                                            required
                                        />
                                        <button type="submit" className="add-task-button"><FaPlus /> Add Task</button>
                                    </form>
                                )}
                                <TodayTasks
                                    tasks={tasks}
                                    addTask={user?.role === "teacher" ? handleCreateTask : null}
                                    deleteTask={user?.role === "teacher" ? handleDeleteTask : null}
                                    toggleTaskCompletion={handleUpdateTask}
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
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;