import { commands } from './scripts/commands/commands.js';

document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("user-input");
    const terminal = document.getElementById("terminal");
    const output = document.getElementById("output");

    let commandHistory = [];
    let historyIndex = -1;


    // KEY HANDLING (ENTER / ARROW KEYS)
    userInput.addEventListener("keydown", async (event) => {

        // --- ENTER KEY ---
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

        // --- ARROW UP ---
        if (event.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                userInput.value = commandHistory[historyIndex];
            }
            return;
        }

        // --- ARROW DOWN ---
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


    // COMMAND PROCESSOR
    async function processCommand(input) {
        const commandOutput = document.createElement("div");

        if (!input) {
            commandOutput.textContent = "";
            output.appendChild(commandOutput);
            return;
        }

        // Normalize to lowercase for command lookup
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

        // Clear command (returns null)
        if (response === null) {
            output.textContent = "";
        } else {
            commandOutput.textContent = response;
            output.appendChild(commandOutput);
        }

        terminal.scrollTop = terminal.scrollHeight;
    }
});
