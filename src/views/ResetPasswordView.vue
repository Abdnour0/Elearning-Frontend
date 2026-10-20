<template>
  <div class="auth-page reset-page">
    <section class="auth-form-side">
      <div class="auth-panel">
        <span class="eyebrow"><i class="focus-dot" /> ACCOUNT RECOVERY</span>
        <h1>Choose a new<br><em>password.</em></h1>
        <p class="auth-lede">Pick something at least 8 characters long. You'll be signed in right after.</p>

        <v-alert v-if="errorMsg" type="error" variant="tonal" rounded="lg" class="mb-6">
          {{ errorMsg }}
        </v-alert>

        <v-alert v-if="!token" type="warning" variant="tonal" rounded="lg" class="mb-6">
          This reset link is missing its token. Request a new one from the sign-in page.
        </v-alert>

        <v-form v-model="isValid" @submit.prevent="handleSubmit">
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
            label="New password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            variant="outlined"
            color="primary"
            class="mb-4 zen-input"
            :rules="[v => !!v || 'Password is required', v => (v || '').length >= 8 || 'At least 8 characters']"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-text-field
            v-model="form.password_confirmation"
            label="Confirm new password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check-outline"
            variant="outlined"
            color="primary"
            class="mb-6 zen-input"
            :rules="[v => v === form.password || 'Passwords do not match']"
          />

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            class="zen-btn mb-6"
            height="52"
            :loading="submitting"
            :disabled="!isValid || !token"
          >
            Set new password
          </v-btn>

          <div class="auth-switch">
            Remembered it?
            <router-link to="/login">Back to sign in</router-link>
          </div>
        </v-form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../axios';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const route = useRoute();
const router = useRouter();
const { isLoading: submitting, markLoading, markLoaded } = useViewLoadState();

const token = ref(String(route.query.token || ''));
const isValid = ref(false);
const errorMsg = ref('');
const showPassword = ref(false);

const form = ref({
  email: String(route.query.email || ''),
  password: '',
  password_confirmation: '',
});

async function handleSubmit() {
  if (!isValid.value || !token.value) return;
  markLoading();
  errorMsg.value = '';

  try {
    await api.post('/auth/confirm-reset-password', {
      token: token.value,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    });

    router.push('/login');
  } catch (error) {
    errorMsg.value = error.response?.data?.message
      || 'This reset link is invalid or has expired. Please request a new one.';
  } finally {
    markLoaded();
  }
}
</script>

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  background: #fbfaf6;
  color: #25342a;
}

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
  color: #57715d;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .13em;
}
.focus-dot { width: 7px; height: 7px; border-radius: 50%; background: #749578; }

.auth-panel h1 {
  margin: 18px 0 14px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(34px, 4vw, 44px);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -.04em;
  color: #24362a;
}
.auth-panel h1 em { color: #52755d; }
.auth-lede {
  margin: 0 0 30px;
  max-width: 390px;
  color: #5f6b62;
  font-size: 14px;
  line-height: 1.7;
}

.zen-input :deep(.v-field) { border-radius: 8px; }

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

.auth-switch {
  text-align: center;
  color: #5f6b62;
  font-size: 13px;
}
.auth-switch a {
  margin-left: 4px;
  color: #52755d;
  font-weight: 650;
  text-decoration: none;
}
.auth-switch a:hover { color: #3f5f49; }

@media (max-width: 900px) {
  .auth-form-side { padding: 48px 24px 64px; }
}
@media (prefers-reduced-motion: reduce) {
  .auth-page *, .auth-page *::before, .auth-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
