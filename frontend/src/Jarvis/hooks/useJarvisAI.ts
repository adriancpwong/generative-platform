import { useEffect, useState, useCallback } from "react";
import GuruAdvancedSearchEngine from "../utils/GuruAdvancedSearchEngine";

interface JarvisAIHook {
    isInitialized: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    currentProvider: string;
    currentVoiceProvider: string;
    searchEnabled: boolean;
    conversationActive: boolean;
    showSettings: boolean;
    toggleSettings: () => void;
    saveSettings: () => void;
    selectProvider: (provider: string) => void;
    selectVoiceProvider: (voice: string) => void;
    toggleSearch: () => void;
    speak: (text: string, isInitial?: boolean) => void;
    stopSpeech: () => void;
    startListening: () => void;
    stopListening: () => void;
    updateStatus: (type: string, status: string, text: string) => void;
    updateProviderDisplay: () => void;
}

const useJarvisAI = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>
): JarvisAIHook => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentProvider, setCurrentProvider] = useState("gemini-2.0-flash");
    const [currentVoiceProvider, setCurrentVoiceProvider] =
        useState("elevenlabs");
    const [searchEnabled, setSearchEnabled] = useState(true);
    const [conversationActive, setConversationActive] = useState(false);
    const [showSettings, setShowSettings] = useState(true);
    const [advancedSearchEngine] = useState(new GuruAdvancedSearchEngine());

    const toggleSettings = useCallback(() => {
        setShowSettings((prev) => !prev);
        console.log(`Settings toggled: ${!showSettings}`);
    }, []);

    const saveSettings = useCallback(() => {
        console.log("Settings saved");
        // Implement actual save logic here
    }, []);

    const selectProvider = useCallback((provider: string) => {
        setCurrentProvider(provider);
    }, []);

    const selectVoiceProvider = useCallback((voice: string) => {
        setCurrentVoiceProvider(voice);
    }, []);

    const toggleSearch = useCallback(() => {
        setSearchEnabled((prev) => {
            advancedSearchEngine.toggleSearch();
            return !prev;
        });
    }, [advancedSearchEngine]);

    const speak = useCallback(
        (text: string, isInitial = false) => {
            if (isSpeaking && !isInitial) return;
            setIsSpeaking(true);
            console.log(`Speaking: ${text}`);
            // Implement actual speech logic here
        },
        [isSpeaking]
    );

    const stopSpeech = useCallback(() => {
        setIsSpeaking(false);
        console.log("Speech stopped");
        // Implement actual stop speech logic here
    }, []);

    const startListening = useCallback(() => {
        setIsListening(true);
        console.log("Started listening");
        // Implement actual listening logic here
    }, []);

    const stopListening = useCallback(() => {
        setIsListening(false);
        console.log("Stopped listening");
        // Implement actual stop listening logic here
    }, []);

    const updateStatus = useCallback(
        (type: string, status: string, text: string) => {
            console.log(`Status updated: ${type} - ${status} - ${text}`);
            // Implement actual status update logic here
        },
        []
    );

    const updateProviderDisplay = useCallback(() => {
        console.log("Provider display updated");
        // Implement actual provider display update logic here
    }, []);

    useEffect(() => {
        // Initialize the AI system
        const initialize = async () => {
            console.log("Initializing JARVIS AI...");
            // Simulate initialization
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsInitialized(true);
            startListening();
        };

        initialize();

        return () => {
            // Cleanup
            stopListening();
            stopSpeech();
        };
    }, [startListening, stopListening, stopSpeech]);

    return {
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
    };
};

export default useJarvisAI;
