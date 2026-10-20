<template>
  <div class="formateur-page">
    <div class="formateur-inner">
      <!-- Header -->
      <header class="page-head">
        <div>
          <span class="eyebrow"><i class="focus-dot" /> INSTRUCTOR</span>
          <h1>Your course<br><em>workspace.</em></h1>
          <p class="page-lede">Publish courses, track learners, and keep your teaching moving.</p>
        </div>
        <RouterLink class="zen-btn" to="/formateur/cours/creer">
          Create a course <span aria-hidden="true">→</span>
        </RouterLink>
      </header>

      <!-- Stats -->
      <section class="stats-row">
        <div v-for="s in stats" :key="s.label" class="stat-card">
          <span class="stat-label">{{ s.label }}</span>
          <strong>{{ s.value }}</strong>
          <span class="stat-detail">{{ s.detail }}</span>
        </div>
      </section>

      <!-- Course list -->
      <h2 class="section-title">My courses</h2>

      <div v-if="loading" class="skeleton-stack">
        <div v-for="i in 3" :key="i" class="skeleton-block" style="height: 150px;" />
      </div>

      <div v-else-if="courses.length === 0" class="empty-card">
        <span class="empty-symbol" aria-hidden="true">✳</span>
        <h2>No courses yet</h2>
        <p>Your teaching space is ready. Create your first course to get started.</p>
        <RouterLink class="zen-btn" to="/formateur/cours/creer">Create your first course <span aria-hidden="true">→</span></RouterLink>
      </div>

      <div v-else class="course-list">
        <article v-for="course in courses" :key="course.id" class="course-row">
          <div class="course-art" :class="`art-${(course.id || 0) % 3}`">
            <span class="art-symbol">{{ getCategoryIcon(course.categorie) }}</span>
            <span class="status-chip" :class="`status-${course.statut}`">{{ statusLabel(course.statut) }}</span>
          </div>

          <div class="course-body">
            <div class="course-top">
              <span class="course-category">{{ course.categorie || 'GENERAL' }}</span>
              <h3>{{ course.titre }}</h3>
              <p class="course-desc">{{ course.description || 'No description yet. Add one by editing this course.' }}</p>
            </div>

            <div class="course-foot">
              <div class="course-meta">
                <span class="meta-block">
                  <span class="meta-label">LEARNERS</span>
                  <span class="meta-value">{{ course.inscriptions_count || 0 }}</span>
                </span>
                <span class="meta-block">
                  <span class="meta-label">LAST EDITED</span>
                  <span class="meta-value">{{ new Date(course.updated_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                </span>
              </div>

              <div class="course-actions">
                <v-tooltip text="Statistics" location="top">
                  <template #activator="{ props }">
                    <RouterLink v-bind="props" class="icon-btn" :to="`/formateur/cours/${course.id}/stats`" aria-label="Statistics">
                      <v-icon size="19">mdi-chart-line</v-icon>
                    </RouterLink>
                  </template>
                </v-tooltip>
                <v-tooltip text="Edit" location="top">
                  <template #activator="{ props }">
                    <RouterLink v-bind="props" class="icon-btn" :to="`/formateur/cours/${course.id}/edit`" aria-label="Edit">
                      <v-icon size="19">mdi-pencil-outline</v-icon>
                    </RouterLink>
                  </template>
                </v-tooltip>
                <v-tooltip v-if="course.statut === 'brouillon' || course.statut === 'depublie'" text="Publish" location="top">
                  <template #activator="{ props }">
                    <button v-bind="props" class="icon-btn is-publish" :disabled="actionId === course.id" aria-label="Publish" @click="publishCourse(course)">
                      <v-icon size="19">mdi-rocket-launch-outline</v-icon>
                    </button>
                  </template>
                </v-tooltip>
                <v-tooltip v-else text="Unpublish" location="top">
                  <template #activator="{ props }">
                    <button v-bind="props" class="icon-btn" :disabled="actionId === course.id" aria-label="Unpublish" @click="unpublishCourse(course)">
                      <v-icon size="19">mdi-eye-off-outline</v-icon>
                    </button>
                  </template>
                </v-tooltip>
                <v-tooltip text="Delete" location="top">
                  <template #activator="{ props }">
                    <button v-bind="props" class="icon-btn is-danger" aria-label="Delete" @click="confirmDelete(course)">
                      <v-icon size="19">mdi-trash-can-outline</v-icon>
                    </button>
                  </template>
                </v-tooltip>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Delete dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="zen-dialog pa-6" elevation="0" rounded="lg">
        <h3>Delete this course?</h3>
        <p class="dialog-lede">
          <strong>{{ deletingCourse?.titre }}</strong> and its lessons will be permanently removed. This can't be undone.
        </p>
        <div class="dialog-actions">
          <button class="zen-btn zen-btn-quiet" @click="deleteDialog = false">Cancel</button>
          <button class="zen-btn zen-btn-danger" :disabled="deleting" @click="deleteCourse">{{ deleting ? 'Deleting…' : 'Delete course' }}</button>
        </div>
      </v-card>
    </v-dialog>
  </div>
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
  { label: 'TOTAL COURSES',    value: courses.value.length,                                               detail: 'in your workspace' },
  { label: 'PUBLISHED',        value: courses.value.filter(c => c.statut === 'publie').length,            detail: 'live for learners' },
  { label: 'TOTAL LEARNERS',   value: courses.value.reduce((a, c) => a + (c.inscriptions_count || 0), 0), detail: 'across all courses' },
]);

function statusLabel(s) { return { publie: 'Published', brouillon: 'Draft', depublie: 'Unpublished' }[s] || s; }

function getCategoryIcon(cat) {
  const map = { 'Développement Web': '⌘', Backend: '▤', 'Base de Données': '◉', 'Data Science': '◌', DevOps: '↗' };
  return map[cat] || '✳';
}

async function publishCourse(course) {
  actionId.value = course.id;
  try {
    await api.post(`/cours/${course.id}/publish`);
    course.statut = 'publie';
    showToast('Course published.', 'success');
  } catch(e) {
    showErrorToast(e, 'Could not publish this course.');
  }
  finally { actionId.value = null; }
}

async function unpublishCourse(course) {
  actionId.value = course.id;
  try {
    await api.post(`/cours/${course.id}/unpublish`);
    course.statut = 'depublie';
    showToast('Course unpublished.', 'success');
  } catch(e) {
    showErrorToast(e, 'Could not unpublish this course.');
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
    showToast('Course deleted.', 'success');
  } catch(e) {
    showErrorToast(e, 'Could not delete this course.');
  }
  finally { deleting.value = false; }
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get('/mes-cours');
    courses.value = data;
  } catch(e) {
    showErrorToast(e, 'Could not load your courses.');
  }
  finally { markLoaded(); }
});
</script>

