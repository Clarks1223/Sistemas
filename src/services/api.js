import axios from 'axios';

const isDevelopment = import.meta.env.MODE === 'development';
const baseurl = isDevelopment
  ? import.meta.env.VITE_BACKEND_DEV
  : import.meta.env.VITE_BACKEND_PROD;

const api = axios.create({
  baseURL: baseurl + '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const c04Service = {
  getAll: () => api.get('c04/'),
  create: (data) => api.post('c04/', data),
  update: (id, data) => api.put(`c04/${id}/`, data),
  patch: (id, data) => api.patch(`c04/${id}/`, data),
  delete: (id) => api.delete(`c04/${id}/`),
};

export default api;
