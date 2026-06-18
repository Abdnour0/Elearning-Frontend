<template>
  <v-app>
    <!-- Floating Island Nav -->
    <v-app-bar
      app flat elevation="0"
      :class="['el-top-nav', 'floating-nav', { 'scrolled': isScrolled, 'nav-hidden': hideNav }]"
    >
      <!-- Brand -->
      <div class="nav-inner d-flex align-center w-100 px-5">
      <router-link to="/" class="text-decoration-none d-flex align-center gap-3">
        <span class="brand-icon-wrap">
          <v-icon color="primary" size="20">mdi-school-outline</v-icon>
        </span>
        <span class="brand-mark">E-Learning Hub</span>
      </router-link>

      <v-spacer />

      <!-- Desktop Nav Links -->
      <nav class="d-none d-md-flex align-center gap-1">
        <!-- Unauthenticated -->
        <template v-if="!authStore.isAuthenticated">
          <v-btn key="unauth-catalogue" variant="text" to="/catalogue" exact class="nav-link text-none font-weight-medium">Catalogue</v-btn>
          <v-btn key="unauth-login" color="primary" variant="flat" to="/login" class="nav-cta text-none font-weight-bold ml-2 rounded-lg" height="38">
            Connexion
          </v-btn>
        </template>

        <!-- Apprenant -->
        <template v-else-if="authStore.isApprenant">
          <v-btn key="app-dashboard" variant="text" to="/dashboard" exact class="nav-link text-none font-weight-medium" :ripple="false">Mon espace</v-btn>
          <v-btn key="app-catalogue" variant="text" to="/catalogue" exact class="nav-link text-none font-weight-medium" :ripple="false">Catalogue</v-btn>
        </template>

        <!-- Formateur -->
        <template v-else-if="authStore.isFormateur">
          <v-btn variant="text" to="/formateur" class="nav-link text-none font-weight-medium">Mes cours</v-btn>
          <v-btn variant="text" to="/formateur/cours/creer" class="nav-link text-none font-weight-medium">Créer</v-btn>
          <v-btn variant="text" to="/catalogue" class="nav-link text-none font-weight-medium">Catalogue</v-btn>
        </template>

        <!-- Admin -->
        <template v-else-if="authStore.isAdmin">
          <v-btn variant="text" to="/admin" class="nav-link text-none font-weight-medium">Dashboard</v-btn>
          <v-btn variant="text" to="/admin/users" class="nav-link text-none font-weight-medium">Utilisateurs</v-btn>
          <v-btn variant="text" to="/catalogue" class="nav-link text-none font-weight-medium">Catalogue</v-btn>
        </template>

        <!-- Avatar Menu -->
        <template v-if="authStore.isAuthenticated">
          <div class="nav-divider mx-3" />
          <v-menu location="bottom end" transition="slide-y-transition" :offset="[0, 12]" open-on-hover>
            <template #activator="{ props }">
              <v-avatar
                v-bind="props"
                :color="roleColor"
                size="36"
                class="nav-avatar cursor-pointer"
                @click="$router.push('/profil')"
              >
                <span class="text-caption font-weight-black text-white">{{ initials }}</span>
              </v-avatar>
            </template>
            <v-card class="user-menu-card rounded-xl border-subtle overflow-hidden" width="260" theme="dark">
              <!-- Profile Header (Glass Island) -->
              <div class="pa-4 position-relative" style="background: linear-gradient(135deg, rgba(15,20,35,0.9), rgba(5,7,10,0.95)); border-bottom: 1px solid rgba(255,255,255,0.05);">
                <div class="d-flex align-center gap-3">
                  <v-avatar size="48" class="premium-avatar">
                    <span :class="`text-${roleColor}`" class="font-weight-black text-h6">{{ initials }}</span>
                  </v-avatar>
                  <div class="min-w-0 flex-grow-1">
                    <div class="text-body-2 font-weight-black text-white text-truncate leading-tight mb-0">{{ authStore.user?.name }}</div>
                    <div class="text-caption text-grey text-truncate mb-2" style="font-size: 0.7rem;">{{ authStore.user?.email }}</div>
                    <div class="role-badge" :class="`role-${authStore.userRole}`">
                      {{ authStore.userRole }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Menu Items -->
              <div class="pa-2 bg-glass-dark">
                <v-list density="compact" bg-color="transparent" class="pa-0">
                  <v-list-item to="/profil" class="rounded-lg mb-1 premium-menu-item text-white transition-all" :ripple="false">
                    <template #prepend>
                      <v-icon size="20" class="mr-3 opacity-70">mdi-account-circle-outline</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium text-body-2">Mon profil</v-list-item-title>
                  </v-list-item>
                  
                  <v-divider class="my-2 opacity-10 border-white" />
                  
                  <v-list-item class="rounded-lg premium-menu-item premium-logout transition-all" :ripple="false" @click="handleLogout">
                    <template #prepend>
                      <v-icon size="20" class="mr-3 text-error opacity-90">mdi-logout-variant</v-icon>
                    </template>
                    <v-list-item-title class="font-weight-bold text-error text-body-2">Déconnexion</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </v-card>
          </v-menu>
        </template>
      </nav>

      <!-- Mobile Nav Menu -->
      <div class="d-flex d-md-none align-center ml-2">
        <v-menu location="bottom end" transition="scale-transition">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-menu" variant="text" color="white" />
          </template>
          <v-card class="user-menu-card rounded-xl pa-2" width="220" theme="dark">
            <v-list density="compact" bg-color="transparent" class="pa-1">
              <template v-if="!authStore.isAuthenticated">
                <v-list-item to="/catalogue" title="Catalogue" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/login" title="Connexion" prepend-icon="mdi-login" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/register" title="S'inscrire" prepend-icon="mdi-account-plus" base-color="primary" class="rounded-lg text-body-2 menu-item font-weight-bold" />
              </template>
              <template v-else-if="authStore.isApprenant">
                <v-list-item to="/dashboard" title="Mon espace" prepend-icon="mdi-view-dashboard" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/catalogue" title="Catalogue" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
              </template>
              <template v-else-if="authStore.isFormateur">
                <v-list-item to="/formateur" title="Mes cours" prepend-icon="mdi-school" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/formateur/cours/creer" title="Créer un cours" prepend-icon="mdi-plus-box" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/catalogue" title="Catalogue" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
              </template>
              <template v-else-if="authStore.isAdmin">
                <v-list-item to="/admin" title="Dashboard" prepend-icon="mdi-shield-crown" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/admin/users" title="Utilisateurs" prepend-icon="mdi-account-group" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/catalogue" title="Catalogue" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
              </template>
              
              <template v-if="authStore.isAuthenticated">
                <v-divider class="my-2 opacity-10" />
                <v-list-item to="/profil" prepend-icon="mdi-account-circle-outline" title="Mon profil" class="rounded-lg text-body-2 menu-item" />
                <v-list-item prepend-icon="mdi-logout-variant" title="Déconnexion" base-color="error" class="rounded-lg text-body-2 menu-item" @click="handleLogout" />
              </template>
            </v-list>
          </v-card>
        </v-menu>
      </div>
      </div><!-- /nav-inner -->
    </v-app-bar>

    <v-main class="page-bg" :class="{ 'no-nav': hideNav }">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="currentRoute.fullPath" />
        </transition>
      </router-view>
    </v-main>

    <!-- ── Minimal Footer ────────────────────────────────────── -->
    <v-footer class="el-footer bg-black border-t-subtle pa-0 overflow-hidden" :class="{ 'footer-hidden': hideFooter }">
      <v-container class="py-8">
        <v-row align="center" justify="space-between" class="flex-column flex-md-row">
<!-- Brand & Copyright -->
          <v-col cols="12" md="4" class="text-center text-md-left mb-4 mb-md-0">
            <div class="d-flex align-center justify-center justify-md-start gap-3 mb-2">
              <v-icon color="primary" size="20">mdi-school-outline</v-icon>
              <span class="text-h6 font-weight-black text-white tracking-tighter">E-Learning Hub</span>
            </div>
            <div class="text-caption text-grey">
              &copy; 2026 E-Learning Hub. Tous droits réservés.
            </div>
          </v-col>

          <!-- Essential Links -->
          <v-col cols="12" md="4" class="d-flex justify-center gap-6 mb-4 mb-md-0">
            <a href="#" class="text-body-2 text-grey-lighten-1 text-decoration-none footer-link transition-colors">À propos</a>
            <a href="#" class="text-body-2 text-grey-lighten-1 text-decoration-none footer-link transition-colors">Contact</a>
            <a href="#" class="text-body-2 text-grey-lighten-1 text-decoration-none footer-link transition-colors">Confidentialité</a>
          </v-col>

          <!-- Social Icons -->
          <v-col cols="12" md="4" class="d-flex justify-center justify-md-end gap-3">
            <a href="#" class="social-icon-wrapper rounded-circle d-flex align-center justify-center transition-all">
              <v-icon size="18" color="white">mdi-linkedin</v-icon>
            </a>
            <a href="#" class="social-icon-wrapper rounded-circle d-flex align-center justify-center transition-all">
              <v-icon size="18" color="white">mdi-twitter</v-icon>
            </a>
            <a href="#" class="social-icon-wrapper rounded-circle d-flex align-center justify-center transition-all">
              <v-icon size="18" color="white">mdi-github</v-icon>
            </a>
          </v-col>
</v-row>
      </v-container>
    </v-footer>

    <!-- ── Global Toast Notifications ──────────────────────── -->
    <div class="toast-container" aria-live="polite">
      <transition-group name="toast-slide">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast-item', `toast-${toast.type}`]"
        >
          <v-icon size="20" class="toast-icon" :color="toastIconColor(toast.type)">
            {{ toastIcon(toast.type) }}
          </v-icon>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" aria-label="Fermer" @click="dismissToast(toast.id)">
            <v-icon size="16">mdi-close</v-icon>
          </button>
        </div>
      </transition-group>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { toasts, dismissToast } from './composables/useToast.js';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const isScrolled = ref(false);

const hideFooter = computed(() => route.path !== '/');
const hideNav = computed(() => route.meta.hideNav);

const handleScroll = () => { isScrolled.value = window.scrollY > 30; };
onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

const initials = computed(() =>
  (authStore.user?.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
);

const roleColor = computed(() =>
  ({ admin: 'error', formateur: 'secondary', apprenant: 'primary' }[authStore.userRole] || 'primary')
);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const toastIcon = (type) => ({
  success: 'mdi-check-circle-outline',
  error:   'mdi-alert-circle-outline',
  warning: 'mdi-alert-outline',
  info:    'mdi-information-outline',
}[type] || 'mdi-information-outline');

const toastIconColor = (type) => ({
  success: '#4ade80',
  error:   '#f87171',
  warning: '#fbbf24',
  info:    '#60a5fa',
}[type] || '#60a5fa');
</script>

<style scoped>
/* Full-width inner wrapper keeps content from touching edges */
.nav-inner {
  width: 100%;
  max-width: 100%;
}

/* Nav links — all identical text style */
.nav-link {
  color: rgba(255,255,255,0.6) !important;
  font-size: 0.875rem;
  font-weight: 500 !important;
  letter-spacing: 0.01em;
  padding: 0 16px !important;
  height: 38px !important;
  border-radius: 10px !important;
  transition: color 0.2s ease, background 0.2s ease !important;
  /* Never show filled/active background by default */
  background: transparent !important;
  box-shadow: none !important;
}
.nav-link:hover {
  color: #fff !important;
  background: rgba(255,255,255,0.07) !important;
}
/* Active route — subtle underline indicator instead of filled background */
.nav-link.v-btn--active, 
.v-btn.nav-link--active {
  color: #60a5fa !important;
  background: transparent !important;
  background-color: transparent !important;
  position: relative;
}
.nav-link.v-btn--active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 16px;
  right: 16px;
  height: 2px;
  border-radius: 2px;
  background: #3b82f6;
}

.nav-cta {
  font-size: 0.875rem !important;
  height: 38px !important;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(255,255,255,0.12);
}

.nav-avatar {
  border: 2px solid rgba(255,255,255,0.15);
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.nav-avatar:hover {
  border-color: rgba(255,255,255,0.35);
  transform: scale(1.05);
}
.cursor-pointer { cursor: pointer; }

/* Dropdown card */
/* ── Custom Popups & Menus ───────────────────────────────── */
.border-subtle { border: 1px solid rgba(255, 255, 255, 0.08) !important; }
.shadow-subtle { box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important; }
.bg-glass-light { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); }
.bg-glass-dark { background: rgba(5, 7, 10, 0.8); }

.premium-menu-item {
  padding: 10px 16px !important;
  min-height: 44px !important;
}
.premium-menu-item:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}
.premium-menu-item:hover .v-icon {
  opacity: 1 !important;
  color: #3b82f6 !important;
  transform: translateX(2px);
}
.premium-logout:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}
.premium-logout:hover .v-icon {
  color: #ef4444 !important;
  transform: translateX(2px);
}

