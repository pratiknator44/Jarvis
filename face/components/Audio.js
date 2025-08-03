import React, { useState, useRef } from 'react';

// Replace this with your backend API endpoint
const SERVER_URL = "http://yourserver.com/your-endpoint";

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaRecorderRef = useRef(null);

    // Start recording function
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                setAudioChunks((prevChunks) => [...prevChunks, event.data]);
                sendAudioData(event.data);
            };

            mediaRecorderRef.current.start();

            setIsRecording(true);
            console.log("Recording started...");
        } catch (err) {
            console.error("Error accessing the microphone", err);
        }
    };

    // Stop recording function
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log("Recording stopped.");
        }
    };

    // Send audio data over HTTP request
    const sendAudioData = async (audioBlob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');

        try {
            await fetch(SERVER_URL, {
                method: 'POST',
                body: formData,
            });
            console.log("Audio sent to server.");
        } catch (err) {
            console.error("Error sending audio to server", err);
        }
    };

    return (
        <div>
            <h1>Real-time Audio Recorder</h1>
            <button onClick={startRecording} disabled={isRecording}>
                Start Recording
            </button>
            <button onClick={stopRecording} disabled={!isRecording}>
                Stop Recording
            </button>
        </div>
    );
};

export default AudioRecorder;
