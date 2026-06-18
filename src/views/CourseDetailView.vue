<template>
  <v-container v-if="course" class="py-8">
    <v-row>
      <!-- Main content -->
      <v-col cols="12" md="8" class="position-relative">
        <div class="hero-glow" />
        <!-- Course header -->
        <div class="mb-6">
          <v-chip :color="categoryColor" variant="tonal" class="mb-3 font-weight-bold">{{ course.categorie }}</v-chip>
          <h1 class="text-h3 font-weight-black text-white mb-2">{{ course.titre }}</h1>
          <div class="d-flex align-center gap-4 text-grey-lighten-2 flex-wrap">
            <span><v-icon size="16" class="mr-1">mdi-school</v-icon>{{ course.formateur?.name }}</span>
            <span><v-icon size="16" class="mr-1">mdi-book-multiple</v-icon>{{ totalLessons }} leçons</span>
          </div>
        </div>

        <!-- Description -->
        <v-card class="glass-card rounded-xl pa-6 mb-6" theme="dark">
          <h2 class="text-h6 font-weight-bold mb-3">À propos de ce cours</h2>
          <p class="text-body-1 text-grey-lighten-1">{{ course.description }}</p>
        </v-card>

        <!-- Modules accordion -->
        <h2 class="text-h5 font-weight-bold text-white mb-4 position-relative z-1">Contenu du cours</h2>
        <v-expansion-panels variant="popout" class="custom-panels mb-6 position-relative z-1">
          <v-expansion-panel v-for="module in course.modules" :key="module.id" theme="dark" class="glass-panel mb-3 rounded-xl overflow-hidden border-subtle" elevation="0" bg-color="transparent">
            <v-expansion-panel-title class="font-weight-bold py-4">
              <v-icon class="mr-3" color="primary">mdi-layers</v-icon>
              Module {{ module.ordre }}: {{ module.titre }}
              <v-chip class="ml-auto" size="x-small" variant="tonal" color="grey">
                {{ module.lecons?.length || 0 }} leçons
              </v-chip>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="pa-0">
              <v-list bg-color="transparent" density="compact">
                <v-list-item
                  v-for="lecon in module.lecons"
                  :key="lecon.id"
                  class="py-3 border-b"
                  style="border-color: rgba(99,102,241,0.1)"
                >
                  <template #prepend>
                    <div class="lesson-icon-wrap" :class="`icon-${lecon.typeContenu}`">
                      <v-icon :color="iconColor(lecon.typeContenu)" size="18">{{ typeIcon(lecon.typeContenu) }}</v-icon>
                    </div>
                  </template>
                  <v-list-item-title class="text-body-2 font-weight-medium">{{ lecon.titre }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{ lecon.typeContenu }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <div class="sticky-sidebar">
          <!-- Enroll / Progress card -->
          <v-card class="glass-card rounded-xl mb-4 overflow-hidden" theme="dark">
            <div class="course-banner" :style="{ background: gradient }">
              <v-icon size="72" color="white" style="opacity:0.25">mdi-book-open-variant</v-icon>
            </div>
            <v-card-text class="pa-6">
              <template v-if="progression !== null">
                <p class="text-body-2 text-grey-lighten-1 mb-2">Votre progression</p>
                <v-progress-linear
                  :model-value="progression"
                  color="primary"
                  height="10"
                  rounded
                  bg-color="rgba(99,102,241,0.15)"
                  class="mb-2"
                />
                <p class="text-right font-weight-bold text-primary">{{ Math.round(progression) }}%</p>
                <v-btn
                  color="primary" block variant="flat" size="large"
                  class="rounded-lg font-weight-bold mt-4 btn-glow"
                  :to="`/cours/${course.id}/apprendre`"
                >
                  <v-icon start>mdi-play</v-icon>
                  Reprendre le cours
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  color="primary" block variant="flat" size="large"
                  class="rounded-lg font-weight-bold btn-glow"
                  :loading="enrolling"
                  @click="enroll"
                >
                  <v-icon start>mdi-school</v-icon>
                  S'inscrire au cours
                </v-btn>
              </template>
            </v-card-text>
          </v-card>

          <!-- Quizzes card -->
          <v-card v-if="course.quizzes?.length" class="glass-card rounded-xl" theme="dark">
            <v-card-title class="font-weight-bold pa-4 pb-2">
              <v-icon class="mr-2" color="warning">mdi-head-question</v-icon>
              Quizzes
            </v-card-title>
            <v-list bg-color="transparent" density="compact">
              <v-list-item v-for="quiz in course.quizzes" :key="quiz.id" class="py-3 px-4 quiz-item">
                <v-list-item-title class="text-body-2 font-weight-medium">{{ quiz.titre }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  <v-icon size="12" class="mr-1">mdi-timer</v-icon>
                  {{ quiz.dureeSecondes ? Math.floor(quiz.dureeSecondes / 60) + ' min' : 'Sans limite' }}
                </v-list-item-subtitle>
                <template #append>
                  <v-btn
                    v-if="progression !== null"
                    size="small" color="warning" variant="flat"
                    class="rounded-pill font-weight-bold"
                    :to="`/quiz/${quiz.id}`"
                  >
                    Passer
                  </v-btn>
                  <v-btn v-else size="small" variant="outlined" disabled>Inscrivez-vous</v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="isInitial || isLoading" class="py-8">
    <v-row>
      <!-- Skeleton Main Content -->
      <v-col cols="12" md="8">
        <div class="mb-6">
          <v-skeleton-loader type="chip" color="rgba(255,255,255,0.05)" class="mb-3" />
          <v-skeleton-loader type="heading" color="rgba(255,255,255,0.05)" class="mb-2" width="60%" />
          <v-skeleton-loader type="text" color="rgba(255,255,255,0.05)" width="30%" />
        </div>
        <v-skeleton-loader type="card" color="rgba(255,255,255,0.05)" class="rounded-xl mb-6 glass-card border-subtle" height="150" />
        <v-skeleton-loader v-for="i in 3" :key="i" type="list-item" color="rgba(255,255,255,0.05)" class="rounded-xl mb-3 glass-card border-subtle" height="60" />
      </v-col>
      <!-- Skeleton Sidebar -->
      <v-col cols="12" md="4">
        <v-skeleton-loader type="image, article" color="rgba(255,255,255,0.05)" class="rounded-xl glass-card border-subtle" />
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else class="py-12">
    <v-alert type="error" variant="tonal" class="rounded-xl">
      Impossible de charger ce cours. Vérifiez qu'il est encore disponible, puis réessayez.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { isInitial, isLoading, markLoading, markLoaded } = useViewLoadState();

const course = ref(null);
const progression = ref(null);
const enrolling = ref(false);

const gradients = ['linear-gradient(135deg,#6366f1,#8b5cf6)', 'linear-gradient(135deg,#10b981,#059669)', 'linear-gradient(135deg,#f59e0b,#ef4444)'];
const gradient = computed(() => gradients[(course.value?.id || 0) % gradients.length]);

const totalLessons = computed(() => course.value?.modules?.reduce((acc, m) => acc + (m.lecons?.length || 0), 0) || 0);

const categoryColor = computed(() => {
  const map = { 'Développement Web': 'primary', 'Backend': 'secondary', 'Base de Données': 'warning' };
  return map[course.value?.categorie] || 'primary';
});

function typeIcon(type) {
  return { video: 'mdi-play', pdf: 'mdi-file-pdf-box', image: 'mdi-image', texte: 'mdi-text' }[type] || 'mdi-file';
}
function iconColor(type) {
  return { video: 'primary', pdf: 'warning', image: 'info', texte: 'secondary' }[type] || 'grey';
}

async function enroll() {
  if (!authStore.isAuthenticated) return router.push('/login');
  enrolling.value = true;
  try {
    await api.post('/inscriptions', { cours_id: course.value.id });
    progression.value = 0;
    router.push(`/cours/${course.value.id}/apprendre`);
  } catch { /* already enrolled */ progression.value = 0; }
  finally { enrolling.value = false; }
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get(`/cours/${route.params.id}`);
    course.value = data;

    if (authStore.isAuthenticated) {
      try {
        const { data: prog } = await api.get(`/progress/${route.params.id}`);
        if (prog.inscrit) progression.value = prog.progression;
      } catch { /* not enrolled */ }
    }
  } catch (e) {
    showErrorToast(e, 'Impossible de charger ce cours.');
  } finally {
    markLoaded();
  }
});
</script>

