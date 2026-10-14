import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.15 });

const routes = [
  // Public
  { path: '/', meta: { title: 'Accueil — E-Learning Hub' }, component: () => import('../views/HomeView.vue') },
  { path: '/login', meta: { guest: true, title: 'Connexion' }, component: () => import('../views/LoginView.vue') },
  { path: '/register', meta: { guest: true, title: 'Inscription' }, component: () => import('../views/RegisterView.vue') },
  { path: '/catalogue', meta: { title: 'Catalogue de cours' }, component: () => import('../views/CatalogView.vue') },
  { path: '/cours/:id', meta: { title: 'Détail du cours' }, component: () => import('../views/CourseDetailView.vue') },

  // Apprenant — auth required
  { path: '/dashboard', meta: { requiresAuth: true, roles: ['apprenant'], title: 'Mon espace', hideFooter: true }, component: () => import('../views/DashboardView.vue') },
  { path: '/cours/:id/apprendre', meta: { requiresAuth: true, roles: ['apprenant'], title: 'Apprendre', hideFooter: true, hideNav: true }, component: () => import('../views/CourseLearnView.vue') },
  { path: '/quiz/:id', meta: { requiresAuth: true, roles: ['apprenant'], title: 'Quiz' }, component: () => import('../views/QuizView.vue') },
  { path: '/quiz/:id/resultats', meta: { requiresAuth: true, roles: ['apprenant'], title: 'Résultats du quiz' }, component: () => import('../views/QuizResultsView.vue') },
  { path: '/profil', meta: { requiresAuth: true, title: 'Mon profil' }, component: () => import('../views/ProfileView.vue') },

  // Formateur
  { path: '/formateur', meta: { requiresAuth: true, roles: ['formateur', 'admin'], title: 'Espace formateur' }, component: () => import('../views/FormateurDashboard.vue') },
  { path: '/formateur/cours/creer', meta: { requiresAuth: true, roles: ['formateur', 'admin'], title: 'Créer un cours' }, component: () => import('../views/CourseCreateView.vue') },
  { path: '/formateur/cours/:id/edit', meta: { requiresAuth: true, roles: ['formateur', 'admin'], title: 'Modifier le cours' }, component: () => import('../views/CourseCreateView.vue') },
  { path: '/formateur/cours/:id/stats', meta: { requiresAuth: true, roles: ['formateur', 'admin'], title: 'Statistiques du cours' }, component: () => import('../views/CourseStatsView.vue') },

  // Admin
  { path: '/admin', meta: { requiresAuth: true, roles: ['admin'], title: 'Administration' }, component: () => import('../views/AdminDashboard.vue') },
  { path: '/admin/users', meta: { requiresAuth: true, roles: ['admin'], title: 'Gestion des utilisateurs' }, component: () => import('../views/AdminUsersView.vue') },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to, _from, next) => {
  NProgress.start();
  const auth = useAuthStore();

  // Set page title
  document.title = to.meta.title || 'E-Learning Hub';

  // In SPA auth, user is populated from localStorage. 
  // If the session is invalid, the 401 Axios interceptor will handle it on the first API call.

  const isAuth = auth.isAuthenticated;
  const role   = auth.userRole;

  // Guest-only pages (login, register)
  if (to.meta.guest && isAuth) {
    const redirects = { admin: '/admin', formateur: '/formateur', apprenant: '/dashboard' };
    return next(redirects[role] || '/');
  }

  // Protected pages
  if (to.meta.requiresAuth && !isAuth) {
    return next('/login');
  }

  // Role-specific pages
  if (to.meta.roles && role && !to.meta.roles.includes(role)) {
    const redirects = { admin: '/admin', formateur: '/formateur', apprenant: '/dashboard' };
    return next(redirects[role] || '/');
  }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

router.onError(() => {
  NProgress.done();
});

export default router;
