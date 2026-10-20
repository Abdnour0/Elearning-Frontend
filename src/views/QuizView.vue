<template>
  <div class="quiz-page">
    <div class="quiz-inner">
      <!-- ═══════════════ LOADING ═══════════════ -->
      <div v-if="isInitial || isLoading" class="quiz-loading">
        <div class="skeleton-block" style="height: 130px;" />
        <div class="skeleton-block" style="height: 240px;" />
        <p class="loading-note">Loading quiz…</p>
      </div>

      <!-- ═══════════════ BLOCKED (no attempts left / expired) ═══════════════ -->
      <div v-else-if="blocked" class="paper-card error-panel">
        <span class="empty-symbol" aria-hidden="true">{{ blocked.symbol }}</span>
        <h2>{{ blocked.title }}</h2>
        <p>{{ blocked.message }}</p>
        <RouterLink class="zen-btn" to="/dashboard">Back to my learning <span aria-hidden="true">→</span></RouterLink>
      </div>

      <!-- ═══════════════ QUIZ FLOW ═══════════════ -->
      <template v-else-if="quizData && quizData.questions?.length && !result">
        <!-- Header -->
        <div class="paper-card quiz-header">
          <div class="quiz-head-row">
            <div>
              <h1>{{ quizData.quiz?.titre }}</h1>
              <p class="quiz-count">
                Question <strong>{{ currentIndex + 1 }}</strong> of <strong>{{ totalQuestions }}</strong>
                <span v-if="attempt && attempt.tentatives_max != null"> · Attempt {{ attempt.tentative_numero }} of {{ attempt.tentatives_max }}</span>
              </p>
            </div>
            <div v-if="quizData.minuterie" class="timer-pill" :class="{ 'timer-danger': timeLeft < 60 }">
              <v-icon size="17">mdi-timer-outline</v-icon>
              <span class="timer-value">{{ formattedTime }}</span>
            </div>
          </div>

          <div class="progress-track"><div class="progress-fill" :style="{ width: progressPercent + '%' }" /></div>

          <div class="dot-row">
            <button
              v-for="(q, i) in quizData.questions"
              :key="q.id"
              class="q-dot"
              :class="{
                'q-dot-active': i === currentIndex,
                'q-dot-answered': i !== currentIndex && answers[q.id] != null && answers[q.id] !== '',
              }"
              :aria-label="`Go to question ${i + 1}`"
              @click="goToQuestion(i)"
            >
              {{ i + 1 }}
            </button>
          </div>
        </div>

        <!-- Question -->
        <transition :name="slideDirection" mode="out-in">
          <div :key="currentIndex" class="paper-card question-panel">
            <div class="question-head">
              <span class="q-number-badge">{{ currentIndex + 1 }}</span>
              <h2>{{ activeQuestion.contenu }}</h2>
            </div>

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
                <v-icon v-if="answers[activeQuestion.id] === choix" size="19" color="primary" class="choice-check">mdi-check-circle</v-icon>
              </button>
            </div>

            <v-text-field
              v-else
              v-model="answers[activeQuestion.id]"
              label="Your answer"
              variant="outlined"
              color="primary"
              class="zen-input mt-2"
              hide-details
            />
          </div>
        </transition>

        <!-- Navigation -->
        <div class="quiz-nav">
          <button v-if="currentIndex > 0" class="zen-btn zen-btn-quiet" @click="prevQuestion">
            ← Previous
          </button>
          <span v-else />

          <button
            v-if="currentIndex < totalQuestions - 1"
            class="zen-btn"
            @click="nextQuestion"
          >
            Next <span aria-hidden="true">→</span>
          </button>
          <button
            v-else
            class="zen-btn"
            :disabled="submitting"
            @click="submitQuiz"
          >
            {{ submitting ? 'Submitting…' : 'Finish quiz' }} <span aria-hidden="true">→</span>
          </button>
        </div>

        <p v-if="unansweredCount > 0" class="unanswered-note">
          <v-icon size="14">mdi-alert-circle-outline</v-icon>
          {{ unansweredCount }} unanswered question{{ unansweredCount > 1 ? 's' : '' }}
        </p>
      </template>

      <!-- ═══════════════ RESULTS ═══════════════ -->
      <template v-else-if="result">
        <div class="paper-card result-panel">
          <div class="score-ring-container">
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
              <span class="score-number" :class="result.reussi ? 'is-pass' : 'is-fail'">{{ Math.round(animatedScore) }}</span>
              <span class="score-pct" :class="result.reussi ? 'is-pass' : 'is-fail'">%</span>
            </div>
          </div>

          <span class="result-chip" :class="result.reussi ? 'chip-pass' : 'chip-fail'">
            <span class="chip-dot" />{{ result.reussi ? 'Passed — well done' : 'Not passed yet — keep going' }}
          </span>

          <div class="stats-grid">
            <div class="mini-stat">
              <v-icon size="20" color="primary">mdi-check-circle-outline</v-icon>
              <strong>{{ correctCount }}</strong>
              <span>Correct</span>
            </div>
            <div class="mini-stat">
              <v-icon size="20" color="error">mdi-close-circle-outline</v-icon>
              <strong>{{ wrongCount }}</strong>
              <span>Incorrect</span>
            </div>
            <div class="mini-stat">
              <v-icon size="20" color="warning">mdi-percent-outline</v-icon>
              <strong>{{ result.score.toFixed(1) }}%</strong>
              <span>Accuracy</span>
            </div>
          </div>

          <div class="results-divider" />
          <h3 class="corrections-title">Detailed corrections</h3>

          <div
            v-for="(c, idx) in result.corrections"
            :key="c.question_id"
            class="correction-item"
            :class="c.est_correct ? 'correction-correct' : 'correction-wrong'"
          >
            <div class="correction-head">
              <span class="correction-mark" :aria-label="c.est_correct ? 'Correct' : 'Incorrect'" role="img">{{ c.est_correct ? '✓' : '✕' }}</span>
              <span class="correction-index">Question {{ idx + 1 }}</span>
            </div>
            <p class="correction-line">Your answer: <strong>{{ c.reponse_soumise || 'None' }}</strong></p>
            <p v-if="!c.est_correct" class="correction-line is-good">Correct answer: <strong>{{ c.bonneReponse }}</strong></p>
          </div>

          <div class="results-actions">
            <button v-if="canRetry" class="zen-btn zen-btn-quiet" @click="restart">Try again</button>
            <RouterLink class="zen-btn" to="/catalogue">Back to catalogue <span aria-hidden="true">→</span></RouterLink>
          </div>
        </div>
      </template>

      <!-- ═══════════════ ERROR / EMPTY ═══════════════ -->
      <div v-else class="paper-card error-panel">
        <span class="empty-symbol" aria-hidden="true">✳</span>
        <h2>{{ quizData ? 'No questions yet' : "We couldn't load this quiz" }}</h2>
        <p>{{ quizData ? 'This quiz has no questions to answer right now.' : 'Check that the quiz is still available, then try again.' }}</p>
        <RouterLink class="zen-btn" to="/catalogue">Back to catalogue <span aria-hidden="true">→</span></RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const route = useRoute();
