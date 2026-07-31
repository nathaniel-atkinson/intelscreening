const clock = document.getElementById("clock");

function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    let time = `${hours}:${minutes}:${seconds}`;
    clock.textContent = time;

    return time;
}

updateClock();              // Show immediately
setInterval(updateClock, 1000);

function getTime() {
    let time = updateClock();
    return time;
}

function getDate() {
    const today = new Date();

    let years = today.getFullYear();
    let monthIndex = today.getMonth()
    let months = getMonth(monthIndex);
    let days = today.getDate();

    let date = `${days} ${months} ${years}`;
    return date;
}

let data;

await initialiseClock();
async function initialiseClock() {
    try {
        const response = await fetch('/global/scripts/months.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        data = await response.json();
        
    } catch (err) {
        console.error(err);
        return "";
    }
}

function getMonth(index) {
    return data.months[index].short;
}

function getFullDate() {
    let date = getDate();
    let time = getTime();

    let loggedtime = `${date} [${time}]`;
    
    return loggedtime;
}

export const calendar = { 
    updateClock,
    getTime,
    getDate,
    getFullDate
};