import Vue from 'vue';
import VueRouter from 'vue-router';
import ShillsList from '../views/ShillsList.vue';
import Profile from '../views/Profile.vue';
import Leaderboard from '../views/Leaderboard.vue';
import OldLeaderboard from '../views/OldLeaderboard.vue';
import About from '../views/About.vue';
import Stats from '../views/Stats.vue';
import ShillView from '../views/ShillView.vue';
// import { authGuard } from '../auth/authGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'ShillsListMain',
    component: ShillsList,
    meta: {
      title: 'The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
        {
          property: 'og:description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
      ],
    },
  },
  {
    path: '/list/:tag',
    name: 'ShillsListTagged',
    component: ShillsList,
    meta: {
      title: 'The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
        {
          property: 'og:description',
          content: 'A list of multimedia works that any internet user will enjoy, from Worm to Kid Radd.',
        },
      ],
    },
  },
  {
    path: '/shill/:id',
    name: 'ShillView',
    component: ShillView,
    meta: {
      title: 'Work Page - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'One of the works in the Shills List, the list of multimedia works that any internet user will enjoy.',
        },
        {
          property: 'og:description',
          content: 'One of the works in the Shills List, the list of multimedia works that any internet user will enjoy.',
        },
      ],
    },
  },
  {
    path: '/shill/:id/:name',
    name: 'ShillViewNamed',
    component: ShillView,
    meta: {
      title: 'Work Page - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'One of the works in the Shills List, the list of multimedia works that any internet user will enjoy.',
        },
        {
          property: 'og:description',
          content: 'One of the works in the Shills List, the list of multimedia works that any internet user will enjoy.',
        },
      ],
    },
  },
  {
    path: '/oldleaderboard',
    name: 'oldleaderboard',
    component: OldLeaderboard,
    meta: {
      title: 'Old Leaderboard - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'The old, static leaderboard for the Shills List. No longer updated.',
        },
        {
          property: 'og:description',
          content: 'The old, static leaderboard for the Shills List. No longer updated.',
        },
      ],
    },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard,
    meta: {
      title: 'Leaderboard - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'A dynamic leaderboard that tracks people\'s progress in the Shills List.',
        },
        {
          property: 'og:description',
          content: 'A dynamic leaderboard that tracks people\'s progress in the Shills List.',
        },
      ],
    },
  },
  {
    path: '/profile/:username?',
    name: 'profile',
    component: Profile,
    meta: {
      title: 'User Profile - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'The profile of a Shills List user.',
        },
        {
          property: 'og:description',
          content: 'The profile of a Shills List user.',
        },
      ],
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'About Page - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'An explanation of what the Shills List is, as well as the conditions to add your own shills.',
        },
        {
          property: 'og:description',
          content: 'An explanation of what the Shills List is, as well as the conditions to add your own shills.',
        },
      ],
    },
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats,
    meta: {
      title: 'Stats Page - The Shills List',
      metaTags: [
        {
          name: 'description',
          content: 'The statistics of the Shills List. Trending shills, global stats, best users, and the like.',
        },
        {
          property: 'og:description',
          content: 'The statistics of the Shills List. Trending shills, global stats, best users, and the like.',
        },
      ],
    },
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

// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find((r) => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map((tagDef) => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach((key) => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

export default router;
