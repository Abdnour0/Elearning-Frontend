import axios from 'axios';
import { API_BASE_URL, SANCTUM_CSRF_URL } from './config/apiBase.js';
import { showToast } from './composables/useToast.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      try {
        localStorage.removeItem('user');
      } catch { /* ignore */ }
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (status === 419 && !error.config._retry) {
      error.config._retry = true;
      return api.get(SANCTUM_CSRF_URL).then(() => {
        return api(error.config);
      }).catch(() => {
        showToast('Your session expired. Please sign in again.', 'error', 6000);
        setTimeout(() => { window.location.href = '/login'; }, 2000);
        return Promise.reject(error);
      });
    }

    if (status === 403) {
      showToast(message || 'Access denied.', 'error');
    } else if (status === 422) {
      // Validation errors — let individual forms handle them
    } else if (status === 429) {
      showToast(message || 'Too many requests. Please wait a moment.', 'warning', 6000);
    } else if (status >= 500) {
      showToast('Server error. Please try again later.', 'error');
    } else if (!error.response) {
      showToast('Could not reach the server. Check your connection.', 'error', 8000);
    }

    return Promise.reject(error);
  }
);

export default api;
