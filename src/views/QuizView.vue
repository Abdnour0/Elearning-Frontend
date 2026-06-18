<template>
  <div class="quiz-wrapper">
    <!-- Ambient mesh background -->
    <div class="quiz-mesh" />

    <v-container class="position-relative z-1" style="max-width: 820px;">
<!-- ═══════════════ LOADING STATE ═══════════════ -->
      <div v-if="isInitial || isLoading" class="d-flex flex-column align-center justify-center" style="min-height: 60vh;">
        <v-progress-circular indeterminate color="primary" size="64" width="5" />
        <p class="mt-6 text-grey-lighten-1 font-weight-medium tracking-wide text-uppercase text-caption">Chargement du quiz…</p>
      </div>

      <!-- ═══════════════ QUIZ FLOW ═══════════════ -->
      <template v-else-if="quizData && !result">
<!-- Header strip -->
        <div class="quiz-header glass-panel rounded-xl pa-5 mb-6">
          <div class="d-flex align-center justify-space-between flex-wrap gap-4">
            <div>
              <h1 class="text-h5 font-weight-black text-white mb-1">{{ quizData.quiz?.titre }}</h1>
              <p class="text-caption text-grey-lighten-1 ma-0">
                Question <strong class="text-white">{{ currentIndex + 1 }}</strong> sur <strong class="text-white">{{ totalQuestions }}</strong>
              </p>
            </div>
            <!-- Timer -->
            <div v-if="quizData.minuterie" class="timer-pill" :class="{ 'timer-danger': timeLeft < 60 }">
              <v-icon size="18" class="mr-1">mdi-timer-outline</v-icon>
              <span class="font-mono font-weight-black">{{ formattedTime }}</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="progress-track mt-4">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
          </div>

          <!-- Question dots -->
          <div class="d-flex gap-1 mt-3 flex-wrap">
            <button
              v-for="(q, i) in quizData.questions"
              :key="q.id"
              class="q-dot"
              :class="{
                'q-dot-active': i === currentIndex,
                'q-dot-answered': answers[q.id] != null && answers[q.id] !== '',
                'q-dot-unanswered': i !== currentIndex && (answers[q.id] == null || answers[q.id] === '')
              }"
              @click="goToQuestion(i)"
            >
              {{ i + 1 }}
            </button>
          </div>
        </div>

        <!-- Question Card (animated) -->
        <transition :name="slideDirection" mode="out-in">
          <div :key="currentIndex" class="question-panel glass-panel rounded-xl pa-6 pa-md-8 mb-6">
            <div class="d-flex align-start gap-4 mb-6">
              <div class="q-number-badge">{{ currentIndex + 1 }}</div>
              <h2 class="text-h6 font-weight-bold text-white" style="line-height: 1.6;">{{ activeQuestion.contenu }}</h2>
            </div>

            <!-- QCM / Vrai-Faux choices -->
            <div v-if="activeQuestion.type === 'qcm' || activeQuestion.type === 'vrai_faux'" class="choices-grid">
              <button
                v-for="(choix, cIdx) in activeQuestion.choix"
                :key="cIdx"
                class="choice-btn"
                :class="{ 'choice-selected': answers[activeQuestion.id] === choix }"
                @click="answers[activeQuestion.id] = choix"
              >
                <span class="choice-letter">{{ String.fromCharCode(65 + cIdx) }}</span>
                <span class="choice-text">{{ choix }}</span>
                <v-icon v-if="answers[activeQuestion.id] === choix" size="20" color="primary" class="ml-auto">mdi-check-circle</v-icon>
              </button>
            </div>

            <!-- Free-text answer -->
            <v-text-field
              v-else
              v-model="answers[activeQuestion.id]"
              label="Votre réponse"
              variant="outlined"
              color="primary"
              class="custom-input mt-2"
              hide-details
            />
          </div>
        </transition>

        <!-- Bottom Navigation -->
        <div class="d-flex align-center justify-space-between flex-wrap gap-3">
          <v-btn
            v-if="currentIndex > 0"
            variant="tonal"
            color="white"
            class="rounded-pill px-6"
            prepend-icon="mdi-arrow-left"
            @click="prevQuestion"
          >
            Précédent
          </v-btn>
          <div v-else />

          <div class="d-flex gap-3">
            <v-btn
              v-if="currentIndex < totalQuestions - 1"
              color="primary"
              variant="flat"
              class="rounded-pill px-8 font-weight-bold btn-glow"
              append-icon="mdi-arrow-right"
              @click="nextQuestion"
            >
              Suivant
            </v-btn>
            <v-btn
              v-else
              color="success"
              variant="flat"
              class="rounded-pill px-8 font-weight-bold btn-glow-success"
              prepend-icon="mdi-send"
              :loading="submitting"
              @click="submitQuiz"
            >
              Terminer le quiz
            </v-btn>
          </div>
        </div>

        <!-- Unanswered warning -->
        <div v-if="unansweredCount > 0" class="text-center mt-4">
          <p class="text-caption text-warning">
            <v-icon size="14" class="mr-1">mdi-alert-circle-outline</v-icon>
            {{ unansweredCount }} question(s) sans réponse
          </p>
        </div>
      </template>

      <!-- ═══════════════ RESULTS ═══════════════ -->
      <template v-else-if="result">
        <div class="result-panel glass-panel rounded-2xl pa-8 pa-md-10 text-center">
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
              <span class="text-h3 font-weight-black" :class="result.reussi ? 'text-success' : 'text-error'">
                {{ Math.round(animatedScore) }}
              </span>
              <span class="text-caption font-weight-bold" :class="result.reussi ? 'text-success' : 'text-error'">%</span>
            </div>
          </div>

          <!-- Status chip -->
          <v-chip
            :color="result.reussi ? 'success' : 'error'"
            size="large"
            variant="flat"
            class="font-weight-bold mb-6"
          >
            {{ result.reussi ? '🎉 Félicitations — Réussi !' : '😔 Non réussi — Réessayez' }}
          </v-chip>

          <!-- Stats Grid -->
          <div class="stats-grid mb-8">
            <div class="stat-card">
              <v-icon size="24" color="primary" class="mb-2">mdi-check-circle-outline</v-icon>
              <div class="text-h5 font-weight-black text-white">{{ correctCount }}</div>
              <div class="text-caption text-grey-lighten-1">Correctes</div>
            </div>
            <div class="stat-card">
              <v-icon size="24" color="error" class="mb-2">mdi-close-circle-outline</v-icon>
              <div class="text-h5 font-weight-black text-white">{{ wrongCount }}</div>
              <div class="text-caption text-grey-lighten-1">Incorrectes</div>
            </div>
            <div class="stat-card">
              <v-icon size="24" color="warning" class="mb-2">mdi-percent</v-icon>
              <div class="text-h5 font-weight-black text-white">{{ result.score.toFixed(1) }}%</div>
              <div class="text-caption text-grey-lighten-1">Précision</div>
            </div>
          </div>

          <!-- Corrections -->
          <v-divider class="mb-6 opacity-10" />
          <h3 class="text-left text-h6 font-weight-bold mb-4 text-white">Corrections détaillées</h3>

          <div
            v-for="(c, idx) in result.corrections"
            :key="c.question_id"
            class="correction-item rounded-xl pa-4 mb-3 text-left"
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

          <!-- Action buttons -->
          <div class="d-flex gap-3 mt-8 justify-center flex-wrap">
            <v-btn variant="outlined" color="white" class="rounded-pill px-6 border-subtle" prepend-icon="mdi-refresh" @click="restart">
              Réessayer
            </v-btn>
            <v-btn color="primary" variant="flat" class="rounded-pill px-6 font-weight-bold btn-glow" to="/catalogue" prepend-icon="mdi-book-open-variant">
              Catalogue
            </v-btn>
          </div>
        </div>
      </template>

      <v-alert v-else type="error" variant="tonal" class="rounded-xl">
        Impossible de charger ce quiz.
      </v-alert>
