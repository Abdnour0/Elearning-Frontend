<template>
  <div class="catalog-wrapper">
<!-- ── Hero Header ──────────────────────────────────────── -->
    <div class="catalog-hero">
      <div class="hero-glow" />
      <v-container class="position-relative z-1 text-center">
        <v-chip size="small" color="primary" variant="tonal" class="font-weight-bold mb-5 px-4 tracking-wide" prepend-icon="mdi-bookshelf">
          Catalogue
        </v-chip>
        <h1 class="text-h2 font-weight-black text-white mb-4" style="letter-spacing: -0.03em; line-height: 1.1;">
          Trouvez votre <span class="text-gradient-brand">prochaine formation</span>
        </h1>
        <p class="text-body-1 text-grey-lighten-1 mx-auto mb-0" style="max-width: 520px;">
          {{ totalCourses }} formation{{ totalCourses !== 1 ? 's' : '' }} disponible{{ totalCourses !== 1 ? 's' : '' }} dispensée{{ totalCourses !== 1 ? 's' : '' }} par des experts du secteur.
        </p>
      </v-container>
    </div>

    <v-container class="py-6">
<!-- ── Simplified Floating Search ──────────────── -->
      <div class="control-center rounded-2xl pa-4 mb-16 mx-auto border-subtle" style="max-width: 700px;">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Rechercher une formation par titre, technologie..."
          variant="solo"
          density="comfortable"
          flat hide-details rounded="lg"
          bg-color="rgba(255,255,255,0.03)"
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
               <v-icon size="120" color="white" class="visual-icon">{{ getCategoryIcon(course.categorie) }}</v-icon>
               <div class="visual-overlay" />
            </div>

            <!-- Content -->
            <div class="card-body pa-6 d-flex flex-column position-relative">
              <!-- Loading Overlay -->
              <div v-if="enrollingId === course.id" class="enroll-loading-overlay rounded-2xl d-flex align-center justify-center">
                <v-progress-circular indeterminate color="white" size="32" width="3" />
              </div>

              <div class="d-flex justify-space-between align-start mb-4">
                <v-chip size="x-small" :color="categoryColor(course.categorie)" variant="flat" class="font-weight-black text-uppercase px-3 rounded-pill">
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
                  <v-icon :color="categoryColor(course.categorie)" size="24" class="hint-icon">mdi-arrow-right-circle-outline</v-icon>
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

const avatarColors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'];

const gradients = [
  'linear-gradient(160deg, #1e3a8a 0%, #2563eb 100%)',
  'linear-gradient(160deg, #064e3b 0%, #059669 100%)',
  'linear-gradient(160deg, #7c2d12 0%, #ea580c 100%)',
  'linear-gradient(160deg, #312e81 0%, #4f46e5 100%)',
  'linear-gradient(160deg, #4c1d95 0%, #7c3aed 100%)',
  'linear-gradient(160deg, #164e63 0%, #0891b2 100%)',
];
const catColors = { 'Développement Web': 'primary', 'Backend': 'warning', 'Base de Données': 'secondary', 'Data Science': 'success', 'DevOps': 'info' };

function getGradient(id) { return gradients[id % gradients.length]; }
function categoryColor(cat) { return catColors[cat] || 'primary'; }
function getCategoryColorHex(cat) {
  return { 'Développement Web': '#3b82f6', 'Backend': '#f97316', 'Base de Données': '#8b5cf6', 'Data Science': '#10b981', 'DevOps': '#06b6d4' }[cat] || '#3b82f6';
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
  background: rgba(13, 17, 28, 0.6);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.premium-search-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease;
}
.premium-search-field :deep(.v-field--focused) {
  border-color: #3b82f6 !important;
  background: rgba(255, 255, 255, 0.04) !important;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2) !important;
}

.filter-btn {
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  background: rgba(255, 255, 255, 0.02) !important;
}
.filter-btn-active {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  border: none !important;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
}

.stats-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.pulse-dot {
  width: 8px; height: 8px; background: #10b981; border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

/* ── Premium Course Card ─────────────────────────────── */
.premium-course-card {
  background: #0d111c !important;
  overflow: hidden;
  position: relative;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) !important;
  cursor: pointer;
  height: 460px;
}
.premium-course-card:hover {
  transform: translateY(-10px) scale(1.01);
  border-color: var(--card-accent) !important;
  box-shadow: 0 30px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) !important;
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
  opacity: 0.2;
  transition: all 0.6s ease;
}
.premium-course-card:hover .visual-icon {
  opacity: 0.05;
  transform: scale(1.2) rotate(5deg);
}
.visual-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent, #0d111c);
  z-index: 2;
}
.ambient-orb {
  position: absolute; top: -50px; right: -50px;
  width: 150px; height: 150px;
  background: var(--card-accent);
  filter: blur(80px);
  opacity: 0.2;
  transition: all 0.8s ease;
}
.premium-course-card:hover .ambient-orb {
  opacity: 0.4;
  transform: scale(1.5);
}

.card-title { 
  transition: all 0.3s ease; 
  font-size: 1.15rem !important;
  line-height: 1.4 !important;
}
.premium-course-card:hover .card-title { color: var(--card-accent) !important; transform: translateX(4px); }

.action-btn-premium {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.4s ease;
}
.premium-course-card:hover .action-btn-premium {
  opacity: 1;
  transform: translateX(0);
}

.card-action-hint {
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.premium-course-card:hover .card-action-hint {
  opacity: 1;
  transform: scale(1);
}
.hint-icon {
  filter: drop-shadow(0 0 8px var(--card-accent));
}

.premium-course-card:hover .card-visual {
  filter: brightness(1.2);
}

/* ── Empty State ─────────────────────────────────────── */
.empty-icon {
  width: 80px; height: 80px; border-radius: 50%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; justify-content: center;
}

/* ── Utilities ────────────────────────────────────────── */
.line-clamp-2 {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.border-subtle { border: 1px solid rgba(255, 255, 255, 0.08) !important; }

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
  background: linear-gradient(90deg, 
    rgba(255,255,255,0.03) 25%, 
    rgba(255,255,255,0.08) 50%, 
    rgba(255,255,255,0.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  height: 460px;
}
.skeleton-img { height: 150px; width: 100%; }

.enroll-loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--v-theme-primary), 0.4);
  backdrop-filter: blur(8px);
  z-index: 10;
  transition: all 0.3s ease;
}
</style>
