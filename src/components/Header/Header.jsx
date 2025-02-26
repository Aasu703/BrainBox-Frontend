import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Import the CSS file
import { FaBookOpen } from "react-icons/fa"; // Import an icon for a modern look

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <FaBookOpen className="logo-icon" />
                <h1 className="header-title">Virtual Study Room</h1>
            </div>
            <nav className="header-nav">
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>
        </header>
    );
};

export default Header;
