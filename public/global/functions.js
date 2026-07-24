console.log("functions.js loaded");
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

function adjustHeader() {
    let showHeader;

    if (!showHeader) {
        body.style.gridTemplateRows = '0px 50px auto 50px';
    }
}

export const functions = { adjustHeader };