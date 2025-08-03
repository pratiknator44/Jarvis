import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import { ElevenLabsClient } from "elevenlabs";

// import { Constants } from "../constants";
const client = new ElevenLabsClient();

async function getVoiceForText(text) {

    try {
        const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
        return client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
            output_format: "mp3_44100_128",
            text,
            model_id: "eleven_multilingual_v2"
        });
    } catch (error) {
        console.error('Error calling ElevenLabs API:', error);
    }
}

export default getVoiceForText;