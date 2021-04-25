<template>
  <div class="statsList">
    <div class="d-flex flex-row justify-center"><h1>TRENDING SHILLS</h1></div>
    <div class="d-flex flex-row ma-6 justify-center">
      <div class="frameworks justify-center" v-if="reads">
        <shill-stat v-for="(read,i) in topReads" :key="i" :index="i + 1" :data="read.data" :slug="read.slug" />
      </div>
    </div>
    <div class="d-flex flex-row justify-center"><h1>GLOBAL STATS</h1></div>
    <div class="d-flex flex-row flex-wrap justify-center">
      <div class="stat justify-center" v-for="(stat, i) in stats" :key="i">
        <v-row align="center" justify="center"><v-col class="statIcon"><v-row justify="center"><v-icon large>{{stat.icon}}</v-icon></v-row></v-col>
        <v-col class="statText"><v-card-title>{{stat.name}}</v-card-title>
        <v-card-text>{{stat.value}}</v-card-text></v-col></v-row>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../auth/api';
import ShillStat from '../components/ShillStat.vue';

export default {
  name: 'Stats',
  components: {
    ShillStat,
  },
  data() {
    return {
      data: null,
      works: [],
      reads: [],
      rawReads: [],
      hoursWasted: 0,
    };
  },
  computed: {
    topReads() {
      const numberOfGraphs = 6;
      if (this.reads.length > 0) {
        const readArray = [...this.reads.filter((el) => el !== undefined && el.data.length > 3)];
        return readArray.sort((a, b) => (b.data[b.data.length - 1].value + b.data[b.data.length - 2].value + b.data[b.data.length - 3].value) - (a.data[a.data.length - 1].value + a.data[a.data.length - 2].value + a.data[a.data.length - 3].value)).slice(0, numberOfGraphs);
      }
      return [];
    },
    topReader() {
      return [...this.readArray].sort((a, b) => b.value - a.value)[1];
    },
    topShamed() {
      return [...this.readArray].filter((el) => el.hours > 30).sort((a, b) => a.hours / a.value - b.hours / b.value)[0];
    },
    readArray() {
      const readArray = [];
      this.rawReads.forEach((el) => {
        const found = readArray.find((read) => read.readername === el.readername);
        if (!found) {
          const element = { readername: el.readername, value: 1, hours: this.works.find((work) => work.id === el.work).hours };
          readArray.push(element);
        } else {
          found.value += 1;
          found.hours += this.works.find((work) => work.id === el.work).hours;
        }
      });
      return readArray;
    },
    timeWasted() {
      const years = Math.floor(this.hoursWasted / 365 / 24);
      const months = Math.floor(this.hoursWasted / 24 / 30) - years * 12;
      const days = Math.floor(this.hoursWasted / 24) - months * 30 - years * 365;
      const yearString = years !== 1 ? `${years} years` : '1 year';
      const monthString = months !== 1 ? `${months} months` : '1 month';
      const dayString = days !== 1 ? `${days} days` : '1 day';
      return `${yearString}, ${monthString}, ${dayString}`;
    },
    stats() {
      const hoursWastedStat = { name: 'Total time wasted', icon: 'mdi-clock', value: this.timeWasted };
      const currentTopReader = { name: 'Top reader', icon: 'mdi-medal-outline', value: `${this.topReader?.readername} (${this.topReader?.value} shills)` };
      const currentlyShamedUser = { name: 'Laziest reader', icon: 'mdi-emoticon-devil', value: `${this.topShamed?.readername} (${Math.round((this.topShamed?.hours / this.topShamed?.value) * 100) / 100} hours/shill)` };
      const userCount = { name: 'User count', icon: 'mdi-human', value: `${this.readArray.length} registered users` };
      const favoriteUser = { name: 'Favorite user', icon: 'mdi-mirror', value: 'You!' };
      return [hoursWastedStat, currentTopReader, currentlyShamedUser, userCount, favoriteUser];
    },
  },
  methods: {
    numberWithSpaces(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    onMouseMove(params) {
      if (!params) {
        this.currentInfo = null;
        return;
      }
      this.currentInfo = {
        label: params.data[0].day,
        value: this.numberWithSpaces(params.data[0].value),
      };
    },
    convertDate(dateString) {
      let dateObject = new Date(dateString);
      const offset = dateObject.getTimezoneOffset();
      dateObject = new Date(dateObject.getTime() - (offset * 60 * 1000));
      return dateObject.toISOString().split('T')[0];
    },
    getWorkName(work) {
      return this.works.find((el) => el.id === work.work)?.name;
    },
    addTime(read) {
      const found = this.works.find((el) => el.id === read.work);
      this.hoursWasted += found && found.hours ? found.hours : 0;
    },
    prepareReadsArray(reads) {
      const dataArray = [];
      reads.filter((el) => el.readername != null).forEach((el) => {
        this.addTime(el);
        if (dataArray[el.work]) {
          const foundDate = dataArray[el.work].data.find((date) => date.day === this.convertDate(el.created));
          if (foundDate) {
            foundDate.value += 1;
          } else {
            const element = { day: this.convertDate(el.created), value: 1 };
            dataArray[el.work].data.push(element);
          }
        } else {
          const element = { day: this.convertDate(el.created), value: 1 };
          dataArray[el.work] = {};
          dataArray[el.work].data = [element];
          dataArray[el.work].slug = this.getWorkName(el);
        }
      });
      return dataArray;
    },
  },
  async created() {
    const promises = await Promise.all([
      await api.requestShillsList({ auth: this.$auth, type: this.type }),
      await api.requestAllWorksRead(),
    ]);
    const works = promises[0];
    const reads = promises[1];
    this.works = works;
    this.reads = this.prepareReadsArray(reads);
    this.rawReads = reads;
  },
};
</script>

<style lang="scss">
.stat {
  max-width: 400px;
  min-width: 325px;
  .statIcon {
    flex-basis: 20%;
  }
  .statText {
    flex-basis: 80%;
  }
}
.frameworks {
  display: flex;
  flex-wrap: wrap;
  .vtc {
    width: 160px;
    height: 60px;
    margin-right: -5px;
  }
  .stroke {
    stroke-width: 2;
  }
  .fill {
    opacity: 0.2;
  }
  .active-line {
    stroke: rgba(255, 255, 255, 0.8);
  }
  .point {
    display: none;
  }
  .point.is-active {
    display: block;
  }
}
</style>
