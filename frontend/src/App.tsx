import React, { useState, useEffect } from "react";
import "./App.css";

interface Message {
    text: string;
    sender: "user" | "bot";
}

interface Service {
    name: string;
    id: string;
    port: number;
    path: string;
    description: string;
}

interface ChatState {
    [key: string]: {
        messages: Message[];
        input: string;
    };
}

const App: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [activeTab, setActiveTab] = useState<string>("");
    const [chatState, setChatState] = useState<ChatState>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/services"
                );
                console.log("Response status:", response);
                if (!response.ok) {
                    throw new Error("Failed to fetch services");
                }
                const data = await response.json();
                setServices(data.services);

                // Initialize chat state for each service
                const initialState: ChatState = {};
                data.services.forEach((service: Service) => {
                    initialState[service.id] = {
                        messages: [],
                        input: "",
                    };
                });
                setChatState(initialState);

                if (data.services.length > 0) {
                    setActiveTab(data.services[0].id);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleInputChange = (serviceId: string, value: string) => {
        setChatState((prev) => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                input: value,
            },
        }));
    };

    const handleSendMessage = async (serviceId: string) => {
        const message = chatState[serviceId]?.input.trim();
        if (!message) return;

        // Add user message to chat
        const userMessage: Message = { text: message, sender: "user" };
        setChatState((prev) => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                messages: [...prev[serviceId].messages, userMessage],
                input: "",
            },
        }));

        try {
            const response = await fetch(`/api/chat/${serviceId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error("Service request failed");
            }

            const data = await response.json();
            const botMessage: Message = { text: data.response, sender: "bot" };
            setChatState((prev) => ({
                ...prev,
                [serviceId]: {
                    ...prev[serviceId],
                    messages: [...prev[serviceId].messages, botMessage],
                },
            }));
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Service unavailable";
            const botMessage: Message = {
                text: `Error: ${errorMessage}`,
                sender: "bot",
            };
            setChatState((prev) => ({
                ...prev,
                [serviceId]: {
                    ...prev[serviceId],
                    messages: [...prev[serviceId].messages, botMessage],
                },
            }));
        }
    };

    if (loading) return <div className="loading">Loading services...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (services.length === 0)
        return <div className="error">No services available</div>;

    return (
        <div className="app">
            <div className="tabs">
                {services.map((service) => (
                    <button
                        key={service.id}
                        className={`tab ${
                            activeTab === service.id ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(service.id)}
                    >
                        {service.name}
                    </button>
                ))}
            </div>
            <div className="chat-container">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`chat ${
                            activeTab === service.id ? "active" : ""
                        }`}
                    >
                        <div className="chat-header">
                            <h2>{service.name}</h2>
                            <p>{service.description}</p>
                        </div>
                        <div className="messages">
                            {chatState[service.id]?.messages.map(
                                (msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.sender}`}
                                    >
                                        {msg.text}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="input-area">
                            <input
                                type="text"
                                value={chatState[service.id]?.input || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        service.id,
                                        e.target.value
                                    )
                                }
                                onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    handleSendMessage(service.id)
                                }
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={() => handleSendMessage(service.id)}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
