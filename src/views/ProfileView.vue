<template>
  <div class="profile-page">
    <!-- ── Ambient Scenery ──────────────────────────────── -->
    <div class="scenery-bg">
      <div class="light-beam lb-1" />
      <div class="light-beam lb-2" />
      <div class="mesh-layer" />
    </div>

    <v-container class="profile-container position-relative z-10" fluid>
      <v-row justify="center" class="fill-height align-center">
        <v-col cols="12" lg="11" xl="10">
<v-card class="master-profile-card rounded-3xl overflow-hidden" elevation="0">
            <v-row no-gutters class="fill-height position-relative z-1">
<!-- ── Side Identity Panel ────────────────────── -->
              <v-col cols="12" md="4" class="identity-panel pa-8 pa-xl-10 d-flex flex-column">
<!-- Compact Avatar Section -->
                <div class="avatar-stage mb-8">
                  <div class="avatar-glow" :style="{ background: roleHex + '33' }" />
                  <div class="avatar-orbit" />
                  <v-avatar size="130" class="profile-avatar-main border-glass elevation-24">
                    <span class="text-h2 font-weight-black text-white initials-glow">{{ initials }}</span>
                  </v-avatar>
                  <div class="role-badge-floating" :style="{ background: roleHex }">
                    <v-icon size="18" color="white">{{ roleIcon }}</v-icon>
                  </div>
                  <v-btn icon size="x-small" color="primary" class="avatar-edit-btn">
                    <v-icon size="14">mdi-camera-outline</v-icon>
                  </v-btn>
                </div>

                <!-- Balanced Identity Info -->
                <div class="text-center mb-8">
                  <h2 class="text-h5 font-weight-black text-white mb-2 tracking-tight line-clamp-1 px-4">
                    {{ authStore.user?.name }}
                  </h2>
                  <div class="d-flex flex-column align-center gap-2">
                    <div class="email-chip-v2">
                      <v-icon start size="12" class="opacity-60">mdi-email-outline</v-icon>
                      {{ authStore.user?.email }}
                    </div>
                    <v-chip variant="tonal" :color="roleHex" size="x-small" class="font-weight-black text-uppercase px-3">
                      {{ authStore.user?.role }} Verified
                    </v-chip>
                  </div>
                </div>

                <!-- Intelligent Stats Panel -->
                <div v-if="hasStats" class="mini-stats-v2 mb-10 pa-4 rounded-2xl border-glass">
                  <template v-if="authStore.isApprenant">
                    <div class="m-stat-item">
                      <div class="m-val">{{ stats.courses }}</div>
                      <div class="m-lbl">Cours</div>
                    </div>
                    <div class="m-stat-item">
                      <div class="m-val">{{ stats.completed }}</div>
                      <div class="m-lbl">Finis</div>
                    </div>
                    <div class="m-stat-item">
                      <div class="m-val text-primary">{{ stats.progress }}%</div>
                      <div class="m-lbl">Prog.</div>
                    </div>
                  </template>
                  <template v-else-if="authStore.isFormateur">
                    <div class="m-stat-item">
                      <div class="m-val">{{ formateurStats.courses }}</div>
                      <div class="m-lbl">Cours</div>
                    </div>
                    <div class="m-stat-item">
                      <div class="m-val">{{ formateurStats.published }}</div>
                      <div class="m-lbl">Publiés</div>
                    </div>
                    <div class="m-stat-item">
                      <div class="m-val text-secondary">{{ formateurStats.students }}</div>
                      <div class="m-lbl">Élèves</div>
                    </div>
                  </template>
                  <template v-else-if="authStore.isAdmin">
                    <div class="m-stat-item">
                      <div class="m-val">99+</div>
                      <div class="m-lbl">Users</div>
                    </div>
                    <div class="m-stat-item">
                      <div class="m-val">24/7</div>
                      <div class="m-lbl">Status</div>
                    </div>
                  </template>
                </div>

                <!-- Sleek Navigation Menu -->
                <div class="nav-stack-v2 w-100 mt-auto">
                  <div class="nav-group-label mb-3">MENU PRINCIPAL</div>
                  <button 
                    v-for="m in menuItems" :key="m.value"
                    class="nav-item-v2 mb-2"
                    :class="{ 'nav-item-v2-active': activeTab === m.value }"
                    @click="activeTab = m.value"
                  >
                    <div class="nav-icon-box">
                      <v-icon size="18">{{ m.icon }}</v-icon>
                    </div>
                    <span class="nav-label-v2">{{ m.label }}</span>
                    <v-icon v-if="activeTab === m.value" size="16" class="ml-auto pulse-arrow">mdi-chevron-right</v-icon>
                  </button>
                </div>
              </v-col>

              <!-- ── Main Content Stage ────────────────────── -->
              <v-col cols="12" md="8" class="content-panel h-100 overflow-y-auto custom-scrollbar">
                <v-window v-model="activeTab" class="transition-section">
