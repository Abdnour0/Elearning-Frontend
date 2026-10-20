<template>
  <v-app>
    <!-- Keyboard/screen-reader bypass: jump straight past the nav to the page content. -->
    <a class="skip-link" href="#main-content">Skip to main content</a>

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
          <v-btn key="unauth-catalogue" variant="text" to="/catalogue" exact class="nav-link text-none font-weight-medium">Courses</v-btn>
          <v-btn key="unauth-login" color="primary" variant="flat" to="/login" class="nav-cta text-none font-weight-bold ml-2 rounded-lg" height="38">
            Sign in
          </v-btn>
        </template>

        <!-- Apprenant -->
        <template v-else-if="authStore.isApprenant">
          <v-btn key="app-dashboard" variant="text" to="/dashboard" exact class="nav-link text-none font-weight-medium" :ripple="false">My learning</v-btn>
          <v-btn key="app-catalogue" variant="text" to="/catalogue" exact class="nav-link text-none font-weight-medium" :ripple="false">Courses</v-btn>
        </template>

        <!-- Formateur -->
        <template v-else-if="authStore.isFormateur">
          <v-btn variant="text" to="/formateur" class="nav-link text-none font-weight-medium">My courses</v-btn>
          <v-btn variant="text" to="/formateur/cours/creer" class="nav-link text-none font-weight-medium">Create</v-btn>
          <v-btn variant="text" to="/catalogue" class="nav-link text-none font-weight-medium">Courses</v-btn>
        </template>

        <!-- Admin -->
        <template v-else-if="authStore.isAdmin">
          <v-btn variant="text" to="/admin" class="nav-link text-none font-weight-medium">Overview</v-btn>
          <v-btn variant="text" to="/admin/users" class="nav-link text-none font-weight-medium">People</v-btn>
          <v-btn variant="text" to="/admin/audit" class="nav-link text-none font-weight-medium">Activity</v-btn>
          <v-btn variant="text" to="/catalogue" class="nav-link text-none font-weight-medium">Courses</v-btn>
        </template>

        <!-- Avatar Menu -->
        <template v-if="authStore.isAuthenticated">
          <div class="nav-divider mx-3" />
          <v-menu location="bottom end" transition="slide-y-transition" :offset="[0, 12]" open-on-hover>
            <template #activator="{ props }">
              <!-- Native <button> so Vuetify's aria-haspopup/aria-expanded are legal on it.
                   A bare <v-avatar> renders a <div>, which trips aria-allowed-attr. -->
              <button
                v-bind="props"
                type="button"
                class="nav-avatar-btn"
                :aria-label="`${initials} — open account menu`"
                @click="$router.push('/profil')"
              >
                <v-avatar :color="roleColor" size="36" class="nav-avatar">
                  <span class="text-caption font-weight-black text-white">{{ initials }}</span>
                </v-avatar>
              </button>
            </template>
            <v-card class="user-menu-card rounded-lg overflow-hidden" width="260">
              <div class="menu-head">
                <span class="menu-avatar">{{ initials }}</span>
                <div class="menu-id">
                  <span class="menu-name">{{ authStore.user?.name }}</span>
                  <span class="menu-email">{{ authStore.user?.email }}</span>
                  <span class="role-badge" :class="`role-${authStore.userRole}`">{{ authStore.userRole }}</span>
                </div>
              </div>

              <v-list density="compact" bg-color="transparent" class="pa-2">
                <v-list-item to="/profil" prepend-icon="mdi-account-circle-outline" title="My profile" class="menu-item rounded-lg" :ripple="false" />
                <v-divider class="my-1" />
                <v-list-item prepend-icon="mdi-logout-variant" title="Sign out" class="menu-item menu-logout rounded-lg" :ripple="false" @click="handleLogout" />
              </v-list>
            </v-card>
          </v-menu>
        </template>
      </nav>

      <!-- Mobile Nav Menu -->
      <div class="d-flex d-md-none align-center ml-2">
        <v-menu location="bottom end" transition="scale-transition">
          <template #activator="{ props }">
            <!-- aria-label: the button renders only the MDI menu glyph, so it has no
                 inner text; without this it fails Lighthouse's button-name audit. -->
            <v-btn v-bind="props" icon="mdi-menu" variant="text" aria-label="Open menu" />
          </template>
          <v-card class="user-menu-card rounded-lg pa-2" width="220">
            <v-list density="compact" bg-color="transparent" class="pa-1">
              <template v-if="!authStore.isAuthenticated">
                <v-list-item to="/catalogue" title="Courses" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/login" title="Sign in" prepend-icon="mdi-login" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/register" title="Create account" prepend-icon="mdi-account-plus" base-color="primary" class="rounded-lg text-body-2 menu-item font-weight-bold" />
              </template>
              <template v-else-if="authStore.isApprenant">
                <v-list-item to="/dashboard" title="My learning" prepend-icon="mdi-view-dashboard" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/catalogue" title="Courses" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
              </template>
              <template v-else-if="authStore.isFormateur">
                <v-list-item to="/formateur" title="My courses" prepend-icon="mdi-school" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/formateur/cours/creer" title="Create a course" prepend-icon="mdi-plus-box" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/catalogue" title="Courses" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
              </template>
              <template v-else-if="authStore.isAdmin">
                <v-list-item to="/admin" title="Overview" prepend-icon="mdi-shield-crown" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/admin/users" title="People" prepend-icon="mdi-account-group" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/admin/audit" title="Activity" prepend-icon="mdi-history" class="rounded-lg text-body-2 menu-item" />
                <v-list-item to="/catalogue" title="Courses" prepend-icon="mdi-bookshelf" class="rounded-lg text-body-2 menu-item" />
              </template>

              <template v-if="authStore.isAuthenticated">
                <v-divider class="my-2 opacity-10" />
                <v-list-item to="/profil" prepend-icon="mdi-account-circle-outline" title="My profile" class="rounded-lg text-body-2 menu-item" />
                <v-list-item prepend-icon="mdi-logout-variant" title="Sign out" base-color="error" class="rounded-lg text-body-2 menu-item" @click="handleLogout" />
              </template>
            </v-list>
          </v-card>
        </v-menu>
      </div>
      </div><!-- /nav-inner -->
    </v-app-bar>

    <!-- v-main renders the page's single <main> landmark; the skip link targets it. -->
    <v-main id="main-content" tabindex="-1" class="page-bg" :class="{ 'no-nav': hideNav }">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="currentRoute.fullPath" />
        </transition>
      </router-view>
    </v-main>

    <!-- ── Minimal Footer ────────────────────────────────────── -->
    <v-footer class="el-footer pa-0 overflow-hidden" :class="{ 'footer-hidden': hideFooter }">
      <v-container class="py-8">
        <v-row align="center" justify="space-between" class="flex-column flex-md-row">
          <!-- Brand & Copyright -->
          <v-col cols="12" md="4" class="text-center text-md-left mb-4 mb-md-0">
            <div class="d-flex align-center justify-center justify-md-start gap-3 mb-2">
              <v-icon color="primary" size="20">mdi-school-outline</v-icon>
              <span class="footer-brand">E-Learning Hub</span>
            </div>
            <div class="footer-copy">
              &copy; 2026 E-Learning Hub. Learn with intention.
            </div>
          </v-col>

          <!-- Essential Links -->
          <v-col cols="12" md="4" class="d-flex justify-center gap-6 mb-4 mb-md-0">
            <a href="#" class="footer-link">About</a>
            <a href="mailto:hello@elearninghub.example" class="footer-link">Contact</a>
            <a href="#" class="footer-link">Privacy</a>
          </v-col>

          <!-- Social Icons -->
          <v-col cols="12" md="4" class="d-flex justify-center justify-md-end gap-3">
            <a href="#" class="social-icon-wrapper" aria-label="LinkedIn">
              <v-icon size="18">mdi-linkedin</v-icon>
            </a>
            <a href="#" class="social-icon-wrapper" aria-label="Twitter">
              <v-icon size="18">mdi-twitter</v-icon>
            </a>
            <a href="#" class="social-icon-wrapper" aria-label="GitHub">
              <v-icon size="18">mdi-github</v-icon>
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
          <button class="toast-close" aria-label="Close" @click="dismissToast(toast.id)">
            <v-icon size="16">mdi-close</v-icon>
          </button>
        </div>
      </transition-group>
    </div>
    <div id="main" />
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
  success: '#6d9271',
  error:   '#bc7168',
  warning: '#b08d53',
  info:    '#6d8b8e',
}[type] || '#6d8b8e');
</script>

<style scoped>
/* ── Skip link ─────────────────────────────────────────────
   Off-screen until focused, so it never shifts layout or
   shows on mouse use. Targets <main id="main-content">. */
.skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 3000;
  padding: 10px 16px;
  border-radius: 8px;
  background: #2f3a33;
  color: #fbfaf6;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transform: translateY(-200%);
}
/* :focus (not :focus-visible) — a skip link must reveal whenever it receives
   focus, including programmatic focus after a hash navigation. */
.skip-link:focus {
  transform: translateY(0);
  outline: 2px solid #2f3a33;
  outline-offset: 2px;
}

/* Full-width inner wrapper keeps content from touching edges */
.nav-inner {
  width: 100%;
  max-width: 100%;
}

/* ── Nav links ───────────────────────────────────────────── */
.nav-link {
  color: #647067 !important;
  font-size: 12px;
  font-weight: 550 !important;
  letter-spacing: 0;
  padding: 0 14px !important;
  height: 38px !important;
  border-radius: 8px !important;
  background: transparent !important;
  box-shadow: none !important;
  transition: color .18s ease, background .18s ease !important;
}
.nav-link:hover {
  color: #425f49 !important;
  background: #f0f2ec !important;
}
.nav-link.v-btn--active,
.v-btn.nav-link--active {
  color: #3f5f49 !important;
  position: relative;
}
.nav-link.v-btn--active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 14px;
  right: 14px;
  height: 2px;
  border-radius: 2px;
  background: #5f7e66;
}