const { isInitial, isLoading, markLoading, markLoaded } = useViewLoadState();
const quizData  = ref(null);
const answers   = ref({});
const result    = ref(null);
const attempt   = ref(null);
const blocked   = ref(null);
const timeLeft  = ref(0);
const timer     = ref(null);
const submitting = ref(false);
const currentIndex = ref(0);
const slideDirection = ref('slide-left');

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
const canRetry = computed(() => {
  const r = result.value;
  if (!r) return false;
  // null = unlimited attempts
  return r.tentatives_restantes == null || r.tentatives_restantes > 0;
});

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
  if (timer.value) clearInterval(timer.value);
  timeLeft.value = seconds;
  timer.value = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer.value);
      submitQuiz();
    }
  }, 1000);
}

/**
 * Ask the server to open (or resume) an attempt. The server owns the attempt
 * count and the quiz window; the client only mirrors what it returns.
 */
async function startAttempt() {
  try {
    const { data } = await api.post(`/quiz/${route.params.id}/demarrer`);
    attempt.value = data;
    const seconds = data.temps_restant ?? quizData.value?.minuterie;
    if (seconds) startTimer(seconds);
  } catch (e) {
    const payload = e.response?.data || {};
    if (e.response?.status === 422 && payload.tentatives_max != null) {
      blocked.value = {
        symbol: '⏳',
        title: 'No attempts left',
        message: `You have used all ${payload.tentatives_max} attempt(s) for this quiz. Review your results to see how you did.`,
      };
    } else {
      blocked.value = {
        symbol: '✳',
        title: 'This quiz is unavailable',
        message: payload.message || 'You cannot start this quiz right now.',
      };
    }
  }
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
  const duration = 1200;
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    animatedScore.value = target * ease;
    if (progress < 1) scoreAnimFrame = requestAnimationFrame(tick);
  }
  scoreAnimFrame = requestAnimationFrame(tick);
}

