<template>
  <div class="admin-wrapper">
    <!-- ── Page Header ──────────────────────────────────── -->
    <div class="admin-hero">
      <div class="admin-hero-glow" />
      <v-container fluid class="px-6 py-0 position-relative z-1">
        <div class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div>
            <div class="d-flex align-center gap-3 mb-2">
              <v-chip size="x-small" color="error" variant="flat" class="font-weight-black text-uppercase px-3" style="letter-spacing:0.07em;">Admin</v-chip>
              <span class="text-caption text-grey">Dernière actualisation : {{ currentTime }}</span>
            </div>
            <h1 class="text-h3 font-weight-black text-white mb-0" style="letter-spacing:-0.025em">Vue d'ensemble</h1>
          </div>
          <div class="d-flex gap-3 align-center flex-wrap">
            <!-- Export Menu -->
            <v-menu transition="slide-y-transition" location="bottom end">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="tonal" color="default" class="rounded-xl text-none font-weight-medium border-subtle" prepend-icon="mdi-export-variant" height="42">
                  Exporter <v-icon end size="16">mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-card class="user-menu-card rounded-xl pa-2" width="220" theme="dark">
                <v-list density="compact" bg-color="transparent">
                  <v-list-subheader class="text-uppercase text-caption font-weight-bold tracking-wide opacity-60">CSV</v-list-subheader>
                  <v-list-item prepend-icon="mdi-account-group" class="rounded-lg menu-item" title="Utilisateurs" @click="doExport('users','csv')" />
                  <v-list-item prepend-icon="mdi-school" class="rounded-lg menu-item" title="Inscriptions" @click="doExport('enrollments','csv')" />
                  <v-divider class="my-1 opacity-10" />
                  <v-list-subheader class="text-uppercase text-caption font-weight-bold tracking-wide opacity-60">PDF</v-list-subheader>
                  <v-list-item prepend-icon="mdi-file-pdf-box" base-color="error" class="rounded-lg menu-item" title="Quiz" @click="doExport('quizzes','pdf')" />
                </v-list>
              </v-card>
            </v-menu>

            <v-btn color="primary" variant="flat" class="rounded-xl font-weight-bold btn-glow text-none" prepend-icon="mdi-account-cog" height="42" to="/admin/users">
              Gérer Utilisateurs
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container fluid class="px-6 pb-16">
      <div v-if="isLoading" class="d-flex align-center justify-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>

      <template v-else>
