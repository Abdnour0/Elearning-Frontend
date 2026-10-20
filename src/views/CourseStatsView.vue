<template>
  <div class="stats-page">
    <!-- Loaded -->
    <div v-if="statsData" class="stats-inner">
      <RouterLink class="back-link" to="/formateur">← Back to my courses</RouterLink>
      <span class="eyebrow"><i class="focus-dot" /> COURSE ANALYTICS</span>
      <h1>{{ statsData.cours }}</h1>
      <p class="stats-lede">How learners are moving through this course.</p>

      <!-- KPIs -->
      <section class="kpi-row">
        <div class="stat-card">
          <span class="stat-label">ENROLLED LEARNERS</span>
          <strong>{{ statsData.enrollments }}</strong>
          <span class="stat-detail">learners enrolled</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">AVERAGE PROGRESS</span>
          <strong>{{ statsData.avg_progression }}<small>%</small></strong>
          <span class="stat-detail">across all learners</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">QUIZZES</span>
          <strong>{{ statsData.quiz_stats?.length || 0 }}</strong>
          <span class="stat-detail">available in this course</span>
        </div>
      </section>

      <!-- Quiz stats -->
      <section v-if="statsData.quiz_stats && statsData.quiz_stats.length > 0" class="paper-card">
        <h2>Quiz performance</h2>
        <div class="table-wrap">
          <table class="zen-table">
            <thead>
              <tr>
                <th>QUIZ</th>
                <th>ATTEMPTS</th>
                <th>PASSED</th>
                <th>PASS RATE</th>
                <th>AVG SCORE</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="qs in statsData.quiz_stats" :key="qs.quiz_titre">
                <td class="cell-strong">{{ qs.quiz_titre }}</td>
                <td>{{ qs.total_attempts }}</td>
                <td class="cell-pass">{{ qs.passed }}</td>
                <td>
                  <div class="rate-cell">
                    <div class="rate-track"><span :class="qs.pass_rate >= 60 ? 'is-pass' : 'is-warn'" :style="{ width: `${Math.min(100, Math.max(0, qs.pass_rate))}%` }" /></div>
                    <span class="rate-value" :class="qs.pass_rate >= 60 ? 'is-pass-text' : 'is-warn-text'">{{ qs.pass_rate }}%</span>
                  </div>
                </td>
                <td class="cell-strong">{{ qs.avg_score }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-else class="paper-card empty-card">
        <span class="empty-symbol">✳</span>
        <h2>No quiz data yet</h2>
        <p>This course doesn't have any quizzes to report on yet.</p>
      </section>
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading || isInitial" class="stats-inner stats-loading">
      <div class="skeleton-line" />
      <div class="kpi-row">
        <div v-for="i in 3" :key="i" class="skeleton-block" style="height: 104px;" />
      </div>
      <div class="skeleton-block" style="height: 220px;" />
    </div>

    <!-- Error -->
    <div v-else class="stats-inner stats-error">
      <span class="empty-symbol">✳</span>
      <h2>We couldn't load these statistics</h2>
      <p>Check the course still exists, then try again.</p>
      <RouterLink class="zen-btn" to="/formateur">Back to my courses <span aria-hidden="true">→</span></RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const route = useRoute();
const statsData = ref(null);
const { isInitial, isLoading, markLoading, markLoaded } = useViewLoadState();

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get(`/cours/${route.params.id}/stats`);
    statsData.value = data;
  } catch(e) {
    showErrorToast(e, 'Could not load the statistics for this course.');
  } finally {
    markLoaded();
  }
});
</script>

<style scoped>
.stats-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 72px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.stats-inner { max-width: 1060px; margin: 0 auto; }

.back-link {
  display: inline-block;
  margin-bottom: 26px;
  color: #55735c;
  font-size: 12px;
  font-weight: 650;
  text-decoration: none;
}
.back-link:hover { color: #3f5f49; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #59715e;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .13em;
}
.focus-dot { width: 7px; height: 7px; border-radius: 50%; background: #749578; }
.stats-inner h1 {
  margin: 14px 0 10px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(34px, 4.2vw, 50px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -.04em;
}
.stats-lede { margin: 0; color: #686f69; font-size: 13px; }

/* ── KPIs ──────────────────────────────────────────────── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 34px 0 40px;
}
.stat-card {
  display: grid;
  padding: 18px 20px;
  border: 1px solid #e7e8e1;
  border-radius: 8px;
  background: #fff;
}
.stat-label { color: #637064; font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.stat-card strong {
  margin-top: 10px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -.02em;
  color: #28382e;
}
.stat-card strong small { font-size: 18px; }
.stat-detail { margin-top: 4px; color: #696e68; font-size: 11px; }

/* ── Table ─────────────────────────────────────────────── */
.paper-card {
  padding: 26px;
  border: 1px solid #e5e7df;
  border-radius: 8px;
  background: #fff;
}
.paper-card h2 {
  margin: 0 0 18px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.table-wrap { overflow-x: auto; }
.zen-table { width: 100%; border-collapse: collapse; }
.zen-table th {
  padding: 0 12px 12px;
  border-bottom: 1px solid #e8e8df;
  color: #696e68;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .1em;
  text-align: left;
  white-space: nowrap;
}
.zen-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #eff0ea;
  color: #5f6c62;
  font-size: 13px;
}
.zen-table tbody tr:last-child td { border-bottom: 0; }
.cell-strong { color: #33473a; font-weight: 650; }
.cell-pass { color: #46704f; font-weight: 650; }
.rate-cell { display: flex; align-items: center; gap: 10px; }
.rate-track {
  width: 84px;
  height: 6px;
  overflow: hidden;
  border-radius: 4px;
  background: #eef0eb;
}
.rate-track span { display: block; height: 100%; border-radius: 4px; }
.rate-track .is-pass { background: #5f7e66; }
.rate-track .is-warn { background: #c9a15f; }
.rate-value { font-size: 12px; font-weight: 700; }
.is-pass-text { color: #46704f; }
.is-warn-text { color: #846936; }

/* ── Empty / error ─────────────────────────────────────── */
.empty-card, .stats-error { text-align: center; padding: 56px 24px; }
.empty-card h2, .stats-error h2 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}
.empty-card p, .stats-error p { margin: 8px 0 0; color: #686f68; font-size: 13px; }
.stats-error p { margin-bottom: 20px; }
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

/* ── Loading ───────────────────────────────────────────── */
.stats-loading .skeleton-block, .stats-loading .skeleton-line {
  border-radius: 6px;
  background: #eceee7;
  animation: pulse 1.6s ease-in-out infinite alternate;
}
.stats-loading .skeleton-line { height: 12px; width: 30%; margin-bottom: 22px; }
@keyframes pulse { to { opacity: .52; } }

/* ── Button ────────────────────────────────────────────── */
.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: 7px;
  background: #537a62;
  color: #fff;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
  transition: background .18s ease, transform .18s ease;
}
.zen-btn:hover { background: #456c54; transform: translateY(-1px); }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 700px) {
  .kpi-row { grid-template-columns: 1fr; }
  .stats-page { padding: 56px 20px 72px; }
}
@media (prefers-reduced-motion: reduce) {
  .stats-page *, .stats-page *::before, .stats-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
