import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../services/api';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const [user, setUser] = useState(storedUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userToken', user.token || '');
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('userToken');
        }
    }, [user]);

    const login = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginUser(userData);
            const userWithToken = { 
                id: response.user.id, 
                name: response.user.name, 
                email: response.user.email, 
                role: response.user.role, 
                token: response.token 
            };
            setUser(userWithToken);
            return response;
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await signupUser(userData);
            const userWithToken = { 
                id: response.user.id, 
                name: response.user.name, 
                email: response.user.email, 
                role: response.user.role, 
                token: response.token 
            };
            setUser(userWithToken);
            return response;
        } catch (err) {
            setError(err.message || "Signup failed. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        error,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;