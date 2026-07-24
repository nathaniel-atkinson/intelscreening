const logContainer = document.getElementById("log");

let separatorTimer = null;
let firstLog = true;

function stringify(value) {
    if (value instanceof Error) {
        return value.stack || value.message;
    }

    if (typeof value === "object" && value !== null) {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    return String(value);
}

function addLog(type, args) {

    // Restart separator timer
    clearTimeout(separatorTimer);

    separatorTimer = setTimeout(() => {

        if (!firstLog) {
            logContainer.appendChild(document.createElement("hr"));
        }

        firstLog = false;

    }, 75);

    const entry = document.createElement("div");
    entry.className = `log-entry log-${type}`;

    entry.textContent = args
        .map(stringify)
        .join(" ");

    logContainer.appendChild(entry);

    logContainer.scrollTop = logContainer.scrollHeight;
}

["log", "info", "warn", "error", "debug"].forEach(type => {

    const original = console[type];

    console[type] = (...args) => {

        // Normal browser console
        original.apply(console, args);

        // Custom log window
        addLog(type, args);

    };
});