<style scoped>
.sticky-sidebar { position: sticky; top: 100px; }
.course-banner {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.course-banner::after {
  content: '';
  position: absolute; inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E");
  pointer-events: none;
}

.hero-glow {
  position: absolute; top: -100px; left: -100px; right: 0; height: 500px;
  background: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.z-1 { position: relative; z-index: 1; }

.border-subtle { border: 1px solid rgba(255,255,255,0.08) !important; }

.btn-glow { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }

.quiz-item {
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.quiz-item:hover {
  background: rgba(255,255,255,0.03);
}
.quiz-item:last-child { border-bottom: none; }

/* ── Custom Expansion Panels ────────────────── */
.custom-panels { background: transparent !important; }
.glass-panel {
  background: rgba(17, 24, 39, 0.6) !important;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}
.glass-panel:hover {
  border-color: rgba(59, 130, 246, 0.3) !important;
}
.glass-panel:deep(.v-expansion-panel-title--active) {
  background: rgba(59, 130, 246, 0.05);
}

.lesson-icon-wrap {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  margin-right: 12px;
  background: rgba(255,255,255,0.05);
}
.icon-video { background: rgba(59,130,246,0.15); }
.icon-pdf { background: rgba(245,158,11,0.15); }
.icon-image { background: rgba(6,182,212,0.15); }
.icon-texte { background: rgba(139,92,246,0.15); }
</style>
