#!/usr/bin/env node

import readline from "readline";
import { createTask, getTasks, deleteTask, editTask } from "./utils";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question: string): Promise<string> =>
  new Promise((resolve) => rl.question(question, resolve));

async function showMenu(): Promise<void> {
  console.log(`
[1] Show tasks
[2] Create task
[3] Edit task
[4] Delete task
[5] Exit
  `);

  const option = await ask("Choose an option: ");
  await handleOption(option.trim());
}

async function handleOption(option: string): Promise<void> {
  switch (option) {
    case "1":
      getTasks();
      break;

    case "2":
      await handleCreateTask();
      break;

    case "3":
      await handleEditTask();
      break;

    case "4":
      await handleDeleteTask();
      break;

    case "5":
      rl.close();
      return;

    default:
      console.log("Invalid option!");
  }

  returnToMenu();
}

async function handleCreateTask(): Promise<void> {
  const label = await ask("Label: ");
  if (!label.trim()) {
    console.log("Label cannot be empty.");
    return;
  }
  createTask(label.trim());
  console.log("✅ Task created successfully!");
}

async function handleEditTask(): Promise<void> {
  const idStr = await ask("Task ID: ");
  const id = parseInt(idStr);
  if (isNaN(id)) return console.log("Invalid ID.");

  const label = await ask("New label (or Enter to keep): ");
  const statusStr = await ask("New status (true/false or Enter to keep): ");
  const status = statusStr !== "" ? statusStr === "true" : undefined;

  editTask(id, {
    label: label !== "" ? label : undefined,
    status
  });

  console.log("✏️ Task edited.");
}

async function handleDeleteTask(): Promise<void> {
  const idStr = await ask("Task ID to delete: ");
  const id = parseInt(idStr);
  if (isNaN(id)) return console.log("Invalid ID.");
  deleteTask(id);
  console.log("🗑️ Task deleted.");
}

function returnToMenu() {
  setTimeout(() => {
    showMenu();
  }, 500);
}

showMenu();
