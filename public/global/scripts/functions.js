console.log("functions.js loaded");
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

function adjustHeader() {
    let showHeader;

    if (!showHeader) {
        body.style.gridTemplateRows = '0px 50px auto 50px';
        nav.style.borderRadius = '10px 10px 0 0';
        nav.style.overflow = 'hidden';
    }
}

//---Helper Functions---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


const isMobile = () => Mobi|iPHone|iPad|android/i.test(navigator.userAgent);

const checkFor = (e) => document.querySelector(e) ? true : false;

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

let hasCreateMenu;
let hasDeleteMenu;

body.addEventListener('click', (e) => {
    document.querySelectorAll('.temp').forEach(i => {
        if (!i===e.target) {
            console.log('Removing:', i);
            i.remove();
            hasCreateMenu = null;
            hasDeleteMenu = null;
        }
    })
})

export let lets = {
    hasCreateMenu,
    hasDeleteMenu
}
export const functions = {
    adjustHeader,
    isMobile,
    checkFor
};