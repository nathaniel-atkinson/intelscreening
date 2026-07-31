console.log("scripts.js loaded");
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
    isMobile,
    checkFor
} = functions;


const {
    updateClock,
    getDate,
    getTime,
    getFullDate
} = calendar;

window.addEventListener("DOMContentLoaded", () => {
    adjustHeader();
});

let createMenu;
let deleteMenu;
let hasCreateMenu;
let hasDeleteMenu;
const stylesLink = document.querySelector('#stylesheet');

buttons.forEach(b => {
    console.log('Attaching listener:', `<button id='${b.id}'/>`);

    const checkClass = className => b.classList.contains(className);
    const test = id => id === b.id;

    b.addEventListener('click', async e => {
        e.stopPropagation();
        let data;

        if (checkClass('main')) {
            e.stopPropagation();

            if (test('test')) data = await constructTestMenu(b);
            if (test('create')) data = await constructCreateMenu(b);
            if (test('delete')) data = await constructDeleteMenu(b);
            if (test('settings')) {
                data = await loadFrame({
                    type: 'page',
                    embed: 'settings',
                    id: '100'
                });
            }
        }

        if (checkClass('setting')) {
            e.stopPropagation();

            if (test('consoleToggle')) {
                data = await toggle('console');

                switch (data) {
                    case true: {
                        main.style.gridTemplateColumns = '200px 1fr 1fr';
                        document.querySelector('button[id="consoleToggle"] span').innerHTML = 'true';
                        break;
                    }
                    case false: {
                        main.style.gridTemplateColumns = '200px 2fr 0fr';
                        document.querySelector('button[id="consoleToggle"] span').innerHTML = 'false';
                        break;
                    }
                }
            }

            if (test('lightThemeToggle')) {
                data = await toggle('theme');

                switch (data) {
                    case true: {
                        document.querySelector('button[id="lightThemeToggle"] span').innerHTML = 'light';
                        stylesLink.href = '/global/styles/light.css';
                        break;
                    }
                    case false: {
                        document.querySelector('button[id="lightThemeToggle"] span').innerHTML = 'dark';
                        stylesLink.href = '/global/styles/dark.css';
                    }
                }
            }
        }

        console.log(b.id, '.STATUS:', data);
    });
});

if (sessionStorage.getItem('console') === 'false') {
    main.style.gridTemplateColumns = '200px 2fr 0fr';
    document.querySelector('button[id="consoleToggle"] span').innerHTML = 'false';
}

async function toggle(name) {
    const current = sessionStorage.getItem(name) === 'true';
    const next = !current;

    sessionStorage.setItem(name, next.toString());

    return next;
}


async function constructTestMenu(b) {
    const testMenu = document.createElement('div');
    testMenu.innerHTML = `
    `;
}

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
        hasCreateMenu = false;
        return false;
    }
}

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
        hasDeleteMenu = false;
    }
}

export const menus = {
    createMenu,
    deleteMenu
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

        const createFile = modalDocument.querySelector('button[id="create"]');

        createFile.addEventListener('click', async e => {
            const data = await fetch('/api/file/create');
        })

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


//---REMOVE TEMPORARY ELEMENTS---::::::::::::::::::::::::::::::::::::::::::::::::::::

body.addEventListener('click', (e) => {
    document.querySelectorAll('.temp').forEach(i => {
        if (!i.contains(e.target)) {
            console.log('Removing:', i);

            i.remove();

            if (i === deleteMenu) {
                deleteMenu = null;
                hasDeleteMenu = false;
            }

            if (i === createMenu) {
                createMenu = null;
                hasCreateMenu = false;
            }
        }
    });
});