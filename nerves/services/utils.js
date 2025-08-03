import axios from 'axios';
import { Constants } from '../constants.js'; // Make sure constants.js also uses `export default`

export function LMRequest(query) {
    return axios({
        method: 'post',
        url: Constants.MODEL_URL,
        data: {
            model: Constants.MODEL_GEMMA3,
            messages: [
                {
                    role: 'system',
                    content: `decide whether user wants to do a task or just wanna chat. For regular chat not involving any task, reply {"response": "Chat"} only. Otherwise, return in this pattern: {"response": "Task", "task": "setAlarm", "time": "<time in HH:mm>", "days": ["Mo" | "Tu" | "We"| "Th"| "Fr"| "Sa"|"Su"], "repeat": true | false}, {"response": "Task", "task": "removeAllAlarms"}, {"response": "Task", "task": "removeAlarm", "name": "<alarm name>"}, {"response":"Task", "task": "setReminder", "time": "<time in HH:mm>", "days": ["Mo" | "Tu"| "We" | "Th", "Fr"| "Sa"| "Su"], "repeat": true | false} etc. if user asks to shut down or self kill or relative, return {"response": "Shutdown"} Current timestamp: ${new Date()}`
                },
                { role: 'user', content: query }
            ],
            temperature: 0.5,
            max_tokens: 200
        },
        headers: {
            'Content-Type': 'application/json'
        },
        responseType: 'json'
    });
}