<!-- Section: Information -->
                  <v-window-item value="info" class="pa-8 pa-xl-12">
                    <div v-motion class="section-header mb-8" :initial="{ opacity: 0, x: 20 }" :enter="{ opacity: 1, x: 0 }">
                      <div class="overline-text text-primary mb-2">IDENTITÉ NUMÉRIQUE</div>
                      <h3 class="text-h3 font-weight-black text-white">Profil <span class="text-gradient-primary">Professionnel</span></h3>
                    </div>

                    <v-form class="profile-form-compact" @submit.prevent="saveProfile">
                      <v-row dense>
                        <v-col cols="12" sm="6" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Nom Complet</label>
                            <v-text-field
                              v-model="form.name" variant="solo" flat rounded="xl"
                              bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              placeholder="Votre nom" prepend-inner-icon="mdi-account-outline"
                              density="comfortable" hide-details
                            />
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Email Professionnel</label>
                            <v-text-field
                              v-model="form.email" variant="solo" flat rounded="xl"
                              bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              placeholder="votre@email.com" prepend-inner-icon="mdi-email-outline"
                              density="comfortable" hide-details
                            />
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Téléphone</label>
                            <v-text-field
                              v-model="form.telephone" variant="solo" flat rounded="xl"
                              bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              placeholder="+212 6..." prepend-inner-icon="mdi-phone-outline"
                              density="comfortable" hide-details
                            />
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Profession / Titre</label>
                            <v-text-field
                              variant="solo" flat rounded="xl"
                              bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              placeholder="Ex: Développeur Fullstack" prepend-inner-icon="mdi-briefcase-outline"
                              density="comfortable" hide-details
                            />
                          </div>
                        </v-col>
                        <v-col cols="12" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Bio Courte</label>
                            <v-textarea
                              variant="solo" flat rounded="xl" rows="3"
                              bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              placeholder="Parlez-nous de vous..." prepend-inner-icon="mdi-text-account"
                              density="comfortable" hide-details no-resize
                            />
                          </div>
                        </v-col>
                      </v-row>

                      <v-alert v-if="saveMessage" :type="saveSuccess ? 'success' : 'error'" variant="tonal" rounded="xl" class="mt-6 border-glass glass-alert animate-in" density="compact">
                        {{ saveMessage }}
                      </v-alert>

                      <div class="d-flex justify-end pt-8">
                        <v-btn
                          type="submit" height="60"
                          class="action-btn-premium rounded-2xl px-12 font-weight-black text-none"
                          :loading="saving"
                        >
                          Sauvegarder les modifications
                        </v-btn>
                      </div>
                    </v-form>
                  </v-window-item>

                  <!-- Section: Security -->
                  <v-window-item value="security" class="pa-8 pa-xl-12">
                    <div v-motion class="section-header mb-8" :initial="{ opacity: 0, x: 20 }" :enter="{ opacity: 1, x: 0 }">
                      <div class="overline-text text-warning mb-2">PROTECTION DES DONNÉES</div>
                      <h3 class="text-h3 font-weight-black text-white">Sécurité <span class="text-gradient-warning">& Accès</span></h3>
                    </div>

                    <v-form class="profile-form-compact" @submit.prevent="changePassword">
                      <v-row dense>
                        <v-col cols="12" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Mot de passe actuel</label>
                            <v-text-field
                              v-model="pwForm.current" :type="showCurrent ? 'text' : 'password'"
                              variant="solo" flat rounded="xl" bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              prepend-inner-icon="mdi-lock-outline" :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
                              density="comfortable"
                              hide-details @click:append-inner="showCurrent = !showCurrent"
                            />
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Nouveau mot de passe</label>
                            <v-text-field
                              v-model="pwForm.password" :type="showNew ? 'text' : 'password'"
                              variant="solo" flat rounded="xl" bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              prepend-inner-icon="mdi-shield-lock-outline" :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
                              density="comfortable"
                              hide-details @click:append-inner="showNew = !showNew"
                            />
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-4">
                          <div class="neo-input-group">
                            <label class="neo-label">Confirmation</label>
                            <v-text-field
                              v-model="pwForm.password_confirmation" :type="showConfirm ? 'text' : 'password'"
                              variant="solo" flat rounded="xl" bg-color="rgba(255,255,255,0.03)" class="neo-input"
                              prepend-inner-icon="mdi-shield-check-outline" :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
                              density="comfortable"
                              hide-details @click:append-inner="showConfirm = !showConfirm"
                            />
                          </div>
                        </v-col>
                      </v-row>

                      <v-alert v-if="pwMessage" :type="pwSuccess ? 'success' : 'error'" variant="tonal" rounded="xl" class="mt-6 border-glass animate-in" density="compact">
                        {{ pwMessage }}
                      </v-alert>

                      <div class="d-flex justify-end pt-8 mb-12">
                        <v-btn
                          type="submit" height="60"
                          class="action-btn-warning rounded-2xl px-12 font-weight-black text-none"
                          :loading="changingPw"
                        >
                          Actualiser le mot de passe
                        </v-btn>
                      </div>

                      <!-- Danger Zone -->
                      <div v-motion class="danger-zone-pro pa-8 rounded-3xl border-danger-glass mt-12" :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1 }">
                        <div class="d-flex align-center justify-space-between flex-wrap gap-6">
                          <div>
                            <h4 class="text-h6 font-weight-black text-error mb-1">Zone de danger</h4>
                            <p class="text-caption text-grey-lighten-1 mb-0">La suppression du compte est irréversible et effacera toutes vos données.</p>
                          </div>
                          <v-btn variant="outlined" color="error" class="rounded-xl px-8 font-weight-black text-none border-danger-btn">
                            Supprimer le compte
                          </v-btn>
                        </div>
                      </div>
                    </v-form>
                  </v-window-item>
