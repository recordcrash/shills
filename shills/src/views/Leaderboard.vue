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
        <router-link :to="'profile/'+item.name">
          {{ item.name }}
        </router-link>
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
    getColor(number) {
      return this.makeColor(number * (number / 518));
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
</style>
