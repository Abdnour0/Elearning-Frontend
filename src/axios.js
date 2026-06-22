import axios from 'axios';
import { API_BASE_URL } from './config/apiBase.js';
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
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (status === 419 && !error.config._retry) {
      error.config._retry = true;
      return api.get('/sanctum/csrf-cookie').then(() => {
        return api(error.config);
      }).catch(() => {
        showToast('Session expirée. Veuillez vous reconnecter.', 'error', 6000);
        setTimeout(() => { window.location.href = '/login'; }, 2000);
        return Promise.reject(error);
      });
    }

    if (status === 403) {
      showToast(message || 'Accès refusé.', 'error');
    } else if (status === 422) {
      // Validation errors — let individual forms handle them
    } else if (status === 429) {
      showToast(message || 'Trop de requêtes. Veuillez patienter.', 'warning', 6000);
    } else if (status >= 500) {
      showToast('Erreur serveur. Veuillez réessayer plus tard.', 'error');
    } else if (!error.response) {
      showToast('Impossible de contacter le serveur. Vérifiez votre connexion.', 'error', 8000);
    }

    return Promise.reject(error);
  }
);

export default api;
