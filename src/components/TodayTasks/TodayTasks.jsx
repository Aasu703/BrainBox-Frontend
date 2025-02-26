import React, { useState } from "react";
import "./TodayTasks.css";

const TodayTasks = ({ tasks, addTask, deleteTask, toggleTaskCompletion }) => {
    const [taskText, setTaskText] = useState("");

    const handleAddTask = () => {
        if (taskText.trim() === "") return;
        addTask(taskText);
        setTaskText("");
    };

    return (
        <div className="tasks-container">
            <h3 className="tasks-header">Today's Tasks</h3>
            
            <div className="task-input">
                <input 
                    type="text" 
                    placeholder="Enter task..." 
                    value={taskText} 
                    onChange={(e) => setTaskText(e.target.value)} 
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>

            <ul className="task-list">
                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                            <span onClick={() => toggleTaskCompletion(task.id)}>
                                {task.text}
                            </span>
                            <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TodayTasks;