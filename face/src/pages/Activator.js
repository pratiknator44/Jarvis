import React, { useEffect } from "react";
import { Constants } from "../Constants";

const JarvisListener = ({ onRecognising, onStart, onResult, onEnd, isAllowed }) => {

    useEffect(() => {
        if (onStart) { onStart(); }
        const recognition = new (window.SpeechRecognition ||
            window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log("Heard:", transcript);

            if (transcript.toLowerCase().includes(Constants.CALL_SIGN_LOWER) && !isAllowed.status) {
                console.log("Jarvis cancelled");
                window.speechSynthesis.cancel(); // Stop any ongoing speech
                return;
            }

            if (transcript.toLowerCase().includes(Constants.CALL_SIGN_LOWER) && isAllowed.status) {
                if (onResult) { onResult(); }
                if (onRecognising) {
                    onRecognising(transcript);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event);
        };

        recognition.start();

        return () => {
            recognition.stop();
            if (onEnd) { onEnd(); }
        };
    }, []);

    return (
        <div className="border p-3">
            <span>Say "Jarvis" {JSON.stringify(isAllowed.status)}</span>
        </div>
    );
};

export default JarvisListener;