async function submitQuiz() {
  if (submitting.value || !attempt.value) return;
  if (timer.value) clearInterval(timer.value);
  submitting.value = true;
  try {
    const { data } = await api.post(`/quiz/${route.params.id}/soumettre`, {
      tentative_id: attempt.value.tentative_id,
      reponses: answers.value,
    });
    result.value = data;
    await nextTick();
    animateScore(data.score);
  } catch (e) {
    const payload = e.response?.data || {};
    if (e.response?.status === 422 && payload.expire) {
      blocked.value = {
        symbol: '⏱',
        title: "Time's up",
        message: 'The time for this attempt ran out and it was submitted automatically.',
      };
    } else {
      showErrorToast(e, 'Could not submit the quiz.');
    }
  }
  finally { submitting.value = false; }
}

async function restart() {
  result.value = null;
  answers.value = {};
  currentIndex.value = 0;
  animatedScore.value = 0;
  attempt.value = null;
  await startAttempt();
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get(`/quiz/${route.params.id}`);
    quizData.value = data;

    if (!data.questions?.length) return; // empty state — nothing to attempt

    if (data.tentatives_restantes === 0) {
      blocked.value = {
        symbol: '⏳',
        title: 'No attempts left',
        message: `You have used all ${data.tentatives_max} attempt(s) for this quiz. Review your results to see how you did.`,
      };
      return;
    }

    await startAttempt();
  } catch (e) {
    showErrorToast(e, 'Could not load this quiz.');
  }
  finally { markLoaded(); }
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
  if (scoreAnimFrame) cancelAnimationFrame(scoreAnimFrame);
});
</script>

<style scoped>
.quiz-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 65px 24px 90px;
  background: #fbfaf6;
  color: #28382e;
}
.quiz-inner { max-width: 820px; margin: 0 auto; }

.paper-card {
  padding: 26px;
  border: 1px solid #e5e7df;
  border-radius: 10px;
  background: #fff;
}

