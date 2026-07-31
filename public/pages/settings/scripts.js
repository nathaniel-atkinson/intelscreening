console.log('settings.js loaded');
import { globalConsts } from '/global/scripts/scripts.js';
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
    isMobile,
    checkFor
} = functions;

const test = (instance, element) => instance === element.id ? true : false;


