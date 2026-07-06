const main = document.querySelector("main > div.left");

const defaultPath = "/files/master/master.db";
loadData(defaultPath);

async function fetchData(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Could not load data: ${response.status}`);
    }

    return response.json();
}

async function loadData(path) {
    try {
        const data = await fetchData(path);
        renderData(data);
    } catch (error) {
        console.error(error);
        main.innerHTML = `<p>No data available: ${error}</p>`;
    }
}

function renderData(data, format) {
    if (!format || format === "list") {
        listData(data);
    } else if (format === "card") {
        cardData(data);
    }
}

function listData(data) {
    main.innerHTML = "";

    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
        main.innerHTML = "<p>No data available.</p>";
        return;
    }

    data.data.forEach((item, index) => {
        const entry = document.createElement("div");

        entry.className = "entry";
        entry.dataset.id = index + 1;
        entry.dataset.step = "1";
        entry.dataset.route = item.route;

        entry.textContent = item.name.toUpperCase();

        entry.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            createContextMenu()
        });

        entry.addEventListener("click", () => {
            expandListItem(entry);
        });

        main.appendChild(entry);
    });
}

function cardData(data) {
    listData(data);
}

async function expandListItem(parent) {

    // Collapse
    if (parent.classList.contains("expanded")) {

        parent.classList.remove("expanded");

        const parentId = parent.dataset.id;

        document.querySelectorAll(".entry").forEach(entry => {
            if (entry.dataset.id.startsWith(parentId + ".")) {
                entry.remove();
            }
        });

        return;
    }

    // Expand
    try {

        parent.classList.add("expanded");

        const payload = await fetchData(parent.dataset.route);

        let insertAfter = parent;

        payload.data.forEach((item, index) => {

            const child = document.createElement("div");

            child.className = "entry sublist";

            child.dataset.parent = parent.dataset.id;
            child.dataset.id = `${parent.dataset.id}.${index + 1}`;
            child.dataset.step = Number(parent.dataset.step) + 1;
            child.dataset.route = item.route;

            child.style.textIndent =
                `${Number(child.dataset.step) * 0.25}in`;

            child.textContent = item.name.toUpperCase();

            child.addEventListener("click", (event) => {
                event.stopPropagation();
                expandListItem(child);
            });

            child.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                createContextMenu(child)
            });

            insertAfter.after(child);
            insertAfter = child;

        });

    } catch (error) {

        console.error(error);
        const em = document.createElement("span");
        em.innerHTML=`<i>Unable to load selected data.</i>`

        if (!em) {
            parent.appendChild(em);
        } else {
            em.remove();
        }
        

    }
}

function createContextMenu(entry) {
    
}

