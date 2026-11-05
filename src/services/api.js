import axios from 'axios';

const API = axios.create({
  // 👇 এখানে আপনার সঠিক Render লিংকটি বসালাম (project শব্দটি সহ)
  baseURL: 'https://nineteenz-project.onrender.com/api', 
});

API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default API;