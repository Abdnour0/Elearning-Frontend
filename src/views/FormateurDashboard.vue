<template>
  <v-container class="py-8">
    <!-- Header -->
    <v-row class="mb-6" align="center">
      <v-col>
        <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold mb-3" prepend-icon="mdi-teach">
          Formateur
        </v-chip>
        <h1 class="text-h3 font-weight-black text-white" style="letter-spacing: -0.02em">
          Votre <span class="text-gradient-brand">espace cours</span>
        </h1>
        <p class="text-body-1 text-medium-emphasis mt-2 mb-0">Gérez vos formations et suivez vos apprenants.</p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary" variant="flat" class="rounded-pill font-weight-bold btn-glow"
          prepend-icon="mdi-plus" to="/formateur/cours/creer"
        >
          Créer un cours
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats row -->
    <v-row class="mb-8">
      <v-col v-for="s in stats" :key="s.label" cols="12" sm="4">
        <v-card class="glass-card surface-card rounded-xl pa-5 text-center" theme="dark">
          <v-icon :color="s.color" size="32" class="mb-2">{{ s.icon }}</v-icon>
          <div class="text-h4 font-weight-black" :class="`text-${s.color}`">{{ s.value }}</div>
          <div class="text-grey-lighten-1 text-caption mt-1">{{ s.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Course list -->
    <h2 class="text-h5 font-weight-bold text-white mb-4">Mes cours</h2>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-6" rounded />

    <v-card v-if="!loading && courses.length === 0" class="glass-card surface-card rounded-xl pa-8 text-center" theme="dark">
      <v-icon size="72" color="grey-darken-1">mdi-book-plus-outline</v-icon>
      <p class="text-h6 text-grey mt-4">Aucun cours créé</p>
      <v-btn color="primary" class="mt-4 rounded-pill" to="/formateur/cours/creer">Créer votre premier cours</v-btn>
    </v-card>

    <v-row>
      <v-col v-for="course in courses" :key="course.id" cols="12">
        <v-card class="formateur-course-card surface-card rounded-xl mb-2 overflow-hidden" theme="dark">
          <div class="d-flex flex-column flex-md-row h-100">
            <!-- Image / Gradient side -->
            <div class="course-image-side position-relative d-flex align-center justify-center" :style="{ background: getGradient(course.id) }">
              <div class="course-overlay" />
              <v-icon size="64" color="white" class="position-relative z-1 opacity-80">{{ getCategoryIcon(course.categorie) }}</v-icon>
              <v-chip
                :color="statusColor(course.statut)"
                size="small" variant="flat" class="status-chip font-weight-bold"
              >
                {{ statusLabel(course.statut) }}
              </v-chip>
            </div>

            <!-- Content side -->
            <div class="pa-6 d-flex flex-column flex-grow-1 justify-center">
              <div>
                <div class="text-caption text-primary font-weight-bold text-uppercase mb-1 tracking-wide">
                  {{ course.categorie || 'Général' }}
                </div>
                <h3 class="text-h5 font-weight-black text-white leading-tight mb-2">{{ course.titre }}</h3>
              </div>
              <p class="text-grey-lighten-1 text-body-2 line-clamp-2 mb-4">{{ course.description || 'Aucune description fournie pour ce cours. Vous pouvez en ajouter une en le modifiant.' }}</p>

              <div class="d-flex align-center justify-space-between flex-wrap gap-4 mt-auto pt-4 border-top-subtle">
                <div class="d-flex align-center gap-6">
                  <div class="d-flex flex-column">
                    <span class="text-caption text-grey">Apprenants</span>
                    <span class="font-weight-bold text-white d-flex align-center mt-1">
                      <v-icon size="16" color="secondary" class="mr-1">mdi-account-group</v-icon>
                      {{ course.inscriptions_count || 0 }}
                    </span>
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-caption text-grey">Dernière modif.</span>
                    <span class="font-weight-bold text-white d-flex align-center mt-1">
                      <v-icon size="16" color="grey" class="mr-1">mdi-calendar-edit</v-icon>
                      {{ new Date(course.updated_at || Date.now()).toLocaleDateString('fr-FR') }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="d-flex align-center gap-3">
                  <v-tooltip text="Statistiques" location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon variant="tonal" color="info" class="action-btn" :to="`/formateur/cours/${course.id}/stats`">
                        <v-icon size="20">mdi-chart-line</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  
                  <v-tooltip text="Modifier" location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon variant="tonal" color="primary" class="action-btn" :to="`/formateur/cours/${course.id}/edit`">
                        <v-icon size="20">mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>

                  <v-tooltip v-if="course.statut === 'brouillon' || course.statut === 'depublie'" text="Publier" location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon variant="tonal" color="success" class="action-btn"
                        :loading="actionId === course.id" @click="publishCourse(course)"
                      >
                        <v-icon size="20">mdi-rocket-launch</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  
                  <v-tooltip v-else text="Dépublier" location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon variant="tonal" color="warning" class="action-btn"
                        :loading="actionId === course.id" @click="unpublishCourse(course)"
                      >
                        <v-icon size="20">mdi-eye-off</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  
                  <v-tooltip text="Supprimer" location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon variant="tonal" color="error" class="action-btn" @click="confirmDelete(course)">
                        <v-icon size="20">mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="glass-card rounded-xl pa-6" theme="dark">
        <h3 class="text-h6 font-weight-bold mb-3">Supprimer le cours</h3>
        <p class="text-grey-lighten-1">
          Êtes-vous sûr de vouloir supprimer <strong class="text-white">{{ deletingCourse?.titre }}</strong> ?
          Cette action est irréversible.
        </p>
        <div class="d-flex justify-end gap-3 mt-6">
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" class="rounded-pill font-weight-bold" :loading="deleting" @click="deleteCourse">
            Supprimer
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../axios';
import { showErrorToast, showToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const courses    = ref([]);
const { isLoading: loading, markLoading, markLoaded } = useViewLoadState();
const actionId   = ref(null);
const deleteDialog = ref(false);
const deletingCourse = ref(null);
const deleting   = ref(false);

const stats = computed(() => [
  { label: 'Cours total',     value: courses.value.length,                                                  icon: 'mdi-book-multiple',    color: 'primary' },
  { label: 'Cours publiés',   value: courses.value.filter(c => c.statut === 'publie').length,               icon: 'mdi-publish',          color: 'success' },
  { label: 'Total apprenants',value: courses.value.reduce((a, c) => a + (c.inscriptions_count || 0), 0),    icon: 'mdi-account-group',    color: 'secondary' },
]);

function statusColor(s) { return { publie: 'success', brouillon: 'warning', depublie: 'error' }[s] || 'grey'; }
function statusLabel(s) { return { publie: 'Publié', brouillon: 'Brouillon', depublie: 'Dépublié' }[s] || s; }

const gradients = [
  'linear-gradient(135deg, #0f172a, #1e293b)',
  'linear-gradient(135deg, #0a0f1c, #111827)',
  'linear-gradient(135deg, #0f172a, #3b82f6)',
  'linear-gradient(135deg, #1e3a8a, #3b82f6)',
  'linear-gradient(135deg, #064e3b, #10b981)',
];
const getGradient = id => gradients[(id || 0) % gradients.length];

function getCategoryIcon(cat) {
  const map = { 'Développement Web': 'mdi-vuejs', 'Backend': 'mdi-nodejs', 'Base de Données': 'mdi-database', 'Data Science': 'mdi-language-python' };
  return map[cat] || 'mdi-book-open-page-variant';
}

async function publishCourse(course) {
  actionId.value = course.id;
  try {
    await api.post(`/cours/${course.id}/publish`);
    course.statut = 'publie';
    showToast('Cours publié.', 'success');
  } catch(e) {
    showErrorToast(e, 'Impossible de publier ce cours.');
  }
  finally { actionId.value = null; }
}

async function unpublishCourse(course) {
  actionId.value = course.id;
  try {
    await api.post(`/cours/${course.id}/unpublish`);
    course.statut = 'depublie';
    showToast('Cours dépublié.', 'success');
  } catch(e) {
    showErrorToast(e, 'Impossible de dépublier ce cours.');
  }
  finally { actionId.value = null; }
}

function confirmDelete(course) {
  deletingCourse.value = course;
  deleteDialog.value = true;
}

async function deleteCourse() {
  deleting.value = true;
  try {
    await api.delete(`/cours/${deletingCourse.value.id}`);
    courses.value = courses.value.filter(c => c.id !== deletingCourse.value.id);
    deleteDialog.value = false;
    showToast('Cours supprimé.', 'success');
  } catch(e) {
    showErrorToast(e, 'Impossible de supprimer ce cours.');
  }
  finally { deleting.value = false; }
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get('/mes-cours');
    courses.value = data;
  } catch(e) {
    showErrorToast(e, 'Impossible de charger vos cours.');
  }
  finally { markLoaded(); }
});
</script>

<style scoped>
.formateur-course-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  background: rgba(15, 23, 42, 0.6) !important;
  backdrop-filter: blur(12px);
}
.formateur-course-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.4) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1) !important;
}

.course-image-side {
  width: 100%;
  min-height: 180px;
}
@media (min-width: 960px) {
  .course-image-side {
    width: 260px;
    min-height: auto;
  }
}

.course-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, transparent 0%, rgba(15, 23, 42, 0.8) 100%);
  z-index: 0;
}
@media (max-width: 959px) {
  .course-overlay {
    background: linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.8) 100%);
  }
}

.status-chip {
  position: absolute; top: 16px; left: 16px; z-index: 2;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.leading-tight { line-height: 1.2; }
.tracking-wide { letter-spacing: 0.05em; }
.border-top-subtle { border-top: 1px solid rgba(255,255,255,0.08); }

.action-btn {
  border-radius: 12px !important;
  width: 42px !important;
  height: 42px !important;
  transition: all 0.3s ease !important;
}
.action-btn:hover {
  transform: translateY(-2px);
}
</style>
