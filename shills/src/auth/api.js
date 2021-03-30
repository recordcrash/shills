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
};

export default api;
