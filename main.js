import { commands } from './scripts/commands/commands.js'; 

document.addEventListener("DOMContentLoaded", function () {
    const userInput = document.getElementById("user-input");
    const terminal = document.getElementById("terminal");
    const output = document.getElementById("output");

    let commandHistory = [];
    let historyIndex = -1;

    userInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const inputValue = userInput.value.trim().toLowerCase(); 
            if (inputValue) {
                commandHistory.push(inputValue);
                historyIndex = commandHistory.length;
            }
            processCommand(inputValue);  
            userInput.value = "";  
        } else if (event.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                userInput.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                userInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                userInput.value = "";
            }
        }
    });

    async function processCommand(input) {
        const commandOutput = document.createElement("div");

        const args = input.split(" ");
        const command = args.shift(); 
        const argString = args.join(" "); 

        const response = commands[command] 
            ? await commands[command](argString)  
            : commands.unknown(input);

        if (response === null) {
            output.textContent = "";  
        } else {
            commandOutput.textContent = response;
            output.appendChild(commandOutput);  
        }

        terminal.scrollTop = terminal.scrollHeight; 
    }
});