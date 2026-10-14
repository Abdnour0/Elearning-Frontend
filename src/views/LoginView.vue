<template>
  <div class="login-page-wrapper">
    <div class="auth-page">
      <!-- Form side -->
      <section class="auth-form-side">
        <div class="auth-panel">
          <span class="eyebrow"><i class="focus-dot" /> WELCOME BACK</span>
          <h1>Sign in to keep<br><em>your momentum.</em></h1>
          <p class="auth-lede">Pick up where you left off and keep your learning rhythm going.</p>

          <v-alert v-if="errorMsg" type="error" variant="tonal" rounded="lg" class="mb-6">
            {{ errorMsg }}
          </v-alert>

          <v-form v-model="isValid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="form.email"
              label="Email address"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              class="mb-4 zen-input"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Invalid email']"
            />

            <v-text-field
              v-model="form.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              variant="outlined"
              color="primary"
              class="mb-2 zen-input"
              :rules="[v => !!v || 'Password is required']"
              @click:append-inner="showPassword = !showPassword"
            />

            <div class="d-flex justify-space-between align-center mb-8 auth-row">
              <v-checkbox v-model="remember" label="Remember me" color="primary" hide-details density="compact" />
              <a href="#" class="auth-mini-link" @click.prevent="forgotPasswordDialog = true">Forgot password?</a>
            </div>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              class="zen-btn mb-6"
              height="52"
              :loading="loading"
              :disabled="!isValid"
            >
              Sign in
            </v-btn>

            <div class="auth-switch">
              New to E-Learning Hub?
              <router-link to="/register">Create an account</router-link>
            </div>
          </v-form>
        </div>
      </section>

      <!-- Brand side -->
      <aside class="auth-aside" aria-hidden="true">
        <div class="aside-inner">
          <span class="eyebrow"><i class="focus-dot" /> A QUIETER WAY FORWARD</span>
          <h2>Make room for<br><em>your next skill.</em></h2>
          <p>Steady, expert-led learning designed to fit real life — one focused session at a time.</p>

          <div class="aside-preview">
            <div class="preview-top">
              <span class="preview-label">PICK UP WHERE YOU LEFT OFF</span>
              <span class="preview-progress">62%</span>
            </div>
            <h3>Designing with data</h3>
            <p>Build a story around the numbers that matter.</p>
            <div class="progress-track"><span style="width: 62%" /></div>
            <div class="preview-foot"><span>Continue learning</span><span aria-hidden="true">→</span></div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="forgotPasswordDialog" max-width="420">
      <v-card class="zen-dialog pa-6" elevation="0" rounded="lg">
        <h3>Forgot your password?</h3>
        <p class="dialog-lede">Enter your email address and we'll send you a link to reset it.</p>

        <v-alert v-if="resetMessage" :type="resetSuccess ? 'success' : 'error'" variant="tonal" rounded="lg" class="mb-4 text-caption">
          {{ resetMessage }}
        </v-alert>

        <v-text-field
          v-model="resetEmail"
          label="Email address"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          color="primary"
          class="mb-6 zen-input"
          hide-details
        />

        <div class="d-flex gap-3 justify-end">
          <v-btn variant="text" class="zen-quiet-btn" @click="forgotPasswordDialog = false">Cancel</v-btn>
          <v-btn
            color="primary" variant="flat" class="zen-btn"
            :loading="resetting"
            :disabled="!resetEmail"
            @click="handleResetPassword"
          >
            Send link
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
      errorMsg.value = 'Incorrect email or password.';
    } else if (error.response?.data?.message) {
      errorMsg.value = error.response.data.message;
    } else {
      errorMsg.value = 'Something went wrong while signing in. Please try again.';
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
    resetMessage.value = data.message || 'Reset link sent successfully.';
    setTimeout(() => {
      forgotPasswordDialog.value = false;
      resetEmail.value = '';
      resetMessage.value = '';
    }, 3000);
  } catch (error) {
    resetSuccess.value = false;
    resetMessage.value = error.response?.data?.message || 'Could not send the reset link.';
  } finally {
    resetting.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  background: #fbfaf6;
  color: #25342a;
}

/* ── Form side ─────────────────────────────────────────── */
.auth-form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 6vw;
}
.auth-panel { width: 100%; max-width: 430px; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #5f7d66;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .13em;
}
.focus-dot { width: 7px; height: 7px; border-radius: 50%; background: #749578; }

.auth-panel h1 {
  margin: 18px 0 14px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(36px, 4vw, 46px);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -.04em;
  color: #24362a;
}
.auth-panel h1 em { color: #557a61; }
.auth-lede {
  margin: 0 0 30px;
  max-width: 390px;
  color: #7b837c;
  font-size: 14px;
  line-height: 1.7;
}

.zen-input :deep(.v-field) { border-radius: 8px; }
.auth-row { gap: 12px; }
.auth-mini-link {
  color: #557a61;
  font-size: 12px;
  font-weight: 650;
  text-decoration: none;
}
.auth-mini-link:hover { color: #3f5f49; }

.zen-btn {
  background: #537a62 !important;
  color: #fff !important;
  border-radius: 8px;
  font-weight: 650;
  letter-spacing: 0;
  text-transform: none;
  box-shadow: none !important;
}
.zen-btn:hover { background: #456c54 !important; }
.zen-quiet-btn { color: #66716a !important; text-transform: none; }

.auth-switch {
  text-align: center;
  color: #7b837c;
  font-size: 13px;
}
.auth-switch a {
  margin-left: 4px;
  color: #557a61;
  font-weight: 650;
  text-decoration: none;
}
.auth-switch a:hover { color: #3f5f49; }

/* ── Brand side ────────────────────────────────────────── */
.auth-aside {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 6vw;
  background: #eef1e9;
  border-left: 1px solid #e4e7df;
}
.aside-inner { width: 100%; max-width: 460px; }
.auth-aside h2 {
  margin: 16px 0 14px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(34px, 3.4vw, 46px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -.04em;
  color: #24362a;
}
.auth-aside h2 em { color: #557a61; }
.auth-aside p {
  max-width: 380px;
  margin: 0;
  color: #6f7a70;
  font-size: 14px;
  line-height: 1.7;
}

.aside-preview {
  margin-top: 32px;
  padding: 22px;
  border: 1px solid #e0e5db;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 18px 50px rgba(52, 72, 55, .08);
}
.preview-top { display: flex; align-items: center; justify-content: space-between; }
.preview-label { color: #939a91; font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.preview-progress { color: #52775c; font-size: 11px; font-weight: 700; }
.aside-preview h3 {
  margin: 12px 0 5px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -.02em;
  color: #28382e;
}
.aside-preview p { color: #828a82; font-size: 12px; line-height: 1.6; }
.progress-track {
  height: 4px;
  margin: 16px 0 12px;
  overflow: hidden;
  border-radius: 4px;
  background: #eef0eb;
}
.progress-track span { display: block; height: 100%; border-radius: 4px; background: #6f9276; }
.preview-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #506d57;
  font-size: 11px;
  font-weight: 700;
}

/* ── Dialog ────────────────────────────────────────────── */
.zen-dialog { background: #fff !important; border: 1px solid #e7e8e1; }
.zen-dialog h3 {
  margin: 0 0 8px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.02em;
  color: #28382e;
}
.dialog-lede { margin: 0 0 22px; color: #7b837c; font-size: 13px; line-height: 1.6; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 900px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-form-side { padding: 48px 24px 64px; }
  .auth-panel { max-width: 460px; }
  .auth-aside { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .auth-page *, .auth-page *::before, .auth-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
