import polyfills from './utils/polyfills';
import nav from './nav/nav';
import lazyload from 'vanilla-lazyload';

(function () {
    'use strict';

    window.app.lazyloader = new lazyload({
        elements_selector: '.lazy',
        threshold: 0
    });
}());