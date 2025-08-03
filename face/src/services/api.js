import { Constants } from "../Constants";
import axiosInstance from "./interceptor";

export function getTextToSpeech(formData) {
    return axiosInstance.post('/speech-text/transcribe', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export function sendSimpleChatQuery(message) {
    return fetch('http://localhost:3001/query/', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function streamTextResponse(formData, setReply, setIsLoading) {
    const res = await fetch("http://localhost:3001/speech-text/transcribe", {
        method: 'POST',
        body: formData,
    });

    if (!res.body) {
        console.error('No stream received');
        setIsLoading(false);
        return;
    }

    console.log("started gettin response stream");
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setReply(prev => prev + chunk);
    }
}

export async function streamAudioResponse(formData, setAudioSource, setIsLoading) {
    const response = await fetch("http://localhost:3001/speech-text/transcribe-audio", {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        console.error('Failed to fetch audio');
        return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.play();
    setAudioSource(audioUrl);
}

export async function getAudioResponseStream(sentence, onChunk) {
    const response = await fetch("http://localhost:3001/speech-text/transcribe-stream", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Allow-Cross-Origin-Requests": "true"
        },
        body: JSON.stringify({ sentence: sentence.toLowerCase().replaceAll(Constants.CALL_SIGN_LOWER, "gemma") })
    });


    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let reply = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Parse SSE-style chunk (if your server uses it)
        chunk.split("\n").forEach(line => {
            if (line.startsWith("data: ")) {
                const text = line.replace("data: ", "").trim();
                if (text && text !== "[DONE]") {
                    reply += text;
                    onChunk(text); // 👈 Callback for every streamed bit
                }
            }
        });
    }

    return reply;
}

// if (!response.ok) {
//     console.error('Failed to fetch audio');
//     return;
// }

// const audioBlob = await response.blob();
// const audioUrl = URL.createObjectURL(audioBlob);

// // const audio = new Audio(audioUrl);
// // audio.play();
// setAudioSource(audioUrl);
// }

export function getTextResponse(message) {
    return axiosInstance.post("/query", { message });
}