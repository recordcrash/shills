<template>
  <v-card elevation="24" :max-width="maxWidth">
    <v-carousel
      :continuous="true"
      :cycle="false"
      :show-arrows="false"
      hide-delimiter-background
      delimiter-icon="mdi-minus"
      height="300"
    >
      <v-carousel-item v-for="image in images" :key="image">
        <v-img :src="image" height="300">
          <v-card-title lights-out style="text-shadow: 0px 0px 8px #000000;">{{name}}</v-card-title>
        </v-img>
      </v-carousel-item>
    </v-carousel>
    <v-card-text><div v-html="description"></div></v-card-text>
    <v-card-actions class="mt-auto">
      <v-container class="mb-0 pl-1 pb-1">
        <v-row justify="start" class="mb-3 ml-0">
          <v-chip v-for="tag in tags" class="mr-1" v-bind:key="tag">{{tag}}</v-chip>
        </v-row>
       <v-list-item class="grow">
        <v-row align="center" justify="start">
          <v-icon class="mr-1" v-if="!isAuthenticated" @click="onLike"> mdi-heart-outline </v-icon>
          <v-icon class="mr-1" v-else-if="isAuthenticated && !liked" @click="onLike"> mdi-heart-outline </v-icon>
          <v-icon class="mr-1" v-else @click="onLike"> mdi-heart </v-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="subheading mr-2">{{localLikes}}</span>
            </template>
            <span>{{likedTooltip}}</span>
          </v-tooltip>
          <span class="mr-1">·</span>

          <v-icon class="mr-1" v-if="!isAuthenticated" @click="onRead"> mdi-flag-outline </v-icon>
          <v-icon class="mr-1" v-else-if="isAuthenticated && !read" @click="onRead"> mdi-flag-outline </v-icon>
          <v-icon class="mr-1" v-else @click="onRead"> mdi-flag </v-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on" class="subheading mr-2">{{localReads}}</span>
            </template>
            <span>{{readTooltip}}</span>
          </v-tooltip>
          <span class="mr-1">·</span>

          <v-icon class="mr-1"> mdi-clock </v-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span class="subheading" v-bind="attrs" v-on="on">{{timeString}}</span>
            </template>
            <span>{{amount}}</span>
          </v-tooltip>
          <v-spacer/>
          <a :href="link">{{linkText}}</a>
        </v-row>
      </v-list-item>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    isAuthenticated: Boolean,
    name: String,
    description: String,
    likes: Number,
    reads: Number,
    link: String,
    linkText: String,
    author: String,
    amount: String,
    hours: Number,
    tags: Array,
    images: Array,
    maxWidth: Number,
  },
  methods: {
    onLike() {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else {
        this.localLikes = this.liked ? this.localLikes - 1 : this.localLikes + 1;
        this.liked = !this.liked;
        document.activeElement.blur();
      }
    },
    onRead() {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else {
        this.localReads = this.read ? this.localReads - 1 : this.localReads + 1;
        this.read = !this.read;
        document.activeElement.blur();
      }
    },
  },
  computed: {
    timeString() {
      const localTime = this.hours;
      if (localTime > 719) return `${Math.trunc(localTime / 720)} months`;
      if (localTime > 167) return `${Math.trunc(localTime / 168)} weeks`;
      if (localTime > 23) return `${Math.trunc(localTime / 24)} days`;
      return `${localTime} hours`;
    },
    likedTooltip() {
      return `${this.localLikes} people have enjoyed this work`;
    },
    readTooltip() {
      return `${this.localReads} people have finished this work`;
    },
  },
  created() {
    this.localLikes = this.likes;
    this.localReads = this.reads;
  },
  data() {
    return {
      localLikes: 0,
      localReads: 0,
      liked: false,
      read: false,
      colors: [
        'green',
        'secondary',
        'yellow darken-4',
        'red lighten-2',
        'orange darken-1',
      ],
      cycle: true,
      slides: [
        'First',
        'Second',
        'Third',
        'Fourth',
        'Fifth',
      ],
    };
  },
};
</script>
