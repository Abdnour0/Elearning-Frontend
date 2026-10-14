<template>
  <div class="catalog-wrapper">
<!-- ── Hero Header ──────────────────────────────────────── -->
    <div class="catalog-hero">
      <v-container class="position-relative z-1 text-center">
        <v-chip size="small" color="primary" variant="tonal" class="el-fade-up font-weight-bold mb-5 px-4 tracking-wide" prepend-icon="mdi-bookshelf">
          Catalogue
        </v-chip>
        <h1 class="el-fade-up el-d1 text-h2 font-weight-black text-white mb-4" style="letter-spacing: -0.03em; line-height: 1.1;">
          Trouvez votre <span class="text-gradient-brand">prochaine formation</span>
        </h1>
        <p class="el-fade-up el-d2 text-body-1 text-grey-lighten-1 mx-auto mb-0" style="max-width: 520px;">
          {{ totalCourses }} formation{{ totalCourses !== 1 ? 's' : '' }} disponible{{ totalCourses !== 1 ? 's' : '' }} dispensée{{ totalCourses !== 1 ? 's' : '' }} par des experts du secteur.
        </p>
      </v-container>
    </div>

    <v-container class="py-6">
<!-- ── Simplified Floating Search ──────────────── -->
      <div class="el-fade-up el-d3 control-center rounded-2xl pa-4 mb-16 mx-auto border-subtle" style="max-width: 700px;">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Rechercher une formation par titre, technologie..."
          variant="solo"
          density="comfortable"
          flat hide-details rounded="lg"
          bg-color="var(--el-surface-2)"
          class="premium-search-field"
          @update:model-value="debouncedFetchCourses"
        />
      </div>

      <!-- ── Skeleton Loaders ────────────────────────────────── -->
      <v-row v-if="isLoading">
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4" lg="3">
          <div class="skeleton-card rounded-xl overflow-hidden">
            <div class="skeleton-img shimmer" />
            <div class="pa-4">
              <div class="skeleton-line shimmer mb-2" style="width:60%; height:12px; border-radius:6px;" />
              <div class="skeleton-line shimmer" style="width:85%; height:14px; border-radius:6px;" />
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- ── Empty State ─────────────────────────────────────── -->
      <div v-else-if="courses.length === 0" class="text-center py-20">
        <div class="empty-icon mx-auto mb-5">
          <v-icon size="40" color="grey-darken-1">mdi-magnify-close</v-icon>
        </div>
        <h3 class="text-h5 text-white font-weight-bold mb-2">Aucun résultat</h3>
        <p class="text-grey-lighten-1 mb-6">Essayez d'autres mots-clés ou supprimez les filtres.</p>
        <v-btn variant="tonal" color="primary" rounded="lg" @click="resetFilters">
          Réinitialiser les filtres
        </v-btn>
      </div>

      <!-- ── Course Grid ───────────────────────────────────── -->
      <v-row v-else class="course-grid">
        <v-col
          v-for="(course, i) in courses"
          :key="course.id"
          cols="12" sm="6" md="4" lg="4"
          class="d-flex"
          v-reveal="i * 60"
        >
          <v-card
            class="premium-course-card rounded-2xl border-subtle flex-grow-1"
            elevation="0"
            tabindex="0"
            role="button"
            :style="`--card-accent: ${getCategoryColorHex(course.categorie)}; animation-delay:${i * 50}ms`"
            @click="handleEnroll(course.id)"
            @keydown.enter="handleEnroll(course.id)"
            @keydown.space.prevent="handleEnroll(course.id)"
          >
            <!-- Background Visual -->
            <div class="card-visual" :style="{ background: getGradient(course.id) }">
               <div class="ambient-orb" />
               <v-icon size="120" class="visual-icon">{{ getCategoryIcon(course.categorie) }}</v-icon>
               <div class="visual-overlay" />
            </div>

            <!-- Content -->
            <div class="card-body pa-6 d-flex flex-column position-relative">
              <!-- Loading Overlay -->
              <div v-if="enrollingId === course.id" class="enroll-loading-overlay rounded-2xl d-flex align-center justify-center">
                <v-progress-circular indeterminate color="primary" size="32" width="3" />
              </div>

              <div class="d-flex justify-space-between align-start mb-4">
                <v-chip size="x-small" :color="getCategoryColorHex(course.categorie)" variant="tonal" class="font-weight-bold text-uppercase px-3 rounded-pill">
                  {{ course.categorie }}
                </v-chip>
                <div class="d-flex align-center gap-1">
                  <v-icon color="warning" size="14">mdi-star</v-icon>
                  <span class="text-caption font-weight-bold text-white">4.8</span>
                </div>
              </div>

              <h3 class="text-h6 font-weight-black text-white leading-tight mb-3 card-title">{{ course.titre }}</h3>
              <p class="text-caption text-grey-lighten-1 line-clamp-2 mb-6 card-desc">{{ course.description || 'Apprenez les fondamentaux et les techniques avancées de ce domaine avec nos experts.' }}</p>

              <v-spacer />

              <!-- Footer Section -->
              <div class="d-flex align-center justify-space-between mt-auto pt-4 border-t-subtle-light">
                <div class="d-flex align-center gap-3">
                  <v-avatar :color="avatarColors[course.id % avatarColors.length]" size="32" class="border-subtle">
                    <span class="text-caption font-weight-black text-white">{{ (course.formateur?.name || 'E')[0].toUpperCase() }}</span>
                  </v-avatar>
                  <div class="min-w-0">
                    <div class="text-caption font-weight-bold text-white text-truncate">{{ course.formateur?.name || 'Expert' }}</div>
                    <div class="text-caption text-grey" style="font-size: 0.65rem;">Formateur Certifié</div>
                  </div>
                </div>
                
                <div class="card-action-hint">
                  <v-icon :color="getCategoryColorHex(course.categorie)" size="24" class="hint-icon">mdi-arrow-right-circle-outline</v-icon>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <div v-if="totalPages > 1" class="d-flex justify-center mt-12">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          color="primary"
          @update:model-value="fetchCourses"
        />
      </div>
