<template>
  <div class="shills-list">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <shill-card v-for="index in 10" v-bind:key="index" class="ma-5" />
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ShillCard from '../components/ShillCard.vue';

export default {
  name: 'ShillsList',
  components: {
    ShillCard,
  },
};
</script>
