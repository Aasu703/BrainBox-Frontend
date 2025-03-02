import axios from 'axios';

const API_URL = 'http://localhost:5000';

const getToken = () => localStorage.getItem('token');

export const loginUser = async (userData) => {
    if (!userData?.email || !userData?.password) {
        throw new Error("Email and password are required");
    }
    try {
        const response = await axios.post(`${API_URL}/users/login`, userData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Login failed";
        console.error('Login API Error:', errorMessage, error.response?.data || error);
        throw new Error(errorMessage);
    }
};

export const signupUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/signup`, userData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error('Signup API Error:', error.response?.data || error.message);
        throw error;
    }
};

export const createTask = async (taskData) => {
    const token = getToken();
    if (!token) throw new Error('No token found. Please log in.');
    try {
        const response = await axios.post('http://localhost:5000/api/task/create', taskData, {
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            },
        });
        return response.data.task;
    } catch (error) {
        console.error('Create Task Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};


export const getTasks = async () => {
    const token = getToken();
    if (!token) throw new Error('No token found. Please log in.');
    try {
        const response = await axios.get(`${API_URL}/api/task/all`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data.map(task => ({
            id: task.id,
            title: task.title,
            dueDate: task.dueDate,
            status: task.status,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            assignedTo: task.Assignee?.id || task.assignedTo,
            assignedBy: task.Assigner?.id || task.assignedBy
        }));
    } catch (error) {
        console.error('Get Tasks Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

export const updateTask = async (id, taskData) => {
    const token = getToken();
    if (!token) throw new Error('No token found. Please log in.');
    try {
        const response = await axios.put(`${API_URL}/api/task/update/${id}`, taskData, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        return response.data.task;
    } catch (error) {
        console.error('Update Task Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

export const deleteTask = async (id) => {
    const token = getToken();
    if (!token) throw new Error('No token found. Please log in.');
    try {
        const response = await axios.delete(`${API_URL}/api/task/delete/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Delete Task Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

export const uploadMaterial = async (formData) => {
    const token = getToken();
    if (!token) throw new Error('No token found. Please log in.');
    try {
        const response = await axios.post(`${API_URL}/api/materials/materials`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Upload Material Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

export const getUserMaterials = async () => {
    const token = getToken();
    if (!token) throw new Error('No token found. Please log in.');
    try {
        const response = await axios.get(`${API_URL}/api/materials/getmaterial`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Let backend return the raw data
    } catch (error) {
        console.error('Get Materials Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

// export const sendMessage = async (messageData) => {
//     const token = getToken();
//     if (!token) throw new Error('No token found. Please log in.');
//     try {
//         const response = await axios.post(`${API_URL}/api/chat/messages`, messageData, {
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Send Message Error:', error.response?.status, error.response?.data || error.message);
//         throw error;
//     }
// };

// export const getMessages = async ({ roomId }) => {
//     const token = getToken();
//     if (!token) throw new Error('No token found. Please log in.');
//     try {
//         const response = await axios.get(`${API_URL}/api/chat/messages?roomId=${roomId || 1}`, {
//             headers: { 'Authorization': `Bearer ${token}` },
//         });
//         return response.data.map(msg => ({
//             Message_ID: msg.Message_ID,
//             Message_Content: msg.Message_Content,
//             Sent_By: msg.Sent_By,
//             Room_ID: msg.Room_ID,
//             Sent_Time: msg.Sent_Time,
//         }));
//     } catch (error) {
//         console.error('Get Messages Error:', error.response?.status, error.response?.data || error.message);
//         throw error;
//     }
// };

export const signalOffer = async (roomId, offerData) => {
    const token = getToken();
    if (!token) throw new Error('No token found. Please log in.');
    try {
        const response = await axios.post(`${API_URL}/api/virtualroom/signaling/${roomId}`, offerData, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Signaling Error:', error.response?.status, error.response?.data || error.message);
        throw error;
    }
};

export { getToken };