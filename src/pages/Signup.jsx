import { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

const Signup = () => {
  const [userData, setUserData] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signupUser(userData);
      if (!res.user || !res.token) {
        setError("Invalid response from server.");
        return;
      }
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user.id);
      localStorage.setItem("username", res.user.name);
      localStorage.setItem("role", res.user.role);
      alert("Signup Successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err); // Debug log
      setError(err.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Signup</h2>
        {error && <p className="auth-message">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="auth-input"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            onChange={handleChange}
            required
          />
          <div className="user-type-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={userData.role === "student"}
                onChange={handleChange}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={userData.role === "teacher"}
                onChange={handleChange}
              />
              Teacher
            </label>
          </div>
          <button type="submit" className="auth-button">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;