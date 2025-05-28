import { useEffect, useRef } from "react";
import NeuralNetworkVisualizer from "./components/NeuralNetworkVisualizer";
import HUD from "./components/HUD";
import "./styles/style.css";
import SettingsPanel from "./components/SettingsPanel";
import useJarvisAI from "./hooks/useJarvisAI";

function Jarvis() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {
        isInitialized,
        isListening,
        isSpeaking,
        currentProvider,
        currentVoiceProvider,
        searchEnabled,
        conversationActive,
        showSettings,
        toggleSettings,
        saveSettings,
        selectProvider,
        selectVoiceProvider,
        toggleSearch,
        speak,
        stopSpeech,
        startListening,
        stopListening,
        updateStatus,
        updateProviderDisplay,
    } = useJarvisAI(canvasRef);

    useEffect(() => {
        // Handle keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                // e.ctrlKey &&
                // e.altKey &&
                e.key === "s"
            ) {
                console.log("Settings toggled via keyboard shortcut");
                e.preventDefault();
                toggleSettings();
            }
            if (e.key === "Escape" && !isSpeaking) {
                toggleSettings();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isSpeaking, toggleSettings]);

    return (
        <div className="hud-overlay">
            <NeuralNetworkVisualizer ref={canvasRef} />
            <HUD
                isInitialized={isInitialized}
                isListening={isListening}
                isSpeaking={isSpeaking}
                currentProvider={currentProvider}
                currentVoiceProvider={currentVoiceProvider}
                searchEnabled={searchEnabled}
                conversationActive={conversationActive}
                showSettings={showSettings}
                toggleSettings={toggleSettings}
                updateStatus={updateStatus}
                updateProviderDisplay={updateProviderDisplay}
            />
            <SettingsPanel
                show={showSettings}
                onClose={toggleSettings}
                onSave={saveSettings}
                currentProvider={currentProvider}
                currentVoiceProvider={currentVoiceProvider}
                searchEnabled={searchEnabled}
                onSelectProvider={selectProvider}
                onSelectVoiceProvider={selectVoiceProvider}
                onToggleSearch={toggleSearch}
            />
        </div>
    );
}

export default Jarvis;