<!-- ── KPI Cards ─────────────────────────────────── -->
      <v-row class="mb-8">
        <v-col v-for="(kpi, i) in kpis" :key="kpi.label" cols="12" sm="6" xl="3">
          <v-card class="kpi-card rounded-xl pa-5" theme="dark" :style="`animation-delay:${i*80}ms`">
            <div class="d-flex justify-space-between align-start mb-3">
              <div class="kpi-icon-wrap" :style="{ background: kpi.bg }">
                <v-icon :color="kpi.color" size="22">{{ kpi.icon }}</v-icon>
              </div>
              <div class="trend-pill" :class="kpi.trend > 0 ? 'trend-up' : 'trend-neutral'">
                <v-icon size="12" class="mr-1">{{ kpi.trend > 0 ? 'mdi-trending-up' : 'mdi-minus' }}</v-icon>
                {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
              </div>
            </div>
            <div class="text-h3 font-weight-black tabular-nums text-white mb-1">{{ stats[kpi.key] ?? '—' }}</div>
            <div class="text-caption text-grey font-weight-medium text-uppercase tracking-wide">{{ kpi.label }}</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- ── Charts Row ─────────────────────────────────── -->
      <v-row class="mb-8">
        <!-- Enrollments Bar Chart -->
        <v-col cols="12" lg="8">
          <v-card class="dashboard-panel rounded-xl pa-5" theme="dark">
            <div class="d-flex align-center justify-space-between mb-5">
              <div>
                <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">Inscriptions par mois</h2>
                <p class="text-caption text-grey mt-1 mb-0">Tendance sur les 6 derniers mois</p>
              </div>
              <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold">2025</v-chip>
            </div>
            <div style="height: 260px; position: relative;">
              <Bar v-if="barReady" :data="enrollmentChartData" :options="barOptions" />
              <div v-else class="d-flex align-center justify-center h-100">
                <v-progress-circular indeterminate color="primary" size="32" />
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Role Distribution Doughnut -->
        <v-col cols="12" lg="4">
          <v-card class="dashboard-panel rounded-xl pa-5 h-100" theme="dark">
            <div class="d-flex align-center justify-space-between mb-5">
              <div>
                <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">Répartition des rôles</h2>
                <p class="text-caption text-grey mt-1 mb-0">Distribution des utilisateurs</p>
              </div>
            </div>
            <div style="height: 200px; position: relative;" class="mb-4">
              <Doughnut v-if="doughnutReady" :data="roleChartData" :options="doughnutOptions" />
              <div v-else class="d-flex align-center justify-center h-100">
                <v-progress-circular indeterminate color="primary" size="32" />
              </div>
            </div>
            <!-- Legend -->
            <div v-if="stats.users_by_role" class="d-flex flex-column gap-3 mt-2">
              <div v-for="(count, role) in stats.users_by_role" :key="role" class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-2">
                  <div class="role-dot" :style="{ background: roleColors[role] || '#888' }" />
                  <span class="text-body-2 text-capitalize text-grey-lighten-1">{{ role }}</span>
                </div>
                <div class="d-flex align-center gap-3">
                  <v-progress-linear
                    :model-value="(count / Math.max(stats.total_users, 1)) * 100"
                    :color="roleColors[role] || 'grey'"
                    height="4" rounded width="80"
                    bg-color="rgba(255,255,255,0.05)"
                  />
                  <span class="text-body-2 font-weight-bold tabular-nums text-white" style="min-width:24px;">{{ count }}</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- ── Second Charts Row ──────────────────────────── -->
      <v-row class="mb-8">
        <!-- Quiz Performance Line Chart -->
        <v-col cols="12" lg="6">
          <v-card class="dashboard-panel rounded-xl pa-5" theme="dark">
            <div class="d-flex align-center justify-space-between mb-5">
              <div>
                <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">Performance des quiz</h2>
                <p class="text-caption text-grey mt-1 mb-0">Score moyen hebdomadaire</p>
              </div>
              <div class="d-flex align-center gap-2">
                <v-icon size="20" :color="passRateColor">mdi-chart-line</v-icon>
                <span class="text-h6 font-weight-black tabular-nums" :style="{ color: passRateColor }">{{ stats.quiz_pass_rate ?? 0 }}%</span>
              </div>
            </div>
            <div style="height: 200px; position: relative;">
              <Line v-if="lineReady" :data="quizLineData" :options="lineOptions" />
              <div v-else class="d-flex align-center justify-center h-100">
                <v-progress-circular indeterminate color="primary" size="32" />
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Course Completion vs Enrollment -->
        <v-col cols="12" lg="6">
          <v-card class="dashboard-panel rounded-xl pa-5" theme="dark">
            <div class="d-flex align-center justify-space-between mb-5">
              <div>
                <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">Activité récente</h2>
                <p class="text-caption text-grey mt-1 mb-0">Dernières inscriptions</p>
              </div>
              <v-btn variant="text" size="small" color="primary" class="text-none px-0" to="/admin/users">Voir tout</v-btn>
            </div>
            <div v-if="stats.recent_enrollments?.length" class="d-flex flex-column gap-0">
              <div
                v-for="(enr, index) in stats.recent_enrollments.slice(0, 5)"
                :key="enr.id"
                class="activity-row d-flex align-center gap-3 py-3"
                :class="{ 'border-bottom-subtle': index < Math.min(stats.recent_enrollments.length, 5) - 1 }"
              >
                <v-avatar :color="avatarColors[index % avatarColors.length]" size="36" class="font-weight-bold text-white flex-shrink-0">
                  {{ enr.utilisateur?.name?.charAt(0) || 'U' }}
                </v-avatar>
                <div class="flex-grow-1 min-w-0">
                  <div class="text-body-2 font-weight-bold text-white text-truncate">{{ enr.utilisateur?.name }}</div>
                  <div class="text-caption text-grey text-truncate d-flex align-center gap-1 mt-0.5">
                    <v-icon size="11" color="secondary">mdi-book-open-variant</v-icon>
                    {{ enr.cours?.titre }}
                  </div>
                </div>
                <v-chip size="x-small" color="success" variant="tonal" class="font-weight-bold flex-shrink-0">Nouveau</v-chip>
              </div>
            </div>
            <div v-else class="d-flex align-center justify-center py-10">
              <p class="text-grey text-caption">Aucune inscription récente</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
      </template>
    </v-container>
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { showErrorToast, showToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const stats = ref({});
const currentTime = ref(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
const barReady = ref(false);
const doughnutReady = ref(false);
const lineReady = ref(false);
const { isLoading, markLoading, markLoaded } = useViewLoadState();

const kpis = [
  { key: 'total_users',       label: 'Utilisateurs',   icon: 'mdi-account-group',    color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  trend: 12 },
  { key: 'published_courses', label: 'Cours Publiés',  icon: 'mdi-book-check',       color: '#10b981', bg: 'rgba(16,185,129,0.12)',  trend: 4  },
  { key: 'total_enrollments', label: 'Inscriptions',   icon: 'mdi-school',           color: '#f97316', bg: 'rgba(249,115,22,0.12)',  trend: 28 },
  { key: 'total_courses',     label: 'Cours Total',    icon: 'mdi-database-outline', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   trend: 0  },
];

const roleColors = { admin: '#ef4444', formateur: '#f97316', apprenant: '#3b82f6' };
const avatarColors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'];

const passRateColor = computed(() => {
  const r = stats.value.quiz_pass_rate || 0;
  return r >= 75 ? '#10b981' : r >= 50 ? '#f59e0b' : '#ef4444';
});

/* ── Chart Data ──────────────────────────────────────────── */
const months = ['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai'];

const enrollmentChartData = computed(() => ({
  labels: stats.value.trends?.map(t => t.month) || months,
  datasets: [{
    label: 'Inscriptions',
    data: stats.value.trends?.map(t => t.enrollments) || [18, 24, 32, 28, 41, 55],
    backgroundColor: 'rgba(59,130,246,0.75)',
    borderColor: '#3b82f6',
    borderWidth: 0,
    borderRadius: 6,
    borderSkipped: false,
  }, {
    label: 'Cours complétés',
    data: stats.value.trends?.map(t => t.completions) || [12, 18, 22, 20, 30, 38],
    backgroundColor: 'rgba(16,185,129,0.65)',
    borderColor: '#10b981',
    borderWidth: 0,
    borderRadius: 6,
    borderSkipped: false,
  }]
}));

const roleChartData = computed(() => {
  const roles = stats.value.users_by_role || {};
  return {
    labels: Object.keys(roles).map(r => r.charAt(0).toUpperCase() + r.slice(1)),
    datasets: [{
      data: Object.values(roles),
      backgroundColor: Object.keys(roles).map(r => roleColors[r] || '#888'),
      borderWidth: 2,
      borderColor: '#111827',
      hoverOffset: 8,
    }]
  };
});

const quizLineData = computed(() => ({
  labels: stats.value.trends?.map(t => t.month) || months,
  datasets: [{
    label: 'Score moyen (%)',
    data: stats.value.trends?.map(t => t.avg_score) || [62, 68, 71, 65, 78, 75],
    borderColor: '#f97316',
    backgroundColor: 'rgba(249,115,22,0.1)',
    pointBackgroundColor: '#f97316',
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: true,
    tension: 0.4,
    borderWidth: 2,
  }]
}));

/* ── Chart Options ───────────────────────────────────────── */
const gridColor = 'rgba(255,255,255,0.03)';
const tickColor = '#6b7280';

const baseTooltip = {
  backgroundColor: 'rgba(10,15,28,0.95)',
  borderColor: 'rgba(255,255,255,0.08)',
  borderWidth: 1,
  titleColor: '#fff',
  bodyColor: '#9ca3af',
  padding: 12,
  cornerRadius: 10,
};

const barOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#9ca3af', boxWidth: 12, padding: 16, font: { size: 12 } } }, tooltip: baseTooltip },
  scales: {
    x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } }, border: { display: false } },
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
    x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 } }, border: { display: false } },
    y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { size: 11 }, callback: v => v + '%' }, border: { display: false }, min: 0, max: 100 },
  },
};

