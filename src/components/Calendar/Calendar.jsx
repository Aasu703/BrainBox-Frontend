import React, { useState } from "react";
import "./Calendar.css";

const Calendar = ({ tasks = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
        setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
        setCurrentYear(prev => prev === 0 ? prev - 1 : prev);
    };

    const nextMonth = () => {
        setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
        setCurrentYear(prev => prev === 11 ? prev + 1 : prev);
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
                    const formattedDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    
                    const hasCreatedTasks = tasks && tasks.some(task => task.createdAt === formattedDate);
                    const hasCompletedTasks = tasks && tasks.some(task => task.completedAt === formattedDate);

                    return (
                        <div
                            key={day}
                            className={`calendar-day ${hasCreatedTasks ? "task-created" : ""} ${hasCompletedTasks ? "task-completed" : ""}`}
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