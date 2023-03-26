import axios from 'axios';

const HTTPClient = axios.create({
  baseURL: process.env.PROJECT_POSTS_SERVICE_URL,
});

export default HTTPClient;
