import React, { useState } from "react";
import "./Calendar.css";

const Calendar = ({ tasks = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
        setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
        if (currentMonth === 0) setCurrentYear(prev => prev - 1);
    };

    const nextMonth = () => {
        setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
        if (currentMonth === 11) setCurrentYear(prev => prev + 1);
    };

    const isTaskDue = (day) => {
        const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return tasks.some(task => {
            if (!task.dueDate) return false;
            const taskDueDate = new Date(task.dueDate);
            if (isNaN(taskDueDate.getTime())) return false;
            return taskDueDate.toISOString().split('T')[0] === formattedDate && task.status === "pending";
        });
    };

    const isTaskCreated = (day) => {
        const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return tasks.some(task => {
            if (!task.createdAt) return false;
            const createdDate = new Date(task.createdAt);
            if (isNaN(createdDate.getTime())) return false;
            return createdDate.toISOString().split('T')[0] === formattedDate;
        });
    };

    const isTaskCompleted = (day) => {
        const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return tasks.some(task => {
            if (!task.updatedAt || task.status !== "completed") return false;
            const completedDate = new Date(task.updatedAt);
            if (isNaN(completedDate.getTime())) return false;
            return completedDate.toISOString().split('T')[0] === formattedDate;
        });
    };

    return (
        <div className="calendar">
            <h2>Calendar</h2>
            <div className="calendar-header">
                <button onClick={prevMonth}>◀</button>
                <span>{new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" })}</span>
                <button onClick={nextMonth}>▶</button>
            </div>
            <div className="calendar-grid">
                {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
                {[...Array(daysInMonth)].map((_, i) => {
                    const day = i + 1;
                    return (
                        <div
                            key={day}
                            className={`calendar-day 
                                ${isTaskDue(day) ? "task-due" : ""} 
                                ${isTaskCreated(day) ? "task-created" : ""} 
                                ${isTaskCompleted(day) ? "task-completed" : ""}
                            `}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;