<template>
  <div class="leaderboard">
    <v-data-table
    :headers="headers"
    :items="sortedElements"
    :items-per-page="99"
    hide-default-footer
    fixed-header
    dense
    height="100vh"
    mobile-breakpoint="0"
    class="elevation-1"
  >
  <template v-slot:[`item.name`]="{ item }">
        <router-link :to="'profile/'+item.name"><span :title="item.name">{{getTrueNameString(item.name)}}</span></router-link>
        <span v-for="medal in getMedals(item)" :key="medal.name">
          <img :src="medal.link" class="medal" :title="medal.description"/>
        </span>
  </template>
  <template v-slot:[`item.count`]="{ item }">
      <v-chip
        :color="getColor(item.count)"
        dark
      >
        {{ item.count }}
      </v-chip>
  </template>
  </v-data-table>
  </div>
</template>

<script>
import api from '../auth/api';

export default {
  name: 'Leaderboard',
  computed: {
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    sortedElements() {
      return [...this.elements].sort((a, b) => b.count - a.count);
    },
  },
  async created() {
    const promises = await Promise.all([
      await api.requestShillsList({ auth: this.$auth, type: this.type }),
      await api.requestAllWorksRead(),
    ]);
    const works = promises[0];
    const reads = promises[1];
    const elements = this.getElementsByReadsArray(works, reads);

    const headers = [{
      text: 'Shill Reader',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Shills finished',
      value: 'count',
    },
    {
      text: 'Hours spent',
      value: 'hours',
    }];
    works.forEach((work) => {
      headers.push({
        text: work.shortname,
        value: work.id.toString(),
      });
    });
    this.headers = headers;
    this.reads = reads;
    this.works = works;
    this.elements = elements;
  },
  methods:
  {
    getElementsByReadsArray(works, reads) {
      const elements = [];
      reads.forEach((read) => {
        const foundWork = works.find((el) => el.id === read.work);
        // if we need to initialize a new reader row
        const foundElement = elements.find((el) => el.name === read.readername);
        if (!foundElement) {
          const element = {};
          element.name = read.readername;
          works.forEach((work) => { (element[work.id.toString()] = 'NO'); });
          element[read.work.toString()] = 'YES';
          element.hours = foundWork.hours;
          element.count = 1;
          elements.push(element);
        } else { // Otherwise we find the existing element
          foundElement[read.work.toString()] = 'YES';
          foundElement.hours += foundWork.hours;
          foundElement.count += 1;
        }
      });
      return elements;
    },
    getMedals(reader) {
      const medals = [];
      const goldMedal = { name: 'Gold Medal', link: 'https://recordcrash.com/images/gold.png', description: 'A medal granted to those who finish the main shills list' };
      const silverMedal = { name: 'Silver Medal', link: 'https://recordcrash.com/images/silver.png', description: 'A medal granted to those who finish over ten shills' };
      const gameMedal = { name: 'Game Medal', link: 'https://recordcrash.com/images/game.png', description: 'A medal granted to those who finish all the games in the shills list' };
      const tvMedal = { name: 'Video Medal', link: 'https://recordcrash.com/images/tv.png', description: 'A medal granted to those who finish all the video shills' };
      const bookMedal = { name: 'Book Medal', link: 'https://recordcrash.com/images/book.png', description: 'A medal granted to those who finish the additional shills' };
      const goldMedalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      const gameMedalArray = [30, 31, 32];
      const tvMedalArray = [33, 34];
      const bookMedalArray = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
      const localReads = this.reads.filter((read) => read.readername === reader.name).map((el) => el.work);
      if (goldMedalArray.every((el) => localReads.includes(el))) medals.push(goldMedal);
      if (localReads.length > 10) medals.push(silverMedal);
      if (gameMedalArray.every((el) => localReads.includes(el))) medals.push(gameMedal);
      if (tvMedalArray.every((el) => localReads.includes(el))) medals.push(tvMedal);
      if (bookMedalArray.every((el) => localReads.includes(el))) medals.push(bookMedal);
      return medals;
    },
    getColor(number) {
      return this.makeColor(number * (number / 518));
    },
    getTrueNameString(string) {
      const length = 12;
      return string.length > length ? `${string.substring(0, length)}…` : string;
    },
    makeColor(value) {
      // value must be between [0, 510]
      value = Math.min(Math.max(0, value), 1) * 510;

      let redValue;
      let greenValue;
      if (value < 255) {
        redValue = 255;
        greenValue = Math.sqrt(value) * 16;
        greenValue = Math.round(greenValue);
      } else {
        greenValue = 255;
        value -= 255;
        redValue = 256 - (value * (value / 255));
        redValue = Math.round(redValue);
      }

      return `#${this.intToHex(redValue * 0.3)}${this.intToHex(greenValue * 0.3)}00`;
    },

    intToHex(i) {
      const hex = Number.parseInt(i, 10).toString(16);
      return (hex.length < 2) ? `0${hex}` : hex;
    },
  },
  data() {
    return {
      works: [],
      headers: [],
      reads: [],
      elements: [],
    };
  },
};
</script>
<style>
  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1) {
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 1;
    background: #1e1e1e;
  }
  table > thead > tr > th {
    z-index: 2 !important;
  }
  /* GOD LOOK AT THIS CODE, IT'S TOTALLY NOT A HUGE EMBARASSING HACK*/
  table > thead > tr > th:nth-child(1) {
    z-index: 3 !important;
  }
  .medal {
    margin-left: 4px;
    vertical-align: middle;
  }
</style>
