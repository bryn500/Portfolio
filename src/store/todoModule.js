import Vue from "vue";

const initialData = {
    id: 1,
    boardName: 'Todo App',
    lists: []
};

const storageKey = 'todoData';

const db = {
    fetch: function (key) {
        const keyData = localStorage.getItem(key);

        if (keyData !== null) {
            return JSON.parse(keyData);
        } else {
            return null;
        }
    },
    save: function (key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

const getSavedData = () => {
    let savedData = db.fetch(storageKey);

    if (savedData === null) {
        db.save(storageKey, initialData);
        savedData = initialData;
    }

    let maxIds = getCurrentMaxIds(savedData.lists);

    savedData.maxListId = maxIds.maxListId;
    savedData.maxCardId = maxIds.maxCardId;

    return savedData;
};

function getCurrentMaxIds(lists) {
    let maxListId = 0;
    let maxCardId = 0;

    if (lists.length) {
        lists.forEach((list, i) => {
            if (list.id > maxListId) {
                maxListId = list.id;
            }
            list.cards.forEach((card, index) => {
                if (card.id > maxCardId) {
                    maxCardId = card.id;
                }
            });
        });
    }

    return {
        maxListId,
        maxCardId
    };
}

function getListById(lists, id) {
    return lists.find(list => list.id === id);
}

export default {
    namespaced: true,
    state: getSavedData(),
    getters: {
        getListById: (state) => (id) => getListById(state.lists, id)
    },
    mutations: {
        addList: (state, listTitle) => {
            let newList = {
                id: ++state.maxListId,
                name: listTitle,
                cards: []
            };

            // add list to state
            state.lists.push(newList);

            // save
            db.save(storageKey, state);
        },
        removeList: (state, list) => {
            // find index of list
            let index = state.lists.findIndex(item => item.id === list.id);

            // remove list
            Vue.delete(state.lists, index);

            // save
            db.save(storageKey, state);
        },
        addCard: (state, data) => {
            // set card id & increment
            data.newCard.id = ++state.maxCardId;

            // add card to list
            data.list.cards.push(data.newCard);

            // save
            db.save(storageKey, state);
        },
        removeCard: (state, data) => {
            // lookup list
            let list = getListById(state.lists, data.listId);

            // lookup index in list
            let index = list.cards.findIndex(item => item.id === data.cardId);

            // remove card from list
            Vue.delete(list.cards, index);

            // save
            db.save(storageKey, state);
        },
        updateOrder: (state) => {
            // save position
            db.save(storageKey, state);
        }
    }
};