.user-menu-card {
  background: rgba(10, 15, 25, 0.95) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  backdrop-filter: blur(24px);
  box-shadow: 0 24px 50px rgba(0,0,0,0.6) !important;
}
.premium-avatar {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}
.role-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.55rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.role-apprenant { background: rgba(59, 130, 246, 0.1); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
.role-formateur { background: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
.role-admin { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }

.menu-item:hover { background: rgba(255,255,255,0.05) !important; }

/* ── Footer Styles ───────────────────────────────────────── */
.el-footer {
  background-color: #000000 !important;
}
.border-t-subtle {
  border-top: 1px solid rgba(255,255,255,0.08) !important;
}
.footer-logo {
  background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05)) !important;
  border: 1px solid rgba(59,130,246,0.2) !important;
}
.footer-link-item {
  color: #9ca3af !important;
  transition: all 0.2s ease !important;
  cursor: pointer;
}
.footer-link-item:hover {
  color: #fff !important;
  transform: translateX(4px);
}
.footer-social-btn {
  background: rgba(255,255,255,0.03) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  transition: all 0.3s ease !important;
}
.footer-social-btn:hover {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: white !important;
  transform: translateY(-4px);
}
.hover-white:hover {
  color: white !important;
}
.footer-newsletter-input :deep(.v-field__input) {
  padding-right: 110px !important;
}

/* Page transitions — combined fade + subtle slide */
.page-fade-enter-active { transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.page-fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(12px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* Layout tweaks when elements are hidden */
.no-nav { padding-top: 0 !important; }
.nav-hidden { display: none !important; }
.footer-hidden { display: none !important; }

.footer-link {
  position: relative;
}
.footer-link:hover { color: #fff !important; }
.footer-link::after {
  content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px;
  background: #3b82f6; transition: width 0.3s ease;
}
.footer-link:hover::after { width: 100%; }

.social-icon-wrapper {
  width: 36px; height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-decoration: none;
}
.social-icon-wrapper:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}
.social-icon-wrapper:hover .v-icon { color: #3b82f6 !important; }
</style>
