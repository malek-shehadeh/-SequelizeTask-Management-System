// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4025', // Adjust this URL if your backend runs on a different port
});

export default instance;
