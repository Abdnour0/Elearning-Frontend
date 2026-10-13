<template>
  <main class="catalog-page">
    <section class="catalog-intro"><span class="eyebrow"><i /> YOUR NEXT SKILL, STARTS HERE</span><h1>Find a course<br><em>worth your time.</em></h1><p>Thoughtful, expert-led learning for work that keeps moving.</p></section>
    <section class="catalog-content" aria-label="Course catalogue">
      <div class="catalog-toolbar"><label class="catalog-search"><span aria-hidden="true">⌕</span><input v-model="search" type="search" placeholder="Search by skill, course or instructor" aria-label="Search courses" @input="debouncedFetchCourses"></label><span class="result-count">{{ totalCourses }} courses to explore</span></div>
      <div class="catalog-filters" aria-label="Filter by subject"><button v-for="category in categoryFilters" :key="category.value || 'all'" :class="['filter-chip', { active: selectedCategory === category.value }]" @click="chooseCategory(category.value)">{{ category.label }}</button></div>

      <div v-if="isLoading" class="catalog-grid" aria-live="polite"><article v-for="i in 3" :key="i" class="skeleton-card"><div class="skeleton-img" /><div class="skeleton-line short" /><div class="skeleton-line" /><div class="skeleton-line medium" /></article></div>
      <div v-else-if="courses.length === 0" class="catalog-empty"><div class="empty-icon">⌕</div><h2>No results</h2><p>Try a broader phrase or clear the subject filter to see more courses.</p><button class="catalog-reset" @click="resetFilters">Clear filters</button></div>
      <div v-else class="catalog-grid">
        <article v-for="(course, i) in courses" :key="course.id" class="premium-course-card">
          <RouterLink class="course-card-link" :to="`/cours/${course.id}`" :aria-label="`View ${course.titre}`">
            <div class="catalog-art" :class="`catalog-art-${i % 4}`"><span class="catalog-art-category">{{ course.categorie || 'Learning path' }}</span><span class="catalog-art-symbol">{{ getCategoryIcon(course.categorie) }}</span><span class="catalog-art-time">{{ ['6 weeks', '4.5 hours', '8 lessons'][i % 3] }}</span></div>
            <div class="course-card-content"><div class="course-card-meta"><span>{{ course.niveau || ['FOUNDATION', 'INTERMEDIATE', 'PRACTICAL'][i % 3] }}</span><span class="course-rating">★ 4.8</span></div><h2>{{ course.titre }}</h2><p>{{ course.description || 'Build practical skills and put what you learn to work.' }}</p><div class="course-card-footer"><span class="instructor-avatar">{{ (course.formateur?.name || 'E').slice(0, 1) }}</span><span class="instructor-name">{{ course.formateur?.name || 'Expert instructor' }}</span><span class="detail-arrow">↗</span></div></div>
          </RouterLink>
          <button class="enroll-action" :disabled="enrollingId === course.id" @click="handleEnroll(course.id)">{{ enrollingId === course.id ? 'Joining…' : 'View learning path' }} <span>→</span></button>
        </article>
      </div>
      <div v-if="!isLoading && totalPages > 1" class="catalog-pagination"><button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">← Previous</button><span>Page {{ currentPage }} of {{ totalPages }}</span><button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">Next →</button></div>
    </section>
  </main>
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
const allCourses = ref([]);
const { isLoading, markLoading, markLoaded } = useViewLoadState();
const search = ref('');
const selectedCategory = ref('');
const enrollingId = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
let searchDebounceId = null;
let fetchRequestId = 0;
const totalCourses = computed(() => allCourses.value.length);
const categoryFilters = [
  { label: 'All courses', value: '' },
  { label: 'Web development', value: 'Développement Web' },
  { label: 'Data & AI', value: 'Data Science' },
  { label: 'Backend', value: 'Backend' },
  { label: 'Databases', value: 'Base de Données' },
  { label: 'Cloud & DevOps', value: 'DevOps' },
  { label: 'Product & design', value: 'Design' },
  { label: 'Business', value: 'Business' },
];
function getCategoryIcon(category) { return ({ 'Développement Web': '⌘', Backend: '▤', 'Base de Données': '◉', 'Data Science': '◌', DevOps: '↗' })[category] || '✳'; }

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
  } catch (error) {
    if (requestId === fetchRequestId) {
      courses.value = [];
      showErrorToast(error, 'Could not load the course catalogue.');
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
function chooseCategory(category) { selectedCategory.value = category; currentPage.value = 1; fetchCourses(); }
function changePage(page) { currentPage.value = page; fetchCourses(); }
function resetFilters() { search.value = ''; selectedCategory.value = ''; currentPage.value = 1; fetchCourses(); }
watch(() => route.path, path => { if (path === '/catalogue') fetchCourses(); });
watch(() => route.query.search, query => { if (typeof query === 'string' && query !== search.value) { search.value = query; fetchCourses(); } });
async function handleEnroll(id) {
  if (!authStore.isAuthenticated) return router.push('/login');
  enrollingId.value = id;
  try { await api.post('/inscriptions', { cours_id: id }); router.push(`/cours/${id}/apprendre`); }
  catch { router.push(`/cours/${id}`); }
  finally { enrollingId.value = null; }
}
onMounted(() => { search.value = typeof route.query.search === 'string' ? route.query.search : ''; selectedCategory.value = typeof route.query.category === 'string' ? route.query.category : ''; fetchCourses(); });
onUnmounted(() => window.clearTimeout(searchDebounceId));
</script>

<style scoped>
.catalog-page { min-height: calc(100vh - 72px); padding: 88px 24px 100px; background: #fbfaf6; color: #25342a; }
.eyebrow { display: inline-flex; gap: 8px; align-items: center; color: #648069; font-size: 10px; font-weight: 700; letter-spacing: .13em; }.eyebrow i { width: 7px; height: 7px; background: #749578; border-radius: 50%; }
.catalog-intro { max-width: 1060px; margin: 0 auto 46px; }.catalog-intro h1 { margin: 20px 0 12px; font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; font-size: clamp(48px,6vw,68px); font-weight: 400; line-height: .98; letter-spacing: -.04em; }.catalog-intro h1 em { color: #5b7d63; font-weight: 400; }.catalog-intro p { margin: 0; color: #7e877e; font-size: 14px; }
.catalog-content { max-width: 1060px; margin: auto; }.catalog-toolbar { display: flex; align-items: center; gap: 20px; }.catalog-search { flex: 1; max-width: 600px; display: flex; align-items: center; gap: 11px; height: 48px; padding: 0 14px; border: 1px solid #e4e7df; border-radius: 6px; background: #fff; color: #718073; }.catalog-search:focus-within { border-color: #84a087; box-shadow: 0 0 0 3px rgba(87,124,94,.1); }.catalog-search > span { font-size: 24px; line-height: 1; }.catalog-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: #28382d; font: inherit; font-size: 12px; }.catalog-search input::placeholder { color: #989f97; }.result-count { color: #8a9289; font-size: 11px; }
.catalog-filters { display: flex; flex-wrap: wrap; gap: 8px; padding: 18px 0 28px; }.filter-chip { border: 1px solid #e4e6de; padding: 8px 12px; border-radius: 20px; background: transparent; color: #6f786f; cursor: pointer; font: inherit; font-size: 10px; transition: background .16s, color .16s; }.filter-chip.active { background: #e8eee6; color: #48644e; border-color: #e8eee6; }.filter-chip:hover { border-color: #9fb29e; }
.catalog-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 17px; }.premium-course-card { overflow: hidden; display: flex; flex-direction: column; min-width: 0; border: 1px solid #e5e7df; border-radius: 7px; background: #fff; transition: transform .18s ease, box-shadow .18s ease; }.premium-course-card:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(40,60,44,.07); }.course-card-link { color: inherit; text-decoration: none; }.catalog-art { height: 145px; display: grid; place-items: center; position: relative; overflow: hidden; background: #dfe8df; }.catalog-art-1 { background: #e7e1d6; }.catalog-art-2 { background: #dfe5e8; }.catalog-art-3 { background: #e8e9dd; }.catalog-art-category, .catalog-art-time { position: absolute; font-size: 8px; font-weight: 700; letter-spacing: .11em; color: #5b705e; }.catalog-art-category { left: 14px; top: 13px; }.catalog-art-time { right: 14px; bottom: 12px; }.catalog-art-symbol { font-family: Georgia, serif; font-size: 64px; color: rgba(72,101,76,.68); }.catalog-art-1 .catalog-art-symbol { color: rgba(143,107,70,.64); }.catalog-art-2 .catalog-art-symbol { color: rgba(74,101,121,.65); }.course-card-content { padding: 16px 16px 12px; }.course-card-meta { display: flex; justify-content: space-between; color: #929a91; font-size: 8px; letter-spacing: .1em; font-weight: 700; }.course-rating { color: #8b7b4d; font-size: 10px; letter-spacing: 0; }.course-card-content h2 { min-height: 42px; margin: 11px 0 5px; font-family: 'Iowan Old Style', Georgia, serif; font-size: 20px; line-height: 1.15; font-weight: 400; color: #28382e; }.course-card-content > p { min-height: 34px; margin: 0; color: #7d867d; font-size: 11px; line-height: 1.55; }.course-card-footer { display: flex; align-items: center; gap: 8px; margin-top: 15px; padding-top: 12px; border-top: 1px solid #eff0eb; }.instructor-avatar { width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: #e7eee5; color: #557259; font-size: 10px; }.instructor-name { color: #758075; font-size: 10px; }.detail-arrow { margin-left: auto; color: #5b795f; font-size: 15px; }.enroll-action { display: flex; justify-content: space-between; align-items: center; margin: auto 16px 14px; padding: 10px 0 0; border: 0; border-top: 1px solid #eff0eb; background: none; color: #526f57; cursor: pointer; font: inherit; font-size: 10px; font-weight: 700; }.enroll-action:disabled { opacity: .55; cursor: wait; }
.catalog-empty { padding: 66px 16px; text-align: center; }.empty-icon { width: 42px; height: 42px; display: grid; place-items: center; margin: 0 auto 12px; border-radius: 50%; background: #edf1e9; color: #65816a; font-size: 25px; }.catalog-empty h2 { margin: 0; font-family: 'Iowan Old Style', Georgia, serif; font-weight: 400; font-size: 26px; }.catalog-empty p { color: #828a82; font-size: 12px; }.catalog-reset { border: 0; background: none; color: #547158; cursor: pointer; font-weight: 700; font-size: 11px; }.catalog-pagination { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 38px; color: #7a837a; font-size: 11px; }.catalog-pagination button { border: 1px solid #e2e6de; background: white; padding: 9px 12px; border-radius: 5px; color: #546b57; cursor: pointer; }.catalog-pagination button:disabled { color: #a6aba4; cursor: default; }.skeleton-card { padding-bottom: 20px; border: 1px solid #e5e7df; border-radius: 7px; background: #fff; overflow: hidden; }.skeleton-img { height: 145px; background: #eceee7; animation: pulse 1.6s ease-in-out infinite alternate; }.skeleton-line { height: 11px; margin: 12px 15px 0; border-radius: 5px; background: #eceee7; animation: pulse 1.6s ease-in-out infinite alternate; }.skeleton-line.short { width: 30%; }.skeleton-line.medium { width: 65%; }@keyframes pulse { to { opacity: .52; } }
@media (max-width: 820px) { .catalog-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }.catalog-intro { padding-inline: 4px; }
@media (max-width: 560px) { .catalog-page { padding: 70px 20px 72px; }.catalog-grid { grid-template-columns: 1fr; }.catalog-toolbar { align-items: flex-start; flex-direction: column; gap: 12px; }.catalog-search { max-width: none; width: 100%; }.catalog-filters { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 16px; }.filter-chip { flex: 0 0 auto; }.result-count { font-size: 10px; } }
@media (prefers-reduced-motion: reduce) { .catalog-page *, .catalog-page *::before, .catalog-page *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; } }
</style>
