<template>
    <div>
        <transition name="fade" mode="out-in" @afterEnter="afterEnter">
            <slot/>
        </transition>
        <transition name="fadedelay" mode="in-out">
            <div class="loading" v-if="loading">
                <div class="top">
                    <div class="bouncer">
                        <span class="ball traveller"></span>
                    </div>
                </div>
                <div class="bottom"></div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
  name: 'TransitionPage',
  data() {
    return {
      loading: true,
      viewTo: null,
      loadHandledViews: ['Globe', 'NotFound'],
      showLoadingViews: ['Index', 'Globe', 'Photos', 'TodoApp', 'Scrollstory', 'BrynGame']
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {

      // store view to name
      this.viewTo = to.name;
      
      // dispatch close menu event.
      var routeChangedEvent = new Event('route-changed');
      document.dispatchEvent(routeChangedEvent);
      
      // show loading screen on async components
      if (this.showLoadingViews.indexOf(to.name) >= 0) {
        this.loading = true;
      }

      next();
    });

    // close loading screen when route-load event is emitted
    // used when view loads data internally
    this.$root.$on('route-load', event => {
      this.routeLoaded();
    });
  },
  methods: {
    routeLoaded() {
      // close loading screen
      this.loading = false;
    },
    afterEnter(element) {
      // if page handles closing loading screen manually skip
      if (this.loadHandledViews.indexOf(this.viewTo) >= 0) {
        return;
      }
      
      // otherwise close loading screen
      this.routeLoaded();
    }
  }
};
</script>

<style lang="scss">
@import '../scss/shared/_variables.scss';
@import '../scss/shared/_mixins.scss';

$bounceDuration: 0.5s;

.loading {
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  @include z-index(loading);
}

.top,
.bottom {
  height: 50vh;
}

.top {
  padding-top: 1rem;
  background: $altFontColour;
  position: relative;
}

.bottom {
  background: $darkGrey;
}

.bouncer {
  @include z-index(loading);
  -webkit-backface-visibility: hidden;
  position: absolute;
  bottom: -10px;
  left: 50%;
  margin-left: -20px;
  transform: translate3d(0, 0, 0);
  animation-direction: alternate;
  animation-duration: $bounceDuration;
  animation-name: bounce;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.33333, 0.66667, 0.66667, 1);
}

.traveller {
  @include z-index(loading);
  -webkit-backface-visibility: hidden;
  animation-direction: alternate;
  animation-duration: $bounceDuration * 2;
  animation-name: travel;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.ball {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $mainFontColour;
}

@keyframes bounce {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(0, -100px, 0);
  }
}

@keyframes travel {
  from {
    transform: translate3d(-75px, 0, 0);
  }
  to {
    transform: translate3d(75px, 0, 0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s opacity ease-in-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.fadedelay-enter-active,
.fadedelay-leave-active {
  transition: all 0.1s ease-in-out;
  transition-delay: 0.2s; // won't appear unless this much time has passed
}

.fadedelay-enter,
.fadedelay-leave-to {
  opacity: 0;
}

.fadedelay-enter-to,
.fadedelay-leave {
  opacity: 1;
}
</style>
