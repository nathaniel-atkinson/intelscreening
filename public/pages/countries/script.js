const main = document.querySelector("main > div.left");
const mainActual = document.querySelector("main");
const nav = document.querySelector("nav");
const tabs = document.querySelector(".tabsContainer");

async function fetchData() {
    const file = '/files/countries/intel.db';
    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`Could not load data: ${response.status}`)
    }

    return response.json();
}

async function loadData() {
    try {
        const data = await fetchData();
        renderData(data);
    } catch (error) {
        console.error(error);
        main.innerHTML = `<p>No country data available: <i>${error}</i></p>`;
    }
}

loadData();

function renderData(data, format) {
    if (!format || format === 'list') {
        listData(data);
    } else if (format === 'card') {
        cardData(data);
    }
}

function listData(data) {
    main.innerHTML = '';

    if (data.data.length === 0) {
        main.innerHTML = '<p>No country data available.</p>';
        return;
    }

    const countries = data.data;
    countries.forEach((country) => {
        const list = document.createElement('div');
        list.classList.add('list');

        list.addEventListener("click", () => {
            openPage(country);
        })

        const label = country.name || country.item || country.country || 'Unknown country';
        const text = label.toUpperCase();
        list.innerHTML = `<span>${text}</span>`;
        main.appendChild(list);
    });
}

function cardData(data) {
    listData(data);
}

//--INSERT-SECONDARY-MENU-BAR---

mainActual.style.top="100px";



function openPage(entry) {
    const main_right = document.querySelector("main .right");
    main_right.innerHTML = "";

    const page = document.createElement("table");
    page.classList.add("page");

    page.innerHTML=`
        <tr>
            <th>KEY</th>
            <th>VALUE</th>
        </tr>
    `;

        Object.entries(entry).forEach(([key, value]) => {
            const row = document.createElement("tr");
            row.innerHTML += `
                <td><strong>${key}</strong>: </td>
                <td>${value}</td><br>
            `;

            page.appendChild(row);
        })

    main_right.appendChild(page);

}

const toolbar = document.querySelector("header");
const buttons = toolbar.querySelectorAll("input[type='button']");

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.value === "hide") hideToolBar();
    })
});

function hideToolBar() {
    toolbar.style.display = "none";
    mainActual.style.top = "50px";

    const expand = document.createElement("span");
    expand.textContent = "V";

    expand.addEventListener("click", () => {
        toolbar.style.display = "grid";
        mainActual.style.top = "100px"
        expand.remove();

        
    })

    tabs.appendChild(expand);
}