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
            const taskDueDate = new Date(task.dueDate).toISOString().split('T')[0];
            return taskDueDate === formattedDate && task.status === "pending";
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
                            className={`calendar-day ${isTaskDue(day) ? "task-due" : ""}`}
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