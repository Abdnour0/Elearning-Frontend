<template>
  <div class="dashboard-wrapper">
<!-- ── Welcome Header ─────────────────────────────────── -->
    <div class="dashboard-header">
      <div class="dashboard-header-bg" />
      <v-container class="position-relative z-1">
        <v-row class="align-center">
          <v-col cols="12" md="6">
            <div
              v-motion
              :initial="{ opacity: 0, x: -30 }"
              :enter="{ opacity: 1, x: 0, transition: { duration: 800 } }"
            >
              <h1 class="dashboard-greeting">
                Bon retour, <span class="greeting-name">{{ firstName }}</span> <span class="emoji">👋</span>
              </h1>
              <p class="dashboard-subline">
                {{ enrolledCourses.length > 0 ? 'Ravi de vous revoir. Prêt à atteindre vos objectifs aujourd\'hui ?' : 'Commencez votre premier cours et transformez votre carrière.' }}
              </p>
            </div>
          </v-col>
          
          <v-col cols="12" md="6" class="d-flex justify-md-end gap-4 flex-wrap mt-6 mt-md-0">
             <div v-for="stat in dashboardStats" :key="stat.label" 
               v-motion
               class="stat-chip-premium pa-4 rounded-xl d-flex align-center gap-4" :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 200 } }"
             >
               <div class="stat-icon-wrap" :style="{ background: stat.color + '15' }">
                 <v-icon :color="stat.color">{{ stat.icon }}</v-icon>
               </div>
               <div>
                 <div class="text-h6 font-weight-black text-white leading-none">{{ stat.value }}</div>
                 <div class="text-caption text-grey-lighten-1">{{ stat.label }}</div>
               </div>
             </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- ── Main Content ────────────────────────────────────── -->
    <v-container class="pb-16">
<!-- Loading skeletons -->
      <v-row v-if="loading" class="mt-2">
        <v-col cols="12">
          <v-skeleton-loader type="card" height="220" class="rounded-xl mb-6" color="var(--el-surface-2)" />
        </v-col>
        <v-col v-for="i in 3" :key="i" cols="12" md="4">
          <v-skeleton-loader type="card" height="140" class="rounded-xl" color="var(--el-surface-2)" />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div
        v-else-if="enrolledCourses.length === 0"
        v-motion
        :initial="{ opacity: 0, scale: 0.97 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
      >
        <v-card class="glass-panel rounded-2xl pa-10 text-center border-subtle empty-state-card" >
          <div class="empty-icon-ring mx-auto mb-6">
            <v-icon size="56" color="primary">mdi-rocket-launch-outline</v-icon>
          </div>
          <h2 class="text-h4 font-weight-black text-white mb-3">Aucune formation en cours</h2>
          <p class="text-body-1 text-grey-lighten-1 mb-0" style="max-width: 480px; margin: 0 auto;">
            Parcourez notre catalogue et choisissez votre prochaine formation pour commencer à progresser dès aujourd'hui.
          </p>
        </v-card>
      </div>

      <!-- Active Courses -->
      <template v-else>