</v-window>
              </v-col>
</v-row>
          </v-card>
</v-col>
      </v-row>
    </v-container>
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
  { label: 'Informations', value: 'info', icon: 'mdi-account-circle-outline' },
  { label: 'Sécurité', value: 'security', icon: 'mdi-shield-lock-outline' }
];

const hasStats = computed(() => authStore.isApprenant || authStore.isFormateur || authStore.isAdmin);

const initials = computed(() =>
  (authStore.user?.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
);
const roleHex = computed(() =>
  ({ admin: '#ff5252', formateur: '#8b5cf6', apprenant: '#3b82f6' }[authStore.user?.role] || '#3b82f6')
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
    saveMessage.value = 'Profil mis à jour !';
  } catch(e) {
    saveSuccess.value = false;
    saveMessage.value = e.response?.data?.message || 'Erreur.';
  } finally { saving.value = false; }
}

async function changePassword() {
  changingPw.value = true; pwMessage.value = '';
  try {
    await api.put('/auth/password', pwForm.value);
    pwSuccess.value = true;
    pwMessage.value = 'Mot de passe modifié !';
    pwForm.value = { current: '', password: '', password_confirmation: '' };
  } catch(e) {
    pwSuccess.value = false;
    pwMessage.value = e.response?.data?.message || 'Erreur.';
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
      showErrorToast(e, 'Impossible de charger vos statistiques.');
    }
  } else if (authStore.isFormateur) {
    try {
      const { data: myCourses } = await api.get('/mes-cours');
      const published = myCourses.filter(c => c.statut === 'publie').length;
      const students = myCourses.reduce((sum, c) => sum + (c.inscriptions_count || 0), 0);
      formateurStats.value = { courses: myCourses.length, published, students };
    } catch (e) {
      showErrorToast(e, 'Impossible de charger vos statistiques formateur.');
    }
  }
  markLoaded();
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #020408;
  overflow-x: hidden;
  position: relative;
}

