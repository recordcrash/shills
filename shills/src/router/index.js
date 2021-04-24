import Vue from 'vue';
import VueRouter from 'vue-router';
import ShillsList from '../views/ShillsList.vue';
import Profile from '../views/Profile.vue';
import Leaderboard from '../views/Leaderboard.vue';
import OldLeaderboard from '../views/OldLeaderboard.vue';
import About from '../views/About.vue';
import Stats from '../views/Stats.vue';
// import { authGuard } from '../auth/authGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'ShillsListMain',
    component: ShillsList,
  },
  {
    path: '/list/:tag',
    name: 'ShillsListTagged',
    component: ShillsList,
  },
  {
    path: '/oldleaderboard',
    name: 'oldleaderboard',
    component: OldLeaderboard,
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard,
  },
  {
    path: '/profile/:username?',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats,
  },
  {
    path: '/oldlist',
    // eslint-disable-next-line no-restricted-globals
    beforeEnter() { window.open('https://recordcrash.com/shills.html'); },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
