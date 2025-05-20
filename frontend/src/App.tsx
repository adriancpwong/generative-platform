import React, { useState } from "react";
import "./App.css";

function App() {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/ai-response");
            const data = await res.json();
            setResponse(data.text);
        } catch (error) {
            setResponse("Error fetching data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>AI Service Demo</h1>
                <button onClick={fetchData} disabled={loading}>
                    {loading ? "Loading..." : "Call AI Service"}
                </button>
                {response && (
                    <div className="response-box">
                        <h3>AI Response:</h3>
                        <p>{response}</p>
                    </div>
                )}
            </header>
        </div>
    );
}

export default App;
