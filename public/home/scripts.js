console.log("scripts.js loaded");
import { globalConsts } from "/global/scripts/scripts.js";

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

import { functions } from '/global/scripts/functions.js';

const {
    adjustHeader
} = functions;

window.addEventListener("DOMContentLoaded", () => {
    adjustHeader();
});

buttons.forEach(b => {
    console.log("Attaching listener:", b);


    b.addEventListener('click', async () => {
        let data;
        let prop = b.id;
        if (b.id === 'test') data = await testForDirectory();
        if (b.id === 'create' || b.id === 'delete') data = await toggleDatabase(b);
        console.log('.STATUS:', data);
    })
})


async function testForDirectory() {

    const check = await getJson('/api/database/status');
    
    if (check.exists === false) {
        console.log('Directory not found');
        return false;
    } else if (check.exists === true ) {
        console.log('Directory found');
        return true;
    }
}

async function toggleDatabase(b) {
    if (b.id === 'create') {
        var create = await createDirectory(b);
        return create.status;
    }
    else if (b.id === 'delete') {
        var scrub = await deleteDirectory(b);
        return scrub.status;
    }
}

async function createDirectory(b) {
    console.log('createDirectory()');
    const create = await getJson('/api/database/initialise');
    
    b.id = 'delete';
    b.innerHTML = 'DELETE';

    return create;
}

async function deleteDirectory(b) {
    console.log('deleteDirectory()')
    const scrub = await getJson('/api/database/delete');

    b.id = 'create';
    b.innerHTML = 'CREATE';

    return scrub;
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








let savedPage;

if (savedPage) loadFrame(savedPage);
else {
    savedPage = {'type': 'page', 'embed': 'gallery', 'id': '001'};
    loadFrame(savedPage);
}

function loadFrame(data) {

    if (data.type === 'page') {
        const url = new URL(window.location);

        url.searchParams.set("embed", "page");
        url.searchParams.set("id", data.id);

        history.pushState({}, "", url);

        frame.src = `/${data.embed}/index.html`;

        savedPage = {'type': 'page', 'embed': data.embed, 'id': data.id};
        return;
    }
    
    if (data.type === 'file') {
        const url = new URL(window.location);

        url.searchParams.set('embed', 'file');
        url.searchParams.set('id', data.id);
    }
}