<!-- ── Hero Resume Card ──────────────────────────────── -->
        <section class="mb-12">
          <div
            v-motion
            class="section-label mb-6"
            :initial="{ opacity: 0, x: -16 }"
            :enter="{ opacity: 1, x: 0, transition: { duration: 600 } }"
          >
            <v-icon size="18" color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
            Reprendre l'apprentissage
          </div>
 
          <v-card
            v-motion
            class="resume-hero-panel rounded-2xl overflow-hidden"
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 700, delay: 150 } }"
          >
            <div class="resume-glass-overlay" />
            <v-row no-gutters class="position-relative z-1">
              <!-- Left: Visual & Info -->
              <v-col cols="12" md="5" class="pa-8 d-flex flex-column justify-center border-r-subtle">
                <v-chip size="small" color="primary" variant="tonal" class="mb-4 font-weight-bold px-4 text-uppercase tracking-widest" style="font-size: 0.65rem;">
                   {{ primaryCourse.cours.categorie }}
                </v-chip>
                
                <h2 class="text-h3 font-weight-black text-white mb-4 leading-tight">
                  {{ primaryCourse.cours.titre }}
                </h2>
                
                <div class="d-flex align-center gap-3 mb-6">
                  <v-avatar size="32" class="border-subtle">
                    <v-icon size="16">mdi-account-tie</v-icon>
                  </v-avatar>
                  <span class="text-body-2 text-grey-lighten-2">{{ primaryCourse.cours.formateur?.name || 'Expert Formateur' }}</span>
                </div>

                <div class="d-flex align-center gap-4 flex-wrap">
                  <template v-if="primaryCourse.inscription.pourcentageProgression === 100">
                    <v-btn
                      color="success" size="x-large" class="rounded-xl font-weight-black px-10 btn-success-glow"
                      :to="`/cours/${primaryCourse.cours.id}/apprendre`"
                      height="56"
                      prepend-icon="mdi-refresh"
                    >
                      Recommencer
                    </v-btn>
                    <v-btn
                      v-if="primaryCourse.cours.quizzes?.length"
                      color="warning" size="x-large" class="rounded-xl font-weight-black px-10 btn-primary-glow"
                      :to="`/quiz/${primaryCourse.cours.quizzes[0].id}`"
                      height="56"
                      prepend-icon="mdi-head-question-outline"
                    >
                      Faire le Quiz
                    </v-btn>
                  </template>
                  <v-btn
                    v-else
                    color="primary" size="x-large" class="rounded-xl font-weight-black px-10 btn-primary-glow"
                    :to="`/cours/${primaryCourse.cours.id}/apprendre`"
                    height="56"
                    prepend-icon="mdi-play-circle"
                  >
                    Continuer
                  </v-btn>
                </div>
              </v-col>

              <!-- Right: Progress & Stats -->
              <v-col cols="12" md="7" class="pa-8 pa-md-12 d-flex flex-column justify-center bg-black-opacity-20">
                <div class="progress-display-center mb-8">
                  <div class="d-flex justify-space-between align-end mb-4">
                    <div>
                      <div class="text-h2 font-weight-black text-white mb-0 tabular-nums">
                        {{ Math.round(primaryCourse.inscription.pourcentageProgression) }}<span class="text-h4 text-primary">%</span>
                      </div>
                      <div class="text-caption text-uppercase tracking-widest text-grey font-weight-bold">Progression totale</div>
                    </div>
                    <v-icon size="64" color="primary" style="opacity: 0.1;">mdi-trending-up</v-icon>
                  </div>
                  <v-progress-linear
                    :model-value="primaryCourse.inscription.pourcentageProgression"
                    color="primary" height="12" rounded
                    bg-color="var(--el-surface-2)"
                    class="premium-progress-bar"
                  />
                </div>

                <v-row>
                  <v-col cols="6">
                    <div class="text-caption text-grey text-uppercase tracking-widest mb-1">Dernière activité</div>
                    <div class="text-body-1 font-weight-bold text-white">Aujourd'hui</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-caption text-grey text-uppercase tracking-widest mb-1">Certificat</div>
                    <div class="text-body-1 font-weight-bold" :class="primaryCourse.inscription.pourcentageProgression === 100 ? 'text-success' : 'text-grey-darken-1'">
                      {{ primaryCourse.inscription.pourcentageProgression === 100 ? 'Disponible' : 'En attente' }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </section>

        <!-- ── Secondary Courses ────────────────────────────── -->
        <section v-if="secondaryCourses.length > 0">
          <div
            v-motion
            class="section-label mb-5"
            :initial="{ opacity: 0, x: -16 }"
            :visibleOnce="{ opacity: 1, x: 0, transition: { duration: 600 } }"
          >
            <v-icon size="16" color="grey-lighten-1" class="mr-2">mdi-bookshelf</v-icon>
            Autres formations en cours
          </div>

          <v-row class="mt-4">
            <v-col
              v-for="(item, index) in secondaryCourses"
              :key="item.cours.id"
              cols="12" sm="6" lg="4"
              class="d-flex"
            >
              <v-card
                class="premium-course-card rounded-2xl border-subtle flex-grow-1"
                elevation="0"
                tabindex="0"
                role="button"
                :style="`--card-accent: ${getCategoryColorHex(item.cours.categorie)}; animation-delay:${index * 50}ms`"
                @click="$router.push(`/cours/${item.cours.id}/apprendre`)"
                @keydown.enter="$router.push(`/cours/${item.cours.id}/apprendre`)"
                @keydown.space.prevent="$router.push(`/cours/${item.cours.id}/apprendre`)"
              >
                <!-- Background Visual -->
                <div class="card-visual" :style="{ background: getGradient(item.cours.id) }">
                   <div class="ambient-orb" />
                   <v-icon size="100" class="visual-icon">{{ getCategoryIcon(item.cours.categorie) }}</v-icon>
                   <div class="visual-overlay" />
                </div>

                <!-- Content -->
                <div class="card-body pa-6 d-flex flex-column">
                  <div class="d-flex justify-space-between align-start mb-4">
                    <v-chip size="x-small" :color="categoryColor(item.cours.categorie)" variant="tonal" class="font-weight-bold text-uppercase px-3 rounded-pill">
                      {{ item.cours.categorie }}
                    </v-chip>
                    
                    <div class="d-flex align-center gap-2">
                      <v-progress-circular
                        :model-value="item.inscription.pourcentageProgression"
                        :color="item.inscription.pourcentageProgression === 100 ? 'success' : 'primary'"
                        size="24" width="2"
                        bg-color="var(--el-surface-2)"
                      />
                      <span class="text-caption font-weight-black" :class="item.inscription.pourcentageProgression === 100 ? 'text-success' : 'text-white'">
                        {{ Math.round(item.inscription.pourcentageProgression) }}%
                      </span>
                    </div>
                  </div>

                  <h3 class="text-h6 font-weight-black text-white leading-tight mb-3 card-title">{{ item.cours.titre }}</h3>
                  
                  <v-spacer />

                  <!-- Footer Section -->
                  <div class="mt-auto pt-4 border-t-subtle-light">
                    <!-- Actions for completed course -->
                    <div v-if="item.inscription.pourcentageProgression === 100" class="d-flex align-center justify-space-between gap-2" @click.stop>
                      <v-btn 
                        variant="tonal" 
                        size="small" 
                        height="38"
                        class="flex-grow-1 text-none font-weight-bold rounded-lg btn-recommencer-sm" 
                        prepend-icon="mdi-refresh" 
                        :to="`/cours/${item.cours.id}/apprendre`"
                      >
                        Recommencer
                      </v-btn>
                      <v-btn 
                        v-if="item.cours.quizzes?.length" 
                        variant="tonal" 
                        size="small" 
                        height="38"
                        class="flex-grow-1 text-none font-weight-bold rounded-lg btn-quiz-sm" 
                        prepend-icon="mdi-head-question-outline" 
                        :to="`/quiz/${item.cours.quizzes[0].id}`"
                      >
                        Quiz
                      </v-btn>
                    </div>
                    <!-- Default footer info -->
                    <div v-else class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center gap-3">
                        <v-avatar color="surface-variant" size="32" class="border-subtle">
                          <v-icon size="16">mdi-account-tie</v-icon>
                        </v-avatar>
                        <div class="min-w-0">
                          <div class="text-caption font-weight-bold text-white text-truncate">{{ item.cours.formateur?.name || 'Expert' }}</div>
                        </div>
                      </div>
                      
                      <div class="card-action-hint">
                        <v-icon :color="categoryColor(item.cours.categorie)" size="22" class="hint-icon">mdi-arrow-right-circle-outline</v-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </section>
</template>
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
const { isLoading: loading, markLoading, markLoaded } = useViewLoadState();
const enrolledCourses = ref([]);

const firstName = computed(() => (authStore.user?.name || '').split(' ')[0]);

const primaryCourse = computed(() => {
  if (!enrolledCourses.value.length) return null;
  const inProgress = enrolledCourses.value.find(
    c => c.inscription.pourcentageProgression > 0 && c.inscription.pourcentageProgression < 100
  );
  return inProgress || enrolledCourses.value[0];
});

const secondaryCourses = computed(() => {
  if (!primaryCourse.value) return [];
  return enrolledCourses.value.filter(c => c.cours.id !== primaryCourse.value.cours.id);
});

const gradients = [
  '#ffe7de',
  '#e4edf6',
  '#e4eee0',
  '#efe6db',
  '#f2e2e6',
];
const getGradient = id => gradients[id % gradients.length];

function categoryColor(cat) {
  return getCategoryColorHex(cat);
}

function getCategoryColorHex(cat) {
  return { 'Développement Web': '#7ea6cf', 'Backend': '#d99a5f', 'Base de Données': '#ab9dd8', 'Data Science': '#86bd97', 'DevOps': '#8fb4bd' }[cat] || '#ff7448';
}

function getCategoryIcon(cat) {
  const map = { 'Développement Web': 'mdi-web', 'Backend': 'mdi-server-network', 'Base de Données': 'mdi-database', 'Data Science': 'mdi-chart-scatter-plot', 'DevOps': 'mdi-docker' };
  return map[cat] || 'mdi-book-open-page-variant';
}

const dashboardStats = computed(() => {
  const total = enrolledCourses.value.length;
  const inProgress = enrolledCourses.value.filter(c => c.inscription.pourcentageProgression > 0 && c.inscription.pourcentageProgression < 100).length;
  const completed = enrolledCourses.value.filter(c => c.inscription.pourcentageProgression === 100).length;
  
  return [
    { label: 'Formations', value: total, icon: 'mdi-library-outline', color: '#7ea6cf' },
    { label: 'En cours', value: inProgress, icon: 'mdi-progress-clock', color: '#ab9dd8' },
    { label: 'Terminées', value: completed, icon: 'mdi-certificate-outline', color: '#86bd97' },
  ];
});

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get('/my-enrollments');
    enrolledCourses.value = (data || []).sort((a, b) => {
      const score = x => {
        const p = x.inscription.pourcentageProgression;
        if (p > 0 && p < 100) return 2;
        if (p === 0) return 1;
        return 0;
      };
      return score(b) - score(a);
    });
  } catch (e) {
    showErrorToast(e, 'Impossible de charger vos formations.');
  } finally {
    markLoaded();
  }
});
</script>

