import { defineStore } from 'pinia';
import axios from 'axios';
import api from '../axios';
import { API_BASE_URL } from '../config/apiBase.js';

// Sanctum CSRF cookie lives at the web root, NOT under /api.
// e.g. http://localhost:8000/sanctum/csrf-cookie
const SANCTUM_URL = API_BASE_URL.replace(/\/api(?:\/v\d+)?$/, '') + '/sanctum/csrf-cookie';

async function refreshCsrf() {
  await axios.get(SANCTUM_URL, { withCredentials: true });
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole:        (state) => state.user?.role || null,
    isAdmin:         (state) => state.user?.role === 'admin',
    isFormateur:     (state) => state.user?.role === 'formateur',
    isApprenant:     (state) => state.user?.role === 'apprenant',
  },

  actions: {
    _persist(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    async login(credentials) {
      await refreshCsrf();
      const { data } = await api.post('/auth/login', credentials);
      this._persist(data.user);
      return data;
    },

    async register(payload) {
      await refreshCsrf();
      const { data } = await api.post('/auth/register', payload);
      this._persist(data.user);
      return data;
    },

    async fetchUser() {
      if (!this.user) return;
      try {
        const { data } = await api.get('/auth/user');
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data));
      } catch {
        this.logout();
      }
    },

    async logout() {
      if (this.user) {
        try { await api.post('/auth/logout'); } catch { /* ignore */ }
      }
      this.user = null;
      localStorage.removeItem('user');
    },
  },
});