</v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import api from '../axios';
import confetti from 'canvas-confetti';
import { showErrorToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const route = useRoute();
const { isInitial, isLoading, markLoading, markLoaded } = useViewLoadState();
const quizData  = ref(null);
const answers   = ref({});
const result    = ref(null);
const timeLeft  = ref(0);
const timer     = ref(null);
const submitting = ref(false);
const currentIndex = ref(0);
const slideDirection = ref('slide-left');

// Score animation
const animatedScore = ref(0);
let scoreAnimFrame = null;

const totalQuestions = computed(() => quizData.value?.questions?.length || 0);
const activeQuestion = computed(() => quizData.value?.questions?.[currentIndex.value]);
const progressPercent = computed(() => totalQuestions.value ? ((currentIndex.value + 1) / totalQuestions.value) * 100 : 0);
const unansweredCount = computed(() => {
  if (!quizData.value?.questions) return 0;
  return quizData.value.questions.filter(q => answers.value[q.id] == null || answers.value[q.id] === '').length;
});

const correctCount = computed(() => result.value?.corrections?.filter(c => c.est_correct).length || 0);
const wrongCount = computed(() => result.value?.corrections?.filter(c => !c.est_correct).length || 0);

const circumference = 2 * Math.PI * 52;
const scoreOffset = computed(() => {
  const pct = animatedScore.value / 100;
  return circumference * (1 - pct);
});

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60).toString().padStart(2, '0');
  const s = (timeLeft.value % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

function startTimer(seconds) {
  timeLeft.value = seconds;
  timer.value = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer.value);
      submitQuiz();
    }
  }, 1000);
}

