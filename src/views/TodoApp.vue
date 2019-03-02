<template>
  <div class="headerPadding container">   
    <todo-board></todo-board>
  </div>
</template>

<script>
import TodoBoard from './components/todo/Todos.vue';

export default {
  name: 'TodoApp',
  components: {
      'todo-board' : TodoBoard
  },
  mounted: function() {
      window.app.useDarkHeader();
  }
}
</script>

<style>
</style>
