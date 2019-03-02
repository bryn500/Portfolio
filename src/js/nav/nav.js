//Nav
// import { throttle } from '../utils/utils';

export default (function () {
    'use strict';

    let slideMenu = null;

    function openMenu() {
        slideMenu.classList.add('visible');
    }

    function closeMenu() {
        slideMenu.classList.remove('visible');
    }

    document.addEventListener('click', function (e) {
        // get and cache slide menu
        if (slideMenu === null) {
            slideMenu = document.querySelector('.slideMenu');

            if (slideMenu === null) {
                return;
            }
        }

        // close menu if open and clicked outside
        if (slideMenu.classList.contains('visible') && !e.target.closest('.slideMenu')) {
            closeMenu();
            return;
        }

        // get link from event click
        let link = e.target.closest('a');

        if (link) {
            // handle click
            if (link.classList.contains('openNav')) {
                e.preventDefault();
                openMenu();
            }

            if (link.classList.contains('slideMenu__close')) {
                e.preventDefault();
                closeMenu();
            }
        }
    });

    document.addEventListener('keydown', function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
            closeMenu();
        }
    });

    /*
     * Header
    */
    let isBackgroundAdded = false;
    let isHeaderDark = false;

    function toggleHeaderBackground() {
        let header = document.querySelector('.headerBar');
        if (isHeaderDark) {
            if (!isBackgroundAdded) {
                if (header) {
                    header.classList.add('headerBar--background');
                    isBackgroundAdded = true;
                }
            }
            return;
        }

        if (isBackgroundAdded) {
            if (window.scrollY === 0) {
                header.classList.remove('headerBar--background');
                isBackgroundAdded = false;
            }
        } else {
            if (window.scrollY > 0) {
                header.classList.add('headerBar--background');
                isBackgroundAdded = true;
            }
        }
    };

    // Old Scroll change header code
    // let toggleHeaderBackground = throttle(function () {        
    // }, 20);
    // document.addEventListener('scroll', toggleHeaderBackground);
    // toggleHeaderBackground();

    window.app.useDarkHeader = function () {
        isHeaderDark = true;
        toggleHeaderBackground();
    };

    /*
     * Route change reset
    */
    document.addEventListener('route-changed', function () {
        closeMenu();
        isHeaderDark = false;
        toggleHeaderBackground();
    });
}());