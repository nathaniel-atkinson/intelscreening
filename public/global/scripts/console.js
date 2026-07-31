console.log("console.js loaded");
import { calendar } from '/global/scripts/clock.js';
import { globalConsts } from "/global/scripts/scripts.js";

const {
    body,
    header,
    nav,
    main,
        main_l,
        main_m,
            frame,
        main_r,
    footer,
    buttons
} = globalConsts;

const {
    updateClock,
    getDate,
    getTime,
    getFullDate
} = calendar;



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

        logContainer.appendChild(document.createElement("hr"));

        firstLog = false;

    }, 75);

    const entry = document.createElement("div");
    entry.className = `log-entry log-${type}`;

    entry.textContent = `${getFullDate()} ${args.map(stringify).join(" ")}`;

    logContainer.appendChild(entry);

    logContainer.scrollTop = logContainer.scrollHeight;
}

["log", "info", "warn", "error", "debug"].forEach(type => {
    const original = console[type];

    console[type] = (...args) => {
        original.call(console, `[${getFullDate()}]`, ...args);
        addLog(type, args);
    };
});

function hookConsole(win) {
    ["log", "info", "warn", "error", "debug"].forEach(type => {
        const original = win.console[type];

        win.console[type] = (...args) => {
            console[type]("[iframe]", ...args);
            original.apply(win.console, args);
        };
    });
}

frame.addEventListener("load", () => {
    hookConsole(frame.contentWindow);
});