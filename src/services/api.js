// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000"; // Match your backend URL

export const signupUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/signup`, userData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Signup failed" };
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, userData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
};

export const sendMessage = async (messageData) => {
    try {
        const response = await axios.post(`${API_URL}/api/chat/messages`, messageData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Message sending failed" };
    }
};

export const getMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/chat/messages`, {
            withCredentials: true,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Message retrieval failed" };
    }
};

// Real-time AI response using OpenAI via backend
export const getAIResponse = async (message) => {
    try {
        const response = await axios.post(`${API_URL}/api/chat/ai/response`, { message }, {
            withCredentials: true,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}` },
        });
        return response.data.response || "I'm not sure how to respond to that.";
    } catch (error) {
        throw error.response?.data || { message: "AI response failed" };
    }
};

// Material upload and retrieval
export const uploadMaterial = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/api/material/upload`, formData, {
            withCredentials: true,
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}`,
                'Content-Type': 'multipart/form-data', // For file uploads
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Material upload failed" };
    }
};

export const getUserMaterials = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/material/user`, {
            withCredentials: true,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to load materials" };
    }
};