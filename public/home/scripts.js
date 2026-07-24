console.log("scripts.js loaded");
import { globalConsts } from "/api/global/scripts";

const {
    body,
    header,
    nav,
    main,
    main_l,
    main_m,
    main_r,
    footer,
    buttons
} = globalConsts;

import { functions } from '/api/global/functions';

const {
    adjustHeader
} = functions;

adjustHeader();

buttons.forEach(b => {
    console.log("Attaching listener:", b);


    b.addEventListener('click', async () => {
        let data;
        if (b.id === 'test') data = await testForDirectory();
        if (b.id === 'create' || b.id === 'delete') data = await toggleDatabase(b);
        console.log(`${b.id} Clicked!`, data);
    })
})

let checked;

async function testForDirectory() {
    if (checked) return checked;
    else {
        const directory = await getJson('/api/database/status');
        checked = directory.exists
    }

    if (!checked) {
        main_m.innerHTML = `<p>Directory not found</p>`;
        return false;
    } else {
        main_m.innerHTML = `<p>Directory exists!</p>`;
        return true;
    }
}

async function toggleDatabase(b) {
    if (b.id === 'create') await createDirectory(b);
    else if (b.id === 'delete') await deleteDirectory(b);
}

async function createDirectory(b) {
    console.log('createDirectory()');
    await getJson('/api/database/initialise');
    b.id = 'delete';
    b.innerHTML = 'delete';
}

async function deleteDirectory(b) {
    console.log('deleteDirectory()')
    await getJson('/api/database/delete');
    b.id = 'create';
    b.innerHTML = 'create';
}

async function getJson(url, method = 'POST') {
    console.log("Fetching", url, method);
    const response = await fetch(url, { method });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
    }

    return response.json();
}