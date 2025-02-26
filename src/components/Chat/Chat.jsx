// src/components/Chat/Chat.jsx
import React, { useState } from 'react';
import './Chat.css'; // Ensure to include your CSS styles

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() === '') return;

        // Add user message
        const userMessage = { text: input, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        // Get bot response
        const botResponse = getBotResponse(input);
        const botMessage = { text: botResponse, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);

        // Clear the input field
        setInput('');
    };

    const getBotResponse = (userInput) => {
        const responses = {
            hello: "Hi there! How can I assist you today?",
            hi: "Hello! How can I help you?",
            "how are you?": "I'm just a bot, but thanks for asking! 😊",
            goodbye: "Goodbye! Have a great day!",
        };

        return responses[userInput.toLowerCase()] || "I'm not sure how to respond to that. 🤔";
    };

    return (
        <div className="chat">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;