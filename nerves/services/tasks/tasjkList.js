import { setAlarm } from "./alarms.js";

const taskList = [
    { type: "alarm", name: "someAlarm", alarmTime: "08:00", occurrence: "once", createdOn: "2023-10-01" },
];

export function getTaskList() {
    return taskList;
}

export function addTask(task) {
    taskList.push(task);
    console.log('Task added:', taskList);
}

export function removeTask(taskName) {
    const index = taskList.findIndex(task => task.name === taskName);
    if (index !== -1) {
        taskList.splice(index, 1);
    }
}

export function taskDeligator(taskResponse) {
    console.log('Task Function:', taskResponse);

    switch (taskResponse.task) {
        case "setAlarm":
            return setAlarm(taskResponse.time, taskResponse.days, taskResponse.repeat);
        case "removeAllAlarms":
            removeAllAlarms();
            break;
        case "removeAlarm":
            removeAlarm(taskResponse.name);
            break;
        case "setReminder":
            setReminder(taskResponse.time, taskResponse.days, taskResponse.repeat);
            break;

        case "shutdown":
            console.log("Shutting down the server...");
            process.exit(0); // This will stop the Node.js process
            break;
        default:
            console.log('Unknown task:', taskResponse.task);
    }
}
