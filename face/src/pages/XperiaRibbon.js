import React, { useEffect, useRef, useState } from "react";
import "../stylesheet/CyberAI.css"; // Import your CSS file for styling

const CyberAI = ({ audioSrc }) => {
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const recognition = new (window.SpeechRecognition ||
            window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.start();

        return () => recognition.stop();
    }, []);

    return (
        <div className="siri-container">
            <div className={`wave wave1 ${isListening ? "listening" : ""}`}></div>
            <div className={`wave wave2 ${isListening ? "listening" : ""}`}></div>
            <div className={`wave wave3 ${isListening ? "listening" : ""}`}></div>
        </div>
    );
};
export default CyberAI;
