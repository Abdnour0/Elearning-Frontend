<template>
  <div class="results-page">
    <h1 class="sr-only">Quiz results</h1>
    <div class="results-card">
      <!-- Loading -->
      <template v-if="isInitial || isLoading">
        <div class="skeleton-block" style="height: 180px;" />
        <div class="skeleton-line" />
        <div class="skeleton-line medium" />
        <p class="results-loading">Loading your results…</p>
      </template>

      <!-- Result -->
      <template v-else-if="result">
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
            <span class="score-number" :class="result.reussi ? 'is-pass' : 'is-fail'">
              {{ Math.round(animatedScore) }}<small>%</small>
            </span>
          </div>
        </div>

        <span class="result-chip" :class="result.reussi ? 'chip-pass' : 'chip-fail'">
          <span class="chip-dot" />{{ result.reussi ? 'Passed — well done' : 'Not passed yet — keep going' }}
        </span>

        <div class="results-divider" />

        <h2 class="corrections-title">Detailed corrections</h2>
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
          <p class="correction-line">
            Your answer: <strong>{{ c.reponse_soumise || 'No answer' }}</strong>
          </p>
          <p v-if="!c.est_correct" class="correction-line is-good">
            Correct answer: <strong>{{ c.bonneReponse }}</strong>
          </p>
        </div>

        <div class="results-actions">
          <button class="zen-btn zen-btn-quiet" @click="retryQuiz">Try again</button>
          <RouterLink class="zen-btn" to="/catalogue">Back to catalogue <span aria-hidden="true">→</span></RouterLink>
        </div>
      </template>

      <!-- Error -->
      <template v-else>
        <span class="empty-symbol" aria-hidden="true">✳</span>
        <h2 class="corrections-title">We couldn't show these results</h2>
        <p class="results-lede">The results for this quiz aren't available right now.</p>
        <div class="results-actions">
          <button class="zen-btn" @click="retryQuiz">Back to the quiz</button>
          <RouterLink class="zen-btn zen-btn-quiet" to="/catalogue">Back to catalogue</RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useViewLoadState } from '../composables/useViewLoadState.js';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';

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

function retryQuiz() {
  router.push(`/quiz/${route.params.id}`);
}

async function fetchLastAttempt() {
  try {
    const { data } = await api.get(`/quiz/${route.params.id}/historique`);
    if (data.length > 0) {
      const last = data[data.length - 1];
      result.value = { score: last.score, reussi: last.reussi };
    }
  } catch (e) {
    showErrorToast(e, 'Could not load your results.');
  }
}

onMounted(async () => {
  markLoading();
  try {
    if (result.value) {
      animateScore(result.value.score);
    } else {
      await fetchLastAttempt();
      if (result.value) animateScore(result.value.score);
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
.results-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 72px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.results-card {
  max-width: 720px;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #e5e7df;
  border-radius: 12px;
  background: #fff;
  text-align: center;
}

/* ── Score ring ────────────────────────────────────────── */
.score-ring-container {
  position: relative;
  width: 170px;
  height: 170px;
  margin: 0 auto 24px;
}
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
}
.score-number {
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 46px;
  font-weight: 400;
  letter-spacing: -.03em;
}
.score-number small { margin-left: 2px; font-size: 20px; }
.score-number.is-pass { color: #46704f; }
.score-number.is-fail { color: #934f47; }

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

.results-divider { height: 1px; margin: 30px 0; background: #ecece5; }

/* ── Corrections ───────────────────────────────────────── */
.corrections-title {
  margin: 0 0 16px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -.02em;
  text-align: left;
}
.correction-item {
  margin-bottom: 10px;
  padding: 15px 17px;
  border-radius: 8px;
  text-align: left;
}
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

/* ── Actions ───────────────────────────────────────────── */
.results-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
}
.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 20px;
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
.zen-btn:hover { background: #456c54; transform: translateY(-1px); }
.zen-btn-quiet { background: #fff; color: #55735c; border: 1px solid #dfe5db; }
.zen-btn-quiet:hover { background: #f4f6f1; border-color: #c3cfc1; }

/* ── Misc ──────────────────────────────────────────────── */
.results-loading { margin-top: 18px; color: #686f68; font-size: 13px; }
.results-lede { margin: 0 0 6px; color: #686f68; font-size: 13px; }
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
.skeleton-block, .skeleton-line {
  border-radius: 6px;
  background: #eceee7;
  animation: pulse 1.6s ease-in-out infinite alternate;
}
.skeleton-block { margin-bottom: 16px; }
.skeleton-line { height: 12px; margin-top: 12px; }
.skeleton-line.medium { width: 64%; }
@keyframes pulse { to { opacity: .52; } }

@media (max-width: 560px) {
  .results-page { padding: 56px 18px 72px; }
  .results-card { padding: 26px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .results-page *, .results-page *::before, .results-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
