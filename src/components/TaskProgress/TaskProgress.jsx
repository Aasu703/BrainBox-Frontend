import React from "react";
import "./TaskProgress.css";

const TaskProgress = ({ tasks }) => {
    const totalTasks = tasks ? tasks.length : 0;
    const completedTasks = tasks ? tasks.filter(task => task.completed).length : 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="progress-container">
            <h3 className="progress-header">Task Progress</h3>
            {totalTasks === 0 ? (
                <p>No tasks available.</p>
            ) : (
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}>
                        {Math.round(progress)}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskProgress;