<template>
  <v-row class="ma-0 split-layout" no-gutters>
    <!-- Left Side: Form -->
    <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center form-side position-relative py-12">
      <div class="auth-bg-shape auth-bg-shape-2" />
      
      <v-card v-motion class="glass-card auth-panel rounded-xl pa-6 pa-sm-10 mx-4" elevation="0" width="100%"
        max-width="540"
        :initial="{ opacity: 0, x: -30 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 200 } }"
      >
        <div class="text-center mb-8">
          <v-icon color="secondary" size="48" class="mb-4">mdi-account-plus</v-icon>
          <h1 class="text-h4 font-weight-black text-white">Rejoignez-nous</h1>
          <p class="text-grey-lighten-1 mt-2">Commencez votre voyage vers l'excellence</p>
        </div>

        <v-alert v-if="errorMsg" type="error" variant="tonal" rounded="lg" class="mb-6">
          {{ errorMsg }}
        </v-alert>

        <v-form v-model="isValid" @submit.prevent="handleRegister">
          <!-- Role selection -->
          <div class="d-flex gap-4 mb-8">
            <v-card
              class="flex-grow-1 text-center py-4 cursor-pointer role-card"
              :class="{ 'role-active-apprenant': form.role === 'apprenant' }"
              @click="form.role = 'apprenant'"
            >
              <v-icon :color="form.role === 'apprenant' ? 'primary' : 'grey'" size="32">mdi-school</v-icon>
              <div class="mt-2 font-weight-bold" :class="form.role === 'apprenant' ? 'text-primary' : 'text-grey'">Apprenant</div>
            </v-card>
            <v-card
              class="flex-grow-1 text-center py-4 cursor-pointer role-card"
              :class="{ 'role-active-formateur': form.role === 'formateur' }"
              @click="form.role = 'formateur'"
            >
              <v-icon :color="form.role === 'formateur' ? 'secondary' : 'grey'" size="32">mdi-account-tie</v-icon>
              <div class="mt-2 font-weight-bold" :class="form.role === 'formateur' ? 'text-secondary' : 'text-grey'">Formateur</div>
            </v-card>
          </div>

          <v-text-field
            v-model="form.name" label="Nom complet" prepend-inner-icon="mdi-account-outline"
            variant="outlined" color="primary" class="mb-4 custom-input"
            :rules="[v => !!v || 'Le nom est requis']"
            :error-messages="fieldErrors.name"
          />

          <v-text-field
            v-model="form.email" label="Adresse email" type="email" prepend-inner-icon="mdi-email-outline"
            variant="outlined" color="primary" class="mb-4 custom-input"
            :rules="[v => !!v || 'L\'email est requis', v => /.+@.+\..+/.test(v) || 'Email invalide']"
            :error-messages="fieldErrors.email"
          />

          <v-text-field
            v-model="form.telephone" label="Numéro de téléphone" prepend-inner-icon="mdi-phone-outline"
            variant="outlined" color="primary" class="mb-4 custom-input"
            :error-messages="fieldErrors.telephone"
          />

          <v-text-field
            v-model="form.password" label="Mot de passe" :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            color="primary" class="mb-4 custom-input" :rules="[v => !!v || 'Le mot de passe est requis', v => v.length >= 8 || 'Minimum 8 caractères']"
            :error-messages="fieldErrors.password"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-text-field
            v-model="form.password_confirmation" label="Confirmer le mot de passe" :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check-outline"
            variant="outlined" color="primary" class="mb-8 custom-input"
            :rules="[v => v === form.password || 'Les mots de passe ne correspondent pas']"
          />

          <v-btn
            type="submit" :color="form.role === 'formateur' ? 'secondary' : 'primary'"
            block size="x-large" class="rounded-pill font-weight-black btn-glow mb-6" height="56"
            :loading="loading" :disabled="!isValid"
          >
            Créer mon compte
          </v-btn>

          <div class="text-center text-body-2 text-grey-lighten-1">
            Vous avez déjà un compte ?
            <router-link to="/login" class="text-primary font-weight-bold text-decoration-none ml-1">
              Se connecter
            </router-link>
          </div>
        </v-form>
      </v-card>
    </v-col>

    <!-- Right Side: Brand/Graphic -->
    <v-col cols="12" md="6" lg="7" class="d-none d-md-flex align-center justify-center brand-side position-relative overflow-hidden">
      <div class="brand-overlay" />
      <div class="mesh-bg" />
      
      <div v-motion class="brand-content text-center d-flex flex-column align-center" :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 1000, delay: 300 } }">
        <h2 class="text-h2 font-weight-black text-white mb-6" style="letter-spacing: -0.03em;">
          Construisez votre <br><span class="text-gradient-shimmer">avenir.</span>
        </h2>
        
        <!-- 3D Floating Auth Visual -->
        <div class="auth-visual-wrapper mt-10">
          <div class="glass-card-auth">
            <div class="glass-header d-flex gap-2 pa-4 border-b-subtle">
              <div class="mac-dot red" /><div class="mac-dot yellow" /><div class="mac-dot green" />
            </div>
            <div class="pa-6">
              <div class="d-flex align-center gap-4 mb-6">
                <v-avatar color="secondary" size="48">
                  <v-icon color="white">mdi-account-star</v-icon>
                </v-avatar>
                <div class="text-left">
                  <div class="text-subtitle-1 font-weight-bold text-white">Création de Profil</div>
                  <div class="text-caption text-secondary font-weight-bold">Initialisation...</div>
                </div>
              </div>
              <!-- Skeleton lines -->
              <div class="skeleton-block code-line mb-3" style="width: 100%;" />
              <div class="skeleton-block code-line mb-3" style="width: 75%;" />
              <div class="skeleton-block code-line mb-3" style="width: 90%;" />
              <div class="skeleton-block code-line" style="width: 50%;" />
            </div>
          </div>
          
          <!-- Floating badge -->
          <div v-motion class="float-badge" :initial="{ y: 0 }" :enter="{ y: 15, transition: { repeat: Infinity, repeatType: 'mirror', duration: 3500, ease: 'easeInOut' } }">
            <v-icon color="warning" size="24" class="mr-2">mdi-star-shooting</v-icon>
            <span class="text-body-2 font-weight-bold text-white">Nouveau Membre</span>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const authStore = useAuthStore();

