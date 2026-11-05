import axios from 'axios';

const API = axios.create({
  baseURL: 'https://nineteenz-project.onrender.com/api', // 👈 এখানে পরিবর্তন করা হয়েছে
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