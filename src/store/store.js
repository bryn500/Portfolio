import Vue from 'vue';
import Vuex from 'vuex';
import moduleTodo from './todoModule';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        todos: moduleTodo
    }
});


