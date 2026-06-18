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
      // Session expired — redirect to login. The Sanctum session cookie
      // is invalidated server-side. No localStorage cleanup is needed.
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (status === 419) {
      // CSRF Token Mismatch — Silent expiry. Reloading the page forces
      // the browser and Axios to grab a fresh session and CSRF cookie.
      window.location.reload();
      return Promise.reject(error);
    }

    if (status === 403) {
      showToast(message || 'Accès refusé. Vous n\'avez pas les permissions nécessaires.', 'error');
    } else if (status === 422) {
      // Validation errors — let individual forms handle them, don't show toast
    } else if (status === 429) {
      showToast(message || 'Trop de requêtes. Veuillez patienter un moment.', 'warning', 6000);
    } else if (status >= 500) {
      showToast('Une erreur serveur est survenue. Veuillez réessayer plus tard.', 'error');
    } else if (!error.response) {
      // Network error (no response at all)
      showToast('Impossible de contacter le serveur. Vérifiez votre connexion.', 'error', 8000);
    }

    return Promise.reject(error);
  }
);

export default api;
