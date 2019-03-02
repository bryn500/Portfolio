<template>
    <div>
        <header role="banner" class="headerBar clearfix">
            <router-link to="/" class="homeButton">
                <svg viewBox="0 0 1792 1792" class="svg">
                    <title>Home</title>
                    <use xlink:href="/img/icons/home.svg#home"></use>
                </svg>
            </router-link>
            <a href="javascript:;" class="openNav">
                <svg viewBox="0 0 24 24" class="svg">
                    <title>Menu</title>
                    <use xlink:href="/img/icons/bars.svg#bars"></use>
                </svg>
            </a>
        </header>
        <nav class="slideMenu">
            <a href="javascript:;" class="slideMenu__close">
                <svg viewBox="0 0 24 24" class="svg">
                    <title>Close menu</title>
                    <use xlink:href="/img/icons/close.svg#close"></use>
                </svg>
            </a>
            <ul class="nav">
                <li class="nav__item">
                    <router-link to="/" class="nav__link">
                        <svg viewBox="0 0 1792 1792" class="svg">
                            <use xlink:href="/img/icons/home.svg#home"></use>
                        </svg>
                        Home
                    </router-link>
                </li>
                <li class="nav__item">
                    <a class="nav__link" href="/other">Other</a>
                </li>
                <li class="nav__item">
                    <router-link to="/todo-app" class="nav__link">TodoApp</router-link>
                </li>
                <li class="nav__item">
                    <router-link to="/globe" class="nav__link">Globe</router-link>
                </li>
                <li class="nav__item">
                    <router-link to="/splitpage" class="nav__link">50/50 split page</router-link>
                </li>
                <li class="nav__item">
                    <router-link to="/photos" class="nav__link">
                        <svg viewBox="0 0 2048 1792" class="svg">
                            <use xlink:href="/img/icons/photo.svg#photo"></use>
                        </svg>
                        Photos
                    </router-link>
                </li>
                <li class="nav__item">
                    <router-link to="/scrollstory" class="nav__link">Scroll Story</router-link>
                </li>
                <li class="nav__item">
                    <router-link to="/game" class="nav__link">
                        <svg viewBox="0 0 2048 1792" class="svg">
                            <use xlink:href="/img/icons/gamepad.svg#gamepad"></use>
                        </svg>
                        Game
                    </router-link>
                </li>
                <li class="nav__item">
                    <a href="https://github.com/bryn500" class="nav__link">
                        <svg viewBox="0 0 2048 1792" class="svg">
                            <use xlink:href="/img/icons/github.svg#github"></use>
                        </svg>
                        Github
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>


<script>
// scripts in seperate file so it can be reused outside of vue.js
export default {
  name: 'Navigation',
  data() {
    return {};
  }
};
</script>

<style>
/* Styles in seperate file so it can be reused outside of vue.js */
</style>
