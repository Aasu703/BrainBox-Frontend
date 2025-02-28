import React, { useState } from "react";
import { FaTrash } from "react-icons/fa"; // For delete button
import "./TodayTasks.css";

const TodayTasks = ({ tasks, addTask, deleteTask, toggleTaskCompletion }) => {
    const [taskText, setTaskText] = useState("");

    const handleAddTask = () => {
        if (!addTask || taskText.trim() === "") return;
        addTask({ title: taskText, status: "pending" }); // Match Task model
        setTaskText("");
    };

    return (
        <div className="tasks-container">
            <h3 className="tasks-header">Today's Tasks</h3>
            {addTask && (
                <div className="task-input">
                    <input
                        type="text"
                        placeholder="Enter task..."
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                    />
                    <button onClick={handleAddTask}>Add Task</button>
                </div>
            )}
            <ul className="task-list">
                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className={`task-item ${task.status === "completed" ? "completed" : ""}`}>
                            <span onClick={() => toggleTaskCompletion(task.id, { status: task.status === "completed" ? "in-progress" : "completed" })}>
                                {task.title}
                            </span>
                            {deleteTask && <button className="delete-btn" onClick={() => deleteTask(task.id)}><FaTrash /></button>}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TodayTasks;