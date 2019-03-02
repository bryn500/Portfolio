<template>
    <div class="headerPadding container">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {
      msg: '404 Not Found'
    };
  },
  mounted: function() {
    this.$root.$emit('route-load');
    window.app.useDarkHeader();
  }
};
</script>


<style scoped>
</style>
