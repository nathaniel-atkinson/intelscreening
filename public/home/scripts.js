console.log("scripts.js loaded");
import { globalConsts } from '/global/scripts/scripts.js';
import { calendar } from '/global/scripts/clock.js';
import { functions, lets } from '/global/scripts/functions.js';

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
    isMobile,
    checkFor
} = functions;

let {
    hasDeleteMenu,
    hasCreateMenu
} = lets;

const {
    updateClock,
    getDate,
    getTime,
    getFullDate
} = calendar;

window.addEventListener("DOMContentLoaded", () => {
    adjustHeader();
});

buttons.forEach(b => {
    console.log('Attaching listener:', `<button id='${b.id}'/>`);
    const checkClass = (className) => b.classList.contains(className) ? true : false ;

    if (checkClass('main')){
        b.addEventListener('click', async (e) => {
            e.stopPropagation();

            const test = (id) => id === b.id ? true : false ;
            let data;

            let prop = b.id;

            if (test('test')) data = await constructTestMenu(b);
            if (test('create')) data = await constructCreateMenu(b);
            if (test('delete')) data = await constructDeleteMenu(b);
            if (test('settings')) data = await loadFrame({'type': 'page', 'embed': 'settings', 'id': '100'});
    
            console.log (b.id,'.STATUS:', data);
        })
        return;
    }
})

async function constructTestMenu(b) {
    const testMenu = document.createElement('div');
    testMenu.innerHTML = `
    `;
}

let createMenu;
async function constructCreateMenu(b) {
    console.log(`constructCreateMenu(${b.id}).clicked`)
    if (!hasCreateMenu) {
        hasCreateMenu = true;
        createMenu = document.createElement('div');
        createMenu.id = 'createMenu';
        createMenu.classList.add('temp');
        const buttons = ['SQL', 'file','folder'];

        buttons.forEach(type => {
            var button = document.createElement('button');
            button.id = type;
            button.textContent = type;

            button.style.textIndent = '0.25in';

            button.addEventListener('click', () => {
                const test = (id) => button.id === id ? true : false;
                if (test('SQL')) createDirectory(b);
                if (test('file')) createFileField();
            })

            createMenu.appendChild(button);
        })
        
        b.after(createMenu);
        if (checkFor('createMenu')) console.log(`checkFor('createMenu').STATUS =`, true);
        return true;
    } else {
        createMenu.remove();
        hasCreateMenu = null;
        return false;
    }
}

let deleteMenu;
async function constructDeleteMenu(b) {
    
    if (!hasDeleteMenu) {
        hasDeleteMenu = true;
        deleteMenu = document.createElement('div');
        deleteMenu.classList.add('temp');
        const buttons = ['SQL', 'file','folder'];

        buttons.forEach(type => {
            var button = document.createElement('button');
            button.id = type;
            button.textContent = type;

            button.style.textIndent = '0.25in';

            button.addEventListener('click', () => {
                const test = (id) => button.id === id ? true : false;
                if (test('SQL')) deleteDirectory(b);
            })

            deleteMenu.appendChild(button);
        })
        
        b.after(deleteMenu);
        return true;
    } else if (deleteMenu) {
        deleteMenu.remove();
        hasDeleteMenu = null;
    }
}

function createFileField() {
    console.log(`createFileField().ran`);
    createModal('createFile');
}

async function createModal(type) {

    const iframe = await loadFrame({
        type: "page",
        embed: "modal",
        id: "000a"
    });

    const modalDocument = iframe.contentDocument;

    const target = modalDocument.querySelector(".target");

    if (!target) {
        console.error("Modal target not found.");
        return;
    }

    if (type === "createFile") {

        const fields = modalDocument.createElement("div");

        fields.innerHTML = `
            <input type="text" placeholder="File Name">
            <input type="text" placeholder="File Type">
        `;

        target.append(fields);
    }
}


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
    const test = (id) => b.id === id ? true : false;

    return create;
}

async function deleteDirectory(b) {
    console.log('deleteDirectory()')
    const scrub = await getJson('/api/database/delete');

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

async function loadFrame(data) {

    if (data.type !== "page") return;

    const url = new URL(window.location);

    url.searchParams.set("embed", "page");
    url.searchParams.set("id", data.id);

    history.pushState({}, "", url);

    savedPage = {
        type: "page",
        embed: data.embed,
        id: data.id
    };

    return new Promise(resolve => {
        frame.onload = () => resolve(frame);
        frame.src = `./${data.embed}/index.html`;
    });
}
