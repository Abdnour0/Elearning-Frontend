<template>
  <div class="login-page-wrapper">
  <v-row class="ma-0 split-layout" no-gutters>
    <!-- Left Side: Form -->
    <v-col cols="12" md="5" lg="4" class="d-flex align-center justify-center form-side position-relative">
      <div class="auth-bg-shape auth-bg-shape-1" />
      
      <v-card v-motion class="glass-card auth-panel rounded-xl pa-8 pa-sm-10 mx-4" theme="dark" elevation="0" width="100%"
        max-width="480"
        :initial="{ opacity: 0, x: -30 }"
        :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 200 } }"
      >
        <div class="text-center mb-8">
          <v-icon color="primary" size="48" class="mb-4">mdi-rocket-launch</v-icon>
          <h1 class="text-h4 font-weight-black text-white">Re-bonjour</h1>
          <p class="text-grey-lighten-1 mt-2">Connectez-vous pour continuer</p>
        </div>

        <v-alert v-if="errorMsg" type="error" variant="tonal" rounded="lg" class="mb-6">
          {{ errorMsg }}
        </v-alert>

        <v-form v-model="isValid" @submit.prevent="handleLogin">
          <v-text-field
            v-model="form.email"
            label="Adresse email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            color="primary"
            class="mb-4 custom-input"
            :rules="[v => !!v || 'L\'email est requis', v => /.+@.+\..+/.test(v) || 'Email invalide']"
          />

          <v-text-field
            v-model="form.password"
            label="Mot de passe"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            color="primary"
            class="mb-2 custom-input"
            :rules="[v => !!v || 'Le mot de passe est requis']"
            @click:append-inner="showPassword = !showPassword"
          />

          <div class="d-flex justify-space-between align-center mb-8">
            <v-checkbox v-model="remember" label="Se souvenir de moi" color="primary" hide-details density="compact" />
            <a href="#" class="text-caption text-primary font-weight-bold text-decoration-none" @click.prevent="forgotPasswordDialog = true">Mot de passe oublié ?</a>
          </div>

          <v-btn
            type="submit"
            color="primary"
            block
            size="x-large"
            class="rounded-pill font-weight-black btn-glow mb-6"
            height="56"
            :loading="loading"
            :disabled="!isValid"
          >
            Se connecter
          </v-btn>

          <div class="text-center text-body-2 text-grey-lighten-1">
            Nouveau ici ?
            <router-link to="/register" class="text-primary font-weight-bold text-decoration-none ml-1">
              Créer un compte
            </router-link>
          </div>
        </v-form>
      </v-card>
    </v-col>

    <!-- Right Side: Brand/Graphic -->
    <v-col cols="12" md="7" lg="8" class="d-none d-md-flex align-center justify-center brand-side position-relative overflow-hidden">
      <div class="brand-overlay" />
      <div class="mesh-bg" />
      
      <div v-motion class="brand-content text-center d-flex flex-column align-center" :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 1000, delay: 300 } }">
        <h2 class="text-h2 font-weight-black text-white mb-6" style="letter-spacing: -0.03em;">
          Votre succès commence <br><span class="text-gradient-shimmer">maintenant.</span>
        </h2>
        
        <!-- 3D Floating Auth Visual -->
        <div class="auth-visual-wrapper mt-10">
          <div class="glass-card-auth">
            <div class="glass-header d-flex gap-2 pa-4 border-b-subtle">
              <div class="mac-dot red" /><div class="mac-dot yellow" /><div class="mac-dot green" />
            </div>
            <div class="pa-6">
              <div class="d-flex align-center gap-4 mb-6">
                <v-avatar color="primary" size="48">
                  <v-icon color="white">mdi-rocket-launch</v-icon>
                </v-avatar>
                <div class="text-left">
                  <div class="text-subtitle-1 font-weight-bold text-white">Espace Apprenant</div>
                  <div class="text-caption text-primary font-weight-bold">Accès autorisé</div>
                </div>
              </div>
              <!-- Skeleton lines -->
              <div class="skeleton-block code-line mb-3" style="width: 100%;" />
              <div class="skeleton-block code-line mb-3" style="width: 85%;" />
              <div class="skeleton-block code-line" style="width: 60%;" />
            </div>
          </div>
          
          <!-- Floating badge -->
          <div v-motion class="float-badge" :initial="{ y: 0 }" :enter="{ y: -15, transition: { repeat: Infinity, repeatType: 'mirror', duration: 3000, ease: 'easeInOut' } }">
            <v-icon color="success" size="24" class="mr-2">mdi-shield-check</v-icon>
            <span class="text-body-2 font-weight-bold text-white">Connexion Sécurisée</span>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>

  <!-- Forgot Password Dialog -->
  <v-dialog v-model="forgotPasswordDialog" max-width="400">
    <v-card class="glass-card rounded-xl pa-6" theme="dark">
      <h3 class="text-h6 font-weight-bold mb-2">Mot de passe oublié ?</h3>
      <p class="text-body-2 text-grey-lighten-1 mb-6">
        Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>

      <v-alert v-if="resetMessage" :type="resetSuccess ? 'success' : 'error'" variant="tonal" rounded="lg" class="mb-4 text-caption">
        {{ resetMessage }}
      </v-alert>

      <v-text-field
        v-model="resetEmail"
        label="Adresse email"
        type="email"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        color="primary"
        class="mb-6 custom-input"
        hide-details
      />

      <div class="d-flex gap-3 justify-end">
        <v-btn variant="text" color="grey" class="text-none rounded-lg" @click="forgotPasswordDialog = false">Annuler</v-btn>
        <v-btn
          color="primary" variant="flat" class="text-none rounded-lg font-weight-bold btn-glow"
          :loading="resetting"
          :disabled="!resetEmail"
          @click="handleResetPassword"
        >
          Envoyer le lien
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../axios';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const authStore = useAuthStore();