.nav-cta {
  font-size: 12px !important;
  letter-spacing: 0;
  height: 38px !important;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: #e2e6de;
}

.nav-avatar-btn {
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
}
.nav-avatar-btn:focus-visible {
  outline: 2px solid #648069;
  outline-offset: 3px;
}
.nav-avatar {
  border: 2px solid #e7eee6;
  transition: border-color .18s ease;
}
.nav-avatar:hover {
  border-color: #b9cfb8;
}
.cursor-pointer { cursor: pointer; }

/* ── Dropdown card ───────────────────────────────────────── */
.user-menu-card {
  background: #ffffff !important;
  border: 1px solid #e7e8e1 !important;
  box-shadow: 0 18px 40px rgba(42, 56, 43, .12) !important;
}

.menu-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #eff0ea;
}
.menu-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e7eee6;
  color: #46704f;
  font-size: 14px;
  font-weight: 700;
}
.menu-id { display: grid; gap: 3px; min-width: 0; }
.menu-name {
  overflow: hidden;
  color: #28382e;
  font-size: 13px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.menu-email {
  overflow: hidden;
  color: #686f68;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.role-badge {
  display: inline-block;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.role-apprenant { background: #e7eee6; color: #46704f; }
.role-formateur { background: #f1ebe0; color: #816738; }
.role-admin { background: #f3e8e6; color: #934f47; }

.menu-item { color: #4a5a4f !important; }
.menu-item:hover { background: #f2f5ef !important; }
.menu-logout { color: #934f47 !important; }

/* ── Footer ──────────────────────────────────────────────── */
.el-footer {
  background: #f4f4ee !important;
  border-top: 1px solid #e8e8e1 !important;
  color: #666f66 !important;
}
.footer-brand {
  color: #314237;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -.02em;
}
.footer-copy { color: #686f68; font-size: 12px; }
.footer-link {
  position: relative;
  color: #666f66;
  font-size: 13px;
  text-decoration: none;
  transition: color .18s ease;
}
.footer-link:hover { color: #4c6e59 !important; }
.footer-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 1px;
  background: #5f7e66;
  transition: width .22s ease;
}
.footer-link:hover::after { width: 100%; }

.social-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e2e6de;
  border-radius: 50%;
  background: #ffffff;
  color: #657066;
  text-decoration: none;
  transition: background .18s ease, color .18s ease, border-color .18s ease;
}
.social-icon-wrapper:hover {
  background: #5f7e66;
  border-color: #6f9276;
  color: #ffffff;
}

/* ── Page transitions — gentle fade ──────────────────────── */
.page-fade-enter-active { transition: opacity .3s ease, transform .3s cubic-bezier(0.22, 1, 0.36, 1); }
.page-fade-leave-active { transition: opacity .18s ease, transform .18s ease; }
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to { opacity: 0; transform: translateY(-6px); }

/* Layout tweaks when elements are hidden */
.no-nav { padding-top: 0 !important; }
.nav-hidden { display: none !important; }
.footer-hidden { display: none !important; }

@media (prefers-reduced-motion: reduce) {
  .nav-link, .nav-avatar, .footer-link, .social-icon-wrapper,
  .page-fade-enter-active, .page-fade-leave-active {
    transition-duration: .01ms !important;
  }
}
</style>
