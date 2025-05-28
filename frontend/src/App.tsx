import React, { useState } from "react";
import "./App.css";
import Jarvis from "./Jarvis/Jarvis";

// Define message type
type Message = {
    text: string;
    sender: "user" | "ai" | "error";
};

function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        setLoading(true);
        const userMessage: Message = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }), // Properly formatted JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage: Message = { text: data.response, sender: "ai" };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                text: error instanceof Error ? error.message : "Unknown error",
                sender: "error",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return (
        // <div className="chat-container">
        //     <h1>LLM Chat Interface</h1>

        //     <div className="chat-window">
        //         {messages.map((msg, index) => (
        //             <div key={index} className={`message ${msg.sender}`}>
        //                 {msg.text}
        //             </div>
        //         ))}
        //         {loading && <div className="message ai">Thinking...</div>}
        //     </div>

        //     <div className="input-area">
        //         <input
        //             type="text"
        //             value={input}
        //             onChange={(e) => setInput(e.target.value)}
        //             onKeyPress={(e) => e.key === "Enter" && handleSend()}
        //             disabled={loading}
        //             placeholder="Type your message..."
        //         />
        //         <button onClick={handleSend} disabled={loading}>
        //             {loading ? "Sending..." : "Send"}
        //         </button>
        //     </div>
        // </div>
        <Jarvis />
    );
}

export default App;
