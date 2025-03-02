import React, { createContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ✅ Load user and token from localStorage when app starts
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;
    const storedToken = localStorage.getItem('token') || null;

    const [user, setUser] = useState(storedUser);
    const [token, setToken] = useState(storedToken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Update localStorage whenever user or token changes
    useEffect(() => {
        if (user && token) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, [user, token]);

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginUser(credentials);
            if (!response.user || !response.token) {
                throw new Error("Invalid server response");
            }
            setUser(response.user);
            setToken(response.token);
            return response;
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await signupUser(userData);
            if (!response.user || !response.token) {
                throw new Error("Invalid server response");
            }
            setUser(response.user);
            setToken(response.token);
            return response;
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
