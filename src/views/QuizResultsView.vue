<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="7" lg="6">
        <v-card
          v-if="isInitial || isLoading"
          class="glass-card rounded-xl pa-8 text-center"
          theme="dark"
        >
          <v-skeleton-loader type="image, article, actions" color="rgba(255,255,255,0.04)" />
          <p class="text-grey mt-4">Chargement des résultats...</p>
        </v-card>

        <!-- Result card -->
        <v-card v-else-if="result" class="glass-card rounded-2xl pa-8 text-center" theme="dark">
          <!-- Animated Score Ring -->
          <div class="score-ring-container mx-auto mb-6">
            <svg viewBox="0 0 120 120" class="score-ring-svg">
              <circle cx="60" cy="60" r="52" class="ring-bg" />
              <circle
                cx="60" cy="60" r="52"
                class="ring-fill"
                :class="result.reussi ? 'ring-fill-success' : 'ring-fill-error'"
                :style="{ strokeDashoffset: scoreOffset }"
              />
            </svg>
            <div class="score-value">
              <span class="text-h2 font-weight-black" :class="result.reussi ? 'text-success' : 'text-error'">
                {{ Math.round(animatedScore) }}
              </span>
              <span class="text-h5 font-weight-bold" :class="result.reussi ? 'text-success' : 'text-error'" style="margin-top: 10px;">%</span>
            </div>
          </div>
          <v-chip :color="result.reussi ? 'success' : 'error'" size="large" class="mt-3 mb-6 font-weight-bold" variant="flat">
            {{ result.reussi ? '🎉 Félicitations — Réussi !' : '😔 Non réussi — Continuez vos efforts' }}
          </v-chip>

          <!-- Corrections -->
          <v-divider class="mb-6" />
          <h2 class="text-left text-h6 font-weight-bold mb-4 text-white">Corrections détaillées</h2>
          <div
            v-for="(c, idx) in result.corrections"
            :key="c.question_id"
            class="correction-item rounded-lg pa-4 mb-3 text-left"
            :class="c.est_correct ? 'correction-correct' : 'correction-wrong'"
          >
            <div class="d-flex align-center gap-2 mb-2">
              <v-icon :color="c.est_correct ? 'success' : 'error'" size="18">
                {{ c.est_correct ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              <span class="text-body-2 font-weight-bold text-white">Question {{ idx + 1 }}</span>
            </div>
            <p class="text-caption text-grey-lighten-1 mb-1">
              Votre réponse : <strong class="text-white">{{ c.reponse_soumise || 'Aucune' }}</strong>
            </p>
            <p v-if="!c.est_correct" class="text-caption text-success">
              Bonne réponse : <strong>{{ c.bonneReponse }}</strong>
            </p>
          </div>

          <div class="d-flex gap-3 mt-6 justify-center flex-wrap">
            <v-btn variant="outlined" class="rounded-pill" prepend-icon="mdi-refresh" @click="retryQuiz">Réessayer</v-btn>
            <v-btn color="primary" variant="flat" class="rounded-pill" to="/catalogue">
              <v-icon start>mdi-book</v-icon>Catalogue
            </v-btn>
          </div>
        </v-card>

        <v-card v-else class="glass-card rounded-xl pa-8 text-center" theme="dark">
          <v-alert
            v-if="!result && !isLoading"
            type="error"
            variant="tonal"
            rounded="lg"
            class="mb-6 text-left"
          >
            Impossible d'afficher les résultats de ce quiz.
          </v-alert>
          <div class="d-flex gap-3 justify-center flex-wrap">
            <v-btn color="primary" variant="flat" class="rounded-pill" @click="retryQuiz">
              Retourner au quiz
            </v-btn>
            <v-btn variant="outlined" class="rounded-pill" to="/catalogue">
              Retour au catalogue
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const route  = useRoute();
const router = useRouter();
const { isInitial, isLoading, markLoading, markLoaded } = useViewLoadState();

// Results are passed via router state from QuizView
const result = ref(history.state?.result || null);

// Score animation
const animatedScore = ref(0);
let scoreAnimFrame = null;

const circumference = 2 * Math.PI * 52;
const scoreOffset = computed(() => {
  const pct = animatedScore.value / 100;
  return circumference * (1 - pct);
});

function animateScore(target) {
  animatedScore.value = 0;
  const start = performance.now();
  const duration = 1400;
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    animatedScore.value = target * ease;
    if (progress < 1) scoreAnimFrame = requestAnimationFrame(tick);
  }
  scoreAnimFrame = requestAnimationFrame(tick);
}

function retryQuiz() {
  router.push(`/quiz/${route.params.id}`);
}

onMounted(async () => {
  markLoading();
  try {
    if (result.value) {
      animateScore(result.value.score);
      if (result.value.reussi) {
        setTimeout(() => {
          import('canvas-confetti').then(confetti => {
            confetti.default({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#22c55e', '#3b82f6', '#f59e0b'] });
          });
        }, 400);
      }
    }
  } finally {
    markLoaded();
  }
});

onUnmounted(() => {
  if (scoreAnimFrame) cancelAnimationFrame(scoreAnimFrame);
});
</script>

<style scoped>
.rounded-2xl { border-radius: 20px !important; }
/* Score Ring */
.score-ring-container {
  width: 180px; height: 180px;
  position: relative;
}
.score-ring-svg {
  width: 100%; height: 100%;
  transform: rotate(-90deg);
}
.ring-bg {
  fill: none;
  stroke: rgba(255,255,255,0.06);
  stroke-width: 8;
}
.ring-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 326.73; /* 2 * PI * 52 */
  transition: stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.ring-fill-success { stroke: #22c55e; filter: drop-shadow(0 0 8px rgba(34,197,94,0.4)); }
.ring-fill-error   { stroke: #ef4444; filter: drop-shadow(0 0 8px rgba(239,68,68,0.4)); }

.score-value {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  flex-direction: row; gap: 2px;
}
.correction-correct { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2); }
.correction-wrong   { background: rgba(239,68,68,0.08);  border: 1px solid rgba(239,68,68,0.2);  }
</style>