<style scoped>
.formateur-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 65px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.formateur-inner { max-width: 1060px; margin: 0 auto; }

/* ── Head ──────────────────────────────────────────────── */
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
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
  font-size: clamp(36px, 4.5vw, 52px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -.04em;
}
.page-head h1 em { color: #52755d; }
.page-lede { margin: 0; color: #686f69; font-size: 13px; }

/* ── Stats ─────────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 34px 0 44px;
}
.stat-card {
  display: grid;
  padding: 17px 19px;
  border: 1px solid #e7e8e1;
  border-radius: 8px;
  background: #fff;
}
.stat-label { color: #637064; font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.stat-card strong {
  margin-top: 9px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 30px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.stat-detail { margin-top: 4px; color: #696e68; font-size: 11px; }

/* ── Section ───────────────────────────────────────────── */
.section-title {
  margin: 0 0 18px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 26px;
  font-weight: 400;
  letter-spacing: -.02em;
}

/* ── Course rows ───────────────────────────────────────── */
.course-list { display: grid; gap: 16px; }
.course-row {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid #e5e7df;
  border-radius: 8px;
  background: #fff;
  transition: transform .18s ease, box-shadow .18s ease;
}
.course-row:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(40, 60, 44, .07); }
.course-art {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 170px;
  background: #dfe8df;
}
.art-1 { background: #e8e1d4; }
.art-2 { background: #dfe5e8; }
.art-symbol {
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 66px;
  line-height: 1;
  color: rgba(72, 101, 76, .68);
}
.art-1 .art-symbol { color: rgba(143, 107, 70, .64); }
.art-2 .art-symbol { color: rgba(74, 101, 121, .65); }
.status-chip {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.status-publie { background: #e6efe4; color: #46704f; }
.status-brouillon { background: #f1ebe0; color: #816738; }
.status-depublie { background: #f3e8e6; color: #934f47; }

.course-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px;
}
.course-category {
  color: #59715e;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.course-body h3 {
  margin: 9px 0 7px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -.02em;
}
.course-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  max-width: 560px;
  color: #686f68;
  font-size: 12px;
  line-height: 1.6;
}

.course-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #eff0ea;
}
.course-meta { display: flex; gap: 34px; }
.meta-block { display: grid; gap: 4px; }
.meta-label { color: #696e68; font-size: 9px; font-weight: 700; letter-spacing: .1em; }
.meta-value { color: #33473a; font-size: 13px; font-weight: 650; font-variant-numeric: tabular-nums; }

.course-actions { display: flex; align-items: center; gap: 8px; }
.icon-btn {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid #e4e7df;
  border-radius: 8px;
  background: #fff;
  color: #55735c;
  cursor: pointer;
  text-decoration: none;
  transition: background .16s ease, border-color .16s ease, transform .16s ease;
}
.icon-btn:hover { background: #f2f5ef; border-color: #c3cfc1; transform: translateY(-1px); }
.icon-btn.is-publish { color: #46704f; }
.icon-btn.is-danger { color: #934f47; }
.icon-btn.is-danger:hover { background: #f7efed; border-color: #e0c9c4; }
.icon-btn:disabled { opacity: .55; cursor: default; transform: none; }

/* ── Empty ─────────────────────────────────────────────── */
.empty-card {
  padding: 60px 24px;
  border: 1px solid #e5e7df;
  border-radius: 8px;
  background: #fff;
  text-align: center;
}
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
.empty-card h2 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}
.empty-card p { margin: 8px 0 20px; color: #686f68; font-size: 13px; }

/* ── Buttons ───────────────────────────────────────────── */
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
.zen-btn:hover:not(:disabled) { background: #456c54; transform: translateY(-1px); }
.zen-btn:disabled { opacity: .6; cursor: default; }
.zen-btn-quiet { background: #fff; color: #55735c; border: 1px solid #dfe5db; }
.zen-btn-quiet:hover { background: #f4f6f1; border-color: #c3cfc1; }
.zen-btn-danger { background: #a4574f; }
.zen-btn-danger:hover:not(:disabled) { background: #8f4a43; }

/* ── Dialog ────────────────────────────────────────────── */
.zen-dialog { background: #fff !important; border: 1px solid #e7e8e1; }
.zen-dialog h3 {
  margin: 0 0 8px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.dialog-lede { margin: 0 0 22px; color: #657066; font-size: 13px; line-height: 1.6; }
.dialog-lede strong { color: #33473a; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }

/* ── Skeletons ─────────────────────────────────────────── */
.skeleton-stack { display: grid; gap: 16px; }
.skeleton-block {
  border-radius: 8px;
  background: #eceee7;
  animation: pulse 1.6s ease-in-out infinite alternate;
}
@keyframes pulse { to { opacity: .52; } }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 780px) {
  .page-head { flex-direction: column; align-items: flex-start; }
  .stats-row { grid-template-columns: 1fr; }
  .course-row { grid-template-columns: 1fr; }
  .course-art { min-height: 130px; }
  .course-foot { flex-direction: column; align-items: flex-start; gap: 14px; }
  .formateur-page { padding: 50px 20px 72px; }
}
@media (prefers-reduced-motion: reduce) {
  .formateur-page *, .formateur-page *::before, .formateur-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
