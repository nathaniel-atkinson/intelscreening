console.log('settings.js loaded');
import { globalConsts } from '/global/scripts/scripts.js';
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

const test = (instance, element) => instance === element.id ? true : false;

buttons.forEach(b => {
    b.addEventListener('click', (e) => {
        if(test('console', b)) {
            const session = sessionStorage.getItem('console');
            if (session) sessionStorage.setItem('console', false);
            else sessionStorage.setItem('console', true)
        }
    })
})