function goToQuestion(idx) {
  slideDirection.value = idx > currentIndex.value ? 'slide-left' : 'slide-right';
  currentIndex.value = idx;
}

function nextQuestion() {
  slideDirection.value = 'slide-left';
  if (currentIndex.value < totalQuestions.value - 1) currentIndex.value++;
}

function prevQuestion() {
  slideDirection.value = 'slide-right';
  if (currentIndex.value > 0) currentIndex.value--;
}

function animateScore(target) {
  animatedScore.value = 0;
  const start = performance.now();
  const duration = 1400;
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    animatedScore.value = target * ease;
    if (progress < 1) scoreAnimFrame = requestAnimationFrame(tick);
  }
  scoreAnimFrame = requestAnimationFrame(tick);
}

async function submitQuiz() {
  if (submitting.value) return;
  if (timer.value) clearInterval(timer.value);
  submitting.value = true;
  try {
    const { data } = await api.post(`/quiz/${route.params.id}/soumettre`, { reponses: answers.value });
    result.value = data;
    await nextTick();
    animateScore(data.score);
    if (data.reussi) {
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#22c55e', '#3b82f6', '#f59e0b'] });
      }, 400);
    }
  } catch (e) {
    showErrorToast(e, 'Impossible de soumettre le quiz.');
  }
  finally { submitting.value = false; }
}

function restart() {
  result.value = null;
  answers.value = {};
  currentIndex.value = 0;
  animatedScore.value = 0;
  if (quizData.value?.minuterie) startTimer(quizData.value.minuterie);
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get(`/quiz/${route.params.id}`);
    quizData.value = data;
    if (data.minuterie) startTimer(data.minuterie);
  } catch (e) {
    showErrorToast(e, 'Impossible de charger ce quiz.');
  }
  finally { markLoaded(); }
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
  if (scoreAnimFrame) cancelAnimationFrame(scoreAnimFrame);
});
</script>

