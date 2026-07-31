console.log("global.js loaded");

const body = document.querySelector('body');
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const main = document.querySelector('main');
    const main_l = main?.querySelector('.left');
    const main_m = main?.querySelector('.middle');
        const frame = main_m?.querySelector('iframe');
    const main_r = main?.querySelector('.right');
const footer = document.querySelector('footer');
const buttons = document.querySelectorAll('button');

export const globalConsts = {
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
}

let hoverOn;

body.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' & e.ctrlKey) {
        e.preventDefault(); // Optional
        myFunction();
    }
})

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
})