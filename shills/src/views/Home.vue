<template>
  <div class="statsList">
    <div class="d-flex flex-row justify-center pt-3 pb-0"><h2>WELCOME TO <router-link to="/list/main">THE SHILLS LIST</router-link></h2></div>
    <div class="d-flex flex-row flex-wrap justify-center ma-6">
      <div class="justify-center">
        <v-row justify="center">
          <v-col class="latestTweets">
            <v-card-title class="pb-0">LATEST TWEETS</v-card-title>
            <div class="tweetList" v-if="tweets">
              <div v-for="(tweet, index) in tweets" :key="index">
                <div class="tweet">
                  <v-card-text class="py-0 font-weight-bold"><span class="tweetText"><a href="https://twitter.com/RecordCrash">@RecordCrash</a>: {{tweet.text}}</span></v-card-text>
                  <div class="storyContainer">
                    <v-card-text v-if="tweet.storyTitle" class="pb-0"><a :href="tweet.url ? tweet.url : null">{{tweet.storyTitle}}</a></v-card-text>
                    <v-card-subtitle v-if="tweet.storyText" class="pt-0 font-italic">{{tweet.storyText}}</v-card-subtitle>
                  </div>
                  <v-divider></v-divider>
                </div>
              </div>
            </div>
          </v-col>
          <v-col v-if="latestCompletions" class="latestCompletions">
            <v-card-title>RECENT ACTIVITY</v-card-title>
            <div v-if="latestCompletions">
              <v-list-item two-line v-for="(work, index) in latestCompletions" :key="index">
                <v-list-item-content>
                  <router-link :to="work.link"><v-list-item-title>{{work.readername}}</v-list-item-title></router-link>
                  <v-list-item-subtitle>{{work.name}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </div>
          </v-col>
          <v-col class="latestReviews">
            <v-card-title class="pb-0">LATEST REVIEWS</v-card-title>
            <div v-if="latestReviews">
              <div v-for="(review, index) in latestReviews" :key="index">
                  <router-link :to="getWorkUrl(review.workid)"><v-card-title class="pb-0">{{getWorkName({work: review.workid})}}</v-card-title></router-link>
                  <router-link :to="getReaderUrl(review.readername)"><v-card-subtitle class="pt-0 font-italic">{{review.readername}}</v-card-subtitle></router-link>
                  <v-card-text class="py-0"><span class="review">{{review.review}}</span></v-card-text>
              </div>
            </div>
          </v-col>
          <v-col class="globalStats">
            <v-card-title class="pb-0">GLOBAL STATS</v-card-title>
            <div class="stat d-flex flex-row flex-wrap justify-center" v-if="stats" >
              <v-row class="stat justify-center ml-3 mt-2" v-for="(stat, i) in stats" :key="i">
                <v-row align="center" justify="center"><v-col class="statIcon"><v-row justify="center"><v-icon large>{{stat.icon}}</v-icon></v-row></v-col>
                <v-col class="statText"><v-card-title>{{stat.name}}</v-card-title>
                <v-card-text>{{stat.value}}</v-card-text></v-col></v-row>
              </v-row>
            </div>
          </v-col>
          <v-col class="trendingShills">
            <v-card-title class="pb-0">TRENDING SHILLS</v-card-title>
            <div class="d-flex flex-row ma-6 justify-start">
              <div class="frameworks" v-if="reads">
                <shill-stat v-for="(read,i) in topReads" :key="i" :index="i + 1" :data="read.data" :slug="read.slug" />
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

  </div>
</template>

<script>
import api from '../auth/api';
import ShillStat from '../components/ShillStat.vue';

export default {
  name: 'Home',
  components: {
    ShillStat,
  },
  data() {
    return {
      data: null,
      works: [],
      tweets: [],
      reads: [],
      rawReads: [],
      reviews: [],
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
      return [...this.readArray].sort((a, b) => b.value - a.value)[0];
    },
    topShamed() {
      return [...this.readArray].filter((el) => el.hours > 30).sort((a, b) => a.hours / a.value - b.hours / b.value)[0];
    },
    latestReviews() {
      return [...this.reviews].reverse().slice(0, 4);
    },
    latestCompletions() {
      return [...this.rawReads].reverse().slice(0, 8).map((el) => ({
        name: this.getWorkName({ work: el.work }),
        readername: el.readername,
        link: this.getReaderUrl(el.readername),
      }));
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
      const years = Math.floor(this.hoursWasted / 365.2422 / 24);
      const months = Math.floor((this.hoursWasted / 24 / 30.436875) - years * 12);
      const days = Math.floor((this.hoursWasted / 24) - months * 30 - years * 365.2422);
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
    getWorkUrl(id) {
      return `/shill/${id}/${this.works.find((el) => el.id === id)?.name.replace(/ /g, '+')}`;
    },
    getReaderUrl(readername) {
      return `/profile/${readername.replace(/ /g, '+')}`;
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
  async mounted() {
    const promises = await Promise.all([
      await api.requestShillsList({ auth: this.$auth, type: this.type }),
      await api.requestAllWorksRead(),
      await api.requestTweets(),
    ]);
    const [works, reads, tweets] = promises;
    this.works = works;
    this.tweets = tweets;
    this.reads = this.prepareReadsArray(reads);
    this.rawReads = reads;
    this.reviews = await api.requestAllReviews();
  },
};
</script>

<style lang="scss">
.stat {
  max-width: 400px;
  min-width: 300px;
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
  max-width: 200px;
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

<style scoped>
a {text-decoration: none; }
.review {
  white-space: pre-wrap;
  line-height: 1.6;
}
.latestCompletions {
  max-width: 360px;
}
.latestReviews {
  max-width: 800px;
  min-width: 300px;
}
.tweet {
  margin-top: 10px;
}
.latestTweets{
  max-width: 800px;
  min-width: 400px;
}
.tweetList {
  max-height: 500px;
  overflow-y: scroll;
}
.storyContainer{
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  margin: 20px;
}
</style>