<style scoped>
/* ── Header & Stats ──────────────────────────────────────── */
.dashboard-header {
  position: relative;
  padding-top: calc(var(--el-app-bar-h, 72px) + 40px);
  padding-bottom: 56px;
  background: var(--el-bg-0);
}
.dashboard-header-bg {
  display: none;
}

.stat-chip-premium {
  background: var(--el-surface);
  border: 1px solid var(--el-border);
  backdrop-filter: none;
  min-width: 160px;
}
.stat-icon-wrap {
  width: 44px; height: 44px;
  border-radius: var(--el-radius-sm);
  display: flex; align-items: center; justify-content: center;
}

.leading-none { line-height: 1; }

.dashboard-greeting {
  margin: 0;
  font-family: var(--el-font-display);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--el-text);
}
.greeting-name { color: var(--el-accent); }
.dashboard-subline {
  margin-top: 10px;
  color: var(--el-text-muted);
  font-size: 1.05rem;
  max-width: 520px;
}

/* ── Hero Resume Card Premium ─────────────────────────────── */
.resume-hero-panel {
  background: var(--el-surface) !important;
  border: 1px solid var(--el-border) !important;
  box-shadow: var(--el-shadow-md) !important;
  position: relative;
}

.resume-glass-overlay {
  display: none;
}

