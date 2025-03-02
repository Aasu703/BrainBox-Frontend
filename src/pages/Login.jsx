import { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // Ensure this path is correct
import "../css/Auth.css";

const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(userData);
      console.log("API Response:", res); // Debugging

      if (!res || !res.user || !res.token) {
        setError("Invalid response from server.");
        return;
      }

      // Store token and user in localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user)); // Store entire user object

      // Update global auth state
      login(res.user, res.token);

      alert("Login Successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>
        {error && <p className="auth-message">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={userData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
