import {globalConsts} from "/api/global/scripts";

const {body, main_M, main, nav, header, footer, main_L, main_R} = globalConsts;

const createButton = document.querySelector("#openCreateMenu");
createButton.addEventListener("click", (e) => {
    let menu = document.querySelector("#createMenu");
    const button = menu?.querySelector('input');

    const rect = createButton.getBoundingClientRect();
    const {top, left, right, bottom, width, height, x, y} = rect;

    if (!menu) {
        menu = document.createElement("div");
        menu.classList.add("temp");
        menu.id = "createMenu";
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
        menu.innerHTML =`
            <span class="underlined bold">OPTIONS</span>
            <p>Database</p>
            <p>Database Table</p>
            <p>Database Table Record</p>
        `;
        
        createButton.classList.add("active");
        body.appendChild(menu);
        document.querySelectorAll("#createMenu p").forEach(i => {i.classList.add("button");})

    } else {
        menu.remove();
        createButton.classList.remove("active");
    }
    
})
