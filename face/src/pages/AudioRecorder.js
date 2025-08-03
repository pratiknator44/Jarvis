import React, { useRef, useState } from 'react';

const AudioRecorder = ({ onSend }) => {
    const mediaRecorderRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [chunks, setChunks] = useState([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;
        setChunks([]);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                setChunks((prev) => [...prev, event.data]);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.wav');

            if (onSend) {
                onSend(formData); // You can pass formData back to parent
            }
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="p-4 border rounded-md shadow-md max-w-sm mx-auto">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-md text-white ${isRecording ? 'bg-red-500' : 'bg-green-500'
                    }`}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
        </div>
    );
};

export default AudioRecorder;
