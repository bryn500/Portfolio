import fullScreenSlider from './fullscreen-slider.js';

export default function () {
    'use strict';

    var gallery = document.querySelector('.gallery');
    var closeGallery = document.querySelector('.gallery__close');
    var prev = document.querySelector('.gallery__prev');
    var next = document.querySelector('.gallery__next');

    // switch image to its high res version
    function switchToHighRes(item) {
        var image = item.querySelector('.gallery__photo');
        var highResUrl = image.dataset.highRes;
        
        var downloadingImage = new Image();

        if (image.src !== highResUrl) {
            downloadingImage.onload = function () {
                image.src = this.src;
            };

            downloadingImage.src = highResUrl;
        }
    }

    // setup fullscreen slider
    var fss1 = fullScreenSlider(gallery, 'gallery__item', {
        activeClass: 'gallery__item--active',
        useFullScreen: false
    });

    // close button press
    closeGallery.addEventListener('click', function (evt) {
        fss1.exitFullscreen();
    });

    // prev button press
    prev.addEventListener('click', function (evt) {
        fss1.goToPrevSlide();
    });

    // next button press
    next.addEventListener('click', function (evt) {
        fss1.goToNextSlide();
    });

    // on full screen exit
    gallery.addEventListener('fsExit', function (e) {
        gallery.classList.remove('gallery--slider');
        gallery.classList.add('gallery--masonry');
    }, false);

    // on full screen request
    gallery.addEventListener('fsOpen', function (e) {
        gallery.classList.add('gallery--slider');
        gallery.classList.remove('gallery--masonry');
    }, false);

    // on new slide
    gallery.addEventListener('fsSlideChanged', function (e) {
        switchToHighRes(e.detail.newSlide);

        // preload prev and next high res
        switchToHighRes(fss1.findNextSlide(e.detail.newSlide));
        switchToHighRes(fss1.findPrevSlide(e.detail.newSlide));
    }, false);
}