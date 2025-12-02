export const commands = {
    help: () => {
        return `
--- Available commands ---
help            - Show available commands
clear           - Clear the terminal
whois           - Show user/system information
cat <file>      - Display contents of a file
ls              - List files in the current directory
open <url>      - Open a webpage in a new tab
main.exe        - Load the main page
`;
    },

    clear: () => {
        return null; // Terminal clears in main.js
    },

    whois: async () => {
        try {
            const browserInfo = getBrowserInfo();
            const osInfo = getOSInfo();
            const userAgent = navigator.userAgent;
            const screenResolution = `${window.screen.width}x${window.screen.height}`;
            const language = navigator.language;
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const pixelRatio = window.devicePixelRatio || "N/A";
            const connectionType = navigator.connection ? navigator.connection.effectiveType : "N/A";
            const cookiesEnabled = navigator.cookieEnabled ? "Yes" : "No";
            const localStorageAvailable = typeof Storage !== "undefined" ? "Yes" : "No";
            const batteryStatus = "Not supported on desktop browsers";
            const deviceMemory = navigator.deviceMemory || "N/A";
            const ipAddress = await getPublicIP();

            return formatWhoisOutput(
                browserInfo,
                osInfo,
                userAgent,
                screenResolution,
                language,
                timezone,
                pixelRatio,
                connectionType,
                batteryStatus,
                deviceMemory,
                cookiesEnabled,
                localStorageAvailable,
                ipAddress
            );
        } catch (error) {
            return `Error retrieving WHOIS information: ${error.message}`;
        }
    },

    cat: async (file) => {
        if (!file) return "Error: Please specify a filename.";

        try {
            const response = await fetch(`/files/${file}`);
            if (!response.ok) throw new Error(`File '${file}' not found.`);
            return await response.text();
        } catch (error) {
            return `Error: ${error.message}`;
        }
    },

    ls: async () => {
        try {
            const response = await fetch('/files.json');
            if (!response.ok) throw new Error('Unable to fetch file list.');
            const files = await response.json();
            return files.join('\n');
        } catch (error) {
            return `Error: ${error.message}`;
        }
    },

    open: (args) => {
        if (!args) return "Error: Please specify a URL.";

        try {
            const validUrl = args.startsWith("http") ? args : `https://${args}`;
            window.open(validUrl, "_blank");
            return `Opening ${validUrl}...`;
        } catch {
            return `Error: Unable to open ${args}`;
        }
    },

    "main.exe": () => {
        const mainUrl = "Main_page/main.html";
        window.location.href = mainUrl;
        return `Redirecting to main page...`;
    },

    unknown: (input) => {
        return `Error: Command '${input}' not found.`;
    }
};

// Helper functions
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Mozilla Firefox";
    if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    if (userAgent.includes("Trident")) return "Internet Explorer";
    if (userAgent.includes("Edge")) return "Microsoft Edge";
    if (userAgent.includes("Chrome")) return "Google Chrome";
    if (userAgent.includes("Safari")) return "Apple Safari";
    return "Unknown Browser";
}

function getOSInfo() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "MacOS";
    if (userAgent.includes("X11")) return "UNIX";
    if (userAgent.includes("Linux")) return "Linux";
    return "Unknown OS";
}

async function getPublicIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip || "Unavailable";
    } catch {
        return "Unable to retrieve IP address";
    }
}

function formatWhoisOutput(
    browser,
    os,
    userAgent,
    screenRes,
    language,
    timezone,
    pixelRatio,
    connection,
    battery,
    memory,
    cookies,
    storage,
    ip
) {
    return `
Browser: ${browser}
OS: ${os}
User Agent: ${userAgent}
Screen Resolution: ${screenRes}
Language: ${language}
Timezone: ${timezone}
Pixel Ratio: ${pixelRatio}
Connection Type: ${connection}
Battery Status: ${battery}
Device Memory: ${memory}
Cookies Enabled: ${cookies}
Local Storage Available: ${storage}
IP Address: ${ip}
`;
}
