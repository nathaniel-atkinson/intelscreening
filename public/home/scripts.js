import {globalConsts} from "/api/global/scripts";

const {body, main_M, main, nav, header, footer, main_L, main_R} = globalConsts;

const mainMenu = main_L;
const buttons = mainMenu.querySelectorAll(".button");

buttons.forEach(button => {
    const action = button.dataset.actionTarget;

    button.addEventListener("click", async (e) => {
        await createMenu(action, e, button);
    })
})

async function createMenu(action, e, button) {
    let menu = document.querySelector(`#${action}`);

    closeOtherMenus(action);

    const rect = button.getBoundingClientRect();
    const {top, left, right, bottom, width, height, x, y} = rect;

    if (!menu) {
        menu = document.createElement("div");
        menu.classList.add("temp");
        menu.id = action;//-IDENTITY
        menu.style.position = "fixed";
        menu.style.left = `${right + 10}px`
        menu.style.top = `${top}px`
        menu.style.zIndex = 100;
        menu.style.backgroundColor = "var(--bg)";
        menu.style.color = "var(--color)";
        menu.style.border = "3px solid var(--border)";
        menu.style.width = "fit-content";
        menu.style.height = "fit-content";
        menu.style.padding = "10px";

        await populateMenu(menu, action, button);
        body.appendChild(menu);
        button.classList.add("active");

    } else {
        menu.remove();
        button.classList.remove("active");
    }
}

function closeOtherMenus(action) {
    buttons.forEach(button => {
        const menuId = button.dataset.actionTarget;

        if (menuId !== action) {
            document.querySelector(`#${menuId}`)?.remove();
            button.classList.remove("active");
        }
    })
}

async function populateMenu(menu, action, button) {
    if (action === "createMenu") {
        const response = await fetch('/api/database/test');
        const directory = await response.json();

        if (directory.exists === true) {
            menu.innerHTML =`
                <span class="underlined bold">OPTIONS</span>
                <p>Database</p>
                <p>Database Table</p>
                <p>Database Table Record</p>
            `;
        } else { 
            menu.innerHTML =`
                <span class="underlined bold">OPTIONS</span>
                <p id="createDirectory">Create Directory()</p>
            `;
        }

        menu.querySelectorAll("p").forEach(i => {i.classList.add("button");})
        menu.querySelector("#createDirectory")?.addEventListener("click", createDirectory);
    }

    if (action === "deleteMenu") {
        const response = await fetch('/api/database/test');
        const directory = await response.json();

        if (directory.exists === true) {
            menu.innerHTML =`
                <span class="underlined bold">OPTIONS</span>
                <p id="deleteDirectory">Delete Directory()</p>
            `;
        } else {
            menu.innerHTML =`
                <span class="underlined bold">OPTIONS</span>
                <p>No Directory Found</p>
            `;
        }

        menu.querySelectorAll("p").forEach(i => {i.classList.add("button");})
        menu.querySelector("#deleteDirectory")?.addEventListener("click", deleteDirectory);
    }
}

async function createDirectory() {
    const response = await fetch('/api/database/createdirectory', {
        method: 'POST'
    });
    const directory = await response.json();

    if (directory.created) {
        document.querySelector("#createMenu")?.remove();
        document.querySelector("#createButton")?.classList.remove("active");
    }
}

async function deleteDirectory() {
    const response = await fetch('/api/database/deleteDirectory', {
        method: 'POST'
    });
    const directory = await response.json();

    if (directory.deleted) {
        document.querySelector("#deleteMenu")?.remove();
        document.querySelector("#buttonDelete")?.classList.remove("active");
    }
}