const isValid = ref(false);
const { isLoading: loading, markLoading, markLoaded } = useViewLoadState();
const errorMsg = ref('');
const fieldErrors = ref({});
const showPassword = ref(false);

const form = ref({
  name: '',
  email: '',
  telephone: '',
  password: '',
  password_confirmation: '',
  role: 'apprenant'
});

async function handleRegister() {
  if (!isValid.value) return;
  markLoading();
  errorMsg.value = '';
  fieldErrors.value = {};

  try {
    await authStore.register(form.value);

    // Redirect based on role with hard reload
    const role = authStore.userRole;
    if (role === 'formateur') window.location.href = '/formateur';
    else window.location.href = '/dashboard';

  } catch (error) {
    if (error.response?.status === 422) {
      fieldErrors.value = error.response.data.errors;
    } else {
      errorMsg.value = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.';
    }
  } finally {
    markLoaded();
  }
}
</script>

<style scoped>
.split-layout {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  background: var(--el-bg-0);
}

.form-side {
  background: var(--el-bg-0);
}

.auth-bg-shape {
  display: none;
}

.auth-panel {
  backdrop-filter: none;
  background: var(--el-surface) !important;
  border: 1px solid var(--el-border) !important;
  box-shadow: var(--el-shadow-lg) !important;
}

.custom-input :deep(.v-field) {
  border-radius: var(--el-radius-sm);
  background: var(--el-bg-1);
}

.role-card {
  border: 1px solid var(--el-border);
  background: var(--el-surface) !important;
  transition: border-color 0.2s ease, box-shadow 0.25s var(--el-ease), transform 0.2s var(--el-ease);
  border-radius: var(--el-radius) !important;
  box-shadow: var(--el-shadow-xs);
}
.role-card:hover {
  border-color: var(--el-border-strong);
  box-shadow: var(--el-shadow-sm);
  transform: translateY(-2px);
}

.role-active-apprenant {
  background: var(--el-accent-soft) !important;
  border-color: var(--el-accent);
  box-shadow: var(--el-shadow-accent);
  transform: none;
}

.role-active-formateur {
  background: rgba(201, 138, 82, 0.12) !important;
  border-color: #c98a52;
  box-shadow: 0 14px 30px -14px rgba(201, 138, 82, 0.5);
  transform: none;
}

.brand-side {
  background-color: var(--el-bg-1);
  border-left: 1px solid var(--el-border);
}

.mesh-bg {
  display: none;
}

.brand-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="1" fill="rgba(255, 255, 255,0.03)"/></svg>');
  z-index: 1;
}

.brand-content {
  position: relative;
  z-index: 2;
  padding: 40px;
  width: 100%;
}

.text-gradient-shimmer {
  color: var(--el-text);
}

/* 3D Visual */
.auth-visual-wrapper {
  position: relative;
  width: 100%; max-width: 420px;
}
.glass-card-auth {
  background: var(--el-surface);
  backdrop-filter: none;
  border: 1px solid var(--el-border);
  border-radius: var(--el-radius-lg);
  box-shadow: var(--el-shadow-lg);
  transition: transform 0.4s var(--el-ease), box-shadow 0.4s var(--el-ease);
}
.glass-card-auth:hover {
  transform: translateY(-4px) rotateX(1.5deg) rotateY(-1.5deg);
  box-shadow: 0 34px 66px -26px rgba(60, 42, 28, 0.34);
}
.mac-dot { width: 12px; height: 12px; border-radius: 50%; }
.mac-dot.red { background: #ff5f56; }
.mac-dot.yellow { background: #ffbd2e; }
.mac-dot.green { background: #27c93f; }
.border-b-subtle { border-bottom: 1px solid var(--el-border); }
.skeleton-block { height: 10px; border-radius: 5px; background: var(--el-surface-2); }

/* Floating Element */
.float-badge {
  position: absolute;
  bottom: 15%; left: -15%;
  background: var(--el-surface);
  backdrop-filter: none;
  border: 1px solid var(--el-border);
  padding: 14px 20px;
  border-radius: var(--el-radius);
  box-shadow: var(--el-shadow-md);
  display: flex; align-items: center;
}
</style>
