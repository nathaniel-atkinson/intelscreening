import {globalConsts} from "/api/global/scripts";

const {main_M} = globalConsts;

const createButton = document.querySelector("#openCreateMenu");
createButton.addEventListener("click", (e) => {
    let menu = document.querySelector("#createMenu");

    if (!menu) {
        const menu = document.createElement("div");
        menu.id="createMenu";
        menu.innerHTML =`
            <p>Database</p>
            <p>Database Table</p>
            <p>Database Table Record</p>
        `;
        
        createButton.parentElement.classList.add("active");

        main_M.appendChild(menu);

        document.querySelectorAll("#createMenu p").forEach(i => {i.classList.add("button");})

    } else {
        menu.remove();
        createButton.parentElement.classList.remove("active");
    }
    
})