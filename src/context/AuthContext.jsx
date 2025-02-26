import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('userToken') 
        ? JSON.parse(localStorage.getItem('user')) 
        : null;
    const [user, setUser] = useState(storedUser);

    // Sync user state with localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Define the login function
    const login = (userData, token) => {
        // Ensure userData includes fields like name or email
        const userWithToken = { ...userData, token };
        setUser(userWithToken);
        localStorage.setItem('userToken', token); // Store token if needed
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;