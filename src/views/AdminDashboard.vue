<template>
  <div class="admin-page">
    <div class="admin-inner">
      <!-- ── Header ──────────────────────────────────────── -->
      <header class="page-head">
        <div>
          <span class="eyebrow"><i class="focus-dot" /> ADMIN</span>
          <h1>Platform<br><em>overview.</em></h1>
          <p class="page-lede">Last refreshed {{ currentTime }}</p>
        </div>

        <div class="head-actions">
          <v-menu transition="slide-y-transition" location="bottom end">
            <template #activator="{ props }">
              <button v-bind="props" class="quiet-btn">
                Export <v-icon size="16">mdi-chevron-down</v-icon>
              </button>
            </template>
            <v-card class="zen-dialog pa-2" width="220" elevation="0" rounded="lg">
              <v-list density="compact" bg-color="transparent">
                <v-list-subheader class="menu-subheader">CSV</v-list-subheader>
                <v-list-item class="menu-row" prepend-icon="mdi-account-group" title="Users" @click="doExport('users','csv')" />
                <v-list-item class="menu-row" prepend-icon="mdi-school" title="Enrollments" @click="doExport('enrollments','csv')" />
                <v-divider class="my-1" />
                <v-list-subheader class="menu-subheader">PDF</v-list-subheader>
                <v-list-item class="menu-row" prepend-icon="mdi-file-pdf-box" title="Quizzes" @click="doExport('quizzes','pdf')" />
              </v-list>
            </v-card>
          </v-menu>

          <RouterLink class="zen-btn" to="/admin/users">
            Manage users <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="isLoading" class="skeleton-stack">
        <div class="kpi-grid">
          <div v-for="i in 4" :key="i" class="skeleton-block" style="height: 112px;" />
        </div>
        <div class="skeleton-block" style="height: 320px;" />
      </div>

      <template v-else>
        <!-- ── KPIs ──────────────────────────────────────── -->
        <section class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.key" class="stat-card">
            <div class="stat-top">
              <span class="stat-label">{{ kpi.label }}</span>
              <span v-if="kpiTrends && kpiTrends[kpi.key] !== null && kpiTrends[kpi.key] !== undefined" class="trend-pill" :class="(kpiTrends[kpi.key] || 0) > 0 ? 'trend-up' : 'trend-neutral'">
                <v-icon size="12">{{ (kpiTrends[kpi.key] || 0) > 0 ? 'mdi-trending-up' : 'mdi-minus' }}</v-icon>
                {{ (kpiTrends[kpi.key] || 0) > 0 ? '+' : '' }}{{ kpiTrends[kpi.key] }}%
              </span>
            </div>
            <strong class="tabular-nums">{{ stats[kpi.key] ?? '—' }}</strong>
            <span class="stat-detail">{{ kpi.caption }}</span>
          </div>
        </section>

        <!-- ── Charts row 1 ──────────────────────────────── -->
        <section class="chart-grid">
          <div class="paper-panel span-2">
            <div class="panel-head">
              <div>
                <h2>Enrollments by month</h2>
                <p>Trend over the last 6 months</p>
              </div>
              <span class="panel-chip">{{ new Date().getFullYear() }}</span>
            </div>
            <div class="chart-box tall">
              <Bar v-if="barReady" :data="enrollmentChartData" :options="barOptions" />
              <div v-else class="chart-loader"><v-progress-circular indeterminate color="primary" size="32" /></div>
            </div>
          </div>

          <div class="paper-panel">
            <div class="panel-head">
              <div>
                <h2>Role distribution</h2>
                <p>How users are spread across roles</p>
              </div>
            </div>
            <div class="chart-box">
              <Doughnut v-if="doughnutReady" :data="roleChartData" :options="doughnutOptions" />
              <div v-else class="chart-loader"><v-progress-circular indeterminate color="primary" size="32" /></div>
            </div>
            <div v-if="stats.users_by_role" class="legend">
              <div v-for="(count, role) in stats.users_by_role" :key="role" class="legend-row">
                <span class="legend-name"><span class="role-dot" :style="{ background: roleColors[role] || '#8b938b' }" />{{ titleCase(role) }}</span>
                <span class="legend-right">
                  <span class="legend-track"><span :style="{ width: `${(count / Math.max(stats.total_users, 1)) * 100}%`, background: roleColors[role] || '#8b938b' }" /></span>
                  <strong class="tabular-nums">{{ count }}</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Charts row 2 ──────────────────────────────── -->
        <section class="chart-grid">
          <div class="paper-panel">
            <div class="panel-head">
              <div>
                <h2>Quiz performance</h2>
                <p>Average weekly score</p>
              </div>
              <span class="pass-rate" :style="{ color: passRateColor }">
                <v-icon size="18" :color="passRateColor">mdi-chart-line</v-icon>{{ stats.quiz_pass_rate ?? 0 }}%
              </span>
            </div>
            <div class="chart-box">
              <Line v-if="lineReady" :data="quizLineData" :options="lineOptions" />
              <div v-else class="chart-loader"><v-progress-circular indeterminate color="primary" size="32" /></div>
            </div>
          </div>

          <div class="paper-panel">
            <div class="panel-head">
              <div>
                <h2>Recent activity</h2>
                <p>Latest enrollments</p>
              </div>
              <RouterLink class="panel-link" to="/admin/users">View all</RouterLink>
            </div>
            <div v-if="stats.recent_enrollments?.length" class="activity-list">
              <div v-for="enr in stats.recent_enrollments.slice(0, 5)" :key="enr.id" class="activity-row">
                <span class="avatar">{{ enr.utilisateur?.name?.charAt(0) || 'U' }}</span>
                <div class="activity-copy">
                  <span class="activity-name">{{ enr.utilisateur?.name }}</span>
                  <span class="activity-course">{{ enr.cours?.titre }}</span>
                </div>
                <span class="new-chip">New</span>
              </div>
            </div>
            <div v-else class="activity-empty">No recent enrollments</div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import api from '../axios';
