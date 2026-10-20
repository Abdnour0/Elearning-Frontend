<template>
  <div class="course-detail-page">
    <!-- Loaded -->
    <div v-if="course" class="detail-inner">
      <div class="detail-head">
        <RouterLink class="back-link" to="/catalogue">← Back to catalogue</RouterLink>
        <span class="eyebrow"><i class="focus-dot" /> {{ course.categorie || 'COURSE' }}</span>
        <h1>{{ course.titre }}</h1>
        <div class="detail-meta">
          <span class="instructor-avatar">{{ (course.formateur?.name || 'E').slice(0, 1) }}</span>
          <span>{{ course.formateur?.name || 'Expert instructor' }}</span>
          <span class="meta-dot">·</span>
          <span>{{ totalLessons }} lessons</span>
          <span class="meta-dot">·</span>
          <span>{{ course.modules?.length || 0 }} modules</span>
        </div>
      </div>

      <div class="detail-grid">
        <!-- Main column -->
        <div class="detail-main">
          <section class="paper-card about-card">
            <h2>About this course</h2>
            <p>{{ course.description || 'Build practical skills you can put to work right away.' }}</p>
          </section>

          <section class="curriculum">
            <h2>Course content</h2>
            <div class="module-list">
              <details v-for="module in course.modules" :key="module.id" class="module-item" open>
                <summary>
                  <span class="module-index">{{ String(module.ordre).padStart(2, '0') }}</span>
                  <span class="module-title">{{ module.titre }}</span>
                  <span class="module-count">{{ module.lecons?.length || 0 }} lessons</span>
                  <span class="module-plus">+</span>
                </summary>
                <ul class="lesson-list">
                  <li v-for="lecon in module.lecons" :key="lecon.id">
                    <span class="lesson-icon" :class="`icon-${lecon.typeContenu}`">
                      <v-icon size="16">{{ typeIcon(lecon.typeContenu) }}</v-icon>
                    </span>
                    <span class="lesson-name">{{ lecon.titre }}</span>
                    <span class="lesson-type">{{ lecon.typeContenu }}</span>
                  </li>
                </ul>
              </details>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <aside class="detail-side">
          <div class="sticky-sidebar">
            <div class="paper-card enroll-card">
              <div class="course-art" :class="`art-${(course.id || 0) % 3}`">
                <span class="art-symbol" aria-hidden="true">{{ ['◒', '⌘', '↗'][(course.id || 0) % 3] }}</span>
                <span class="art-note">{{ totalLessons }} lessons</span>
              </div>

              <div class="enroll-body">
                <template v-if="progression !== null">
                  <div class="progress-top">
                    <span class="preview-label">YOUR PROGRESS</span>
                    <span class="progress-value">{{ Math.round(progression) }}%</span>
                  </div>
                  <div class="progress-track"><span :style="{ width: `${Math.min(100, Math.max(0, progression))}%` }" /></div>
                  <RouterLink class="zen-btn block-btn" :to="`/cours/${course.id}/apprendre`">
                    Continue learning <span aria-hidden="true">→</span>
                  </RouterLink>
                </template>
                <template v-else>
                  <p class="enroll-note">Enrol to track your progress and pick up where you left off.</p>
                  <button class="zen-btn block-btn" :disabled="enrolling" @click="enroll">
                    {{ enrolling ? 'Enrolling…' : 'Enrol in this course' }} <span aria-hidden="true">→</span>
                  </button>
                </template>
              </div>
            </div>

            <div v-if="course.quizzes?.length" class="paper-card quiz-card">
              <h3>Quizzes</h3>
              <ul class="quiz-list">
                <li v-for="quiz in course.quizzes" :key="quiz.id">
                  <div class="quiz-copy">
                    <span class="quiz-title">{{ quiz.titre }}</span>
                    <span class="quiz-time">{{ quiz.dureeSecondes ? Math.floor(quiz.dureeSecondes / 60) + ' min' : 'No time limit' }}</span>
                  </div>
                  <RouterLink v-if="progression !== null" class="quiz-action" :to="`/quiz/${quiz.id}`">Start <span aria-hidden="true">→</span></RouterLink>
                  <span v-else class="quiz-locked">Enrol first</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="isInitial || isLoading" class="detail-inner">
      <div class="detail-grid">
        <div class="detail-main">
          <div class="skeleton-line short" />
          <div class="skeleton-line title" />
          <div class="skeleton-block" style="height: 130px;" />
          <div class="skeleton-block" style="height: 220px;" />
        </div>
        <div class="detail-side">
          <div class="skeleton-block" style="height: 320px;" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="detail-inner detail-error">
      <span class="empty-symbol" aria-hidden="true">✳</span>
      <h1>We couldn't load this course</h1>
      <p>Check that it is still available, then try again.</p>
      <RouterLink class="zen-btn" to="/catalogue">Back to catalogue <span aria-hidden="true">→</span></RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { isInitial, isLoading, markLoading, markLoaded } = useViewLoadState();

