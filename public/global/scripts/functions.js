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
        header.style.display = 'none';
        nav.style.borderRadius = '10px 10px 0 0';
        nav.style.overflow = 'hidden';
    }
}

function getStorage(e) {
    return sessionStorage.getItem(e);
}

//---EDITING THE HEADER---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function updateStyleSheet(data) {
    const paper = frame.contentDocument;
    const frameStylesLink = paper.querySelector('link[rel="stylesheet"]');
    const stylesLink = document.querySelector('#stylesheet');
    const test = (e) => e === data.scope;
    if (test('global')) {
        stylesLink.href = `/global/styles/${data.theme}.css`;
        if (frameStylesLink) {
            frameStylesLink.href = `/global/styles/${data.theme}.css`;
        } else {
            console.info('frame.contentDocument has not loaded yet');
        }
    }
}

//---Helper Functions---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


const isMobile = () => Mobi|iPHone|iPad|android/i.test(navigator.userAgent);

const checkFor = (e) => document.querySelector(e) ? true : false;

//---::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


export const functions = {
    adjustHeader,
    getStorage,
    updateStyleSheet,
    isMobile,
    checkFor
};