<template>
  <div class="register-page-wrapper">
    <div class="auth-page">
      <!-- Form side -->
      <section class="auth-form-side">
        <div class="auth-panel">
          <span class="eyebrow"><i class="focus-dot" /> CREATE YOUR ACCOUNT</span>
          <h1>Start your path<br><em>to what's next.</em></h1>
          <p class="auth-lede">Join learners and instructors building future-ready skills, one focused session at a time.</p>

          <v-alert v-if="errorMsg" type="error" variant="tonal" rounded="lg" class="mb-6">
            {{ errorMsg }}
          </v-alert>

          <v-form v-model="isValid" @submit.prevent="handleRegister">
            <!-- Role selection -->
            <div class="role-row mb-6">
              <button
                type="button"
                class="role-card"
                :class="{ 'role-active': form.role === 'apprenant' }"
                @click="form.role = 'apprenant'"
              >
                <v-icon size="26" :color="form.role === 'apprenant' ? 'primary' : undefined">mdi-school-outline</v-icon>
                <span class="role-name">Learner</span>
                <span class="role-note">Learn at your pace</span>
              </button>
              <button
                type="button"
                class="role-card"
                :class="{ 'role-active': form.role === 'formateur' }"
                @click="form.role = 'formateur'"
              >
                <v-icon size="26" :color="form.role === 'formateur' ? 'primary' : undefined">mdi-account-tie-outline</v-icon>
                <span class="role-name">Instructor</span>
                <span class="role-note">Teach what you know</span>
              </button>
            </div>

            <v-text-field
              v-model="form.name" label="Full name" prepend-inner-icon="mdi-account-outline"
              variant="outlined" color="primary" class="mb-4 zen-input"
              :rules="[v => !!v || 'Name is required']"
              :error-messages="fieldErrors.name"
            />

            <v-text-field
              v-model="form.email" label="Email address" type="email" prepend-inner-icon="mdi-email-outline"
              variant="outlined" color="primary" class="mb-4 zen-input"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Invalid email']"
              :error-messages="fieldErrors.email"
            />

            <v-text-field
              v-model="form.telephone" label="Phone number" prepend-inner-icon="mdi-phone-outline"
              variant="outlined" color="primary" class="mb-4 zen-input"
              :error-messages="fieldErrors.telephone"
            />

            <v-text-field
              v-model="form.password" label="Password" :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              variant="outlined"
              color="primary" class="mb-4 zen-input" :rules="[v => !!v || 'Password is required', v => v.length >= 8 || 'At least 8 characters']"
              :error-messages="fieldErrors.password"
              @click:append-inner="showPassword = !showPassword"
            />

            <v-text-field
              v-model="form.password_confirmation" label="Confirm password" :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check-outline"
              variant="outlined" color="primary" class="mb-6 zen-input"
              :rules="[v => v === form.password || 'Passwords do not match']"
            />

            <v-btn
              type="submit"
              color="primary"
              block size="large" class="zen-btn mb-6" height="52"
              :loading="loading" :disabled="!isValid"
            >
              Create my account
            </v-btn>

            <div class="auth-switch">
              Already have an account?
              <router-link to="/login">Sign in</router-link>
            </div>
          </v-form>
        </div>
      </section>

      <!-- Brand side -->
      <aside class="auth-aside" aria-hidden="true">
        <div class="aside-inner">
          <span class="eyebrow"><i class="focus-dot" /> BUILT FOR YOUR NEXT CHAPTER</span>
          <h2>Learn a little.<br><em>Use a lot.</em></h2>
          <p>Practical knowledge, taught by the people doing the work — start with a subject and make it your own.</p>

          <div class="aside-preview">
            <span class="preview-label">POPULAR LEARNING PATHS</span>
            <ul class="path-list">
              <li v-for="path in paths" :key="path.name">
                <span class="path-symbol">{{ path.symbol }}</span>
                <span class="path-name">{{ path.name }}</span>
                <span class="path-note">{{ path.note }}</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  </div>
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

const paths = [
  { symbol: '⌘', name: 'Technology & code', note: '6 weeks' },
  { symbol: '◉', name: 'Data & AI', note: '8 modules' },
  { symbol: '◌', name: 'Product & design', note: '4.5 hours' },
  { symbol: '↗', name: 'Business & leadership', note: '5 weeks' },
];

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
      errorMsg.value = error.response?.data?.message || 'Something went wrong while creating your account.';
    }
  } finally {
    markLoaded();
  }
}
</script>

<style scoped>
.auth-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  background: #fbfaf6;
  color: #25342a;
}

/* ── Form side ─────────────────────────────────────────── */
.auth-form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 6vw;
}
.auth-panel { width: 100%; max-width: 470px; }

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
  font-size: clamp(34px, 3.7vw, 44px);
  font-weight: 400;
  line-height: 1.03;
  letter-spacing: -.04em;
  color: #24362a;
}
.auth-panel h1 em { color: #52755d; }
.auth-lede {
  margin: 0 0 28px;
  max-width: 410px;
  color: #5f6b62;
  font-size: 14px;
  line-height: 1.7;
}

/* ── Role cards ────────────────────────────────────────── */
.role-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.role-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 16px;
  border: 1px solid #e4e7df;
  border-radius: 10px;
  background: #fff;
  color: #676f67;
  text-align: left;
  cursor: pointer;
  font: inherit;
  transition: border-color .18s ease, background .18s ease, transform .18s ease;
}
.role-card:hover { border-color: #c3cfc1; }
.role-active {
  border-color: #7ba084;
  background: #f0f4ee;
}
.role-name { margin-top: 8px; color: #33473a; font-size: 13px; font-weight: 700; }
.role-note { color: #686f68; font-size: 11px; }

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

.auth-switch { text-align: center; color: #5f6b62; font-size: 13px; }
.auth-switch a {
  margin-left: 4px;
  color: #52755d;
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
  padding: 60px 6vw;
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
.auth-aside h2 em { color: #52755d; }
.auth-aside p {
  max-width: 380px;
  margin: 0;
  color: #657066;
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
.preview-label { color: #696e68; font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.path-list { margin: 14px 0 0; padding: 0; list-style: none; }
.path-list li {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-top: 1px solid #eff0ea;
}
.path-list li:first-child { border-top: 0; }
.path-symbol { color: #587360; font-size: 17px; }
.path-name { color: #33473a; font-size: 13px; }
.path-note { color: #696e68; font-size: 11px; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 900px) {
  .auth-page { grid-template-columns: 1fr; }
  .auth-form-side { padding: 44px 22px 60px; }
  .auth-panel { max-width: 480px; }
  .auth-aside { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .auth-page *, .auth-page *::before, .auth-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
