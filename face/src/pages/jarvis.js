import { useEffect, useRef, useState } from "react";
import { getAudioResponseStream } from "../services/api";
import JarvisListener from "./Activator";
import XperiaRibbon from "./XperiaRibbon";
import { readAloud } from "../services/speaker";
import { tryParseChunk } from "../services/utils";
import { Card, CardBody } from "react-bootstrap";

let fullReply = "";
let speechBuffer = "";
let speechTimer = null;

function Jarvis() {
    const [isLoading, setIsLoading] = useState(false);
    const [reply, setReply] = useState("reply appears here");
    const [replyMode, setReplyMode] = useState("text");
    const [audioSource, setAudioSource] = useState(null);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("booting...");
    const audioRef = useRef(null);
    const [isAllowed, setIsAllowed] = useState({ status: true });



    async function onRecognising(sentence) {
        setQuery(sentence);
        try {
            setStatus("Thinking...");
            setIsAllowed({ status: false });
            setReply("");
            fullReply = "";
            const response = await getAudioResponseStream(sentence, chunk => say(chunk));
            // console.log("response", response.data);
            say(response.data);
            setStatus("Interacting...");
            // setReply(response.data.reply);
        } catch (error) {
            console.error("Error sending audio to server:", error);
        }
    }

    async function say(chunk) {

        const text = tryParseChunk(chunk)?.choices[0]?.delta.content?.replaceAll("*", "").replaceAll("’", "").replaceAll("Jarvis", "Lola");
        if (!text) {
            console.log("No text to read aloud, changing status");
            setStatus("Listening...");
            setIsAllowed({ status: true, speechRecord: true });
            return
        };
        readAloudandReset(text);

        // readAloud(text, { volume: 1, rate: 1, pitch: 1 });
        fullReply = fullReply + text;
        setReply(fullReply);

        speechBuffer += text;
    }

    function readAloudandReset(chunk) {
        readAloud(speechBuffer, onSpeechEnd); // Speak full chunk
        speechBuffer = ""; // Clear buffer
    }

    function onSpeechEnd() {
        console.log("*****************No chunk to read aloud");
        setStatus("Listening...");
        setIsAllowed({ status: true, speechRecord: true });
        setStatus("Listening...");
    }


    function onStart() {
        setStatus("Listening...");
    }

    function onEnd() {
        setStatus("Stopped Listening...");
    }
    function onResult() {
        setStatus("Recognising...");
    }

    function whileSpeaking() {
        // setStatus("Interacting...");
    }

    useEffect(() => {
        const audio = audioRef.current;

        if (audio && audioSource) {
            console.log("playing")
            audio.play();
            setStatus("Interacting...");
        } else {
            console.log("not playing");
        }


        return () => { };
    }, [audioSource]);

    // runs while the player is interacting
    function onHold(status) {
        return { status }
    }


    return (
        <div>
            <Card>
                <Card.Body>

                    {/* <span>Jarvis 0.1 by Pratik</span> <br /> */}
                    Status: <strong>{status}</strong>
                    <br /><br />
                    Reply: <strong>{reply}</strong> <br />

                </Card.Body>
            </Card>
            {/* <XperiaRibbon audioSrc={audioSource || null} /> */}
            <div
            >
                <JarvisListener
                    onRecognising={onRecognising}
                    onStart={onStart}
                    onResult={onResult}
                    onEnd={onEnd}
                    whileSpeaking={whileSpeaking}
                    onHold={onHold}
                    isAllowed={isAllowed}>
                </JarvisListener>

                query: {query} <br />
            </div>
        </div>
    );
}

export default Jarvis;