/* ── Header ────────────────────────────────────────────── */
.quiz-header { margin-bottom: 20px; }
.quiz-head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.quiz-header h1 {
  margin: 0 0 6px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -.03em;
}
.quiz-count { margin: 0; color: #686f68; font-size: 12px; }
.quiz-count strong { color: #33473a; }

.timer-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border: 1px solid #e2e6de;
  border-radius: 8px;
  background: #f6f8f4;
  color: #47624e;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}
.timer-value { font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; }
.timer-danger { background: #f7efed; border-color: #e4cbc6; color: #934f47; }

.progress-track {
  height: 5px;
  margin: 18px 0 14px;
  overflow: hidden;
  border-radius: 4px;
  background: #eef0eb;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: #5f7e66;
  transition: width .4s cubic-bezier(.22, 1, .36, 1);
}

.dot-row { display: flex; flex-wrap: wrap; gap: 6px; }
.q-dot {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid #e2e6de;
  border-radius: 7px;
  background: #fff;
  color: #686f68;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.q-dot:hover { border-color: #b9c8b7; color: #55735c; }
.q-dot-active { background: #e7eee5; border-color: #9db99f; color: #3f5f49; }
.q-dot-answered { background: #f0f4ee; border-color: #cfe0cd; color: #46704f; }

/* ── Question ──────────────────────────────────────────── */
.question-panel { margin-bottom: 20px; }
.question-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 24px; }
.q-number-badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #5f7e66;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
.question-head h2 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -.01em;
}

.choices-grid { display: flex; flex-direction: column; gap: 10px; }
.choice-btn {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 17px;
  border: 1px solid #e5e7df;
  border-radius: 9px;
  background: #fff;
  color: #4a5a4f;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease;
}
.choice-btn:hover { background: #f7f9f5; border-color: #c3cfc1; }
.choice-selected { background: #eef4ec !important; border-color: #8fb092 !important; color: #2f4a37; }
.choice-letter {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #eef0eb;
  color: #657066;
  font-size: 12px;
  font-weight: 700;
  transition: background .18s ease, color .18s ease;
}
.choice-selected .choice-letter { background: #5f7e66; color: #fff; }
.choice-text { flex: 1; }
.choice-check { flex-shrink: 0; }

.zen-input :deep(.v-field) { border-radius: 8px; }

/* ── Navigation ────────────────────────────────────────── */
.quiz-nav { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
.unanswered-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 16px 0 0;
  color: #846936;
  font-size: 12px;
}

/* ── Transitions ───────────────────────────────────────── */
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  transition: opacity .22s ease, transform .22s ease;
}
.slide-left-enter-from  { opacity: 0; transform: translateX(28px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-28px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-28px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(28px); }

/* ── Results ───────────────────────────────────────────── */
.result-panel { text-align: center; }
.score-ring-container { position: relative; width: 156px; height: 156px; margin: 0 auto 22px; }
.score-ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: #eef0eb; stroke-width: 8; }
.ring-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 326.73;
  transition: stroke-dashoffset 1.2s cubic-bezier(.22, 1, .36, 1);
}
.ring-fill-success { stroke: #5f9070; }
.ring-fill-error { stroke: #bc7168; }
.score-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.score-number {
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 44px;
  font-weight: 400;
  letter-spacing: -.03em;
}
.score-pct { font-size: 18px; font-weight: 700; }
.score-number.is-pass, .score-pct.is-pass { color: #46704f; }
.score-number.is-fail, .score-pct.is-fail { color: #934f47; }

.result-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 650;
}
.chip-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.chip-pass { background: #e8f0e7; color: #46704f; }
.chip-fail { background: #f3e8e6; color: #934f47; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 26px 0 4px;
}
.mini-stat {
  display: grid;
  justify-items: center;
  gap: 5px;
  padding: 16px 10px;
  border: 1px solid #eceee7;
  border-radius: 9px;
}
.mini-stat strong {
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
}
.mini-stat span { color: #686f68; font-size: 11px; }

.results-divider { height: 1px; margin: 28px 0; background: #ecece5; }
.corrections-title {
  margin: 0 0 16px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 21px;
  font-weight: 400;
  text-align: left;
}
.correction-item { margin-bottom: 10px; padding: 15px 17px; border-radius: 9px; text-align: left; }
.correction-correct { background: #f0f4ee; border: 1px solid #dbe6d9; }
.correction-wrong { background: #f7efed; border: 1px solid #ecd9d5; }
.correction-head { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; }
.correction-mark {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}
.correction-correct .correction-mark { background: #dcead9; color: #46704f; }
.correction-wrong .correction-mark { background: #efd9d5; color: #934f47; }
.correction-index { color: #33473a; font-size: 13px; font-weight: 650; }
.correction-line { margin: 0 0 3px; color: #657066; font-size: 12px; line-height: 1.6; }
.correction-line strong { color: #33473a; }
.correction-line.is-good { color: #53755b; }
.correction-line.is-good strong { color: #46704f; }

.results-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}

/* ── Error / loading ───────────────────────────────────── */
.error-panel { padding: 60px 24px; text-align: center; }
.error-panel h2 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}
.error-panel p { margin: 8px 0 20px; color: #686f68; font-size: 13px; }
.empty-symbol {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #edf1e9;
  color: #59715e;
  font-size: 24px;
}
.quiz-loading { display: grid; gap: 20px; }
.loading-note { margin: 0; color: #686f68; font-size: 13px; text-align: center; }
.skeleton-block {
  border-radius: 10px;
  background: #eceee7;
  animation: pulse 1.6s ease-in-out infinite alternate;
}
@keyframes pulse { to { opacity: .52; } }

/* ── Buttons ───────────────────────────────────────────── */
.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 22px;
  border: 0;
  border-radius: 7px;
  background: #537a62;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
  cursor: pointer;
  transition: background .18s ease, transform .18s ease;
}
.zen-btn:hover:not(:disabled) { background: #456c54; transform: translateY(-1px); }
.zen-btn:disabled { opacity: .6; cursor: default; }
.zen-btn-quiet { background: #fff; color: #55735c; border: 1px solid #dfe5db; }
.zen-btn-quiet:hover { background: #f4f6f1; border-color: #c3cfc1; }

@media (max-width: 560px) {
  .quiz-page { padding: 50px 18px 72px; }
  .paper-card { padding: 20px; }
  .stats-grid { gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .quiz-page *, .quiz-page *::before, .quiz-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
