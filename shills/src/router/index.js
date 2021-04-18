import Vue from 'vue';
import VueRouter from 'vue-router';
import ShillsList from '../views/ShillsList.vue';
import Profile from '../views/Profile.vue';
import Leaderboard from '../views/Leaderboard.vue';
import OldLeaderboard from '../views/OldLeaderboard.vue';
import { authGuard } from '../auth/authGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'ShillsList',
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
    beforeEnter: authGuard,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
