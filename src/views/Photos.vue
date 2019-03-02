<template>
    <section class="headerPadding container">
        <header class="header">
            <golden-hour></golden-hour>
            <h1>Photos</h1>
            <p>A selection of photography</p>            
        </header>
        <div class="gallery gallery--masonry">
            <div class="gallery__close" tabindex="0">
                <svg viewBox="0 0 24 24" class="svg">
                    <title>Close Gallery</title>
                    <use xlink:href="/img/icons/close.svg#close"></use>
                </svg>
            </div>
            <div class="gallery__prev" tabindex="0">
                <svg viewBox="0 0 24 24" class="svg">
                    <title>Previous</title>
                    <use xlink:href="/img/icons/chevron-left.svg#left"></use>
                </svg>
            </div>
            <div class="gallery__next" tabindex="0">
                <svg viewBox="0 0 24 24" class="svg">
                    <title>Next</title>
                    <use xlink:href="/img/icons/chevron-right.svg#right"></use>
                </svg>
            </div>
            <figure
                class="gallery__item"
                :style="item.AspectRatioPadding"
                v-for="item in photos"
                :key="item.Order"
                tabindex="0"
            >
                <img
                    :data-src="item.LowResPath"
                    :data-high-res="item.HighResPath"
                    class="gallery__photo lazy"
                    :data-lat="item.LatString"
                    :data-lng="item.LngString"
                >
                <figcaption class="gallery__caption" v-if="item.Caption">{{item.Caption}}</figcaption>
            </figure>
        </div>
    </section>
</template>

<script>
import { json } from 'd3-fetch';
import initPhotos from '../js/photos/photos.js';
import GoldenHour from './components/golden-hour/golden-hour.vue';

const dataUrl = '/data/photos.json';

export default {
  name: 'Photos',
  components: {
      'golden-hour' : GoldenHour
  },
  data() {
    return {
      photos: null
    };
  },
  methods: {
    afterDownload: function(data) {
      this.photos = data.Photos;

      this.photos.forEach(photo => {
        let aspectRatio = (photo.Height / photo.Width) * 100;

        photo.AspectRatioPadding = `padding-bottom:${aspectRatio}%`;
        photo.LowResPath = `${photo.LowResPath}`;
        photo.HighResPath = `${photo.HighResPath}`;
      });

      this.photos.sort(function(a, b) {
        return a.Order - b.Order;
      });

      var grid = document.querySelector('.gallery');

      this.$nextTick(() => {
        window.app.lazyloader.update();
        initPhotos();
      });
    }
  },
  mounted: function() {
    window.app.useDarkHeader();

    // Download photo data
    json(dataUrl)
      .then(this.afterDownload)
      .catch(function(err) {
        console.error(err);
      });
  }
};
</script>


<style lang="scss" scoped>
@import '../scss/shared/_variables.scss';
@import '../scss/shared/_mixins.scss';

.header{
    @include clearfix;
    padding: 1rem;
    text-align: center;
}

.gallery {
  position: relative;
  text-align: center;

  &__prev,
  &__next,
  &__close {
    display: none;

    .svg {
        fill: $altFontColour;
    }
  }

  &__item {
    display: block;
    break-inside: avoid;
  }

  &__caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.25rem 0.75rem;
    background: $slideMenuColour;
    color: $altFontColour;
  }

  &--masonry {
    $spacing: 2rem;
    column-gap: $spacing;
    column-fill: balance;
    column-count: 1;

    @media only screen and (min-width: $mobileBreakpoint) {
      column-count: 2;
    }

    @media only screen and (min-width: $tabletBreakpoint) {
      column-count: 3;
    }

    @media only screen and (min-width: $desktopBreakpoint) {
      column-count: 4;
    }

    .gallery__item {
      margin: 0 0 $spacing;
      position: relative;
      height: 0;
    }

    .gallery__photo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}

.gallery {
  &--slider {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    @include z-index(slider);
    background: $darkGrey;

    .gallery__close {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
    }

    .gallery__prev,
    .gallery__next {
      padding: 0.25rem;
      position: absolute;
      transform: translateY(-50%);
      top: 50%;
      left: 1.25rem;
      cursor: pointer;

      .svg {
        width: 2rem;
        height: 2rem;
      }
    }

    .gallery__next {
      right: 1.25rem;
      left: auto;
    }

    .gallery__close,
    .gallery__prev,
    .gallery__next {
      display: inline-block;
      @include z-index(sliderControls);
    }

    .gallery__item {
      position: absolute;
      height: 100%;
      width: 100%;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 0 !important;
      opacity: 0;
      transition: opacity 0;
    }

    .gallery__item--active {
      opacity: 1;
      transition: opacity 0.5s;
      @include z-index(sliderActive);
    }

    .gallery__photo {
      max-height: 100%;
      max-width: 100%;
      display: block;
    }
  }
}
</style>
