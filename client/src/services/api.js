import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

// Records APIs
export const recordsAPI = {
  getAll: (params) => API.get('/records', { params }),
  create: (data) => API.post('/records', data),
  update: (id, data) => API.put(`/records/${id}`, data),
  delete: (id) => API.delete(`/records/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: () => API.get('/dashboard'),
};

// Users APIs
export const usersAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
};

export default API;
