<template>
  <div class="cinema-mode-bg">
    <v-container v-if="course" fluid class="pa-0 cinema-container">
      <!-- Premium Ambient Background -->
      <div class="ambient-glow" :style="{ background: ambientGlowColor }" />
      
      <v-row no-gutters class="fill-height overflow-hidden">
<!-- Main: Lesson Content -->
        <v-col class="lesson-main d-flex flex-column position-relative h-100 transition-all" :class="sidebarVisible ? 'cols-main-with-sidebar' : 'cols-12'">
<!-- Top Navigation Header -->
          <div class="cinema-header d-flex align-center justify-space-between px-6 py-4">
            <div class="d-flex align-center gap-4">
              <v-btn 
                variant="tonal" 
                color="white" 
                to="/dashboard" 
                prepend-icon="mdi-arrow-left" 
                class="text-none rounded-pill glass-button px-6"
              >
                Dashboard
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="white"
                class="glass-button rounded-circle"
                @click="sidebarVisible = !sidebarVisible"
              >
                <v-icon size="20">{{ sidebarVisible ? 'mdi-backburger' : 'mdi-menu' }}</v-icon>
              </v-btn>
            </div>

            <div class="d-flex align-center gap-3">
              <div class="lesson-counter-chip d-none d-md-flex align-center gap-2 px-4 py-2 rounded-pill border-glass">
                <span class="text-caption text-grey-lighten-1">LEÇON</span>
                <span class="text-body-2 font-weight-black text-white tabular-nums">{{ currentLessonIndex + 1 }} / {{ allLecons.length }}</span>
              </div>
              <div class="premium-badge d-none d-sm-flex align-center px-4 py-2 rounded-pill border-glass bg-glass-dark">
                <v-icon size="16" color="primary" class="mr-2">mdi-school-outline</v-icon>
                <span class="text-caption font-weight-bold text-white tracking-widest text-uppercase" style="font-size: 0.7rem;">Apprenant Hub</span>
              </div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="content-scroll-area flex-grow-1 overflow-y-auto px-4 px-md-10 pb-10 pt-32 custom-scrollbar">
            <div v-if="!activeLecon" class="empty-state-hero d-flex flex-column align-center justify-center h-100">
               <v-icon size="100" color="primary" class="opacity-10 mb-6">mdi-play-box-multiple-outline</v-icon>
               <h2 class="text-h4 font-weight-black text-white">Sélectionnez une leçon</h2>
               <p class="text-grey-lighten-1 mt-2">Choisissez un module dans le menu pour commencer votre apprentissage.</p>
            </div>

            <div v-else class="content-max-width mx-auto">
              <!-- Lesson Header -->
              <div v-motion class="lesson-header mb-8" :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
                <div class="d-flex align-center gap-3 mb-3">
                  <v-chip :color="iconColor(activeLecon.typeContenu)" size="small" variant="flat" class="font-weight-black text-uppercase px-3" style="height: 22px; font-size: 0.6rem;">
                    {{ activeLecon.typeContenu }}
                  </v-chip>
                  <div class="divider-v" />
                  <span class="text-overline text-primary font-weight-black" style="font-size: 0.7rem;">MODULE {{ currentModuleIndex + 1 }}</span>
                </div>
                <h1 class="text-h2 font-weight-black text-white leading-tight mb-2 title-responsive">{{ activeLecon.titre }}</h1>
              </div>

              <!-- Main Content Player -->
              <v-card class="player-surface rounded-3xl overflow-hidden border-subtle" theme="dark">
                <div class="player-ambient-glow" :style="{ background: iconColor(activeLecon.typeContenu) + '15' }" />
                
                <div class="position-relative z-1">
                  <div v-if="activeLecon.typeContenu === 'video'" class="video-stage">
                    <div v-if="mediaLoading" class="player-loading-overlay">
                      <v-progress-circular indeterminate color="primary" size="64" />
                    </div>
                    <video 
                      v-else-if="inlineMediaSrc" 
                      ref="videoPlayer" 
                      :key="activeLecon.id" 
                      :src="inlineMediaSrc"
                      class="w-100 h-100 object-fit-contain" 
                      controls 
                      @timeupdate="onTimeUpdate" 
                      @loadedmetadata="onLoadedMetadata" 
                    />
                    <div v-else class="player-error-stage d-flex flex-column align-center">
                      <v-icon size="80" color="grey-darken-3">mdi-video-off-outline</v-icon>
                      <p class="mt-4 text-grey">Flux vidéo indisponible</p>
                    </div>
                  </div>

                  <div v-else-if="activeLecon.typeContenu === 'pdf'" class="pdf-stage">
                    <div v-if="mediaLoading" class="player-loading-overlay">
                      <v-progress-circular indeterminate color="warning" size="64" />
                    </div>
                    <div v-else-if="mediaError" class="player-error-stage d-flex flex-column align-center justify-center h-100 w-100">
                      <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
                      <p class="text-white font-weight-bold">Impossible de charger le document PDF</p>
                      <p class="text-grey-lighten-1 text-caption mt-1">{{ mediaError }}</p>
                      <v-btn color="primary" size="small" class="mt-4 rounded-pill" prepend-icon="mdi-refresh" @click="loadAuthenticatedMedia">Réessayer</v-btn>
                    </div>
                    <iframe v-else-if="inlineMediaSrc" :key="activeLecon.id" :src="inlineMediaSrc" class="w-100 h-100 border-none" />
                  </div>

                  <div v-else-if="activeLecon.typeContenu === 'image'" class="image-stage d-flex justify-center align-center h-100 pa-6">
                    <v-img :src="inlineMediaSrc" max-height="600" contain />
                  </div>

                  <div v-else-if="activeLecon.typeContenu === 'td'" class="td-stage d-flex flex-column justify-center align-center h-100 pa-10">
                    <v-icon size="80" color="info" class="mb-4">mdi-file-document-outline</v-icon>
                    <h3 class="text-h5 font-weight-bold text-white text-center">Document Associé</h3>
                    <p class="text-grey-lighten-1 mt-2 text-center">Ce fichier est disponible en téléchargement ci-dessous.</p>
                  </div>

                  <div v-else class="text-stage pa-10 pa-md-16">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <div class="text-content-rich" v-html="sanitizedLessonContent" />
                  </div>
                </div>
              </v-card>

              <!-- Unified Command Dock -->
              <div class="action-bar-container mt-10 d-flex justify-center">
                <div class="command-dock pa-2 rounded-pill border-glass d-flex align-center justify-space-between flex-wrap gap-4 w-100" style="max-width: 900px; background: rgba(10, 15, 25, 0.85); backdrop-filter: blur(24px); box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
                  <div class="d-flex align-center gap-2 pl-2">
                    <v-btn 
                      v-if="prevLecon" 
                      variant="text" color="white" height="44"
                      class="rounded-pill px-5 font-weight-bold text-none dock-btn-secondary" 
                      prepend-icon="mdi-chevron-left" 
                      @click="selectLecon(prevLecon)"
                    >
                      Précédent
                    </v-btn>
                    
                    <v-btn
                      v-if="['pdf', 'image', 'td'].includes(activeLecon.typeContenu)"
                      variant="text" color="white" height="44"
                      class="rounded-pill px-5 font-weight-bold text-none dock-btn-secondary"
                      prepend-icon="mdi-download"
                      @click="downloadLecon"
                    >
                      Télécharger
                    </v-btn>
                  </div>

                  <div class="d-flex align-center gap-2 pr-2">
                    <v-btn
                      v-if="!completedIds.has(activeLecon.id)"
                      color="success" height="44"
                      class="rounded-pill px-6 font-weight-black text-none dock-btn-success"
                      :loading="completing"
                      prepend-icon="mdi-check-decagram"
                      @click="markComplete"
                    >
                      Terminer
                    </v-btn>
                    <div v-else class="d-flex align-center gap-2">
                      <div class="dock-success-pill px-5 h-44 rounded-pill d-flex align-center gap-2" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);">
                        <v-icon color="success" size="18">mdi-check-circle</v-icon>
                        <span class="text-success font-weight-bold text-caption text-uppercase tracking-widest">Terminée</span>
                      </div>
                      <v-tooltip text="Refaire la leçon" location="top">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-refresh"
                            variant="tonal" color="white"
                            width="44" height="44"
                            class="rounded-circle dock-btn-icon border-glass"
                            :loading="uncompleting"
                            @click="unmarkComplete"
                          />
                        </template>
                      </v-tooltip>
                    </div>

                    <v-btn
                      v-if="nextLecon"
                      color="primary" height="44"
                      class="rounded-pill px-8 font-weight-black text-none dock-btn-primary"
                      :disabled="!completedIds.has(activeLecon.id)"
                      append-icon="mdi-arrow-right"
                      @click="selectLecon(nextLecon)"
                    >
                      Suivant
                    </v-btn>
                    <v-btn
                      v-else-if="course?.quizzes?.length"
                      color="warning" height="44"
                      class="rounded-pill px-8 font-weight-black text-none dock-btn-warning"
                      append-icon="mdi-arrow-right"
                      :to="`/quiz/${course.quizzes[0].id}`"
                    >
                      Passer au Quiz
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Sidebar: Curriculum -->
        <v-col 
          v-if="sidebarVisible" 
          class="sidebar-panel h-100 d-flex flex-column transition-all"
        >
          <div class="sidebar-top pa-6 pa-xl-8">
            <div class="overline-text text-primary font-weight-black mb-2">PROGRESSION DU COURS</div>
            <div class="d-flex justify-space-between align-end mb-4">
              <h3 class="text-h5 font-weight-black text-white leading-none">Programme</h3>
              <div class="text-h4 font-weight-black text-primary tabular-nums">{{ Math.round(progression) }}%</div>
            </div>
            <v-progress-linear 
              :model-value="progression" 
              color="primary" height="8" rounded 
              bg-color="rgba(255,255,255,0.05)"
              class="mb-3 premium-progress"
            />
            <div class="d-flex align-center justify-space-between">
               <span class="text-caption text-grey font-weight-bold uppercase">{{ completedIds.size }} / {{ allLecons.length }} COMPLÉTÉ</span>
               <v-icon color="grey-darken-1" size="14">mdi-information-outline</v-icon>
            </div>
          </div>

          <div class="sidebar-scroll flex-grow-1 overflow-y-auto pa-4 custom-scrollbar">
            <div v-for="(module, mIdx) in course.modules" :key="module.id" class="mb-8">
              <div class="module-label px-4 mb-3 d-flex align-center">
                <span class="text-caption font-weight-black text-grey-darken-1 uppercase tracking-widest">MODULE {{ mIdx + 1 }}</span>
                <v-divider class="ml-4 opacity-10" />
              </div>
              
              <div class="lesson-list">
                <button 
                  v-for="(lecon, lIdx) in module.lecons" 
                  :key="lecon.id"
                  class="lesson-item-btn pa-4 rounded-2xl mb-2 d-flex align-center text-left transition-all"
                  :class="{ 
                    'lib-active': activeLecon?.id === lecon.id,
                    'lib-locked': isLocked(lecon),
                    'lib-completed': completedIds.has(lecon.id)
                  }"
                  @click="!isLocked(lecon) && selectLecon(lecon)"
                >
                  <div class="lib-icon-wrap mr-4">
                    <v-icon v-if="completedIds.has(lecon.id)" color="success" size="18">mdi-check-circle</v-icon>
                    <v-icon v-else-if="isLocked(lecon)" color="grey-darken-3" size="18">mdi-lock-outline</v-icon>
                    <v-icon v-else :color="activeLecon?.id === lecon.id ? 'primary' : 'grey'" size="18">
                      {{ activeLecon?.id === lecon.id ? 'mdi-play' : 'mdi-circle-medium' }}
                    </v-icon>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="text-subtitle-2 font-weight-bold text-white text-truncate mb-1">{{ lIdx + 1 }}. {{ lecon.titre }}</div>
                    <div class="d-flex align-center gap-2">
                       <v-icon size="12" :color="iconColor(lecon.typeContenu)">{{ typeIcon(lecon.typeContenu) }}</v-icon>
                       <span class="text-caption text-uppercase font-weight-black opacity-60" style="font-size: 0.55rem;">{{ lecon.typeContenu }}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <!-- Quizzes Section -->
            <div v-if="course?.quizzes?.length" class="mb-8">
              <div class="module-label px-4 mb-3 d-flex align-center">
                <span class="text-caption font-weight-black text-warning uppercase tracking-widest">ÉVALUATIONS (OPTIONNEL)</span>
                <v-divider class="ml-4 opacity-10" />
              </div>
              <div class="lesson-list">
                <button
                  v-for="quiz in course.quizzes"
                  :key="quiz.id"
                  class="lesson-item-btn pa-4 rounded-2xl mb-2 d-flex align-center text-left transition-all"
                  @click="$router.push(`/quiz/${quiz.id}`)"
                >
                  <div class="lib-icon-wrap mr-4">
                    <v-icon color="warning" size="18">mdi-clipboard-check-outline</v-icon>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="text-subtitle-2 font-weight-bold text-white text-truncate mb-1">Quiz: {{ quiz.titre }}</div>
                    <div class="d-flex align-center gap-2">
                      <span class="text-caption text-uppercase font-weight-black opacity-60" style="font-size: 0.55rem;">Testez vos connaissances</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div v-else class="h-100 d-flex flex-column align-center justify-center bg-black">
      <div class="loading-stage">
        <div class="loading-orbit" />
        <v-progress-circular indeterminate color="primary" size="64" width="3" />
      </div>
      <p class="mt-8 text-grey text-overline tracking-widest animate-pulse">Initialisation du Hub...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../axios';