.bg-black-opacity-20 {
  background: var(--el-surface-2);
}

.border-r-subtle {
  border-right: 1px solid var(--el-border);
}

@media (max-width: 960px) {
  .border-r-subtle { border-right: none; border-bottom: 1px solid var(--el-border); }
}

.premium-progress-bar :deep(.v-progress-linear__determinate) {
  background: var(--el-accent);
  box-shadow: 0 0 12px -2px rgba(255, 116, 72, 0.55);
}

.btn-primary-glow {
  background: var(--el-accent) !important;
  box-shadow: var(--el-shadow-sm) !important;
  transition: box-shadow 0.25s var(--el-ease), transform 0.2s var(--el-ease) !important;
}
.btn-primary-glow:hover {
  box-shadow: var(--el-shadow-accent) !important;
  transform: translateY(-2px);
}

.btn-success-glow {
  background: #86bd97 !important;
  box-shadow: var(--el-shadow-sm) !important;
  transition: box-shadow 0.25s var(--el-ease), transform 0.2s var(--el-ease) !important;
}
.btn-success-glow:hover {
  box-shadow: 0 14px 30px -14px rgba(134, 189, 151, 0.6) !important;
  transform: translateY(-2px);
}

/* ── Premium Course Card ─────────────────────────────── */
.premium-course-card {
  background: var(--el-surface) !important;
  overflow: hidden;
  position: relative;
  box-shadow: var(--el-shadow-sm) !important;
  transition: transform 0.28s var(--el-ease), border-color 0.28s var(--el-ease), box-shadow 0.28s var(--el-ease) !important;
  cursor: pointer;
  height: 380px;
}
.premium-course-card:hover {
  transform: translateY(-6px);
  border-color: var(--el-border-strong) !important;
  box-shadow: var(--el-shadow-md) !important;
}