const isValid = ref(false);
const { isLoading: loading, markLoading, markLoaded } = useViewLoadState();
const errorMsg = ref('');
const showPassword = ref(false);
const remember = ref(false);

const forgotPasswordDialog = ref(false);
const resetEmail = ref('');
const resetting = ref(false);
const resetMessage = ref('');
const resetSuccess = ref(false);

const form = ref({
  email: '',
  password: '',
});

async function handleLogin() {
  if (!isValid.value) return;
  markLoading();
  errorMsg.value = '';

  try {
    await authStore.login({ ...form.value, remember: remember.value });

    // Redirect based on role with hard reload to flush stale CSRF tokens
    const role = authStore.userRole;
    if (role === 'admin') window.location.href = '/admin';
    else if (role === 'formateur') window.location.href = '/formateur';
    else window.location.href = '/dashboard';

  } catch (error) {
    if (error.response?.status === 401) {
      errorMsg.value = 'Identifiants incorrects.';
    } else if (error.response?.data?.message) {
      errorMsg.value = error.response.data.message;
    } else {
      errorMsg.value = 'Une erreur est survenue lors de la connexion.';
    }
  } finally {
    markLoaded();
  }
}

async function handleResetPassword() {
  resetting.value = true;
  resetMessage.value = '';
  try {
    const { data } = await api.post('/auth/reset-password', { email: resetEmail.value });
    resetSuccess.value = true;
    resetMessage.value = data.message || 'Lien de réinitialisation envoyé avec succès.';
    setTimeout(() => {
      forgotPasswordDialog.value = false;
      resetEmail.value = '';
      resetMessage.value = '';
    }, 3000);
  } catch (error) {
    resetSuccess.value = false;
    resetMessage.value = error.response?.data?.message || 'Erreur lors de la réinitialisation.';
  } finally {
    resetting.value = false;
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
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
  background: #8b5cf6;
}

.auth-panel {
  backdrop-filter: blur(40px);
  background: rgba(15, 15, 18, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.brand-side {
  background-color: #050508;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.mesh-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(34, 211, 238, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(236, 72, 153, 0.1) 0px, transparent 50%);
  z-index: 0;
  animation: meshPulse 15s ease-in-out infinite alternate;
}

@keyframes meshPulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.1); opacity: 1; }
}

.brand-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.03)"/></svg>');
  z-index: 1;
}

.brand-content {
  position: relative;
  z-index: 2;
  padding: 40px;
  width: 100%;
}

.text-gradient-shimmer {
  background: linear-gradient(to right, #3b82f6, #8b5cf6, #3b82f6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer {
  to { background-position: 200% center; }
}

/* 3D Visual */
.auth-visual-wrapper {
  position: relative;
  width: 100%; max-width: 420px;
  perspective: 1000px;
}
.glass-card-auth {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.2);
  transform: rotateY(-10deg) rotateX(5deg);
  transition: transform 0.5s ease;
}
.glass-card-auth:hover {
  transform: rotateY(-2deg) rotateX(2deg);
}
.mac-dot { width: 12px; height: 12px; border-radius: 50%; }
.mac-dot.red { background: #ff5f56; }
.mac-dot.yellow { background: #ffbd2e; }
.mac-dot.green { background: #27c93f; }
.border-b-subtle { border-bottom: 1px solid rgba(255,255,255,0.05); }
.skeleton-block { height: 10px; border-radius: 5px; background: rgba(255,255,255,0.05); }

/* Floating Element */
.float-badge {
  position: absolute;
  top: 15%; right: -15%;
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 14px 20px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  display: flex; align-items: center;
  transform: translateZ(60px);
}
</style>