</v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const courses = ref([]);
const allCourses = ref([]); // unfiltered count
const { isLoading, markLoading, markLoaded } = useViewLoadState();
const search = ref('');
const selectedCategory = ref('');
const enrollingId = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
let searchDebounceId = null;
let fetchRequestId = 0;

const totalCourses = computed(() => allCourses.value.length);

const avatarColors = ['#f3d8c8', '#d7e3ef', '#dbe8d3', '#e6dcf2', '#f2d7d3', '#d2e6e8'];

const gradients = [
  '#ffe7de',
  '#e4edf6',
  '#e4eee0',
  '#efe6db',
  '#f2e2e6',
  '#e8e2f2',
];

function getGradient(id) { return gradients[id % gradients.length]; }
function getCategoryColorHex(cat) {
  return { 'Développement Web': '#7ea6cf', 'Backend': '#d99a5f', 'Base de Données': '#ab9dd8', 'Data Science': '#86bd97', 'DevOps': '#8fb4bd' }[cat] || '#ff7448';
}
function getCategoryIcon(cat) {
  return { 'Développement Web': 'mdi-web', 'Backend': 'mdi-server-network', 'Base de Données': 'mdi-database', 'Data Science': 'mdi-chart-scatter-plot', 'DevOps': 'mdi-docker' }[cat] || 'mdi-book-open-variant';
}

async function fetchCourses() {
  const requestId = ++fetchRequestId;
  markLoading();
  try {
    const params = {};
    if (search.value) params.search = search.value;
    if (selectedCategory.value) params.categorie = selectedCategory.value;
    params.page = currentPage.value;
    const { data } = await api.get('/cours', { params });
    if (requestId !== fetchRequestId) return;
    courses.value = data?.data || [];
    totalPages.value = data?.last_page || 1;
    if (!search.value && !selectedCategory.value) allCourses.value = data?.data || [];
  } catch (e) { 
    if (requestId === fetchRequestId) {
      courses.value = [];
      showErrorToast(e, 'Impossible de charger le catalogue.');
    }
  } finally { 
    if (requestId === fetchRequestId) markLoaded();
  }
}

function debouncedFetchCourses() {
  currentPage.value = 1;
  window.clearTimeout(searchDebounceId);
  searchDebounceId = window.setTimeout(fetchCourses, 350);
}

function resetFilters() {
  search.value = '';
  selectedCategory.value = '';
  currentPage.value = 1;
  fetchCourses();
}

