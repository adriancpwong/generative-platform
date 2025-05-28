import React from "react";

interface HUDProps {
    isInitialized: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    currentProvider: string;
    currentVoiceProvider: string;
    searchEnabled: boolean;
    conversationActive: boolean;
    showSettings: boolean;
    toggleSettings: () => void;
    updateStatus: (type: string, status: string, text: string) => void;
    updateProviderDisplay: () => void;
}

const HUD: React.FC<HUDProps> = ({
    isInitialized,
    isListening,
    isSpeaking,
    currentProvider,
    currentVoiceProvider,
    searchEnabled,
    conversationActive,
    showSettings,
    toggleSettings,
    updateStatus,
    updateProviderDisplay,
}) => {
    return (
        <>
            {/* Status Panel */}
            <div className="status-panel hud-element">
                <div className="guru-font hud-text-lg glow mb-2">GURU</div>
                <div className="hud-text-sm mb-1">
                    <span
                        id="systemsStatus"
                        className="status-dot status-online"
                    ></span>
                    <span id="systemsStatusText">Systems Online</span>
                </div>
                <div className="hud-text-sm mb-1">
                    <span
                        id="aiStatus"
                        className="status-dot status-online"
                    ></span>
                    <span id="aiStatusText">AI Online (Local)</span>
                </div>
                <div className="hud-text-sm">
                    <span
                        id="audioStatus"
                        className="status-dot status-listening"
                    ></span>
                    <span id="audioStatusText">Listening...</span>
                </div>
            </div>

            {/* System Info */}
            <div className="system-info hud-element">
                <div className="guru-font hud-text-lg glow mb-2">
                    SYSTEM STATUS
                </div>
                <div className="hud-text-sm">
                    Uptime: <span id="uptime">00:00:00</span>
                </div>
                <div className="hud-text-sm">
                    Provider: <span id="aiProvider">Local</span>
                </div>
                <div className="hud-text-sm">
                    Model: <span id="aiModel">llama3.2</span>
                </div>
                <div className="hud-text-sm">
                    Latency: <span id="latency">-- ms</span>
                </div>
                <div className="hud-text-sm">
                    Memory: <span id="memoryStatus">Ready</span>
                </div>
                <div className="hud-text-sm">
                    Search: <span id="searchStatusDisplay">Enabled</span>
                </div>
                <div className="hud-text-sm">
                    CPU: <span id="cpuUsage">-- %</span>
                </div>
            </div>

            {/* Connection Status */}
            <div
                id="connectionPanel"
                className="connection-status hud-element"
                style={{ display: "none" }}
            >
                <div className="hud-text-sm">🔗 Connecting to AI...</div>
            </div>

            {/* Wake Word Indicator */}
            <div id="wakeIndicator" className="wake-indicator">
                <div className="guru-font hud-text-xl glow-strong mb-2">
                    GURU ACTIVATED
                </div>
                <div className="hud-text-base">Listening for commands...</div>
            </div>

            {/* Subtitle Panel */}
            <div id="subtitlePanel" className="subtitle-panel">
                <div id="subtitleText" className="subtitle-text"></div>
            </div>

            {/* Audio Visualization */}
            <div className="audio-viz-corner hud-element">
                <div className="hud-text-sm mb-2 text-center">AUDIO</div>
                <div
                    id="audioViz"
                    className="flex items-end justify-center h-8"
                >
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="audio-bar"></div>
                    ))}
                </div>
            </div>

            {/* Settings Hint */}
            <div className="settings-hint">
                Press <strong>Ctrl+Alt+S</strong> for settings
            </div>

            {/* Interaction Hint */}
            <div className="interaction-hint">
                <div className="hud-text-sm mb-1">
                    🎮 <strong>Visualizer Controls:</strong>
                </div>
                <div className="hud-text-sm">Mouse: Drag to rotate</div>
                <div className="hud-text-sm">Wheel: Zoom in/out</div>
                <div className="hud-text-sm">Touch: Pinch & drag</div>
            </div>
        </>
    );
};

export default HUD;