.card-visual {
  height: 140px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.visual-icon {
  z-index: 1;
  color: var(--card-accent, var(--el-accent)) !important;
  opacity: 0.9;
  transition: transform 0.4s var(--el-ease);
}
.premium-course-card:hover .visual-icon {
  opacity: 0.9;
  transform: translateY(-5px) scale(1.08);
}
.visual-overlay {
  display: none;
}
.ambient-orb {
  display: none;
}

.card-title { 
  font-size: 1.1rem !important;
  line-height: 1.4 !important;
}
.premium-course-card:hover .card-title { color: var(--el-text) !important; transform: none; }

.border-t-subtle-light { border-top: 1px solid var(--el-border); }

.card-action-hint {
  opacity: 0.55;
  transform: translateX(-4px);
  transition: opacity 0.3s var(--el-ease), transform 0.3s var(--el-ease);
}
.premium-course-card:hover .card-action-hint {
  opacity: 1;
  transform: none;
}
.hint-icon {
  filter: none;
}

.premium-course-card:hover .card-visual {
  filter: none;
  transform: scale(1.03);
}
.card-visual {
  transition: transform 0.5s var(--el-ease);
}

.section-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--el-text-muted);
  display: flex; align-items: center;
}

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.border-subtle { border: 1px solid var(--el-border) !important; }

/* ── Premium Completed Course Card Actions ───────────────── */
.btn-recommencer-sm {
  background: transparent !important;
  border: 1px solid var(--el-border) !important;
  color: #86bd97 !important;
  transition: border-color 0.15s ease !important;
}
.btn-recommencer-sm:hover {
  background: var(--el-surface-2) !important;
  border-color: #86bd97 !important;
  box-shadow: none !important;
  transform: none;
  color: #86bd97 !important;
}

.btn-quiz-sm {
  background: transparent !important;
  border: 1px solid var(--el-border) !important;
  color: #d9a441 !important;
  transition: border-color 0.15s ease !important;
}
.btn-quiz-sm:hover {
  background: var(--el-surface-2) !important;
  border-color: #d9a441 !important;
  box-shadow: none !important;
  transform: none;
  color: #d9a441 !important;
}
</style>