import { showErrorToast, showToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const stats = ref({});
const currentTime = ref(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
const barReady = ref(false);
const doughnutReady = ref(false);
const lineReady = ref(false);
const { isLoading, markLoading, markLoaded } = useViewLoadState();

const kpis = [
  { key: 'total_users',       label: 'USERS',             caption: 'registered accounts' },
  { key: 'published_courses', label: 'PUBLISHED COURSES', caption: 'live for learners' },
  { key: 'total_enrollments', label: 'ENROLLMENTS',       caption: 'across all courses' },
  { key: 'total_courses',     label: 'TOTAL COURSES',     caption: 'in the catalogue' },
];

const roleColors = { admin: '#a4574f', formateur: '#a97852', apprenant: '#6f9276' };

const passRateColor = computed(() => {
  const r = stats.value.quiz_pass_rate || 0;
  return r >= 75 ? '#46704f' : r >= 50 ? '#9a7a3f' : '#a4574f';
});

function titleCase(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

/* ── Chart Data ──────────────────────────────────────────── */
const enrollmentChartData = computed(() => ({
  labels: stats.value.trends?.map(t => t.month) || [],
  datasets: [{
    label: 'Enrollments',
    data: stats.value.trends?.map(t => t.enrollments) || [],
    backgroundColor: 'rgba(111,146,118,0.85)',
    borderRadius: 6,
    borderSkipped: false,
  }, {
    label: 'Completed courses',
    data: stats.value.trends?.map(t => t.completions) || [],
    backgroundColor: 'rgba(169,120,82,0.72)',
    borderRadius: 6,
    borderSkipped: false,
  }]
}));

const roleChartData = computed(() => {
  const roles = stats.value.users_by_role || {};
  return {
    labels: Object.keys(roles).map(titleCase),
    datasets: [{
      data: Object.values(roles),
      backgroundColor: Object.keys(roles).map(r => roleColors[r] || '#8b938b'),
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 6,
    }]
  };
});

const quizLineData = computed(() => ({
  labels: stats.value.trends?.map(t => t.month) || [],
  datasets: [{
    label: 'Average score (%)',
    data: stats.value.trends?.map(t => t.avg_score) || [],
    borderColor: '#557a61',
    backgroundColor: 'rgba(85,122,97,0.1)',
    pointBackgroundColor: '#557a61',
    pointRadius: 3,
    pointHoverRadius: 5,
    fill: true,
    tension: 0.4,
    borderWidth: 2,
  }]
}));

/* ── Chart Options ───────────────────────────────────────── */
const gridColor = 'rgba(40,60,44,0.07)';
const tickColor = '#8b938b';

const baseTooltip = {
  backgroundColor: '#ffffff',
  borderColor: 'rgba(40,60,44,0.12)',
  borderWidth: 1,
  titleColor: '#28382e',
  bodyColor: '#6f7a70',
  padding: 12,
  cornerRadius: 8,
  displayColors: false,
};

const barOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#7d867e', boxWidth: 12, padding: 16, font: { size: 12 } } }, tooltip: baseTooltip },
  scales: {
    x: { grid: { display: false }, ticks: { color: tickColor, font: { size: 11 } }, border: { display: false } },
    y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } }, border: { display: false } },
  },
};