/* ── Scenic Background ─────────────────────────────── */
.scenery-bg {
  position: absolute; inset: 0;
  z-index: 0;
}
.mesh-layer {
  position: absolute; inset: 0;
  background-image: 
    radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0px, transparent 50%);
}
.light-beam {
  position: absolute; width: 800px; height: 800px;
  border-radius: 50%; filter: blur(150px); opacity: 0.12;
}
.lb-1 { top: -300px; left: -200px; background: #3b82f6; }
.lb-2 { bottom: -300px; right: -200px; background: #8b5cf6; }

/* ── Master Card ───────────────────────────────────── */
.profile-container {
  padding-top: calc(var(--el-app-bar-h, 72px) + 40px);
}
.master-profile-card {
  background: rgba(13, 17, 28, 0.6) !important;
  backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5) !important;
  min-height: 650px;
}

/* ── Side Identity Panel ──────────────────────────── */
.identity-panel {
  background: rgba(255, 255, 255, 0.012);
  border-right: 1px solid rgba(255, 255, 255, 0.03);
}

.avatar-stage {
  position: relative;
  display: flex; align-items: center; justify-content: center;
}
.avatar-glow {
  position: absolute; inset: -15px;
  filter: blur(35px);
  border-radius: 50%;
  z-index: 1;
}
.avatar-orbit {
  position: absolute; inset: -8px;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 50%;
  animation: rotate 15s linear infinite;
}
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.profile-avatar-main {
  z-index: 2;
  background: #0a0f1c;
  border: 3px solid rgba(255, 255, 255, 0.05) !important;
}
.initials-glow { text-shadow: 0 0 15px rgba(255,255,255,0.3); }

.role-badge-floating {
  position: absolute; bottom: 5px; right: 5px;
  width: 38px; height: 38px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  border: 3px solid #0a0f1c;
  z-index: 3;
}
.avatar-edit-btn {
  position: absolute; top: 0; right: 0;
  z-index: 4;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.email-chip-v2 {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  background: rgba(255,255,255,0.02);
  border-radius: 100px;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.04);
}

/* ── Mini Stats v2 ────────────────────────────────── */
.mini-stats-v2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 12px;
  background: rgba(255, 255, 255, 0.015);
  text-align: center;
}
.m-stat-item { display: flex; flex-direction: column; align-items: center; }
.m-val { font-size: 1.1rem; font-weight: 900; color: #fff; line-height: 1.2; }
.m-lbl { font-size: 0.6rem; font-weight: 800; color: #475569; text-transform: uppercase; margin-top: 2px; }

/* ── Navigation v2 ────────────────────────────────── */
.nav-group-label {
  font-size: 0.6rem;
  font-weight: 900;
  color: #334155;
  letter-spacing: 0.15em;
  padding-left: 12px;
}
.nav-item-v2 {
  display: flex; align-items: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 16px;
  background: transparent;
  color: #64748b;
  transition: all 0.3s ease;
  position: relative;
}
.nav-item-v2:hover {
  background: rgba(255, 255, 255, 0.02);
  color: #fff;
}
.nav-item-v2-active {
  background: rgba(59, 130, 246, 0.06) !important;
  color: #3b82f6 !important;
}
.nav-icon-box {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  margin-right: 12px;
  transition: inherit;
}
.nav-item-v2-active .nav-icon-box {
  background: rgba(59, 130, 246, 0.15);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
}
.nav-label-v2 { font-weight: 700; font-size: 0.9rem; }
.pulse-arrow { animation: pulseArrow 2s infinite; }
@keyframes pulseArrow { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }

/* ── Main Content Stage ──────────────────────────── */
.section-header .overline-text {
  font-weight: 900; letter-spacing: 0.25em; font-size: 0.7rem;
}
.text-gradient-primary {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.text-gradient-warning {
  background: linear-gradient(135deg, #fbbf24, #fcd34d);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.text-gradient-secondary {
  background: linear-gradient(135deg, #8b5cf6, #c084fc);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.neo-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 800;
  color: #4b5563;
  margin-left: 12px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.neo-input :deep(.v-field) {
  border: 1px solid rgba(255, 255, 255, 0.04) !important;
  transition: all 0.4s ease;
}
.neo-input :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.06) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.05);
}

.pref-icon-box {
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.05);
}
.bg-secondary-opacity-10 { background: rgba(139, 92, 246, 0.1); }
.bg-primary-opacity-10 { background: rgba(59, 130, 246, 0.1); }
.bg-info-opacity-10 { background: rgba(6, 182, 212, 0.1); }
.bg-warning-opacity-10 { background: rgba(251, 191, 36, 0.1); }

.glass-alert { background: rgba(59, 130, 246, 0.05) !important; border: 1px solid rgba(59, 130, 246, 0.2) !important; }
.border-glass { border: 1px solid rgba(255, 255, 255, 0.06) !important; }

/* ── Buttons ───────────────────────────────────────── */
.action-btn-premium {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3) !important;
}
.action-btn-warning {
  background: linear-gradient(135deg, #fbbf24, #d97706) !important;
  box-shadow: 0 10px 25px rgba(251, 191, 36, 0.2) !important;
}
.action-btn-secondary {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9) !important;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3) !important;
}

/* ── Animation ─────────────────────────────────────── */
.animate-in { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.z-10 { z-index: 10; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>
