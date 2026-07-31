console.log("gallary.js loaded");
import { globalConsts } from '/global/scripts/scripts.js';
import { calendar } from '/global/scripts/clock.js';
import { functions } from '/global/scripts/functions.js';

const {
    body,
    header,
    nav,
    main,
        main_l,
        main_m,
            frame,
        main_r,
    footer,
    buttons
} = globalConsts;

const {
    adjustHeader,
    getStorage,
    updateStyleSheet,
    isMobile,
    checkFor
} = functions;



//---load files for gallery---::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function loadData() {
    try {
        const response = await fetch('/api/files/dir', {
            method: 'POST'
        });

        const data = await response.json();

        renderData(data);
    } catch (err) {
        console.error(err);
    }
}

await loadData();


function renderData(data) {
    const display = document.querySelector('main div#display');

    Array.from(data).forEach(entry => {
        const newLine = document.createElement('p');
        newLine.innerHTML = entry;

        display.append(newLine);
    })
}