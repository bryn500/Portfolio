<template>
    <transition name="card" enter-active-class="animated fadeIn">
        <div class="card">
            <p class="card__title">{{data.card.title}}</p>
            <div class="card__icons">
                <i tabindex="0" v-on:click="removeCard" class="card__remove">
                    <svg viewBox="0 0 24 24" class="svg">
                        <title>Remove</title>
                        <use xlink:href="/img/icons/close.svg#close"></use>
                    </svg>
                </i>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'TodoCard',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeCard: function() {
      let removeData = {
        cardId: this.data.card.id,
        listId: this.data.listId
      };

      this.$store.commit('todos/removeCard', removeData);
    }
  }
};
</script>

<style lang="scss">
@import '../../../scss/shared/_variables.scss';

.card {
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  margin-bottom: 2px;
  text-align: left;
  white-space: normal;
  word-wrap: break-word;
  background-color: $mainFontColour;
  border-left: 3px solid $listBorderColour;
  color: $altFontColour;

  &__title {
    flex: 1 1 auto;
    margin-right: 1rem;
    margin: 0;
    padding-right: 0.2rem;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  &__icons {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
  }

  &__remove {
    flex: 0 0 auto;
    padding: 0.2rem 0rem 0.2rem 0.2rem;
    cursor: pointer;
    font-size: 0.875rem;
    text-align: center;
    font-style: normal;

    .svg {
      width: 15px;
      height: 15px;
      fill: $altFontColour;

      &:focus,
      &:hover {
        fill: red;
      }
    }
  }
}
</style>

