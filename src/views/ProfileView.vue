<template>
  <div class="profile-page">
    <div class="profile-inner">
      <div class="profile-card">
        <!-- ── Identity panel ─────────────────────────── -->
        <aside class="identity-panel">
          <div class="avatar-stage">
            <v-avatar size="104" class="profile-avatar">
              <span class="initials">{{ initials }}</span>
            </v-avatar>
            <span class="role-badge" :style="{ background: roleHex }">
              <v-icon size="16" color="white">{{ roleIcon }}</v-icon>
            </span>
          </div>

          <h2 class="identity-name">{{ authStore.user?.name }}</h2>
          <p class="identity-email">{{ authStore.user?.email }}</p>
          <span class="role-chip" :style="{ color: roleHex, background: roleHex + '18' }">
            {{ authStore.user?.role }}
          </span>

          <div v-if="hasStats" class="mini-stats">
            <template v-if="authStore.isApprenant">
              <div class="m-stat"><span class="m-val">{{ stats.courses }}</span><span class="m-lbl">Courses</span></div>
              <div class="m-stat"><span class="m-val">{{ stats.completed }}</span><span class="m-lbl">Completed</span></div>
              <div class="m-stat"><span class="m-val sage">{{ stats.progress }}%</span><span class="m-lbl">Progress</span></div>
            </template>
            <template v-else-if="authStore.isFormateur">
              <div class="m-stat"><span class="m-val">{{ formateurStats.courses }}</span><span class="m-lbl">Courses</span></div>
              <div class="m-stat"><span class="m-val">{{ formateurStats.published }}</span><span class="m-lbl">Published</span></div>
              <div class="m-stat"><span class="m-val sage">{{ formateurStats.students }}</span><span class="m-lbl">Students</span></div>
            </template>
            <template v-else-if="authStore.isAdmin">
              <div class="m-stat"><span class="m-val">99+</span><span class="m-lbl">Users</span></div>
              <div class="m-stat"><span class="m-val sage">24/7</span><span class="m-lbl">Status</span></div>
            </template>
          </div>

          <nav class="profile-nav">
            <span class="nav-group-label">MENU</span>
            <button
              v-for="m in menuItems" :key="m.value"
              class="nav-item"
              :class="{ 'nav-item-active': activeTab === m.value }"
              @click="activeTab = m.value"
            >
              <v-icon size="18">{{ m.icon }}</v-icon>
              <span>{{ m.label }}</span>
            </button>
          </nav>
        </aside>

        <!-- ── Content panel ──────────────────────────── -->
        <section class="content-panel">
          <v-window v-model="activeTab">
            <!-- Information -->
            <v-window-item value="info" class="content-section">
              <header class="section-header">
                <span class="eyebrow"><i class="focus-dot" /> DIGITAL IDENTITY</span>
                <h3>Professional <em>profile</em></h3>
              </header>

              <v-form @submit.prevent="saveProfile">
                <div class="field-grid">
                  <div class="field">
                    <label>Full name</label>
                    <v-text-field v-model="form.name" variant="outlined" density="comfortable" color="primary" hide-details prepend-inner-icon="mdi-account-outline" class="zen-input" />
                  </div>
                  <div class="field">
                    <label>Email address</label>
                    <v-text-field v-model="form.email" variant="outlined" density="comfortable" color="primary" hide-details prepend-inner-icon="mdi-email-outline" class="zen-input" />
                  </div>
                  <div class="field">
                    <label>Phone number</label>
                    <v-text-field v-model="form.telephone" variant="outlined" density="comfortable" color="primary" hide-details prepend-inner-icon="mdi-phone-outline" class="zen-input" />
                  </div>
                </div>

                <v-alert v-if="saveMessage" :type="saveSuccess ? 'success' : 'error'" variant="tonal" rounded="lg" class="mt-6">
                  {{ saveMessage }}
                </v-alert>

                <div class="form-actions">
                  <button type="submit" class="zen-btn" :disabled="saving">{{ saving ? 'Saving…' : 'Save changes' }}</button>
                </div>
              </v-form>
            </v-window-item>

            <!-- Security -->
            <v-window-item value="security" class="content-section">
              <header class="section-header">
                <span class="eyebrow"><i class="focus-dot" /> DATA PROTECTION</span>
                <h3>Security <em>&amp; access</em></h3>
              </header>

              <v-form @submit.prevent="changePassword">
                <div class="field-grid">
                  <div class="field full">
                    <label>Current password</label>
                    <v-text-field
                      v-model="pwForm.current" :type="showCurrent ? 'text' : 'password'"
                      variant="outlined" density="comfortable" color="primary" hide-details
                      prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
                      class="zen-input" @click:append-inner="showCurrent = !showCurrent"
                    />
                  </div>
                  <div class="field">
                    <label>New password</label>
                    <v-text-field
                      v-model="pwForm.password" :type="showNew ? 'text' : 'password'"
                      variant="outlined" density="comfortable" color="primary" hide-details
                      prepend-inner-icon="mdi-shield-lock-outline" :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
                      class="zen-input" @click:append-inner="showNew = !showNew"
                    />
                  </div>
                  <div class="field">
                    <label>Confirm password</label>
                    <v-text-field
                      v-model="pwForm.password_confirmation" :type="showConfirm ? 'text' : 'password'"
                      variant="outlined" density="comfortable" color="primary" hide-details
                      prepend-inner-icon="mdi-shield-check-outline" :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                      class="zen-input" @click:append-inner="showConfirm = !showConfirm"
                    />
                  </div>
                </div>

                <v-alert v-if="pwMessage" :type="pwSuccess ? 'success' : 'error'" variant="tonal" rounded="lg" class="mt-6">
                  {{ pwMessage }}
                </v-alert>

                <div class="form-actions">
                  <button type="submit" class="zen-btn" :disabled="changingPw">{{ changingPw ? 'Updating…' : 'Update password' }}</button>
                </div>
              </v-form>

              <div class="danger-zone">
                <div>
                  <h4>Danger zone</h4>
                  <p>Deleting your account is permanent and will erase all your data.</p>
                </div>
                <button type="button" class="zen-btn zen-btn-danger">Delete account</button>
              </div>
            </v-window-item>
          </v-window>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const authStore = useAuthStore();
