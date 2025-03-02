import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./TodayTasks.css";

const TodayTasks = ({ tasks, addTask, deleteTask, toggleTaskCompletion }) => {
    const [taskText, setTaskText] = useState("");

    const handleAddTask = (e) => {
        // Prevent execution if no valid input or event context
        if (!taskText.trim()) return;

        // Handle both Enter keypress and button click
        if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")) {
            const taskData = { title: taskText.trim() };
            addTask(taskData);
            setTaskText(""); // Clear input after adding
        }
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
                        onKeyPress={handleAddTask} // Pass the function directly
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
                            <span onClick={() => toggleTaskCompletion(task.id)}>
                                {task.title}
                            </span>
                            {deleteTask && (
                                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                                    <FaTrash />
                                </button>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TodayTasks;