import DOMPurify from 'dompurify';
import confetti from 'canvas-confetti';
import { showErrorToast, showToast } from '../composables/useToast.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const course = ref(null);
const activeLecon = ref(null);
const progression = ref(0);
const completedIds = ref(new Set());
const completing = ref(false);
const uncompleting = ref(false);
const sidebarVisible = ref(true);

const mediaBlobUrl = ref(null);
const mediaLoading = ref(false);
const mediaError = ref('');
let mediaLoadGeneration = 0;

const videoPlayer = ref(null);
const currentTime = ref(0);
const duration = ref(0);

const currentLessonIndex = computed(() => {
  if (!allLecons.value.length || !activeLecon.value) return 0;
  return allLecons.value.findIndex(l => l.id === activeLecon.value.id);
});

const sanitizedLessonContent = computed(() =>
  DOMPurify.sanitize(activeLecon.value?.urlContenu || 'Contenu en cours de rédaction...')
);

const currentModuleIndex = computed(() => {
  if (!course.value || !activeLecon.value) return 0;
  return course.value.modules.findIndex(m => m.lecons.some(l => l.id === activeLecon.value.id));
});

const ambientGlowColor = computed(() => {
  if (!activeLecon.value) return 'rgba(59, 130, 246, 0.05)';
  const colorMap = { video: '#3b82f6', pdf: '#f97316', image: '#06b6d4', texte: '#8b5cf6' };
  const baseColor = colorMap[activeLecon.value.typeContenu] || '#3b82f6';
  return `radial-gradient(circle at 50% 50%, ${baseColor}12 0%, transparent 70%)`;
});