const course = ref(null);
const progression = ref(null);
const enrolling = ref(false);

const totalLessons = computed(() => course.value?.modules?.reduce((acc, m) => acc + (m.lecons?.length || 0), 0) || 0);

function typeIcon(type) {
  return { video: 'mdi-play', pdf: 'mdi-file-pdf-box', image: 'mdi-image', texte: 'mdi-text' }[type] || 'mdi-file';
}

async function enroll() {
  if (!authStore.isAuthenticated) return router.push('/login');
  enrolling.value = true;
  try {
    await api.post('/inscriptions', { cours_id: course.value.id });
    progression.value = 0;
    router.push(`/cours/${course.value.id}/apprendre`);
  } catch { /* already enrolled */ progression.value = 0; }
  finally { enrolling.value = false; }
}

onMounted(async () => {
  markLoading();
  try {
    const { data } = await api.get(`/cours/${route.params.id}`);
    course.value = data;

    if (authStore.isAuthenticated) {
      try {
        const { data: prog } = await api.get(`/progress/${route.params.id}`);
        if (prog.inscrit) progression.value = prog.progression;
      } catch { /* not enrolled */ }
    }
  } catch (e) {
    showErrorToast(e, 'Could not load this course.');
  } finally {
    markLoaded();
  }
});
</script>

<style scoped>
.course-detail-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 72px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.detail-inner { max-width: 1060px; margin: 0 auto; }

/* ── Head ──────────────────────────────────────────────── */
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
.detail-head h1 {
  margin: 16px 0 14px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(38px, 5vw, 60px);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -.04em;
}
.detail-meta {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #686f68;
  font-size: 12px;
}
.instructor-avatar {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e7eee5;
  color: #557258;
  font-size: 11px;
  font-weight: 700;
}
.meta-dot { color: #6b6e6a; }

/* ── Layout ────────────────────────────────────────────── */
.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr);
  gap: 40px;
  margin-top: 46px;
  align-items: start;
}
.paper-card {
  padding: 26px;
  border: 1px solid #e5e7df;
  border-radius: 8px;
  background: #fff;
}

