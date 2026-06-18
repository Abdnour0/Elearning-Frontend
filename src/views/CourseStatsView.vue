<template>
  <v-container v-if="statsData" class="py-8">
    <v-row align="center" class="mb-6">
      <v-col>
        <v-btn variant="text" to="/formateur" prepend-icon="mdi-arrow-left" class="text-none mb-2">Retour</v-btn>
        <h1 class="text-h4 font-weight-black text-white">{{ statsData.cours }}</h1>
        <p class="text-grey-lighten-1">Statistiques du cours</p>
      </v-col>
    </v-row>

    <!-- KPIs -->
    <v-row class="mb-8">
      <v-col cols="12" sm="4">
        <v-card class="glass-card kpi-card rounded-xl pa-5 text-center" theme="dark">
          <v-icon color="primary" size="32" class="mb-2">mdi-account-group</v-icon>
          <div class="text-h3 font-weight-black text-primary">{{ statsData.enrollments }}</div>
          <div class="text-caption text-grey-lighten-1 mt-1">Apprenants inscrits</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="glass-card kpi-card rounded-xl pa-5 text-center" theme="dark">
          <v-icon color="secondary" size="32" class="mb-2">mdi-trending-up</v-icon>
          <div class="text-h3 font-weight-black text-secondary">{{ statsData.avg_progression }}%</div>
          <div class="text-caption text-grey-lighten-1 mt-1">Progression moyenne</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="glass-card kpi-card rounded-xl pa-5 text-center" theme="dark">
          <v-icon color="warning" size="32" class="mb-2">mdi-head-question</v-icon>
          <div class="text-h3 font-weight-black text-warning">{{ statsData.quiz_stats?.length || 0 }}</div>
          <div class="text-caption text-grey-lighten-1 mt-1">Quiz disponibles</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quiz stats table -->
    <v-card v-if="statsData.quiz_stats && statsData.quiz_stats.length > 0" class="glass-card rounded-xl pa-6" theme="dark">
      <h2 class="text-h6 font-weight-bold mb-4">Performance des quiz</h2>
      <v-table theme="dark" class="transparent-table">
        <thead>
          <tr>
            <th class="text-caption font-weight-bold text-grey-lighten-1">QUIZ</th>
            <th class="text-caption font-weight-bold text-grey-lighten-1">TENTATIVES</th>
            <th class="text-caption font-weight-bold text-grey-lighten-1">RÉUSSIES</th>
            <th class="text-caption font-weight-bold text-grey-lighten-1">TAUX</th>
            <th class="text-caption font-weight-bold text-grey-lighten-1">SCORE MOY.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="qs in statsData.quiz_stats" :key="qs.quiz_titre">
            <td class="font-weight-medium text-white py-3">{{ qs.quiz_titre }}</td>
            <td class="text-grey-lighten-1">{{ qs.total_attempts }}</td>
            <td class="text-success font-weight-bold">{{ qs.passed }}</td>
            <td>
              <div class="d-flex align-center gap-2">
                <v-progress-linear :model-value="qs.pass_rate" :color="qs.pass_rate >= 60 ? 'success' : 'warning'" height="6" rounded bg-color="rgba(255,255,255,0.05)" style="width:80px" />
                <span class="text-body-2 font-weight-bold" :class="qs.pass_rate >= 60 ? 'text-success' : 'text-warning'">{{ qs.pass_rate }}%</span>
              </div>
            </td>
            <td class="font-weight-bold text-white">{{ qs.avg_score }}%</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    <v-card v-else class="glass-card rounded-xl pa-8 text-center" theme="dark">
      <v-icon size="48" color="grey-darken-1" class="mb-4">mdi-clipboard-text-off-outline</v-icon>
      <h2 class="text-h6 font-weight-bold text-white">Aucune donnée de quiz</h2>
      <p class="text-grey-lighten-1">Ce cours ne contient pas encore de quiz pour afficher des performances.</p>
    </v-card>
  </v-container>
  <v-container v-else-if="isLoading || isInitial" class="text-center py-16">
    <v-progress-circular indeterminate color="primary" size="64" />
  </v-container>
  <v-container v-else class="py-12">
    <v-alert type="error" variant="tonal" class="rounded-xl">
      Impossible de charger les statistiques de ce cours.
    </v-alert>
  </v-container>
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
    showErrorToast(e, 'Impossible de charger les statistiques de ce cours.');
  } finally {
    markLoaded();
  }
});
</script>
<style scoped>
.transparent-table { background: transparent !important; }

/* KPI Cards */
.kpi-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.kpi-card:hover {
  border-color: rgba(59, 130, 246, 0.3) !important;
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(59, 130, 246, 0.15) !important;
}
</style>