watch(() => route.path, (newPath) => {
  if (newPath === '/catalogue') fetchCourses();
});

async function handleEnroll(id) {
  if (!authStore.isAuthenticated) return router.push('/login');
  enrollingId.value = id;
  try {
    await api.post('/inscriptions', { cours_id: id });
    router.push(`/cours/${id}/apprendre`);
  } catch { router.push(`/cours/${id}`); }
  finally { enrollingId.value = null; }
}

onMounted(fetchCourses);
onUnmounted(() => window.clearTimeout(searchDebounceId));
</script>

<style scoped>
.catalog-wrapper { background-color: var(--v-theme-background); min-height: 100vh; }

/* ── Control Center (Filters) ────────────────────────── */
.control-center {
  background: var(--el-surface);
  backdrop-filter: none;
  border: 1px solid var(--el-border) !important;
  box-shadow: var(--el-shadow-sm);
}

.premium-search-field :deep(.v-field) {
  background: var(--el-bg-1) !important;
  border: 1px solid var(--el-border) !important;
  transition: border-color 0.15s ease;
}
.premium-search-field :deep(.v-field--focused) {
  border-color: var(--el-accent) !important;
  background: var(--el-bg-1) !important;
  box-shadow: none !important;
}

.filter-btn {
  border: 1px solid var(--el-border) !important;
  background: var(--el-surface) !important;
}
.filter-btn-active {
  background: var(--el-accent) !important;
  border: 1px solid var(--el-accent) !important;
  box-shadow: none !important;
}

.stats-pill {
  background: var(--el-surface);
  border: 1px solid var(--el-border);
}
.pulse-dot {
  width: 8px; height: 8px; background: #86bd97; border-radius: 50%;
  box-shadow: none;
  animation: none;
}

/* ── Premium Course Card ─────────────────────────────── */
.premium-course-card {
  background: var(--el-surface) !important;
  overflow: hidden;
  position: relative;
  box-shadow: var(--el-shadow-sm) !important;
  transition: transform 0.28s var(--el-ease), border-color 0.28s var(--el-ease), box-shadow 0.28s var(--el-ease) !important;
  cursor: pointer;
  height: 460px;
}
.premium-course-card:hover {
  transform: translateY(-6px);
  border-color: var(--el-border-strong) !important;
  box-shadow: var(--el-shadow-md) !important;
}

.card-visual {
  height: 150px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.visual-icon {
  z-index: 1;
  color: var(--card-accent, var(--el-accent)) !important;
  opacity: 0.9;
  transition: none;
}
.premium-course-card:hover .visual-icon {
  opacity: 0.9;
  transform: none;
}
.visual-overlay {
  display: none;
}
.ambient-orb {
  display: none;
}

.card-title { 
  font-size: 1.15rem !important;
  line-height: 1.4 !important;
}
.premium-course-card:hover .card-title { color: var(--el-text) !important; transform: none; }

.action-btn-premium {
  opacity: 1;
  transform: none;
  transition: none;
}

.card-action-hint {
  opacity: 1;
  transform: none;
  transition: none;
}
.hint-icon {
  filter: none;
}

.premium-course-card:hover .card-visual {
  filter: none;
}

/* ── Empty State ─────────────────────────────────────── */
.empty-icon {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--el-surface);
  border: 1px solid var(--el-border);
  display: flex; align-items: center; justify-content: center;
}

/* ── Utilities ────────────────────────────────────────── */
.line-clamp-2 {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.border-subtle { border: 1px solid var(--el-border) !important; }

/* ── Animations ──────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.premium-course-card {
  animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) backwards;
}

/* ── Shimmer Effect ─────────────────────────────────── */
.shimmer {
  background: var(--el-surface-2);
  animation: skeletonPulse 1.6s ease-in-out infinite;
}

@keyframes skeletonPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

.skeleton-card {
  background: var(--el-surface);
  border: 1px solid var(--el-border);
  box-shadow: var(--el-shadow-xs);
  height: 460px;
}
.skeleton-img { height: 150px; width: 100%; }

.enroll-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 249, 246, 0.78);
  backdrop-filter: none;
  border-radius: inherit;
  z-index: 10;
  transition: background 0.15s ease;
}
</style>