/* ── About ─────────────────────────────────────────────── */
.about-card h2, .curriculum h2 {
  margin: 0 0 14px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.about-card p { margin: 0; color: #657066; font-size: 14px; line-height: 1.75; }
.curriculum { margin-top: 40px; }

/* ── Curriculum ────────────────────────────────────────── */
.module-list { border-top: 1px solid #e8e8df; }
.module-item { border-bottom: 1px solid #e8e8df; }
.module-item summary {
  display: grid;
  grid-template-columns: 34px 1fr auto 22px;
  align-items: center;
  gap: 12px;
  padding: 18px 4px;
  cursor: pointer;
  list-style: none;
}
.module-item summary::-webkit-details-marker { display: none; }
.module-index { color: #6b6e69; font-size: 11px; }
.module-title { color: #28382e; font-size: 15px; font-weight: 650; }
.module-count { color: #686f68; font-size: 11px; }
.module-plus { color: #5b735f; font-size: 18px; transition: transform .18s ease; }
.module-item[open] .module-plus { transform: rotate(45deg); }
.lesson-list { margin: 0; padding: 0 4px 12px; list-style: none; }
.lesson-list li {
  display: grid;
  grid-template-columns: 30px 1fr auto;
  align-items: center;
  gap: 11px;
  padding: 10px 0 10px 22px;
}
.lesson-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #eef1ea;
  color: #57715d;
}
.icon-video { background: #e6eef0; color: #487278; }
.icon-pdf { background: #f1ebe0; color: #816738; }
.icon-image { background: #e7eee6; color: #4d6753; }
.icon-texte { background: #eceef1; color: #5c6b7a; }
.lesson-name { color: #3a4a3f; font-size: 13px; }
.lesson-type { color: #696e68; font-size: 10px; text-transform: capitalize; }

/* ── Sidebar ───────────────────────────────────────────── */
.sticky-sidebar { position: sticky; top: 96px; display: grid; gap: 16px; }
.enroll-card { padding: 0; overflow: hidden; }
.course-art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  background: #dfe8df;
}
.art-1 { background: #e8e1d4; }
.art-2 { background: #dfe5e8; }
.art-symbol {
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 74px;
  line-height: 1;
  color: rgba(72, 101, 76, .68);
}
.art-1 .art-symbol { color: rgba(143, 107, 70, .64); }
.art-2 .art-symbol { color: rgba(74, 101, 121, .65); }
.art-note {
  position: absolute;
  right: 15px;
  bottom: 13px;
  color: #5b6f5e;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
}
.enroll-body { padding: 20px; }
.enroll-note { margin: 0 0 14px; color: #686f68; font-size: 12px; line-height: 1.6; }
.progress-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.preview-label { color: #696e68; font-size: 9px; font-weight: 700; letter-spacing: .12em; }
.progress-value { color: #51755b; font-size: 14px; font-weight: 700; }
.progress-track {
  height: 5px;
  overflow: hidden;
  border-radius: 4px;
  background: #eef0eb;
}
.progress-track span { display: block; height: 100%; border-radius: 4px; background: #5f7e66; }

.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 48px;
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
.block-btn { width: 100%; margin-top: 16px; }

.quiz-card h3 {
  margin: 0 0 4px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
}
.quiz-list { margin: 0; padding: 0; list-style: none; }
.quiz-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 0;
  border-top: 1px solid #eff0ea;
}
.quiz-list li:first-child { border-top: 0; }
.quiz-copy { display: grid; gap: 3px; }
.quiz-title { color: #3a4a3f; font-size: 13px; font-weight: 600; }
.quiz-time { color: #696e68; font-size: 11px; }
.quiz-action { color: #55735c; font-size: 12px; font-weight: 700; text-decoration: none; }
.quiz-action:hover { color: #3f5f49; }
.quiz-locked { color: #6b6e69; font-size: 11px; }

/* ── Skeletons & error ─────────────────────────────────── */
.skeleton-block, .skeleton-line {
  border-radius: 6px;
  background: #eceee7;
  animation: pulse 1.6s ease-in-out infinite alternate;
}
.skeleton-block { margin-top: 16px; }
.skeleton-line { height: 12px; margin-top: 12px; }
.skeleton-line.short { width: 26%; }
.skeleton-line.title { width: 62%; height: 34px; }
@keyframes pulse { to { opacity: .52; } }

.detail-error {
  padding: 70px 16px;
  text-align: center;
}
.detail-error .empty-symbol {
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
.detail-error h1 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 26px;
  font-weight: 400;
}
.detail-error p { margin: 8px 0 20px; color: #686f68; font-size: 13px; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 880px) {
  .detail-grid { grid-template-columns: 1fr; gap: 28px; }
  .sticky-sidebar { position: static; }
}
@media (max-width: 560px) {
  .course-detail-page { padding: 56px 20px 72px; }
  .module-item summary { grid-template-columns: 28px 1fr 18px; }
  .module-count { display: none; }
  .lesson-list li { padding-left: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .course-detail-page *, .course-detail-page *::before, .course-detail-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
