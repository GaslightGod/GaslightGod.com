export const commands = {
    help: () => {
        return `
--- Available commands: ---
help - Show available commands
clear - Clear the terminal
whois - Show user/system information
cat <file> - Display the content of a file
ls - Display files in the current working directory
open <url> - Open a webpage in a new tab
main.exe - Loads the main page
`;
    },

    clear: () => {
        return null;
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
            const localStorageAvailable = typeof(Storage) !== "undefined" ? "Yes" : "No";
            const batteryStatus = "Battery Status is Not Supported on Desktop";
            const deviceMemory = navigator.deviceMemory || "N/A";

            const ipAddress = await getPublicIP();
            return formatWhoisOutput(browserInfo, osInfo, userAgent, screenResolution, language, timezone, pixelRatio, connectionType, batteryStatus, deviceMemory, cookiesEnabled, localStorageAvailable, ipAddress);
        } catch (error) {
            return `Error retrieving WHOIS information: ${error.message}`;
        }
    },

    cat: async (file) => {
        if (!file) return "Error: Please specify a filename.";

        try {
            const response = await fetch(`/files/${file}`);
            if (!response.ok) throw new Error(`File '${file}' not found.`);
            const content = await response.text();
            return content;
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
        if (!args) return "Error: Please specify a URL";

        try {
            const validUrl = args.startsWith("http") ? args : `https://${args}`;
            window.open(validUrl, "_blank");
            return `Opening ${validUrl}...`;
        } catch (error) {
            return `Error: Unable to open ${args}`;
        }
    },

'main.exe': () => {
        const mainUrl = "Main_page/main.html"; 
        window.location.href = mainUrl; 
        return `Redirecting to main page...`;
    },

    unknown: (input) => {
        return `Error: Command '${input}' not found.`;
    },

};

function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
        browserName = "Samsung Internet";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        browserName = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
        browserName = "Microsoft Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Microsoft Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Google Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Apple Safari";
    }
    return browserName;
}

function getOSInfo() {
    const userAgent = navigator.userAgent;
    let osName = "Unknown";
    if (userAgent.indexOf("Win") > -1) {
        osName = "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
        osName = "MacOS";
    } else if (userAgent.indexOf("X11") > -1) {
        osName = "UNIX";
    } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
    }
    return osName;
}

async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return "Unable to retrieve IP address";
    }
}

function formatWhoisOutput(browserInfo, osInfo, userAgent, screenResolution, language, timezone, pixelRatio, connectionType, batteryStatus, deviceMemory, cookiesEnabled, localStorageAvailable, ipAddress) {
    return `
        Browser: ${browserInfo}
        OS: ${osInfo}
        User Agent: ${userAgent}
        Screen Resolution: ${screenResolution}
        Language: ${language}
        Timezone: ${timezone}
        Pixel Ratio: ${pixelRatio}
        Connection Type: ${connectionType}
        Battery Status: ${batteryStatus}
        Device Memory: ${deviceMemory}
        Cookies Enabled: ${cookiesEnabled}
        Local Storage Available: ${localStorageAvailable}
        IP Address: ${ipAddress}
    `;
}