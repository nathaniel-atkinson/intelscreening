const body = document.querySelector("body");
const nav = document.querySelector("nav");

const tabsContainer = document.querySelector(".tabsContainer");

const main_right = document.querySelector("main .right");
const main_left = document.querySelector("main .left");

//--FETCH DATA---()
async function fetchData() {
    const response = await fetch("/api/data/pages");

    if (!response.ok) throw new Error(`Could not fetch data:${response.status}`)
    
    return response.json();
}

//--LOAD DATA---(FETCH DATA)
async function loadData() {
    try {
        const data = await fetchData();
        renderData(data);
    } catch(error) {
        console.error(error);
        main_right.innerHTML=`<p>Could not load data: <b>${error}</b>`;
    }
}

loadData();

function renderData(data) {
    if (!Array.isArray(data.data)) {
        throw new Error("Invalid page data.");
    }

    data.data.forEach(createTab);
}

const currentPath = window.location.pathname;

function createTab(page) {
    const tab = document.createElement("span");

    tab.classList.add("tab");
    tab.classList.add("button");
    tab.textContent = page.name;

    if (window.location.pathname === page.path) {
        tab.classList.add("active");
    }

    tab.addEventListener("click", () => {
        location.assign(page.path);
    })

    if (currentPath === page.path) {
        tab.classList.add("active");
    }
    
    tabsContainer.appendChild(tab);
}