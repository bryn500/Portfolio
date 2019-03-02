import Vue from 'vue'
import Router from 'vue-router'
import Splitpage from '../views/Splitpage'
import NotFound from '../views/NotFound'

// Lazy load large modules
const Index = () => import(/* webpackChunkName: "3d" */ '../views/Index');
const Globe = () => import(/* webpackChunkName: "3d" */ '../views/Globe');
const Photos = () => import(/* webpackChunkName: "photos" */ '../views/Photos');
const TodoApp = () => import(/* webpackChunkName: "draggable" */ '../views/TodoApp');
const Scrollstory = () => import(/* webpackChunkName: "scrollstory" */ '../views/Scrollstory');
const BrynGame = () => import(/* webpackChunkName: "game" */ '../views/BrynGame');

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/todo-app',
            name: 'TodoApp',
            component: TodoApp
        },
        {
            path: '/splitpage',
            name: 'Splitpage',
            component: Splitpage
        },
        {
            path: '/scrollstory',
            name: 'Scrollstory',
            component: Scrollstory
        },
        {
            path: '/globe',
            name: 'Globe',
            component: Globe
        },
        {
            path: '/photos',
            name: 'Photos',
            component: Photos
        },
        {
            path: '/game',
            name: 'BrynGame',
            component: BrynGame
        },
        {
            path: '*',
            name: 'NotFound',
            component: NotFound
        }
    ]
})
