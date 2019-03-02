<template>
    <div id="app">
        <navigation></navigation>
        <route-transition>
            <router-view class="view"/>
        </route-transition>
    </div>
</template>

<script>
import Navigation from './components/layout/Nav.vue';
import RouteTransition from './RouteTransition.vue';

export default {
  name: 'App',
  components: {
    Navigation,
    RouteTransition
  },
  mounted: function() {
  }
};
</script>

<style>
</style>