const saving = ref(false);
const changingPw = ref(false);
const { markLoading, markLoaded } = useViewLoadState();
const pwMessage = ref('');
const pwSuccess = ref(false);
const saveMessage = ref('');
const saveSuccess = ref(false);
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);
const activeTab = ref('info');

const form = ref({ name: '', email: '', telephone: '' });
const pwForm = ref({ current: '', password: '', password_confirmation: '' });
const stats = ref({ courses: 0, completed: 0, progress: 0 });
const formateurStats = ref({ courses: 0, published: 0, students: 0 });

const menuItems = [
  { label: 'Profile information', value: 'info', icon: 'mdi-account-circle-outline' },
  { label: 'Security', value: 'security', icon: 'mdi-shield-lock-outline' }
];

const hasStats = computed(() => authStore.isApprenant || authStore.isFormateur || authStore.isAdmin);

const initials = computed(() =>
  (authStore.user?.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
);
const roleHex = computed(() =>
  ({ admin: '#a4574f', formateur: '#a97852', apprenant: '#6f9276' }[authStore.user?.role] || '#6f9276')
);
const roleIcon = computed(() =>
  ({ admin: 'mdi-shield-crown', formateur: 'mdi-school', apprenant: 'mdi-account-star' }[authStore.user?.role] || 'mdi-account')
);

async function saveProfile() {
  saving.value = true; saveMessage.value = '';
  try {
    const { data } = await api.put('/auth/profile', form.value);
    authStore.user = data;
    localStorage.setItem('user', JSON.stringify(data));
    saveSuccess.value = true;
    saveMessage.value = 'Your profile has been updated.';
  } catch(e) {
    saveSuccess.value = false;
    saveMessage.value = e.response?.data?.message || 'Something went wrong.';
  } finally { saving.value = false; }
}

async function changePassword() {
  changingPw.value = true; pwMessage.value = '';
  try {
    await api.put('/auth/password', pwForm.value);
    pwSuccess.value = true;
    pwMessage.value = 'Your password has been updated.';
    pwForm.value = { current: '', password: '', password_confirmation: '' };
  } catch(e) {
    pwSuccess.value = false;
    pwMessage.value = e.response?.data?.message || 'Something went wrong.';
  } finally { changingPw.value = false; }
}

onMounted(async () => {
  markLoading();
  form.value.name      = authStore.user?.name || '';
  form.value.email     = authStore.user?.email || '';
  form.value.telephone = authStore.user?.telephone || '';

  if (authStore.isApprenant) {
    try {
      const { data: enrollments } = await api.get('/my-enrollments');
      const total = enrollments.length;
      const completed = enrollments.filter(e => e.inscription.pourcentageProgression >= 100).length;
      const avg = total ? Math.round(enrollments.reduce((sum, e) => sum + e.inscription.pourcentageProgression, 0) / total) : 0;
      stats.value = { courses: total, completed, progress: avg };
    } catch (e) {
      showErrorToast(e, 'Could not load your statistics.');
    }
  } else if (authStore.isFormateur) {
    try {
      const { data: myCourses } = await api.get('/mes-cours');
      const published = myCourses.filter(c => c.statut === 'publie').length;
      const students = myCourses.reduce((sum, c) => sum + (c.inscriptions_count || 0), 0);
      formateurStats.value = { courses: myCourses.length, published, students };
    } catch (e) {
      showErrorToast(e, 'Could not load your instructor statistics.');
    }
  }
  markLoaded();
});
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 65px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.profile-inner { max-width: 1000px; margin: 0 auto; }
.profile-card {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid #e5e7df;
  border-radius: 12px;
  background: #fff;
}

/* ── Identity panel ────────────────────────────────────── */
.identity-panel {
  padding: 34px 28px;
  border-right: 1px solid #e7e8e1;
  background: #faf9f5;
}
.avatar-stage { position: relative; width: 104px; margin: 0 auto 18px; }
.profile-avatar { background: #e7eee5; color: #46704f; }
.initials { font-family: 'Iowan Old Style', Georgia, serif; font-size: 40px; }
.role-badge {
  position: absolute;
  right: -2px;
  bottom: -2px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 3px solid #faf9f5;
  border-radius: 10px;
}
.identity-name {
  margin: 0 0 4px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  text-align: center;
  letter-spacing: -.02em;
}
.identity-email { margin: 0 0 12px; color: #8b938b; font-size: 12px; text-align: center; word-break: break-all; }
.role-chip {
  display: block;
  width: fit-content;
  margin: 0 auto;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.mini-stats {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 8px;
  margin: 24px 0;
  padding: 16px 10px;
  border: 1px solid #eceee7;
  border-radius: 10px;
  background: #fff;
  text-align: center;
}
.m-stat { display: flex; flex-direction: column; align-items: center; }
.m-val {
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #28382e;
}
.m-val.sage { color: #46704f; }
.m-lbl { margin-top: 2px; color: #929a91; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }

.nav-group-label { display: block; padding-left: 12px; margin-bottom: 10px; color: #a1a79f; font-size: 9px; font-weight: 700; letter-spacing: .14em; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 6px;
  padding: 11px 14px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: #66716a;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  text-align: left;
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.nav-item:hover { background: #f1f4ee; }
.nav-item-active { background: #eef4ec !important; border-color: #cfe0cd !important; color: #3f5f49 !important; }

/* ── Content panel ─────────────────────────────────────── */
.content-panel { min-height: 560px; }
.content-section { padding: 40px 44px; }
.section-header { margin-bottom: 30px; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #648069;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .13em;
}
.focus-dot { width: 7px; height: 7px; border-radius: 50%; background: #749578; }
.section-header h3 {
  margin: 14px 0 0;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -.035em;
}
.section-header h3 em { color: #557a61; }

.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.field.full { grid-column: 1 / -1; }
.field label { display: block; margin-bottom: 8px; color: #66716a; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.zen-input :deep(.v-field) { border-radius: 8px; }

.form-actions { display: flex; justify-content: flex-end; margin-top: 28px; }

/* ── Danger zone ───────────────────────────────────────── */
.danger-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 36px;
  padding: 22px 24px;
  border: 1px solid #ecd9d5;
  border-radius: 10px;
  background: #fbf5f4;
}
.danger-zone h4 {
  margin: 0 0 4px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 18px;
  font-weight: 400;
  color: #a4574f;
}
.danger-zone p { margin: 0; color: #8b7a77; font-size: 12px; }

/* ── Buttons ───────────────────────────────────────────── */
.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 24px;
  border: 0;
  border-radius: 7px;
  background: #537a62;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: background .18s ease, transform .18s ease;
}
.zen-btn:hover:not(:disabled) { background: #456c54; transform: translateY(-1px); }
.zen-btn:disabled { opacity: .6; cursor: default; }
.zen-btn-danger { background: #fff; color: #a4574f; border: 1px solid #e0c9c4; flex-shrink: 0; }
.zen-btn-danger:hover { background: #a4574f; color: #fff; border-color: #a4574f; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 800px) {
  .profile-card { grid-template-columns: 1fr; }
  .identity-panel { border-right: 0; border-bottom: 1px solid #e7e8e1; }
  .content-section { padding: 28px 22px; }
  .field-grid { grid-template-columns: 1fr; }
  .danger-zone { flex-direction: column; align-items: flex-start; }
  .profile-page { padding: 50px 18px 72px; }
}
@media (prefers-reduced-motion: reduce) {
  .profile-page *, .profile-page *::before, .profile-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
