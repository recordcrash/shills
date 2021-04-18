<template>
  <div class="shills-list">
    <v-row class="filters pa-2">
      <v-col cols="4">
        <v-autocomplete
          v-model="includedTags"
          :items="allTags"
          outlined
          dense
          chips
          small-chips
          deletable-chips
          label="Show only"
          multiple
        ></v-autocomplete>
      </v-col>
      <v-col cols="4">
        <v-autocomplete
          v-model="excludedTags"
          :items="allTags"
          outlined
          dense
          chips
          small-chips
          deletable-chips
          label="Exclude"
          multiple
        ></v-autocomplete>
      </v-col>
      <v-col cols="4">
         <v-select
          v-model="sortedBy"
          :items="sortings"
          label="Sort by"
          outlined
          dense
        ></v-select>
      </v-col>
    </v-row>
    <div class="shills">
    <v-layout row wrap>
      <shill-card v-for="shill in filteredShills" v-bind:key="shill.id" class="ma-5 mx-5" :isAuthenticated="isAuthenticated"
      :maxWidth="375"
      :id="shill.id"
      :likes="shill.likes" :reads="shill.likes"
      :name="shill.name"
      :shortName="shill.shortname"
      :author="shill.author"
      :description="shill.description"
      :link="shill.link"
      :linkText="shill.linktext"
      :hours="shill.hours"
      :amount="shill.amount"
      :images="shill.image"
      :tags="shill.tags"
      :read="isRead(shill.id)"
      :liked="isLiked(shill.id)"
      @tag="onTag"/>
    </v-layout>
    </div>
  </div>
</template>

<script>
import ShillCard from '../components/ShillCard.vue';
import api from '../auth/api';

export default {
  name: 'ShillsList',
  props: {
    type: String,
  },
  components: {
    ShillCard,
  },
  computed: {
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    sortedShillsList() {
      if (this.shills === []) return [];
      switch (this.sortedBy) {
        case 'Likes':
          return [...this.shills].sort((a, b) => b.likes - a.likes);
        case 'Alphabetical':
          return [...this.shills].sort((a, b) => a.name.localeCompare(b.name));
        case 'Time investment':
          return [...this.shills].sort((a, b) => b.hours - a.hours);
        case 'Recommended':
        default:
          return this.shills;
      }
    },
    filteredShills() {
      return this.sortedShillsList.filter(
        (shill) => this.includedTags.every((selTag) => shill.tags.split(',').includes(selTag))
          && !this.excludedTags.some((selTag) => shill.tags.split(',').includes(selTag)),
      );
    },
    allTags() {
      const allTags = new Set();
      if (this.shills === []) return [];
      this.shills.forEach((shill) => shill.tags.split(',').forEach((tag) => allTags.add(tag)));
      return Array.from(allTags);
    },
  },
  methods: {
    isRead(id) {
      return !!this.reads.find((el) => el.readername === this.$auth?.user?.name && el.work === id);
    },
    isLiked(id) {
      return !!this.likes.find((el) => el.readername === this.$auth?.user?.name && el.work === id);
    },
    onTag(tag) {
      this.includedTags = [tag];
      this.excludedTags = [];
    },
  },
  async created() {
    const promises = await Promise.all([
      await api.requestShillsList({ auth: this.$auth, type: this.type }),
      await api.requestReaders({ auth: this.$auth }),
      await api.requestAllWorksRead(),
      await api.requestAllWorksLiked(),
    ]);
    const works = promises[0];
    const readers = promises[1];
    const reads = promises[2];
    const likes = promises[3];
    this.readers = readers;
    this.shills = works;
    this.reads = reads;
    this.likes = likes;
  },
  data() {
    return {
      readers: [],
      shills: [],
      reads: [],
      likes: [],
      includedTags: ['Main'],
      excludedTags: ['Flawed'],
      sortings: ['Likes', 'Recommended', 'Alphabetical', 'Time investment'],
      sortedBy: 'Recommended',
    };
  },
};
</script>
