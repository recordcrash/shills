<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app clipped>
          <v-list dense>
            <v-list-item v-for="item in items" :key="item.text" link>
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-subheader class="mt-4 grey--text text--darken-1"
              >SUBSCRIPTIONS</v-subheader
            >
            <v-list>
              <v-list-item v-for="item in items2" :key="item.text" link>
                <v-list-item-avatar>
                  <img
                    :src="
                      `https://randomuser.me/api/portraits/men/${item.picture}.jpg`
                    "
                    alt=""
                  />
                </v-list-item-avatar>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item>
            </v-list>
            <v-list-item class="mt-4" link>
              <v-list-item-action>
                <v-icon color="grey darken-1">mdi-plus-circle-outline</v-icon>
              </v-list-item-action>
              <v-list-item-title class="grey--text text--darken-1"
                >Browse Channels</v-list-item-title
              >
            </v-list-item>
            <v-list-item link>
              <v-list-item-action>
                <v-icon color="grey darken-1">mdi-cog</v-icon>
              </v-list-item-action>
              <v-list-item-title class="grey--text text--darken-1"
                >Manage Subscriptions</v-list-item-title
              >
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
            <router-link v-if="$auth.isAuthenticated"
              style="text-decoration: none; color: inherit;" to="/">
              <span class="title">The Shills List</span>
            </router-link>
          </v-toolbar-title>
          <v-spacer />
          <router-link v-if="$auth.isAuthenticated" to="/profile"
            >{{ $auth.user.name }} {{ apiMessage }}</router-link
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
          <v-container class="fill-height">
            <router-view v-if="$auth" />
          </v-container>
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
      { icon: 'mdi-trending-up', text: 'Most Popular' },
      { icon: 'mdi-youtube-subscription', text: 'Subscriptions' },
      { icon: 'mdi-history', text: 'History' },
      { icon: 'mdi-playlist-play', text: 'Playlists' },
      { icon: 'mdi-clock', text: 'Watch Later' },
    ],
    items2: [
      { picture: 28, text: 'Joseph' },
      { picture: 38, text: 'Apple' },
      { picture: 48, text: 'Xbox Ahoy' },
      { picture: 58, text: 'Nokia' },
      { picture: 78, text: 'MKBHD' },
    ],
    apiMessage: '',
  }),
};
</script>
