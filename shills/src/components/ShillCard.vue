<template>
  <v-card elevation="24" :max-width="maxWidth" :min-width="minWidth" style="display: flex; flex-direction: column;">
    <v-carousel
      :continuous="true"
      :cycle="false"
      :show-arrows="false"
      hide-delimiter-background
      delimiter-icon="mdi-minus"
      :hide-delimiters="hasSingleImage"
      height="300"
    >
      <v-carousel-item v-for="image in imagesArray" :key="image">
        <a :href="link">
        <v-img :src="image" :gradient="cardGradient" height="300">
          <v-card-title lights-out style="text-shadow: 0 0 2px #000, 0 0 3px #000, 0 0 4px #000;">{{name}}</v-card-title>
          <v-card-subtitle style="color: #fff; text-shadow: 0 0 1px #000, 0 0 2px #000">{{author}}</v-card-subtitle>
        </v-img>
        </a>
      </v-carousel-item>
    </v-carousel>
    <div style="display: flex; flex-direction: column; flex-grow: 1;">
    <v-card-text><div v-html="description"></div></v-card-text>
    <v-card-actions style="align-items: end; display: flex; flex-grow: 1;">
      <v-container class="mb-0 pl-1 pb-1 align-self-end">
        <v-slide-group
          multiple
        >
          <v-slide-item
            v-for="tag in tagsArray"
            :key="tag"
          >
            <v-chip class="mr-1" @click="onClickTag(tag)">{{tag}}</v-chip>
          </v-slide-item>
        </v-slide-group>
       <v-list-item class="grow">
        <v-row justify="start">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
              <v-icon class="mr-1" v-if="!isAuthenticated" @click="onLike(id)"> mdi-heart-outline </v-icon>
              <v-icon class="mr-1" v-else-if="isAuthenticated && !(liked || localLiked)" @click="onLike(id)"> mdi-heart-outline </v-icon>
              <v-icon class="mr-1" v-else @click="onLike(id)"> mdi-heart </v-icon>
              <span  class="subheading mr-2">{{localLikes}}</span>
              </div>
           </template>
            <span>{{likedTooltip}}</span>
          </v-tooltip>
          <span class="mr-1">·</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
            <v-icon class="mr-1" v-if="!isAuthenticated" @click="onRead(id)"> mdi-flag-outline </v-icon>
            <v-icon class="mr-1" v-else-if="isAuthenticated && !(read || localRead)" @click="onRead(id)"> mdi-flag-outline </v-icon>
            <v-icon class="mr-1" v-else @click="onRead(id)"> mdi-flag </v-icon>
            <span v-bind="attrs" v-on="on" class="subheading mr-2">{{localReads}}</span>
            </div>
            </template>
            <span>{{readTooltip}}</span>
          </v-tooltip>
          <span class="mr-1">·</span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-icon class="mr-1"> mdi-clock </v-icon>
                <span class="subheading" >{{timeString}}</span>
              </div>
            </template>
            <span>{{amount}}</span>
          </v-tooltip>
          <v-spacer/>
          <a :href="link">{{linkText}}</a>
        </v-row>
      </v-list-item>
      </v-container>
    </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import api from '../auth/api';

export default {
  props: {
    isAuthenticated: Boolean,
    id: Number,
    name: String,
    description: String,
    likes: Number,
    reads: Number,
    link: String,
    linkText: String,
    author: String,
    amount: String,
    hours: Number,
    tags: String,
    images: String,
    maxWidth: Number,
    minWidth: Number,
    read: Boolean,
    liked: Boolean,
  },
  methods: {
    onClickTag(tag) {
      this.$emit('tag', tag);
    },
    async onLike(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.localLiked && !this.liked) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.likeWork(id, readername);
          }
        } finally {
          this.localLikes = this.liked ? this.localLikes - 1 : this.localLikes + 1;
          this.localLiked = true;
          document.activeElement.blur();
        }
      }
    },
    async onRead(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.localRead && !this.read) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.readWork(id, readername);
          }
        } finally {
          this.localReads = this.read ? this.localReads - 1 : this.localReads + 1;
          this.localRead = true;
          document.activeElement.blur();
        }
      }
    },
  },
  computed: {
    timeString() {
      let localTime = this.hours * 6; // Let's assume people put 4 hours into a long shill a day at most
      if (localTime > 1437) return `${Math.trunc(localTime / 720)} months`;
      if (localTime > 719) return `${Math.trunc(localTime / 720)} month`;
      if (localTime > 333) return `${Math.trunc(localTime / 168)} weeks`;
      if (localTime > 167) return `${Math.trunc(localTime / 168)} week`;
      if (localTime > 47) return `${Math.trunc(localTime / 24)} days`;
      localTime = this.hours; // Readjust for small quantities
      if (localTime > 23) return `${Math.trunc(localTime / 24)} day`;
      if (localTime > 1) return `${localTime} hours`;
      return `${localTime} hour`;
    },
    hasSingleImage() {
      return this.imagesArray.length < 2;
    },
    likedTooltip() {
      return `${this.localLikes} people have enjoyed this work`;
    },
    readTooltip() {
      return `${this.localReads} people have finished this work`;
    },
    imagesArray() {
      return this.images.split(',');
    },
    tagsArray() {
      return this.tags.split(',');
    },
    cardGradient() {
      if (this.lightArtShills.includes(this.id)) return 'to bottom, black, transparent 60%, transparent';
      return '';
    },
  },
  created() {
    this.localLikes = this.likes;
    this.localReads = this.reads;
    this.localLiked = this.liked;
    this.localRead = this.read;
  },
  data() {
    return {
      localLikes: 0,
      localReads: 0,
      localLiked: false,
      localRead: false,
      lightArtShills: [1, 14, 17, 22, 37],
    };
  },
};
</script>

<style>
.v-card__text, .v-card__title {
  word-break: normal !important;
  }

.v-slide-group__next, .v-slide-group__prev{
  min-width: 0px !important;
  flex: none !important;
}
.spoiler{
  color: black;
  background-color:black;
}

.spoiler:hover{
  color: white;
}
</style>

<style scoped>
a {text-decoration: none; }
</style>
