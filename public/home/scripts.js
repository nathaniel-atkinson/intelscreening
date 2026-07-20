import { globalConsts } from "../global/scripts";

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
} = globalConsts

buttons.forEach(b => {
    b.addEventListener('click', () => {
        if (b.id === 'test') await testForDirectory();
        if (b.id === 'create') await createDirectory();
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
    } else {
        main_m.innerHTML = `<p>Directory exists!</p>`;
    }
}

async function createDirectory() {
    await getJson('/api/database/initialise');
}

async function getJson(url) {
    const response = await fetch(url, {method: 'POST'});
    return response.json();
}