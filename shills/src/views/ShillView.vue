<template>
<v-container>
<div v-if="work">
  <v-card elevation="24" style="display: flex; flex-direction: column;">
    <v-card-title lights-out style="text-shadow: 0 0 2px #000, 0 0 3px #000, 0 0 4px #000;">{{name}}</v-card-title>
    <v-card-subtitle style="color: #fff; text-shadow: 0 0 1px #000, 0 0 2px #000">Author: {{author}}</v-card-subtitle>
    <v-card-text style="color: #fff; text-shadow: 0 0 1px #000, 0 0 2px #000">Available at: <a :href="link">{{link}}</a></v-card-text>
    <v-card-text class="py-0">
      <div> Click flag to mark as read:
      <v-icon class="mr-1" v-if="!isAuthenticated" @click="onRead(id)"> mdi-flag-outline </v-icon>
      <v-icon class="mr-1" v-else-if="isAuthenticated && !read" @click="onRead(id)"> mdi-flag-outline </v-icon>
      <v-icon class="mr-1" v-else @click="onRead(id)"> mdi-flag </v-icon>
      </div>
      <div> Click heart to mark as liked:
      <v-icon class="mr-1" v-if="!isAuthenticated" @click="onLike(id)"> mdi-heart-outline </v-icon>
      <v-icon class="mr-1" v-else-if="isAuthenticated && !liked" @click="onLike(id)"> mdi-heart-outline </v-icon>
      <v-icon class="mr-1" v-else @click="onLike(id)"> mdi-heart </v-icon>
      </div>
    </v-card-text>
    <v-card-title>DESCRIPTION</v-card-title>
    <v-card-text><div v-html="description"></div></v-card-text>
    <v-card-title>INFORMATION</v-card-title>
    <v-card-text>Time investment: {{hours === 1 ? '1 hour' : hours + ' hours'}} {{hours !=1 ? '('+timeString+')' : ''}}
      <br>{{amount}}
      <br>Read by: <span v-for="(reader,index) in readers" :key="'reader'+index"><span v-if="index>0">, </span><router-link :to="'/profile/'+reader.replace(/ /g, '+')">{{reader}}</router-link></span>
      <br>Liked by: <span v-for="(liker,index) in likers" :key="'liker'+index"><span v-if="index>0">, </span><router-link :to="'/profile/'+liker.replace(/ /g, '+')">{{liker}}</router-link></span>
      <br>Leaderboard tag: {{shortname}}
    </v-card-text>
    <v-card-title>ART</v-card-title>
    <v-card-text v-if="items.length < 1">None yet! I encourage you to make some and send it to me.</v-card-text>
    <CoolLightBox
      :items="items"
      :index="index"
      @close="index = null">
    </CoolLightBox>
    <div class="images-wrapper">
      <div class="image-wrapper" v-for="(image, imageIndex) in items" :key="imageIndex">
      <div
        class="image"
        @click="index = imageIndex"
        :style="{ backgroundImage: 'url(' + image.src + ')'}"
      >
      </div>
      </div>
    </div>
    <v-card-title class="pb-0">TAGS</v-card-title>
    <div style="display: flex; flex-direction: column; flex-grow: 1;">
      <v-card-actions style="align-items: end; display: flex; flex-grow: 1;">
        <v-container class="mb-0 pl-1 pb-1 align-self-end">
          <v-slide-group
            multiple
          >
            <v-slide-item
              v-for="tag in tagsArray"
              :key="tag"
            >
              <router-link :to="'/list/'+tag"><v-chip class="mr-1" style="cursor: pointer;">{{tag}}</v-chip></router-link>
            </v-slide-item>
          </v-slide-group>
        </v-container>
      </v-card-actions>
    </div>
    <v-card-title class="pb-0">REVIEWS ({{reviews.length}})</v-card-title>
    <div style="display: flex; flex-direction: column; flex-grow: 1;" class="">
      <div v-for="review in reviewsSorted" :key="review.id">
          <router-link :to="'/profile/'+review.readername.replace(/ /g, '+')"><v-card-title class="pb-0 mb-0">{{review.readername}}</v-card-title></router-link>
          <v-card-subtitle>{{new Date(review.created).toLocaleDateString("en",{timeZone:"UTC"})}}</v-card-subtitle>
        <v-card-text><span class="review">{{review.review}}</span></v-card-text>

      </div>
    </div>
    <div style="display: flex; flex-direction: column; flex-grow: 1;" class="ma-4" v-if="isAuthenticated">
      <v-form v-model="valid" ref="form">
        <v-textarea
        :label="reviewLabel"
        auto-grow
        v-model="reviewContent"
        :rules="rules"
      ></v-textarea>
      <v-btn
        :disabled="!valid"
        color="secondary"
        class="mr-4"
        @click="onSubmitReview"
      >
        Submit
      </v-btn>
      </v-form>
    </div>
  </v-card>
  </div>
</v-container>
</template>

<script>
import CoolLightBox from 'vue-cool-lightbox';
import api from '../auth/api';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';

