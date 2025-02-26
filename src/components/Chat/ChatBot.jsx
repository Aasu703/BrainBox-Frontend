import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { getAIResponse, sendMessage, getMessages } from "../../services/api"; // Import all needed functions
import { useAuth } from "../../context/AuthContext"; // For user authentication
import "./Chat.css"; // Ensure your CSS file is imported

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatWindowRef = useRef(null);
    const { user, loading, error } = useAuth(); // Get user, loading, and error for authentication

    // Fetch existing messages on mount
    useEffect(() => {
        const loadMessages = async () => {
            if (user && !loading) {
                try {
                    const fetchedMessages = await getMessages();
                    setMessages(fetchedMessages.map(msg => ({
                        text: msg.Message_Content,
                        sender: msg.Sent_By === user.id ? "user" : "bot",
                    })));
                } catch (err) {
                    console.error("Error loading messages:", err);
                    setMessages((prev) => [...prev, { text: error || "Failed to load messages. Try again.", sender: "bot" }]);
                }
            }
        };
        loadMessages();
    }, [user, loading, error]);

    const handleSend = async () => {
        if (!user || input.trim() === "" || loading) return;

        const userMessage = { 
            Message_Content: input, 
            Room_ID: 1, // Adjust based on your backend logic
            Sent_By: user.id, // Use user's ID from AuthContext
        };
        setMessages((prevMessages) => [...prevMessages, { text: input, sender: "user" }]);
        setInput(""); // Clear input field

        try {
            // Send user message to backend
            await sendMessage(userMessage);

            // Get AI response
            const aiResponse = await getAIResponse(input);
            const botMessage = { text: aiResponse, sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

            // Optionally, fetch updated messages to ensure sync
            const updatedMessages = await getMessages();
            setMessages(updatedMessages.map(msg => ({
                text: msg.Message_Content,
                sender: msg.Sent_By === user.id ? "user" : "bot",
            })));
        } catch (err) {
            console.error("Error sending message or getting AI response:", err);
            const errorMessage = { text: error || "Sorry, I couldn’t process your request. Try again later.", sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    };

    useEffect(() => {
        chatWindowRef.current?.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    return (
        <div className="chatbot">
            <div className="chat-window" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        <span>{msg.sender === "user" ? "You: " : "Bot: "}{msg.text}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={user ? "Type a message..." : "Please log in to chat"}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()} // Send on Enter key
                    disabled={!user || loading} // Disable input if not logged in or loading
                />
                <button onClick={handleSend} disabled={!user || loading}><FaPaperPlane /></button>
            </div>
            {error && <p className="chat-error">{error}</p>}
        </div>
    );
};

export default ChatBot;