const doughnutOptions = {
  responsive: true, maintainAspectRatio: false, cutout: '68%',
  plugins: { legend: { display: false }, tooltip: baseTooltip },
};

const lineOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: baseTooltip },
  scales: {
    x: { grid: { display: false }, ticks: { color: tickColor, font: { size: 11 } }, border: { display: false } },
    y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 }, callback: v => v + '%' }, border: { display: false }, min: 0, max: 100 },
  },
};

/* ── Export ──────────────────────────────────────────────── */
async function doExport(type, format = 'csv') {
  if (format === 'csv') {
    try {
      const resp = await api.get(`/admin/export?type=${type}&format=csv`, { responseType: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(resp.data);
      link.setAttribute('download', `${type}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 60_000);
      showToast('CSV export ready.', 'success');
    } catch (e) {
      showErrorToast(e, 'Could not generate this CSV export.');
    }
  } else if (format === 'pdf') {
    try {
      const { data } = await api.get(`/admin/export?type=${type}&format=json`);
      if (!data?.length) return;
      // Load the PDF libraries on demand so they stay out of the route bundle.
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.text(`Export - ${type.toUpperCase()}`, 14, 15);
      doc.autoTable({ head: [Object.keys(data[0])], body: data.map(o => Object.values(o).map(v => String(v ?? ''))), startY: 20, theme: 'grid', styles: { fontSize: 9 }, headStyles: { fillColor: [85,122,97] } });
      doc.save(`${type}.pdf`);
      showToast('PDF export ready.', 'success');
    } catch (e) {
      showErrorToast(e, 'Could not generate this PDF export.');
    }
  }
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get('/admin/stats');
    stats.value = data;
  } catch(e) {
    showErrorToast(e, 'Could not load admin statistics.');
  }
  finally {
    await nextTick();
    setTimeout(() => { barReady.value = true; doughnutReady.value = true; lineReady.value = true; }, 200);
    markLoaded();
  }
});
</script>

<style scoped>
.admin-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 65px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.admin-inner { max-width: 1060px; margin: 0 auto; }
.tabular-nums { font-variant-numeric: tabular-nums; }

/* ── Head ──────────────────────────────────────────────── */
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 34px;
}
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
.page-head h1 {
  margin: 14px 0 10px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(34px, 4.3vw, 50px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -.04em;
}
.page-head h1 em { color: #52755d; }
.page-lede { margin: 0; color: #686f69; font-size: 13px; }
.head-actions { display: flex; align-items: center; gap: 12px; }

/* ── KPIs ──────────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 26px;
}
.stat-card {
  display: grid;
  padding: 18px 20px;
  border: 1px solid #e7e8e1;
  border-radius: 8px;
  background: #fff;
}
.stat-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.stat-label { color: #637064; font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.trend-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}
.trend-up { background: #e8f0e7; color: #46704f; }
.trend-neutral { background: #eef0eb; color: #686f68; }
.stat-card strong {
  margin-top: 12px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -.02em;
  line-height: 1;
}
.stat-detail { margin-top: 6px; color: #696e68; font-size: 11px; }

/* ── Panels ────────────────────────────────────────────── */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}
.span-2 { grid-column: span 2; }
.paper-panel {
  padding: 24px;
  border: 1px solid #e5e7df;
  border-radius: 8px;
  background: #fff;
}
.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.panel-head h2 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 21px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.panel-head p { margin: 4px 0 0; color: #696e68; font-size: 12px; }
.panel-chip {
  padding: 4px 10px;
  border-radius: 20px;
  background: #eef1ea;
  color: #55735c;
  font-size: 10px;
  font-weight: 700;
}
.panel-link { color: #55735c; font-size: 12px; font-weight: 650; text-decoration: none; }
.panel-link:hover { color: #3f5f49; }
.pass-rate { display: inline-flex; align-items: center; gap: 6px; font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; }

.chart-box { position: relative; height: 210px; }
.chart-box.tall { height: 280px; }
.chart-loader { display: flex; align-items: center; justify-content: center; height: 100%; }

/* ── Legend ────────────────────────────────────────────── */
.legend { display: grid; gap: 12px; margin-top: 18px; }
.legend-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.legend-name { display: inline-flex; align-items: center; gap: 9px; color: #5f6c62; font-size: 13px; }
.role-dot { width: 9px; height: 9px; border-radius: 50%; }
.legend-right { display: inline-flex; align-items: center; gap: 12px; }
.legend-track { width: 84px; height: 4px; overflow: hidden; border-radius: 4px; background: #eef0eb; }
.legend-track span { display: block; height: 100%; border-radius: 4px; }
.legend-right strong { min-width: 22px; color: #33473a; font-size: 13px; text-align: right; }

/* ── Activity ──────────────────────────────────────────── */
.activity-list { display: grid; }
.activity-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #eff0ea;
}
.activity-row:first-child { border-top: 0; }
.avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e7eee5;
  color: #557258;
  font-size: 12px;
  font-weight: 700;
}
.activity-copy { display: grid; gap: 2px; min-width: 0; }
.activity-name { color: #33473a; font-size: 13px; font-weight: 650; }
.activity-course { overflow: hidden; color: #686f68; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.new-chip {
  flex-shrink: 0;
  margin-left: auto;
  padding: 3px 9px;
  border-radius: 20px;
  background: #e8f0e7;
  color: #46704f;
  font-size: 10px;
  font-weight: 700;
}
.activity-empty { padding: 40px 0; color: #696e68; font-size: 13px; text-align: center; }

/* ── Buttons / menu ────────────────────────────────────── */
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
.quiet-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid #dfe5db;
  border-radius: 7px;
  background: #fff;
  color: #55735c;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease;
}
.quiet-btn:hover { background: #f4f6f1; border-color: #c3cfc1; }
.zen-dialog { background: #fff !important; border: 1px solid #e7e8e1; }
.menu-subheader {
  height: auto;
  padding: 8px 12px 4px;
  color: #696e68;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .12em;
}
.menu-row { border-radius: 8px; }

/* ── Skeletons ─────────────────────────────────────────── */
.skeleton-stack { display: grid; gap: 16px; }
.skeleton-block {
  border-radius: 8px;
  background: #eceee7;
  animation: pulse 1.6s ease-in-out infinite alternate;
}
@keyframes pulse { to { opacity: .52; } }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .chart-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
}
@media (max-width: 640px) {
  .page-head { flex-direction: column; align-items: flex-start; }
  .head-actions { flex-wrap: wrap; }
  .kpi-grid { grid-template-columns: 1fr; }
  .admin-page { padding: 50px 20px 72px; }
}
@media (prefers-reduced-motion: reduce) {
  .admin-page *, .admin-page *::before, .admin-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
