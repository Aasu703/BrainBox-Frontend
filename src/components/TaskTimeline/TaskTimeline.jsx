import React from "react";
import "./TaskTimeline.css";

const TaskTimeline = ({ tasks = [] }) => {
    return (
        <div className="task-timeline">
            <h2>Task Timeline</h2>
            <ul>
                {tasks.length === 0 ? (
                    <li className="no-tasks">No tasks added yet.</li>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className={`timeline-item ${task.status === "completed" ? "completed" : ""}`}>
                            <div className="task-details">
                                <strong>{task.title}</strong>
                                <br />
                                <small>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</small>
                                <br />
                                <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TaskTimeline;