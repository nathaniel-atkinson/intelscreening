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

export const functions = { adjustHeader };