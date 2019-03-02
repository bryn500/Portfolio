<template>
  <div class="headerPadding container">
    <h1 v-html="msg"></h1>    
  </div> 
</template>

<script>
export default {
  name: "Splitpage",
  data() {
    return {
      msg:
        '<a href="https://dribbble.com/shots/4834706-Split">Split Page 50/50</a>'
    };
  },
  mounted: function() {
      window.app.useDarkHeader();
  }
};
</script>


<style scoped>
</style>