<style scoped>
/* ── Layout ────────────────────────────────────── */
.quiz-wrapper {
  min-height: 100vh;
  padding-top: calc(var(--el-app-bar-h, 72px) + 32px);
  padding-bottom: 48px;
  position: relative;
  overflow: hidden;
}
.quiz-mesh {
  position: fixed; inset: 0;
  background-image:
    radial-gradient(at 20% 20%, rgba(59,130,246,0.08) 0px, transparent 50%),
    radial-gradient(at 80% 80%, rgba(139,92,246,0.08) 0px, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
.z-1 { position: relative; z-index: 1; }
.tracking-wide { letter-spacing: 0.05em; }

/* ── Glass panels ──────────────────────────────── */
.glass-panel {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(12px);
}

/* ── Quiz Header ───────────────────────────────── */
.quiz-header { position: relative; overflow: hidden; }

/* Timer */
.timer-pill {
  display: flex; align-items: center;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.timer-danger {
  background: rgba(239,68,68,0.15);
  border-color: rgba(239,68,68,0.4);
  color: #f87171;
  animation: pulse-danger 1s ease-in-out infinite;
}
@keyframes pulse-danger {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
  50% { box-shadow: 0 0 20px 4px rgba(239,68,68,0.2); }
}
.font-mono { font-family: 'Courier New', monospace; }

/* ── Progress Bar ──────────────────────────────── */
.progress-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  box-shadow: 0 0 12px rgba(59,130,246,0.4);
  transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── Question dots ─────────────────────────────── */
.q-dot {
  width: 28px; height: 28px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex; align-items: center; justify-content: center;
}
.q-dot:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
.q-dot-active {
  background: rgba(59,130,246,0.2);
  border-color: rgba(59,130,246,0.5);
  color: #60a5fa;
  box-shadow: 0 0 10px rgba(59,130,246,0.3);
}
.q-dot-answered {
  background: rgba(34,197,94,0.15);
  border-color: rgba(34,197,94,0.4);
  color: #4ade80;
}

/* ── Question Badge ────────────────────────────── */
.q-number-badge {
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 0.85rem; color: #fff;
}

/* ── Choice Buttons ────────────────────────────── */
.choices-grid {
  display: flex; flex-direction: column; gap: 10px;
}
.choice-btn {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: rgba(255,255,255,0.8);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}
.choice-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.15);
}
.choice-selected {
  background: rgba(59,130,246,0.12) !important;
  border-color: rgba(59,130,246,0.5) !important;
  color: #fff;
  box-shadow: 0 0 20px rgba(59,130,246,0.15);
}
.choice-letter {
  width: 30px; height: 30px; flex-shrink: 0;
  border-radius: 8px;
  background: rgba(255,255,255,0.07);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 0.8rem;
  transition: all 0.2s;
}
.choice-selected .choice-letter {
  background: #3b82f6;
  color: #fff;
}

/* ── Custom input ──────────────────────────────── */
.custom-input :deep(.v-field) {
  border-radius: 12px;
  background: rgba(0,0,0,0.2);
}

/* ── Question Slide Transitions ────────────────── */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from  { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(40px); }

/* ── Buttons ───────────────────────────────────── */
.btn-glow { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
.btn-glow-success { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
.border-subtle { border-color: rgba(255,255,255,0.12) !important; }

/* ── RESULTS ───────────────────────────────────── */
.result-panel { animation: fadeInUp 0.5s ease both; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.rounded-2xl { border-radius: 20px !important; }

/* Score Ring */
.score-ring-container {
  width: 160px; height: 160px;
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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.stat-card {
  padding: 16px;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  text-align: center;
}

/* Corrections */
.correction-correct {
  background: rgba(34,197,94,0.06);
  border: 1px solid rgba(34,197,94,0.15);
}
.correction-wrong {
  background: rgba(239,68,68,0.06);
  border: 1px solid rgba(239,68,68,0.15);
}
</style>