export default {
  name: 'ShillView',
  components: { CoolLightBox },
  methods: {
    onClickTag(tag) {
      this.$emit('tag', tag);
    },
    async onLike(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.liked) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.likeWork(id, readername);
          }
        } finally {
          this.localLikes += 1;
          this.liked = true;
          document.activeElement.blur();
        }
      } else {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.likeWork(id, readername);
          }
        } finally {
          this.localLikes -= 1;
          this.liked = false;
          document.activeElement.blur();
        }
      }
    },
    async onRead(id) {
      if (!this.isAuthenticated) this.$auth.loginWithRedirect();
      else if (!this.read) {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.readWork(id, readername);
          }
        } finally {
          this.localReads += 1;
          this.read = true;
          document.activeElement.blur();
        }
      } else {
        try {
          const readername = this?.$auth?.user?.name;
          if (readername) {
            await api.readWork(id, readername);
          }
        } finally {
          this.localReads -= 1;
          this.read = false;
          document.activeElement.blur();
        }
      }
    },
    async onSubmitReview() {
      const reviewObject = {
        readername: this.$auth.user.name,
        workid: this.id,
        review: this.reviewContent,
      };
      try {
        await api.reviewWork(reviewObject);
      } catch (err) {
        console.log(err);
      } finally {
        this.reviews = await api.requestReviewsForWork(this.id);
      }
    },
    handleReviewDefault() {
      if (this.isAuthenticated) {
        const found = this.reviews.find((el) => el.readername === this.$auth.user.name);
        if (found) this.reviewContent = found.review;
      }
    },
  },
  computed: {
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    reviewLabel() {
      const found = this.reviews.find((el) => el.readername === this.$auth.user.name);
      if (found) return 'Edit your review';
      return 'Add new review';
    },
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
    items() {
      return this.props.art ? this.props.art : [];
    },
    tagsArray() {
      return this.tags.split(',');
    },
    reviewsSorted() {
      return [...this.reviews].reverse();
    },
    rules() {
      return [((v) => (v || '').length <= 5327 || 'A maximum of 5327 characters is allowed')];
    },
  },
  async created() {
    const shillId = Number.parseInt(this.$route.params.id, 10) || 1;
    this.id = shillId;
    this.username = this.$auth.user ? this.$auth.user.name : null;
    const promises = await Promise.all([
      await api.requestShillsList(),
      await api.requestAllWorksRead(),
      await api.requestAllWorksLiked(),
      await api.requestReviewsForWork(shillId),
    ]);
    const works = promises[0];
    const work = works.find((el) => el.id === shillId);
    document.title = work?.name ? `${work.name} - The Shills List` : 'Work Page - The Shills List';
    let readInts = promises[1];
    let likeInts = promises[2];
    const reviews = promises[3];
    this.readers = readInts.filter((el) => el.work === shillId).map((el) => el.readername);
    this.likers = likeInts.filter((el) => el.work === shillId).map((el) => el.readername);
    readInts = readInts.filter((read) => read.readername === this.username).map((el) => el.work);
    likeInts = likeInts.filter((like) => like.readername === this.username).map((el) => el.work);
    this.works = works;
    this.readInts = readInts;
    this.likeInts = likeInts;
    this.work = work;
    this.name = work.name;
    this.description = work.description;
    this.link = work.link;
    this.linkText = work.linkText;
    this.author = work.author;
    this.amount = work.amount;
    this.hours = work.hours;
    this.tags = work.tags;
    this.images = work.image;
    this.localLikes = work.likes;
    this.localReads = work.readers;
    this.shortname = work.shortname;
    this.reviews = reviews;
    this.handleReviewDefault();
    this.props = JSON.parse(work.props);
    this.read = !!promises[1].find((el) => el.readername === this.$auth?.user?.name && el.work === shillId);
    this.liked = !!promises[2].find((el) => el.readername === this.$auth?.user?.name && el.work === shillId);
  },
  data() {
    return {
      id: null,
      index: null,
      work: null,
      name: null,
      description: null,
      link: null,
      linkText: null,
      author: null,
      amount: null,
      hours: null,
      tags: null,
      images: null,
      props: null,
      works: [],
      readers: [],
      likers: [],
      readInts: [],
      likeInts: [],
      reviews: [],
      username: '',
      localLikes: 0,
      localReads: 0,
      read: false,
      liked: false,
      valid: false,
      reviewContent: null,
    };
  },
  watch: {
    ownReviewContent(oldContent, newContent) {
      this.reviewContent = newContent;
    },
  },
};
</script>

<style scoped>
a {text-decoration: none; }
.review {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>

<style>
.images-wrapper {
 display:-webkit-box;
 display:-ms-flexbox;
 display:flex;
 flex-wrap: wrap;
 margin-right:-10px;
 margin-left: 15px;
}
.image-wrapper {
  flex-basis: 30%;
}
@media (min-width:767px){
  .image-wrapper {
    flex-basis: 10%;
  }
}
@media (min-width:767px) {
 .images-wrapper {
  margin-right:-20px
 }
}
.images-wrapper .image-wrapper {
 margin-bottom:10px;
 width:calc(50% - 10px);
 margin-right:10px
}
@media (min-width:767px) {
 .images-wrapper .image-wrapper {
  margin-bottom:20px;
  width:calc(16.66667% - 20px);
  margin-right:20px
 }
}
.images-wrapper .image-wrapper .image {
 cursor:pointer;
 background-position:50%;
 background-repeat:no-repeat;
 background-size:cover;
 padding-top:100%
}
</style>