function onTimeUpdate(e) { currentTime.value = e.target.currentTime; }
function onLoadedMetadata(e) { duration.value = e.target.duration; }

function revokeMediaBlob() {
  if (mediaBlobUrl.value) { URL.revokeObjectURL(mediaBlobUrl.value); mediaBlobUrl.value = null; }
}

const inlineMediaSrc = computed(() => {
  const lecon = activeLecon.value;
  if (!lecon) return '';
  if (lecon.typeContenu === 'pdf' && mediaBlobUrl.value) return mediaBlobUrl.value;
  // Use the formatted URL provided by the backend (Cloud ready)
  return lecon.url_contenu_formattee || lecon.urlContenu || '';
});

async function loadAuthenticatedMedia() {
  const myGen = ++mediaLoadGeneration;
  revokeMediaBlob();
  mediaError.value = '';
  const lecon = activeLecon.value;
  if (!lecon?.urlContenu || lecon.typeContenu !== 'pdf' || lecon.urlContenu.startsWith('http')) {
    mediaLoading.value = false; return;
  }

  mediaLoading.value = true;
  try {
    const res = await api.get(`/lessons/${lecon.id}/download`, { responseType: 'blob' });
    if (myGen === mediaLoadGeneration) mediaBlobUrl.value = URL.createObjectURL(res.data);
  } catch {
    if (myGen === mediaLoadGeneration) mediaError.value = 'Erreur réseau.';
  } finally {
    if (myGen === mediaLoadGeneration) mediaLoading.value = false;
  }
}

