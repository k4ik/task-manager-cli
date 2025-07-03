import { Task } from "./types";
import * as fs from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "tasks.json");

function loadTasks(): Array<Task>{
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]", "utf-8");
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

function saveTasks(tasks: Array<Task>): void {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), "utf-8");
}

let tasks: Array<Task> = loadTasks();
let nextId: number = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

export function createTask(label: string, status: boolean = false): void {
    let newTask: Task = { id: nextId++, task: label, status }
    tasks.push(newTask);
    saveTasks(tasks);
}

export function getTasks(): void {
    if(tasks.length === 0) {
        console.log("No tasks found");
    } else {
        tasks.forEach(task => {
            console.log(`#${task.id} ${task.task} [${task.status ? 'finished' : 'pending'}]`);
        });
    }
}

export function editTask(id: number, updates: { label?: string; status?: boolean } ): void {
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
        console.log("Task not found");
        return;
    }

    if (updates.label !== undefined) task.task = updates.label;
    if (updates.status !== undefined) task.status = updates.status;

    saveTasks(tasks);
}

export function deleteTask(id: number): void {
    const index = tasks.findIndex(task => task.id === id);
    if(index === -1) {
        console.log("Task not found");
    } else {
        tasks.splice(index, 1);
        saveTasks(tasks);
    }
}