/* ── Export ──────────────────────────────────────────────── */
async function doExport(type, format = 'csv') {
  if (format === 'csv') {
    try {
      // Use the api instance so Sanctum cookies and global error handling apply
      const resp = await api.get(`/admin/export?type=${type}&format=csv`, { responseType: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(resp.data);
      link.setAttribute('download', `${type}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 60_000);
      showToast('Export CSV généré.', 'success');
    } catch (e) {
      showErrorToast(e, 'Impossible de générer cet export CSV.');
    }
  } else if (format === 'pdf') {
    try {
      const { data } = await api.get(`/admin/export?type=${type}&format=json`);
      if (!data?.length) return;
      const doc = new jsPDF();
      doc.text(`Export - ${type.toUpperCase()}`, 14, 15);
      doc.autoTable({ head: [Object.keys(data[0])], body: data.map(o => Object.values(o).map(v => String(v ?? ''))), startY: 20, theme: 'grid', styles: { fontSize: 9 }, headStyles: { fillColor: [59,130,246] } });
      doc.save(`${type}.pdf`);
      showToast('Export PDF généré.', 'success');
    } catch (e) {
      showErrorToast(e, 'Impossible de générer cet export PDF.');
    }
  }
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get('/admin/stats');
    stats.value = data;
  } catch(e) {
    showErrorToast(e, 'Impossible de charger les statistiques admin.');
  }
  finally {
    await nextTick();
    // Small delay so DOM has mounted the chart containers
    setTimeout(() => { barReady.value = true; doughnutReady.value = true; lineReady.value = true; }, 200);
    markLoaded();
  }
});
</script>

<style scoped>
.admin-wrapper { min-height: 100vh; background-color: var(--v-theme-background); }

/* ── Hero ──────────────────────────────────────────────── */
.admin-hero {
  position: relative;
  padding-top: calc(var(--el-app-bar-h, 72px) + 32px);
  padding-bottom: 32px;
  overflow: hidden;
}
.admin-hero-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 100% 0%, rgba(239,68,68,0.07) 0%, transparent 55%),
              radial-gradient(ellipse at 0% 100%, rgba(59,130,246,0.05) 0%, transparent 50%);
  pointer-events: none;
}
.z-1 { position: relative; z-index: 1; }
.tracking-wide { letter-spacing: 0.06em; }
.tabular-nums { font-variant-numeric: tabular-nums; }
.min-w-0 { min-width: 0; }

/* ── Panel ─────────────────────────────────────────────── */
.dashboard-panel, .kpi-card {
  background: rgba(17, 24, 39, 0.65) !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25) !important;
  backdrop-filter: blur(10px);
}

/* ── KPI Cards ─────────────────────────────────────────── */
@keyframes kpiIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.kpi-card {
  animation: kpiIn 0.5s ease both;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.kpi-card:hover {
  border-color: rgba(59, 130, 246, 0.3) !important;
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(59, 130, 246, 0.15) !important;
}

.kpi-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.trend-pill {
  display: flex; align-items: center;
  font-size: 0.72rem; font-weight: 700;
  padding: 3px 9px; border-radius: 20px;
}
.trend-up { background: rgba(16,185,129,0.12); color: #10b981; }
.trend-neutral { background: rgba(255,255,255,0.05); color: #9ca3af; }

/* ── Role Distribution ─────────────────────────────────── */
.role-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

/* ── Activity List ─────────────────────────────────────── */
.border-bottom-subtle { border-bottom: 1px solid rgba(255,255,255,0.05); }

/* ── User Menu ─────────────────────────────────────────── */
.user-menu-card {
  background: rgba(10,14,26,0.98) !important;
  border: 1px solid rgba(255,255,255,0.07) !important;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
}
.menu-item:hover { background: rgba(255,255,255,0.04) !important; }

.border-subtle { border: 1px solid rgba(255,255,255,0.07) !important; }
.btn-glow { box-shadow: 0 4px 20px rgba(59,130,246,0.35) !important; }
</style>
