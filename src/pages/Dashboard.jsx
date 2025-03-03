import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import TodayTasks from "../components/TodayTasks/TodayTasks";
import TaskProgress from "../components/TaskProgress/TaskProgress";
import TaskTimeline from "../components/TaskTimeline/TaskTimeline";
import Calendar from "../components/Calendar/Calendar";
import { useAuth } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask as apiDeleteTask, getUserMaterials, deleteMaterial, uploadMaterial } from "../services/api";
import { FaUser, FaTasks, FaChartBar, FaCalendarAlt, FaVideo, FaSignOutAlt, FaHome, FaComments, FaUpload, FaTrash } from "react-icons/fa";
import "../css/Dashboard.css";
import VideoCallPage from "./VideoCallPage";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(1);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null); // Ref to reset file input

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setError("Oops! Please log in to see your dashboard.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError("Hmm, no login token found. Please sign in!");
                return;
            }

            try {
                const fetchedTasks = await getTasks();
                console.log("Fetched tasks:", fetchedTasks);
                setTasks(fetchedTasks || []);

                const fetchedMaterials = await getUserMaterials();
                console.log("Fetched materials:", fetchedMaterials);
                setMaterials(fetchedMaterials || []);

                setError(null);
            } catch (err) {
                setError(
                    err.response?.status === 404
                        ? "No tasks or materials found yet—let's add some!"
                        : "Something went wrong fetching data. Give it another go?"
                );
                console.error("Fetch error:", err.response?.status, err.response?.data || err);
            }
        };
        fetchData();
    }, [user]);

    const addTask = async (taskData) => {
        if (!user) {
            setError("Please log in to add a new task!");
            return;
        }
        console.log('Task data being sent:', taskData);

        const taskToCreate = {
            ...taskData,
            dueDate: '2025-03-02',
            status: 'pending',
            assignedTo: user.id || 1,
            assignedBy: user.id || 1,
        };
        console.log('Task to create:', taskToCreate);

        try {
            console.log('Calling createTask with URL:', 'http://localhost:5000/api/task/create');
            const newTask = await createTask(taskToCreate);
            console.log('Response from createTask:', newTask);
            setTasks([...tasks, newTask]);
            setError(null);
            console.log('Task added:', newTask);
        } catch (error) {
            setError(
                error.response?.data?.message 
                    ? `Oops! ${error.response.data.message}` 
                    : "Couldn’t add the task right now. Try again soon?"
            );
            console.error('Add task error:', error.response?.status, error.response?.data || error);
        }
    };

    const deleteTask = async (taskId) => {
        if (!user) {
            setError("Please log in to delete tasks!");
            return;
        }

        console.log("deleteTask called with taskId:", taskId);
        try {
            await apiDeleteTask(taskId);
            setTasks(tasks.filter((task) => task.id !== taskId));
            setError(null);
            console.log("Task deleted successfully:", taskId);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            setError(
                error.response?.status === 403
                    ? "Looks like you don’t have permission to delete this task."
                    : `Uh-oh! ${errorMessage}. Want to try again?`
            );
            console.error("Delete task error:", error.response?.status, error.response?.data || error);
        }
    };

    const toggleTaskCompletion = async (taskId) => {
        if (!user) {
            setError("Please log in to update tasks!");
            return;
        }

        const task = tasks.find(t => t.id === taskId);
        const newStatus = task.status === "completed" ? "pending" : "completed";

        try {
            const updatedTask = await updateTask(taskId, { status: newStatus });
            setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
            setError(null);
        } catch (error) {
            setError(
                error.response?.data?.message 
                    ? `Oops! ${error.response.data.message}` 
                    : "Couldn’t update the task. Try again?"
            );
            console.error("Update task error:", error.response?.status, error.response?.data || error);
        }
    };

    const deleteMaterialHandler = async (materialId) => {
        if (!user) {
            setError("Please log in to delete materials!");
            return;
        }

        console.log("deleteMaterial called with materialId:", materialId);
        try {
            await deleteMaterial(materialId);
            setMaterials(materials.filter((material) => material.id !== materialId));
            setError(null);
            console.log("Material deleted successfully:", materialId);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            setError(
                error.response?.status === 404
                    ? "Material not found—maybe it’s already gone?"
                    : error.response?.status === 403
                    ? "Looks like you don’t have permission to delete this material."
                    : `Uh-oh! ${errorMessage}. Want to try again?`
            );
            console.error("Delete material error:", error.response?.status, error.response?.data || error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadMaterialHandler = async () => {
        if (!user) {
            setError("Please log in to upload materials!");
            return;
        }
        if (!file) {
            setError("Please select a file to upload!");
            return;
        }

        const formData = new FormData();
        formData.append('filePath', file);
        formData.append('fileType', file.type || 'unknown');
        formData.append('uploadedBy', user.id || 1);

        try {
            const uploadedMaterial = await uploadMaterial(formData);
            console.log("Uploaded material:", uploadedMaterial);
            setMaterials([...materials, uploadedMaterial]);
            setFile(null);
            fileInputRef.current.value = ""; // Reset file input
            setError(null);
        } catch (error) {
            setError(
                error.response?.data?.message 
                    ? `Oops! ${error.response.data.message}` 
                    : "Couldn’t upload the material. Try again?"
            );
            console.error("Upload material error:", error.response?.status, error.response?.data || error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/Landing");
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <div className="welcome-header">
                    <FaUser className="welcome-icon" />
                    <h2>
                        Welcome, {user ? user.name : "Guest"}{" "}
                        {error && <span className="error-message">{error}</span>}
                    </h2>
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
                    <div className="material-upload">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="material-file-input"
                            id="material-upload"
                            ref={fileInputRef} // Add ref to reset input
                        />
                        <button
                            onClick={uploadMaterialHandler}
                            className="material-upload-btn"
                            disabled={!file}
                        >
                            <FaUpload className="btn-icon" /> Upload Material
                        </button>
                    </div>
                    <div className="materials-list">
                        {materials.length === 0 ? (
                            <p>No materials uploaded yet.</p>
                        ) : (
                            materials.map((material) => (
                                <div key={material.id} className="material-item">
                                    <div className="material-content">
                                        {material.name || material.filename || `Material ${material.id}`}
                                    </div>
                                    <button
                                        onClick={() => deleteMaterialHandler(material.id)}
                                        className="material-delete-btn"
                                        title="Delete Material"
                                    >
                                        <FaTrash className="btn-icon" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
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