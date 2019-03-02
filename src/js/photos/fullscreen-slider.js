import screenfull from '../vendor/screenfull.js';

export default function fullScreenSlider(container, slideClass, options) {
    'use strict';

    if (!container) {
        console.error('Missing container');
        return;
    }

    if (!slideClass) {
        console.error('Must specify slideClass');
        return;
    }

    /* 
     * Setup
     * Self is public
     */
    var self = {
        activeClass: 'fsSlider--active',
        isFullScreen: false
    };

    if (options.activeClass) {
        self.activeClass = options.activeClass;
    }

    self.slides = Array.prototype.slice.call(container.querySelectorAll('.' + slideClass));

    /* 
     * slide functions
     */
    function getActiveSlide() {
        return container.querySelector('.' + self.activeClass);
    }

    function changeSlide(goToSlide) {
        var currentSlide = getActiveSlide();

        if (currentSlide) {
            currentSlide.classList.remove(self.activeClass);
        }

        goToSlide.classList.add(self.activeClass);

        var slideChangedEvent = new CustomEvent('fsSlideChanged', {
            detail: {
                newSlide: goToSlide
            }
        });

        container.dispatchEvent(slideChangedEvent);
    }

    function findNextSlide() {
        var active = getActiveSlide();
        var index = self.slides.indexOf(active) + 1;
        var next = null;

        if (index >= self.slides.length) {
            next = self.slides[0];
        } else {
            next = self.slides[index];
        }

        return next;
    }

    function findPrevSlide() {
        var active = getActiveSlide();
        var index = self.slides.indexOf(active) - 1;
        var prev = null;

        if (index < 0) {
            prev = self.slides[self.slides.length - 1];
        } else {
            prev = self.slides[index];
        }

        return prev;
    }

    function goToNextSlide() {
        changeSlide(findNextSlide());
    }

    function goToPrevSlide() {
        changeSlide(findPrevSlide());
    }

    /* 
     * Events
     */
    function slideClicked(e) {
        var goToSlide = e.currentTarget;

        self.isFullScreen = true;

        changeSlide(goToSlide);

        self.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        var openFullScreen = new CustomEvent('fsOpen', {
            detail: {
                newSlide: goToSlide
            }
        });

        container.dispatchEvent(openFullScreen);        

        if (screenfull.enabled) {
            screenfull.request(container);
        }
    }

    for (var i = 0; i < self.slides.length; i++) {
        self.slides[i].addEventListener('click', slideClicked, false);
    }

    // key bindings
    document.addEventListener('keydown', function (evt) {
        evt = evt || window.event;

        if (self.isFullScreen) {
            if (evt.keyCode === 27) {
                if (screenfull.enabled) {
                    screenfull.exit();
                }
            } else if (evt.keyCode === 37) {
                goToPrevSlide();
            } else if (evt.keyCode === 39) {
                goToNextSlide();
            }
        }
    });

    // swipe events
    var touchstartX = 0;
    var touchstartY = 0;
    var touchendX = 0;
    var touchendY = 0;

    function handleGesture() {
        if (touchendX <= touchstartX) {
            // Swiped left
            goToNextSlide();
        } else if (touchendX >= touchstartX) {
            // Swiped right
            goToPrevSlide();
        }
    }

    container.addEventListener('touchstart', function (event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    container.addEventListener('touchend', function (event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    function exitFullscreen() {
        if (screenfull.enabled) {
            screenfull.exit();
        }
    }

    /* 
     * Full Screen Functionality
     */
    if (screenfull.enabled) {
        screenfull.on('change', function (e) {
            if (!screenfull.isFullscreen) {
                var exitFullScreen = new CustomEvent('fsExit');
                container.dispatchEvent(exitFullScreen);

                self.isFullScreen = false;
                setTimeout(function () {
                    window.scrollTo(0, self.scrollPosition);
                }, 100);
            }
        });
    }

    /* 
     * Public functions
     */
    self.findNextSlide = findNextSlide;
    self.findPrevSlide = findPrevSlide;
    self.getActiveSlide = getActiveSlide;
    self.goToNextSlide = goToNextSlide;
    self.goToPrevSlide = goToPrevSlide;
    self.exitFullscreen = exitFullscreen;

    return self;
};
