import { useState, useContext } from "react";
import { loginUser } from "../services/api"; // Ensure this function is correctly defined
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../css/Auth.css";

const Login = () => {
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Ensure login is defined

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginUser(userData); // Make sure this returns the expected format
            
            // Call login function from context with the user object and token
            login(res.user, res.token); 
            alert("Login Successful!");
            navigate("/dashboard"); // Redirect to dashboard
        } catch (err) {
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
                    <button type="submit" className="auth-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;