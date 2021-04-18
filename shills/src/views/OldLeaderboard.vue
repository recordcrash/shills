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
  name: 'OldLeaderboard',
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
      await api.requestReaders({ auth: this.$auth }),
      await api.requestProgress({ auth: this.$auth }),
    ]);
    const works = promises[0];
    const readers = promises[1];
    const progress = promises[2];
    readers.forEach((reader) => {
      reader.progresses = progress.filter((el) => el.readerid === reader.id).map((el) => el.workid);
    });
    const elements = [];

    readers.forEach((reader) => {
      const element = {};
      element.name = reader.name;
      works.forEach((el) => { element[el.id.toString()] = reader.progresses.find((workId) => workId === el.id) ? 'YES' : 'NO'; });
      element.count = reader.progresses.length;
      const initialHours = 0;
      const hoursReducer = (acc, item) => (reader.progresses.find((workId) => workId === item.id) ? acc + Number.parseInt(item.hours, 10) : acc + 0);
      element.hours = works.reduce(hoursReducer, initialHours);
      elements.push(element);
    });
    this.readers = readers;
    this.shills = works;
    this.progress = progress;
    this.elements = elements;
    const headers = [{
      text: 'Shill Reader',
      align: 'start',
      sortable: false,
      value: 'name',
    },
    {
      text: 'Shills read',
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
  },
  methods:
  {
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
      readers: [],
      works: [],
      progress: [],
      elements: [],
      headers: [],
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
    z-index: 9997;
    background: #1e1e1e;
  }
  table > thead > tr > th {
    z-index: 9998 !important;
  }
  /* GOD LOOK AT THIS CODE, IT'S TOTALLY NOT A HUGE EMBARASSING HACK*/
  table > thead > tr > th:nth-child(1) {
    z-index: 9999 !important;
  }
</style>
