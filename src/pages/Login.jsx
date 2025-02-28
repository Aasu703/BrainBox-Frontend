import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/Auth.css";

const Login = () => {
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [localError, setLocalError] = useState("");
    const navigate = useNavigate();
    const { login, loading, error } = useContext(AuthContext);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
        setLocalError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login data sent:", userData); // Debug log
        setLocalError("");

        try {
            const result = await login(userData); // Explicitly assign to catch return value
            console.log("Login successful, result:", result); // Debug log
            alert("Login Successful!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Login error details:", err); // Debug full error
            setLocalError(err.message || error || "Login failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Login</h2>
                {(localError || error) && <p className="auth-message">{localError || error}</p>}
                {loading && <p className="auth-message">Loading...</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
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
                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Login" : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;