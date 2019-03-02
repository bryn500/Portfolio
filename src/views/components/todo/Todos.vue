<template>
    <section class="board">
        <h1 class="board__title">{{todos.boardName}}</h1>
        <ul class="lists">
            <task-list element="li" v-for="item in todos.lists" :key="item.id" v-bind:list="item"></task-list>
            <li class="addList">
                <form @submit.prevent="addList" class="addList__form">
                    <input
                        class="addList__input"
                        type="text"
                        name="listTitle"
                        v-model="newList"
                        placeholder="New List"
                        v-validate="'required'"
                        required="required"
                        autocomplete="off"
                    >
                    <transition name="alerting" v-if="showAlerts">
                        <p
                            class="alert"
                            v-if="errors.has('listTitle')"
                        >{{errors.first('listTitle')}}</p>
                    </transition>
                </form>
            </li>
        </ul>
    </section>
</template>

<script>
import TaskList from './TaskList.vue';

export default {
  name: 'Todos',
  data() {
    return {
      newList: '',
      showAlerts: false
    };
  },
  components: {
    TaskList
  },
  computed: {
    todos() {
      return this.$store.state.todos;
    }
  },
  methods: {
    addList: function() {
      let that = this;
      that.showAlerts = true;

      that.$validator.validateAll().then(result => {
        // success
        if (result) {
          // add list
          that.$store.commit('todos/addList', this.newList);

          // empty input
          that.newList = '';
          that.showAlerts = false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '../../../scss/shared/_variables.scss';

.lists {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  margin: 0;
  padding: 0;
}

.addList {
  flex: 0 0 auto;
  display: flex;
  width: 200px;

  &__form {
    flex: 1 1 auto;
  }

  &__input {
    display: block;
    border: 0;
    padding: 0.5rem;
    background-color: $slideMenuColour;
    color: $altFontColour;
    margin: 0;
    width: 100%;

    &:focus {
      background-color: rgba($slideMenuColour, 0.8);
    }
  }
}
</style>
