import React from 'react';
import './TaskTimeline.css';

const TaskTimeline = ({ tasks = [] }) => {
    return (
        <div className="task-timeline">
            <h2>Task Timeline</h2>
            <ul>
                {tasks.length === 0 ? (
                    <li className="no-tasks">No tasks added yet.</li>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id} className={`timeline-item ${task.completed ? "completed" : ""}`}>
                            <div className="task-details">
                                <strong>{task.text}</strong>
                                <br />
                                <small>🕒 Added: {task.createdAt}</small>
                                {task.completed && (
                                    <>
                                        <br />
                                        <small>✅ Completed: {task.completedAt}</small>
                                        <br />
                                        <small>⏳ Duration: {calculateDuration(task.createdAt, task.completedAt)}</small>
                                    </>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

// Function to calculate the duration between task creation and completion
const calculateDuration = (createdAt, completedAt) => {
    const createdDate = new Date(createdAt);
    const completedDate = new Date(completedAt);
    const timeDiff = completedDate - createdDate;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

    return `${days}d ${hours}h ${minutes}m`;
};

export default TaskTimeline;