watch(() => [activeLecon.value?.id, activeLecon.value?.urlContenu], () => loadAuthenticatedMedia(), { immediate: true });
onBeforeUnmount(() => { mediaLoadGeneration++; revokeMediaBlob(); });

const allLecons = computed(() => course.value?.modules?.flatMap(m => m.lecons) || []);
const prevLecon = computed(() => allLecons.value[currentLessonIndex.value - 1] || null);
const nextLecon = computed(() => allLecons.value[currentLessonIndex.value + 1] || null);

function typeIcon(type) { return { video: 'mdi-play-circle-outline', pdf: 'mdi-file-pdf-box', image: 'mdi-image-outline', texte: 'mdi-text-box-outline' }[type] || 'mdi-file'; }
function iconColor(type) { return { video: 'primary', pdf: 'warning', image: 'info', texte: 'secondary' }[type] || 'grey'; }

function isLocked(lecon) {
  if (!lecon || authStore.isAdmin || authStore.isFormateur) return false;
  if (completedIds.value.has(lecon.id)) return false;
  const idx = allLecons.value.findIndex(l => l.id === lecon.id);
  if (idx === 0) return false;
  return !completedIds.value.has(allLecons.value[idx - 1].id);
}

function selectLecon(lecon) { activeLecon.value = lecon; mediaError.value = ''; }

