import { commands } from './scripts/commands/commands.js';

document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("user-input");
    const terminal = document.getElementById("terminal");
    const output = document.getElementById("output");
    const promptEl = document.getElementById("prompt");

    // Dynamic shell prompt state
    let username = "guest";
    let hostname = "gaslightgod";
    let currentDirectory = "~";

    function updatePrompt() {
        promptEl.textContent = `${username}@${hostname}:${currentDirectory}$ `;
    }

    updatePrompt();

    let commandHistory = [];
    let historyIndex = -1;

userInput.addEventListener("keydown", async (event) => {

    // TAB AUTOCOMPLETE
    if (event.key === "Tab") {
        event.preventDefault();

        const current = userInput.value.toLowerCase();
        if (!current) return;

        const availableCommands = Object.keys(commands);

        let fileList = [];
        try {
            const res = await fetch("/files.json");
            fileList = await res.json();
        } catch {}

        const autocompletePool = [...availableCommands, ...fileList];
        const matches = autocompletePool.filter(item => item.startsWith(current));

        if (matches.length === 1) {
            userInput.value = matches[0];
        }

        return;
    }

    // ENTER KEY
    if (event.key === "Enter") {
        event.preventDefault();
        const rawInput = userInput.value.trim();

        if (rawInput !== "") {
            commandHistory.push(rawInput);
            historyIndex = commandHistory.length;
        }

        await processCommand(rawInput);
        userInput.value = "";
        return;
    }

    // ARROW UP
    if (event.key === "ArrowUp") {
        if (historyIndex > 0) {
            historyIndex--;
            userInput.value = commandHistory[historyIndex];
        }
        return;
    }

    // ARROW DOWN
    if (event.key === "ArrowDown") {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            userInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            userInput.value = "";
        }
        return;
    }
});

    async function processCommand(input) {

        // Print prompt + command (like real Bash)
        const inputLine = document.createElement("div");
        inputLine.textContent = `${promptEl.textContent}${input}`;
        output.appendChild(inputLine);

        const commandOutput = document.createElement("div");

        if (!input) {
            commandOutput.textContent = "";
            output.appendChild(commandOutput);
            return;
        }

        const tokens = input.toLowerCase().split(" ");
        const command = tokens.shift();
        const argString = tokens.join(" ");

        let response;

        try {
            if (commands[command]) {
                response = await commands[command](argString);
            } else {
                response = commands.unknown(input);
            }
        } catch (err) {
            response = `Error executing command '${command}': ${err.message}`;
        }

        if (response === null) {
            output.textContent = "";
        } else {
            commandOutput.textContent = response;
            output.appendChild(commandOutput);
        }

        terminal.scrollTop = terminal.scrollHeight;
    }
});
