import { addTask } from "./tasjkList.js";

export function setAlarm(time, occurrence) {

    if (!occurrence) {
        occurrence = "once";
    }

    addTask({
        type: "alarm",
        name: `alarm-${Date.now()}`,
        alarmTime: time,
        occurrence,
        createdOn: new Date().toISOString()
    });

    return `Alarm has been set and will go off at ${time} with occurrence: ${occurrence}`;
}