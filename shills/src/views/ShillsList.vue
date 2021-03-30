<template>
  <div class="shills-list">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <shill-card v-for="shill in sortedShillsList" v-bind:key="shill.id" class="ma-5" :isAuthenticated="isAuthenticated"
        :maxWidth="400"
        :likes="shill.likes" :reads="shill.likes"
        :name="shill.name"
        :description="shill.description"
        :link="shill.link"
        :linkText="shill.linktext"
        :hours="shill.hours"
        :amount="shill.amount"
        :images="[shill.image]"
        :tags="['Rational', 'Meme']"/>
      </v-layout>
    </v-container>
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
      return [...this.shills].sort((a, b) => b.likes - a.likes);
    },
  },
  async created() {
    this.shills = await api.requestShillsList({ auth: this.$auth, type: this.type });
  },
  data() {
    return {
      shills: [],
      images: [
        'https://i.imgur.com/ig2HPNi.jpg',
        'https://i.imgur.com/hEXhxy6.jpg',
        'https://i.imgur.com/9DRgUJF.jpg',
      ],
      tags: [
        'Rational',
        'Horror',
        'Fat Husky',
      ],
    };
  },
};
</script>
