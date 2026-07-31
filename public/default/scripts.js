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
    getStorage,
    updateStyleSheet,
    isMobile,
    checkFor
} = functions;


const {
    updateClock,
    getDate,
    getTime,
    getFullDate
} = calendar;

window.addEventListener("DOMContentLoaded", async () => {
    const fileCheck = await getJson('/api/isloaded/functions.js');
    if (fileCheck.status === 'loaded') adjustHeader();
});

let createMenu;
let deleteMenu;
let hasCreateMenu;
let hasDeleteMenu;

console.groupCollapsed('buttons.main');
buttons.forEach(b => {
    console.log('Attaching listener:', `<button id='${b.id}'/>`);

    const checkClass = className => b.classList.contains(className);
    const test = id => id === b.id;

    b.addEventListener('click', async e => {
        e.stopPropagation();
        let data;

        if (checkClass('main')) {
            e.stopPropagation();

            if (test('gallery')) {
                data = await loadFrame({
                    type: 'page',
                    embed: 'gallery',
                    id: '001'
                })
            }
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
                data = toggle('theme');
                console.log('data:', data);
                const themeButton = document.querySelector('button#lightThemeToggle span');
                themeButton.innerHTML = data;
                updateStyleSheet({scope: 'global', theme: data})
            }
        }

        console.log(b.id, '.STATUS:', data);
    });

});
console.groupEnd();

if (sessionStorage.getItem('console') === 'false') {
    main.style.gridTemplateColumns = '200px 2fr 0fr';
    document.querySelector('button[id="consoleToggle"] span').innerHTML = 'false';
}

function initialiseTheme() {
    console.log('initialiseTheme()');
    var theme = getStorage('theme') ?? 'system';
    console.log(theme);
    if (theme) {
        document.querySelector('button#lightThemeToggle span').innerHTML = theme;
        const is = (e) => e === theme;
        let now;
        if (is('system')) now = 'light';
        if (is('light')) now = 'dark';
        if (is('dark')) now = 'system';
        updateStyleSheet({scope: 'global', theme: now})
    }
}

initialiseTheme();


function toggle(name) {
    console.log("name:", name);
    let current;
    if (name === 'theme') {
        const is = (e) => e === current;
        let next;
        console.log(`toggle('theme')`);
        current = sessionStorage.getItem(name) ?? 'system';
        if (is(undefined) || is('undefined')) {
            sessionStorage.setItem(name, 'system');
            current = 'system';
        }
        if (is('system')) next = 'light';
        if (is('light')) next = 'dark';
        if (is('dark')) next = 'system';

        console.log("next:", next);
        sessionStorage.setItem(name, next);
        return next;
    } else {
        current = sessionStorage.getItem(name) === 'true';
        const next = !current;

        sessionStorage.setItem(name, next.toString());
        console.log(next);
        return next;
    }
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

        const fields = modalDocument.createElement('div');
        fields.innerHTML = `
            <input id='name' type="text" placeholder="File Name" required>
            <select id='type'>
                <option value='txt' default>txt</option>
                <option value='md'>md</option>
                <option value='json'>json</option>
            </select>
        `;

        target.prepend(fields);

        const createFile = modalDocument.querySelector('form');

        const fileName = fields.querySelector('#name');
        const filetype = fields.querySelector('#type');

        createFile.addEventListener('submit', async e => {
            let data;
            try {
                data = await fetch("/api/file/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: fileName.value,
                        type: filetype.value
                    })
                });

                fileName.value='';
            } catch (err) {
                throw new Error(`createFile.STATUS: ${data.status}`)
            }

            console.log(data);
        })
    }
}



//---SQL DIR---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


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


//---PAGES---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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
        frame.src = `./pages/${data.embed}/index.html`;
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