async function markComplete() {
  if (!activeLecon.value || completing.value) return;
  completing.value = true;
  try {
    const { data } = await api.post(`/lessons/${activeLecon.value.id}/complete`);
    if (data.completed_ids) completedIds.value = new Set(data.completed_ids.map(Number));
    progression.value = data.progression;
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    if (nextLecon.value) setTimeout(() => selectLecon(nextLecon.value), 1000);
  } catch (e) {
    showErrorToast(e, 'Impossible de marquer cette leçon comme terminée.');
  }
  finally { completing.value = false; }
}

async function unmarkComplete() {
  if (!activeLecon.value || uncompleting.value) return;
  uncompleting.value = true;
  try {
    const { data } = await api.post(`/lessons/${activeLecon.value.id}/uncomplete`);
    if (data.completed_ids) completedIds.value = new Set(data.completed_ids.map(Number));
    progression.value = data.progression;
    reloadMedia();
  } catch (e) {
    showErrorToast(e, 'Impossible de retirer la validation de cette leçon.');
  } finally {
    uncompleting.value = false;
  }
}

function reloadMedia() {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = 0;
    videoPlayer.value.play();
  } else {
    loadAuthenticatedMedia();
  }
}

async function downloadLecon() {
  const lecon = activeLecon.value;
  if (!lecon) return;
  try {
    const res = await api.get(`/lessons/${lecon.id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    
    // Extract extension from urlContenu, fallback to .file if unknown
    let ext = 'file';
    if (lecon.urlContenu && lecon.urlContenu.includes('.')) {
      ext = lecon.urlContenu.split('.').pop();
    }
    
    a.download = `${lecon.titre}.${ext}`;
    a.click();
    // Release the object URL after triggering the download
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (e) {
    showErrorToast(e, 'Impossible de télécharger cette ressource.');
  }
}

async function initHub() {
  try {
    const { data } = await api.get(`/cours/${route.params.id}`);
    course.value = data;
    const { data: prog } = await api.get(`/progress/${route.params.id}`);
    progression.value = prog.progression || 0;
    if (prog.completed_ids) completedIds.value = new Set(prog.completed_ids.map(Number));
    const firstUn = allLecons.value.find(l => !completedIds.value.has(l.id));
    activeLecon.value = firstUn || allLecons.value[0];
  } catch (e) { 
    if (e.response?.status === 403) {
      // Not enrolled
      router.push(`/cours/${route.params.id}`);
      showToast('Inscription requise pour accéder à ce cours.', 'warning');
    } else {
      showErrorToast(e, 'Impossible de charger le hub de cours.');
    }
  }
}

onMounted(initHub);
watch(() => route.params.id, initHub);
</script>

<style scoped>
.cinema-container { height: 100vh; background-color: #05070a; overflow: hidden; position: relative; }
.ambient-glow { position: absolute; inset: 0; z-index: 0; pointer-events: none; transition: background 1s ease; }
.lesson-main { background: transparent; z-index: 1; }
.cols-main-with-sidebar { flex: 1 1 auto; max-width: 100%; }

@media (min-width: 960px) {
  .cols-main-with-sidebar { max-width: calc(100% - 380px); flex: 0 0 calc(100% - 380px); }
  .sidebar-panel { width: 380px; flex: 0 0 380px; }
}

.cinema-header {
  position: absolute; top: 0; left: 0; right: 0; height: 80px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, transparent 100%);
  z-index: 100;
}
.pt-32 { padding-top: 120px !important; }
.title-responsive { font-size: clamp(2rem, 5vw, 3.5rem) !important; letter-spacing: -0.03em; }

.glass-button { background: rgba(255, 255, 255, 0.04) !important; backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08) !important; }
.lesson-counter-chip { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.05); }
.content-max-width { max-width: 1100px; width: 100%; }
.divider-v { width: 1px; height: 16px; background: rgba(255,255,255,0.1); }

.player-surface {
  background: #0a0f1c !important; border: 1px solid rgba(255, 255, 255, 0.06) !important;
  box-shadow: 0 40px 100px -20px rgba(0,0,0,0.8) !important; position: relative;
}
.player-ambient-glow { position: absolute; inset: 0; filter: blur(80px); opacity: 0.4; z-index: 0; }
.video-stage, .pdf-stage { height: 60vh; background: black; display: flex; align-items: center; justify-content: center; }
.text-stage { background: #0f172a; }
.text-content-rich { color: #d1d5db; font-size: 1.1rem; line-height: 1.8; }

/* ── Command Dock (Redesigned Action Bar) ──────────────── */
.bg-glass-dark { background: rgba(5, 7, 10, 0.6); }
.border-glass { border: 1px solid rgba(255, 255, 255, 0.08) !important; }

.dock-btn-secondary { transition: all 0.2s ease; opacity: 0.8; }
.dock-btn-secondary:hover { opacity: 1; background: rgba(255, 255, 255, 0.05); }

.dock-btn-success { background: linear-gradient(135deg, #10b981, #059669) !important; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3) !important; }
.dock-btn-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4) !important; }
.dock-btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706) !important; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4) !important; }

.dock-btn-success:hover, .dock-btn-primary:hover, .dock-btn-warning:hover { transform: translateY(-1px); filter: brightness(1.1); }

.h-44 { height: 44px; }
.dock-btn-icon { transition: all 0.2s ease; background: rgba(255, 255, 255, 0.03) !important; }
.dock-btn-icon:hover { background: rgba(255, 255, 255, 0.1) !important; transform: rotate(15deg); }

/* ── Sidebar Redesign ─────────────────────────────────── */
.sidebar-panel { background: rgba(5, 7, 10, 0.8); backdrop-filter: blur(40px); border-left: 1px solid rgba(255, 255, 255, 0.05); z-index: 5; }
.sidebar-top { border-bottom: 1px solid rgba(255, 255, 255, 0.04); background: linear-gradient(to bottom, rgba(59, 130, 246, 0.03), transparent); }
.overline-text { font-size: 0.65rem; letter-spacing: 0.25em; color: #3b82f6; }
.premium-progress :deep(.v-progress-linear__determinate) { background: linear-gradient(90deg, #3b82f6, #60a5fa); box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }

.lesson-item-btn {
  width: 100%; border: 1px solid transparent; background: transparent; color: #94a3b8; transition: all 0.3s ease;
}
.lesson-item-btn:hover { background: rgba(255, 255, 255, 0.02); color: #fff; }
.lib-active { 
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), transparent) !important; 
  border-color: rgba(59, 130, 246, 0.2) !important; 
  color: #fff !important; 
  box-shadow: inset 3px 0 0 #3b82f6;
}
.lib-locked { opacity: 0.4; cursor: not-allowed; filter: grayscale(1); }
.lib-completed { background: rgba(16, 185, 129, 0.03); }
.lib-icon-wrap { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border-radius: 10px; }

.loading-stage { position: relative; display: flex; align-items: center; justify-content: center; }
.loading-orbit { position: absolute; width: 100px; height: 100px; border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 50%; animation: rotate 3s linear infinite; }
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.uppercase { text-transform: uppercase; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
</style>
