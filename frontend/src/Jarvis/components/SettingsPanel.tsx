import React from "react";

interface SettingsPanelProps {
    show: boolean;
    onClose: () => void;
    onSave: () => void;
    currentProvider: string;
    currentVoiceProvider: string;
    searchEnabled: boolean;
    onSelectProvider: (provider: string) => void;
    onSelectVoiceProvider: (voice: string) => void;
    onToggleSearch: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    show,
    onClose,
    onSave,
    currentProvider,
    currentVoiceProvider,
    searchEnabled,
    onSelectProvider,
    onSelectVoiceProvider,
    onToggleSearch,
}) => {
    if (!show) return null;

    return (
        <>
            <div id="settingsOverlay" className="settings-overlay active"></div>
            <div id="settingsPanel" className="settings-panel active">
                <button
                    className="btn-close"
                    id="closeSettingsBtn"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="guru-font hud-text-xl glow-strong mb-4">
                    GURU CONFIGURATION
                </div>

                <div className="settings-grid">
                    {/* Left Column: AI Provider */}
                    <div className="settings-column">
                        <h3 className="hud-text-lg">
                            🤖 AI Provider Configuration
                        </h3>
                        <div className="settings-section">
                            <div className="hud-text-base mb-3">
                                Select AI Provider:
                            </div>

                            {/* Local Ollama Option */}
                            <div
                                className={`provider-option ${
                                    currentProvider === "ollama" ? "active" : ""
                                }`}
                                data-provider="ollama"
                                id="provider-ollama"
                                onClick={() => onSelectProvider("ollama")}
                            >
                                <div>
                                    <div className="hud-text-base">
                                        🖥️ Local (Ollama)
                                    </div>
                                    <div
                                        className="hud-text-sm"
                                        style={{
                                            color: "rgba(0, 212, 255, 0.7)",
                                        }}
                                    >
                                        Privacy-focused, runs locally
                                    </div>
                                </div>
                                <div
                                    className="provider-status"
                                    id="ollamaStatus"
                                ></div>
                            </div>

                            {/* Ollama Model Selection */}
                            <div
                                className="settings-section"
                                id="ollamaModelSection"
                                style={{
                                    display:
                                        currentProvider === "ollama"
                                            ? "block"
                                            : "none",
                                }}
                            >
                                <div className="hud-text-base mb-2">
                                    Ollama Model Configuration:
                                </div>
                                <select
                                    id="ollamaModelSelect"
                                    className="input-field"
                                    style={{ marginBottom: "10px" }}
                                >
                                    <option value="">Select a model...</option>
                                </select>
                                <div
                                    className="hud-text-sm mb-2"
                                    style={{ color: "rgba(0, 212, 255, 0.7)" }}
                                >
                                    Or enter model name manually:
                                </div>
                                <input
                                    type="text"
                                    id="ollamaModelInput"
                                    className="input-field"
                                    placeholder="e.g., llama3.2, phi3, mistral..."
                                    style={{ marginBottom: "10px" }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <button
                                        className="btn"
                                        id="refreshModelsBtn"
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        🔄 Refresh Models
                                    </button>
                                    <button
                                        className="btn"
                                        id="setModelBtn"
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        ✅ Set Model
                                    </button>
                                </div>
                                <div
                                    className="hud-text-sm mt-2"
                                    style={{ color: "rgba(0, 212, 255, 0.6)" }}
                                >
                                    Current model:{" "}
                                    <span id="currentOllamaModel">None</span>
                                </div>
                                <div
                                    className="hud-text-sm mt-1"
                                    style={{ color: "rgba(255, 165, 0, 0.8)" }}
                                >
                                    💡 If model not available, Ollama will
                                    attempt to pull it automatically
                                </div>
                            </div>

                            {/* Gemini Options */}
                            <div
                                className={`provider-option ${
                                    currentProvider === "gemini-2.5-flash"
                                        ? "active"
                                        : ""
                                }`}
                                data-provider="gemini-2.5-flash"
                                id="provider-gemini-2.5-flash"
                                onClick={() =>
                                    onSelectProvider("gemini-2.5-flash")
                                }
                            >
                                <div>
                                    <div className="hud-text-base">
                                        ⚡ Gemini 2.5 Flash
                                    </div>
                                    <div
                                        className="hud-text-sm"
                                        style={{
                                            color: "rgba(0, 212, 255, 0.7)",
                                        }}
                                    >
                                        Ultra-fast responses, cloud-based
                                    </div>
                                </div>
                                <div
                                    className="provider-status"
                                    id="gemini25Status"
                                ></div>
                            </div>

                            <div
                                className={`provider-option ${
                                    currentProvider === "gemini-2.0-flash"
                                        ? "active"
                                        : ""
                                }`}
                                data-provider="gemini-2.0-flash"
                                id="provider-gemini-2.0-flash"
                                onClick={() =>
                                    onSelectProvider("gemini-2.0-flash")
                                }
                            >
                                <div>
                                    <div className="hud-text-base">
                                        🚀 Gemini 2.0 Flash
                                    </div>
                                    <div
                                        className="hud-text-sm"
                                        style={{
                                            color: "rgba(0, 212, 255, 0.7)",
                                        }}
                                    >
                                        Advanced reasoning, multimodal
                                    </div>
                                </div>
                                <div
                                    className="provider-status"
                                    id="gemini20Status"
                                ></div>
                            </div>

                            {/* API Key Section */}
                            <div
                                className="settings-section"
                                id="geminiApiSection"
                                style={{
                                    display: currentProvider.startsWith(
                                        "gemini"
                                    )
                                        ? "block"
                                        : "none",
                                }}
                            >
                                <div className="hud-text-base mb-2">
                                    Gemini API Key:
                                </div>
                                <input
                                    type="password"
                                    id="geminiApiKey"
                                    className="input-field"
                                    placeholder="Enter your Gemini API key..."
                                />
                                <div
                                    className="hud-text-sm mt-2"
                                    style={{ color: "rgba(0, 212, 255, 0.6)" }}
                                >
                                    Get from:{" "}
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: "#00d4ff",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        Google AI Studio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Voice Configuration */}
                    <div className="settings-column">
                        <h3 className="hud-text-lg">🎤 Voice Configuration</h3>
                        <div className="settings-section">
                            <div className="hud-text-base mb-3">
                                Select Voice Provider:
                            </div>

                            {/* Voice Provider Selection */}
                            <div
                                className={`provider-option ${
                                    currentVoiceProvider === "elevenlabs"
                                        ? "active"
                                        : ""
                                }`}
                                data-voice="elevenlabs"
                                id="voice-elevenlabs"
                                onClick={() =>
                                    onSelectVoiceProvider("elevenlabs")
                                }
                            >
                                <div>
                                    <div className="hud-text-base">
                                        🎭 ElevenLabs (Realistic)
                                    </div>
                                    <div
                                        className="hud-text-sm"
                                        style={{
                                            color: "rgba(0, 212, 255, 0.7)",
                                        }}
                                    >
                                        Ultra-realistic AI voices
                                    </div>
                                </div>
                                <div
                                    className="provider-status"
                                    id="elevenLabsVoiceStatus"
                                ></div>
                            </div>

                            <div
                                className={`provider-option ${
                                    currentVoiceProvider === "edge"
                                        ? "active"
                                        : ""
                                }`}
                                data-voice="edge"
                                id="voice-edge"
                                onClick={() => onSelectVoiceProvider("edge")}
                            >
                                <div>
                                    <div className="hud-text-base">
                                        🌐 Edge TTS (Free)
                                    </div>
                                    <div
                                        className="hud-text-sm"
                                        style={{
                                            color: "rgba(0, 212, 255, 0.7)",
                                        }}
                                    >
                                        Microsoft Edge voices
                                    </div>
                                </div>
                                <div
                                    className="provider-status connected"
                                    id="edgeVoiceStatus"
                                ></div>
                            </div>

                            {/* ElevenLabs API Key */}
                            <div
                                id="elevenLabsSection"
                                style={{
                                    marginTop: "15px",
                                    display:
                                        currentVoiceProvider === "elevenlabs"
                                            ? "block"
                                            : "none",
                                }}
                            >
                                <div className="hud-text-base mb-2">
                                    ElevenLabs API Key:
                                </div>
                                <input
                                    type="password"
                                    id="elevenLabsApiKey"
                                    className="input-field"
                                    placeholder="Enter your ElevenLabs API key..."
                                />
                                <div
                                    className="hud-text-sm mt-2"
                                    style={{ color: "rgba(0, 212, 255, 0.6)" }}
                                >
                                    Get your API key from:{" "}
                                    <a
                                        href="https://elevenlabs.io/api"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: "#00d4ff",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        ElevenLabs API
                                    </a>
                                </div>

                                {/* ElevenLabs Voice Selection */}
                                <div
                                    id="elevenLabsVoiceSection"
                                    style={{
                                        marginTop: "15px",
                                        display: "none",
                                    }}
                                >
                                    <div className="hud-text-base mb-2">
                                        Select Voice:
                                    </div>
                                    <select
                                        id="elevenLabsVoiceSelect"
                                        className="input-field"
                                    >
                                        <option value="">
                                            Loading voices...
                                        </option>
                                    </select>
                                    <button
                                        className="btn"
                                        id="loadVoicesBtn"
                                        style={{
                                            marginTop: "10px",
                                            padding: "8px 16px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        🔄 Load Voices
                                    </button>
                                    <div
                                        className="hud-text-sm mt-2"
                                        style={{
                                            color: "rgba(0, 212, 255, 0.6)",
                                        }}
                                    >
                                        Current voice:{" "}
                                        <span id="currentVoiceName">
                                            Adam (Professional Male)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Third Column: Internet Search Configuration */}
                    <div className="settings-column">
                        <h3 className="hud-text-lg">
                            🌐 Internet Search Configuration
                        </h3>
                        <div className="settings-section">
                            <div className="hud-text-base mb-3">
                                Search Settings:
                            </div>

                            {/* Search Toggle */}
                            <div
                                className={`provider-option ${
                                    searchEnabled ? "active" : ""
                                }`}
                                id="searchToggle"
                                style={{ cursor: "pointer" }}
                                onClick={onToggleSearch}
                            >
                                <div>
                                    <div className="hud-text-base">
                                        🔍 Internet Search
                                    </div>
                                    <div
                                        className="hud-text-sm"
                                        style={{
                                            color: "rgba(0, 212, 255, 0.7)",
                                        }}
                                    >
                                        Enable real-time web search
                                    </div>
                                </div>
                                <div
                                    className={`provider-status ${
                                        searchEnabled ? "connected" : ""
                                    }`}
                                    id="searchStatus"
                                ></div>
                            </div>

                            {/* Search Method Selection */}
                            <div
                                className="settings-section"
                                id="searchMethodSection"
                            >
                                <div className="hud-text-base mb-2">
                                    Primary Search Method:
                                </div>
                                <select
                                    id="searchMethodSelect"
                                    className="input-field"
                                    style={{ marginBottom: "10px" }}
                                >
                                    <option value="0">
                                        DuckDuckGo Instant Answers (CORS-Safe)
                                    </option>
                                    <option value="1">
                                        Wikipedia API (CORS-Safe)
                                    </option>
                                    <option value="2">
                                        searx.be (SearXNG)
                                    </option>
                                    <option value="3">
                                        searx.tiekoetter.com (SearXNG)
                                    </option>
                                    <option value="4">
                                        searx.work (SearXNG)
                                    </option>
                                </select>
                                <div
                                    className="hud-text-sm mt-2"
                                    style={{ color: "rgba(0, 212, 255, 0.6)" }}
                                >
                                    Current method:{" "}
                                    <span id="currentSearchMethod">
                                        DuckDuckGo Instant Answers
                                    </span>
                                </div>
                                <button
                                    className="btn"
                                    id="testSearchBtn"
                                    style={{
                                        marginTop: "10px",
                                        padding: "8px 16px",
                                        fontSize: "12px",
                                    }}
                                >
                                    🔍 Test All Methods
                                </button>
                            </div>

                            {/* Search Keywords (Info) */}
                            <div className="settings-section">
                                <div className="hud-text-base mb-2">
                                    Auto-Search Triggers:
                                </div>
                                <div
                                    className="hud-text-sm"
                                    style={{
                                        color: "rgba(0, 212, 255, 0.7)",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    Search is automatically triggered by
                                    keywords like:
                                    <br />
                                    <strong>
                                        search, find, what is, current, latest,
                                        news, weather, today, now
                                    </strong>
                                </div>
                                <div
                                    className="hud-text-sm mt-2"
                                    style={{ color: "rgba(255, 165, 0, 0.8)" }}
                                >
                                    💡 Say "test search" to check connection,
                                    "disable search" to turn off
                                </div>
                                <div
                                    className="hud-text-sm mt-1"
                                    style={{ color: "rgba(0, 212, 255, 0.6)" }}
                                >
                                    🔄 Uses DuckDuckGo + Wikipedia + SearXNG
                                    with smart fallback for reliable results
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="settings-section"
                    style={{ textAlign: "center", marginTop: "30px" }}
                >
                    <button
                        className="btn"
                        id="saveSettingsBtn"
                        onClick={onSave}
                    >
                        💾 Save Settings
                    </button>
                    <button className="btn" id="testConnectionBtn">
                        🔍 Test Connection
                    </button>
                    <button
                        className="btn"
                        id="toggleSearchBtn"
                        onClick={onToggleSearch}
                    >
                        🌐 Toggle Search
                    </button>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;
