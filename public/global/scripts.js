const main = document.querySelector("main");
const footer = document.querySelector("footer");


function createFooter() {
    const data = ["INTEL SCREENING", "From: NATHANIEL ATKINSON", "5 JULY 2026"];
    data.forEach((set) => {
        const newLine = document.createElement("span");
        newLine.innerHTML=`<p>${set}</p>\t`;

        footer.appendChild(newLine);
    })
}

createFooter();