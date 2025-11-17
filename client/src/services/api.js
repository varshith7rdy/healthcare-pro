import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
};

export const healthAPI = {
  getWearables: () => api.get('/health/wearables'),
  syncWearable: (deviceId) => api.post('/health/sync', { deviceId }),
};

export const chatAPI = {
  sendQuery: (message) => api.post('/chat/query', { message }),
};

export const appointmentsAPI = {
  getAppointments: () => api.get('/appointments'),
  bookAppointment: (data) => api.post('/appointments/book', data),
  cancelAppointment: (id) => api.delete(`/appointments/${id}`),
};

export const analyticsAPI = {
  getOverview: (timeRange = '7d') => api.get('/analytics/overview', { params: { timeRange } }),
};

export const recordsAPI = {
  getRecords: () => api.get('/records'),
  uploadRecord: (formData) => api.post('/records/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteRecord: (id) => api.delete(`/records/${id}`),
};

export default api;
