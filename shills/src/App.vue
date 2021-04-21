<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app clipped style="z-index: 999 !important;">
          <v-list dense>
            <v-list-item v-for="item in items" :key="item.text" :to="item.to">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar app clipped-left color="secondary" dense>
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-icon class="mx-4" large>
            mdi-notebook-outline
          </v-icon>
          <v-toolbar-title class="mr-12 align-center">
            <router-link
              style="text-decoration: none; color: inherit;" to="/">
              <span class="title">The Shills List</span>
            </router-link>
          </v-toolbar-title>
          <v-spacer />
          <router-link v-if="$auth.isAuthenticated" to="/profile"
            >{{ $auth.user.name }}</router-link
          >
          <div class="ml-3" v-if="!$auth.loading">
            <!-- show login when not authenticated -->
            <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
            <!-- show logout when authenticated -->
            <button v-if="$auth.isAuthenticated" @click="logout">
              Log out
            </button>
          </div>
        </v-app-bar>

        <v-main>
          <router-view v-if="$auth" />
        </v-main>
      </v-app>
    </v-app>
  </div>
</template>

<script>

export default {
  name: 'App',
  props: {
    source: String,
  },

  components: {},

  methods: {
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },

  data: () => ({
    drawer: null,
    items: [
      { icon: 'mdi-book', text: 'Recommendations', to: '/' },
      { icon: 'mdi-trending-up', text: 'Leaderboard', to: '/leaderboard' },
      { icon: 'mdi-trending-up', text: 'Old Leaderboard', to: '/oldleaderboard' },
      { icon: 'mdi-trending-up', text: 'Old List', to: '/oldlist' },
    ],
  }),
};
</script>
