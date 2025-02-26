import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, UserPlus, LogIn, Users, ClipboardList, Monitor } from "lucide-react"; // Icons for added visual appeal
import "./../css/LandingPage.css";
import img from "./../assets/1.jpg"

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <header className="landing-header">
            <BookOpen size={48} color="#6200ea" />
            <h1>Welcome to Brain-Box</h1>
          </header>
          <p>Your virtual study room for collaboration and productivity!</p>
          <div className="landing-buttons">
            <Link to="/login">
              <button className="btn">
                <LogIn size={20} style={{ marginRight: "8px" }} /> Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="btn">
                <UserPlus size={20} style={{ marginRight: "8px" }} /> Sign Up
              </button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          {/* Placeholder for the hero image */}
          <img src={img} alt="Virtual Study Room" />
        </div>
      </section>

      {/* Information Section */}
      <section className="info-section">
        <h2>Why Choose Brain-Box?</h2>
        <div className="info-cards">
          <div className="info-card">
            <Users size={32} color="#6200ea" />
            <h3>Collaborate Effortlessly</h3>
            <p>Work with peers in real-time, share resources, and get instant feedback.</p>
          </div>
          <div className="info-card">
            <ClipboardList size={32} color="#6200ea" />
            <h3>Organized Study</h3>
            <p>Keep track of your study sessions and improve your productivity with our intuitive tools.</p>
          </div>
          <div className="info-card">
            <Monitor size={32} color="#6200ea" />
            <h3>Virtual Whiteboard</h3>
            <p>Use our advanced virtual whiteboard to brainstorm, visualize ideas, and solve problems together.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

