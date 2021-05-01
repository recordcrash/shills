import axios from 'axios';

const api = {
  async requestToken(auth) {
    const token = await auth.getTokenSilently();
    const { data } = await axios.get('/api/external', {
      headers: {
        Authorization: `Bearer ${token}`, // send the access token through the 'Authorization' header
      },
    });
    return data;
  },

  async requestShillsList() {
    const { data } = await axios.get('https://recordcrash.com:3141/works');
    return data;
  },

  async requestReaders() {
    const { data } = await axios.get('https://recordcrash.com:3141/readers');
    return data;
  },
  async requestProgress() {
    const { data } = await axios.get('https://recordcrash.com:3141/progress');
    return data;
  },

  async requestAllWorksRead() {
    const { data } = await axios.get('https://recordcrash.com:3141/works/worksread/1');
    return data;
  },
  async requestAllWorksLiked() {
    const { data } = await axios.get('https://recordcrash.com:3141/works/worksliked/1');
    return data;
  },
  async requestReviewsForWork(id) {
    const { data } = await axios.get(`https://recordcrash.com:3141/works/reviews/${id}`);
    return data;
  },
  async requestReviewsByReader(username) {
    const { data } = await axios.get(`https://recordcrash.com:3141/works/reviewsbyreader/${username}`);
    return data;
  },
  async reviewWork(reviewObject) {
    const { data } = await axios.post(`https://recordcrash.com:3141/works/review/${reviewObject.workid}`, reviewObject);
    return data;
  },
  async likeWork(id, readername) {
    const { data } = await axios.post(`https://recordcrash.com:3141/works/like/${id}/${readername}`);
    return data;
  },
  async readWork(id, readername) {
    const { data } = await axios.post(`https://recordcrash.com:3141/works/read/${id}/${readername}`);
    return data;
  },
};

export default api;
