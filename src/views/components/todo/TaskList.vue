<template>
    <section class="list">
        <h2 class="list__title">{{ list.name }}</h2>
        <i class="list__delete" v-on:click="removeList" tabindex="0">
            <svg viewBox="0 0 24 24" class="svg">
                <title>Remove</title>
                <use xlink:href="/img/icons/close.svg#close"></use>
            </svg>
        </i>
        <draggable
            v-model="list.cards"
            class="cards"
            :options="{group:'tasks', draggable:'.card'}"
            @change="updateCardOrder"
        >
            <task-list-card
                v-for="card in list.cards"
                :key="card.id"
                v-bind:data="{card: card, listId: list.id}"
            ></task-list-card>
        </draggable>
        <form @submit.prevent="addCard" class="addCard">
            <input
                class="addCard__input"
                type="text"
                name="cardTitle"
                v-model="newCard"
                placeholder="New Task"
                v-validate="'required|min:3'"
                autocomplete="off"
            >
            <transition name="alerting" v-if="showAlerts">
                <p class="alert" v-if="errors.has('cardTitle')">{{errors.first('cardTitle')}}</p>
            </transition>
        </form>
    </section>
</template>

<script>
import Draggable from 'vuedraggable';
import TaskListCard from './TaskListCard.vue';

export default {
  name: 'TodoList',
  data() {
    return {
      newCard: '',
      showAlerts: false
    };
  },
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  components: {
    TaskListCard,
    Draggable
  },
  methods: {
    addCard: function() {
      let that = this;
      that.showAlerts = true;

      that.$validator.validateAll().then(result => {
        // success
        if (result) {
          // add card
          that.$store.commit('todos/addCard', {
            list: that.list,
            newCard: { title: that.newCard }
          });

          // empty input
          that.newCard = '';
          that.showAlerts = false;
        }
      });
    },
    updateCardOrder: function() {
      this.$store.commit('todos/updateOrder');
    },
    removeList: function() {
      this.$store.commit('todos/removeList', this.list);
    }
  }
};
</script>

<style lang="scss">
@import '../../../scss/shared/_variables.scss';

.list {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 275px;
  padding: 1rem;
  margin-right: 1rem;
  margin-bottom: 2px;
  background-color: $altGrey;
  border-top: 3px solid $listBorderColour;
  color: $slideMenuColour;

  &__title {
    margin: 0 0 1rem;
  }

  &__delete {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    text-align: center;
    font-style: normal;

    .svg {
      width: 25px;
      height: 25px;
      fill: $altFontColour;
    }

    &:focus,
    &:hover {
      .svg {
        fill: red;
      }
    }
  }
}

.cards {
  min-height: 41px;
}

.addCard {
  padding-top: 10px;
  margin-top: auto;
  transition: 1s all;

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
