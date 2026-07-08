const header = document.querySelector("header");
const nav = document.querySelector("nav");
const body = document.querySelector("body");
const main = document.querySelector("main");
    const main_L = document.querySelector("main .left");
    const main_M = document.querySelector("main .middle");
    const main_R = document.querySelector("main .right");
const footer = document.querySelector("footer");
const all = document.querySelectorAll("*");

export const globalConsts = {body, nav, main, main_L, main_M, main_R, footer};

function createFooter() {
    const data = ["INTEL SCREENING", "From: NATHANIEL ATKINSON", "5 JULY 2026"];
    data.forEach((set) => {
        const newLine = document.createElement("span");
        newLine.innerHTML=`<p>${set}</p>\t`;

        footer.appendChild(newLine);
    })
}

createFooter();

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    document.querySelector("#contextMenu")?.remove();
});

document.addEventListener("click", (e) => {
    document.querySelector("#contextMenu")?.remove();
});

function createContextMenu(e) {

    const menu = document.createElement("div");

    menu.id = "contextMenu";
    menu.innerHTML = `
        <p>This is a context menu</p>
    `;

    menu.id="contextMenu";
    menu.style.width = "200px";
    menu.style.height = "fit-content";
    menu.style.position = "fixed";
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    menu.style.background = "var(--bg)";
    menu.style.border = "3px solid var(--border)";
    menu.style.zIndex = "1000";

    document.body.appendChild(menu);
}