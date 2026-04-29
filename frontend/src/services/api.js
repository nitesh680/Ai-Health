import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Auto-attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mindwell_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mindwell_token');
      localStorage.removeItem('mindwell_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Chat
export const chatAPI = {
  sendAI: (data) => api.post('/chat/ai', data),
  getHistory: (sessionId) => api.get(`/chat/history/${sessionId}`),
  getSessions: () => api.get('/chat/sessions'),
  getSummary: (sessionId) => api.get(`/chat/summary/${sessionId}`),
  sendDirect: (data) => api.post('/chat/send', data),
  getDirectMessages: (userId) => api.get(`/chat/direct/${userId}`),
  getStressLevel: () => api.get('/chat/stress'),
};

// Mood
export const moodAPI = {
  log: (data) => api.post('/mood', data),
  getHistory: (days = 30) => api.get(`/mood/history?days=${days}`),
  getAnalytics: (userId) => api.get(`/mood/analytics${userId ? `?userId=${userId}` : ''}`),
  getPatientMood: (patientId) => api.get(`/mood/patient/${patientId}`),
};

// Appointments
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  getDoctors: () => api.get('/appointments/doctors'),
};

// Journal
export const journalAPI = {
  create: (data) => api.post('/journal', data),
  getAll: () => api.get('/journal'),
  getPrompts: () => api.get('/journal/prompts'),
  delete: (id) => api.delete(`/journal/${id}`),
};

// Users
export const userAPI = {
  getAll: (filters) => api.get('/users', { params: filters }),
  update: (id, data) => api.put(`/users/${id}`, data),
  getDoctors: () => api.get('/users/doctors'),
  getPatients: () => api.get('/users/patients'),
  getProfile: (id) => api.get(`/users/${id}`),
  addTrustedContact: (data) => api.post('/users/trusted-contacts', data),
  updateContactConsent: (contactId, data) => api.put(`/users/trusted-contacts/${contactId}/consent`, data),
  removeTrustedContact: (contactId) => api.delete(`/users/trusted-contacts/${contactId}`),
};

// Admin
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getAuditLogs: (filters) => api.get('/admin/audit-logs', { params: filters }),
  getCrisisAlerts: () => api.get('/admin/crisis-alerts'),
  acknowledgeCrisis: (id) => api.put(`/admin/crisis-alerts/${id}/acknowledge`),
  getChatLogs: (filters) => api.get('/admin/chat-logs', { params: filters }),
};

export default api;
