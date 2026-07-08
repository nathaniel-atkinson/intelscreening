const main = document.querySelector("main");
    const main_L = document.querySelector("main .left");
    const main_M = document.querySelector("main .middle");
    const main_R = document.querySelector("main .right");
const footer = document.querySelector("footer");

export const globalConsts = {main, main_L, main_M, main_R, footer};

function createFooter() {
    const data = ["INTEL SCREENING", "From: NATHANIEL ATKINSON", "5 JULY 2026"];
    data.forEach((set) => {
        const newLine = document.createElement("span");
        newLine.innerHTML=`<p>${set}</p>\t`;

        footer.appendChild(newLine);
    })
}

createFooter();