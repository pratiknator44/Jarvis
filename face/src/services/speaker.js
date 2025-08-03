const voices = window.speechSynthesis.getVoices();

let speechQueue = [];
let speaking = false;

export function readAloud(sentence, onSpeechEnd) {
    speechQueue.push(sentence);
    console.log("typeof ", typeof onSpeechEnd);
    processSpeechQueue(onSpeechEnd);
}

function processSpeechQueue(onSpeechEnd = () => { }) {     // chunk array runs 1 after another automatically
    if (speaking || speechQueue.length === 0) {
        console.log("speech queue empty now", speechQueue.length);
        if (speechQueue.length === 0) {
            console.log("typeof ", typeof onSpeechEnd);
            console.warn("No speech in queue ", onSpeechEnd);
            onSpeechEnd();
        }
        return;
    }

    speaking = true;

    const sentence = speechQueue.join(" ");
    speechQueue = []; // clear queue after combining

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 1;
    utterance.onend = () => {
        console.warn("chunk ended ");
        speaking = false;
        processSpeechQueue(); // check for next batch
    };

    window.speechSynthesis.speak(utterance);
}
