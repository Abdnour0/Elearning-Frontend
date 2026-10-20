<template>
  <div class="learn-page">
    <template v-if="course">
      <div class="learn-layout" :class="{ 'with-sidebar': sidebarVisible }">
        <!-- ── Main: lesson content ──────────────────────── -->
        <div class="lesson-main">
          <header class="learn-header">
            <div class="header-left">
              <RouterLink class="quiet-btn" to="/dashboard">← Dashboard</RouterLink>
              <button class="icon-btn" :aria-label="sidebarVisible ? 'Hide curriculum' : 'Show curriculum'" @click="sidebarVisible = !sidebarVisible">
                <v-icon size="20">{{ sidebarVisible ? 'mdi-backburger' : 'mdi-menu' }}</v-icon>
              </button>
            </div>
            <span class="lesson-counter">LESSON {{ currentLessonIndex + 1 }} / {{ allLecons.length }}</span>
          </header>

          <div class="content-scroll">
            <div v-if="!activeLecon" class="empty-state">
              <span class="empty-symbol">✳</span>
              <h2>Select a lesson</h2>
              <p>Pick a module from the curriculum to start learning.</p>
            </div>

            <div v-else class="content-max">
              <!-- Lesson header -->
              <div class="lesson-head">
                <div class="lesson-tags">
                  <span class="type-chip" :class="`type-${activeLecon.typeContenu}`">{{ activeLecon.typeContenu }}</span>
                  <span class="module-label-text">MODULE {{ currentModuleIndex + 1 }}</span>
                </div>
                <h1>{{ activeLecon.titre }}</h1>
              </div>

              <!-- Player -->
              <div class="player-surface">
                <!-- Video -->
                <div v-if="activeLecon.typeContenu === 'video'" class="video-stage">
                  <div v-if="mediaLoading" class="stage-center"><v-progress-circular indeterminate color="primary" size="52" /></div>
                  <video
                    v-else-if="inlineMediaSrc"
                    ref="videoPlayer"
                    :key="activeLecon.id"
                    :src="inlineMediaSrc"
                    class="stage-media"
                    controls
                    @timeupdate="onTimeUpdate"
                    @loadedmetadata="onLoadedMetadata"
                  />
                  <div v-else class="stage-center stage-copy">
                    <v-icon size="60" class="stage-icon">mdi-video-off-outline</v-icon>
                    <p>Video stream unavailable</p>
                  </div>
                </div>

                <!-- PDF -->
                <div v-else-if="activeLecon.typeContenu === 'pdf'" class="pdf-stage">
                  <div v-if="mediaLoading" class="stage-center"><v-progress-circular indeterminate color="primary" size="52" /></div>
                  <div v-else-if="mediaError" class="stage-center stage-copy">
                    <v-icon size="56" class="stage-icon">mdi-alert-circle-outline</v-icon>
                    <p>Could not load the PDF document</p>
                    <span class="stage-note">{{ mediaError }}</span>
                    <button class="zen-btn mt-4" @click="loadAuthenticatedMedia">Try again</button>
                  </div>
                  <iframe v-else-if="inlineMediaSrc" :key="activeLecon.id" :src="inlineMediaSrc" class="stage-frame" />
                </div>

                <!-- Image -->
                <div v-else-if="activeLecon.typeContenu === 'image'" class="image-stage">
                  <v-img :src="inlineMediaSrc" max-height="600" contain />
                </div>

                <!-- Downloadable document -->
                <div v-else-if="activeLecon.typeContenu === 'td'" class="stage-center stage-copy doc-stage">
                  <v-icon size="60" class="stage-icon">mdi-file-document-outline</v-icon>
                  <h3>Associated document</h3>
                  <p>This file is available for download below.</p>
                </div>

                <!-- Rich text -->
                <div v-else class="text-stage">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="text-content-rich" v-html="sanitizedLessonContent" />
                </div>
              </div>

              <!-- Command dock -->
              <div class="command-dock">
                <div class="dock-left">
                  <button v-if="prevLecon" class="zen-btn zen-btn-quiet" @click="selectLecon(prevLecon)">← Previous</button>
                  <button
                    v-if="['pdf', 'image', 'td'].includes(activeLecon.typeContenu)"
                    class="zen-btn zen-btn-quiet"
                    @click="downloadLecon"
                  >
                    <v-icon size="17">mdi-download</v-icon> Download
                  </button>
                </div>

                <div class="dock-right">
                  <template v-if="!completedIds.has(activeLecon.id)">
                    <button class="zen-btn zen-btn-success" :disabled="completing" @click="markComplete">
                      <v-icon size="18">mdi-check-decagram</v-icon> {{ completing ? 'Saving…' : 'Mark complete' }}
                    </button>
                  </template>
                  <template v-else>
                    <span class="completed-pill"><v-icon size="17" color="success">mdi-check-circle</v-icon> Completed</span>
                    <button class="icon-btn" :disabled="uncompleting" aria-label="Redo lesson" @click="unmarkComplete">
                      <v-icon size="18">mdi-refresh</v-icon>
                    </button>
                  </template>

                  <button v-if="nextLecon" class="zen-btn" :disabled="!completedIds.has(activeLecon.id)" @click="selectLecon(nextLecon)">
                    Next <span aria-hidden="true">→</span>
                  </button>
                  <RouterLink v-else-if="course?.quizzes?.length" class="zen-btn" :to="`/quiz/${course.quizzes[0].id}`">
                    Go to quiz <span aria-hidden="true">→</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Sidebar: curriculum ───────────────────────── -->
        <aside v-if="sidebarVisible" class="sidebar-panel">
          <div class="sidebar-top">
            <span class="eyebrow"><i class="focus-dot" /> COURSE PROGRESS</span>
            <div class="progress-head">
              <h3>Curriculum</h3>
              <span class="progress-value">{{ Math.round(progression) }}%</span>
            </div>
            <div class="progress-track"><span :style="{ width: `${progression}%` }" /></div>
            <span class="progress-foot">{{ completedIds.size }} / {{ allLecons.length }} COMPLETED</span>
          </div>

          <div class="sidebar-scroll">
            <div v-for="(module, mIdx) in course.modules" :key="module.id" class="module-group">
              <div class="module-label">MODULE {{ mIdx + 1 }}</div>
              <button
                v-for="(lecon, lIdx) in module.lecons"
                :key="lecon.id"
                class="lesson-btn"
                :class="{
                  'lib-active': activeLecon?.id === lecon.id,
                  'lib-locked': isLocked(lecon),
                  'lib-completed': completedIds.has(lecon.id)
                }"
                :disabled="isLocked(lecon)"
                @click="selectLecon(lecon)"
              >
                <span class="lib-icon">
                  <v-icon v-if="completedIds.has(lecon.id)" color="success" size="17">mdi-check-circle</v-icon>
                  <v-icon v-else-if="isLocked(lecon)" size="16" class="lib-lock">mdi-lock-outline</v-icon>
                  <v-icon v-else size="16" :color="iconColor(lecon.typeContenu)">{{ typeIcon(lecon.typeContenu) }}</v-icon>
                </span>
                <span class="lib-copy">
                  <span class="lib-title">{{ lIdx + 1 }}. {{ lecon.titre }}</span>
                  <span class="lib-type">{{ lecon.typeContenu }}</span>
                </span>
              </button>
            </div>

            <div v-if="course?.quizzes?.length" class="module-group">
              <div class="module-label is-quiz">ASSESSMENTS (OPTIONAL)</div>
              <button
                v-for="quiz in course.quizzes"
                :key="quiz.id"
                class="lesson-btn"
                @click="$router.push(`/quiz/${quiz.id}`)"
              >
                <span class="lib-icon"><v-icon size="17" color="warning">mdi-clipboard-check-outline</v-icon></span>
                <span class="lib-copy">
                  <span class="lib-title">Quiz: {{ quiz.titre }}</span>
                  <span class="lib-type">Test your knowledge</span>
                </span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </template>

    <!-- Loading -->
    <div v-else class="learn-loading">
      <v-progress-circular indeterminate color="primary" size="52" />
      <p>Loading your course…</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../axios';
import DOMPurify from 'dompurify';
import { showErrorToast, showToast } from '../composables/useToast.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const course = ref(null);
const activeLecon = ref(null);
const progression = ref(0);
const completedIds = ref(new Set());
const completing = ref(false);
const uncompleting = ref(false);
const sidebarVisible = ref(true);

const mediaBlobUrl = ref(null);
const mediaLoading = ref(false);
const mediaError = ref('');
let mediaLoadGeneration = 0;

const videoPlayer = ref(null);
const currentTime = ref(0);
const duration = ref(0);

const currentLessonIndex = computed(() => {
  if (!allLecons.value.length || !activeLecon.value) return 0;
  return allLecons.value.findIndex(l => l.id === activeLecon.value.id);
});

const sanitizedLessonContent = computed(() =>
  DOMPurify.sanitize(activeLecon.value?.urlContenu || 'Content is being written…')
);

const currentModuleIndex = computed(() => {
  if (!course.value || !activeLecon.value) return 0;
  return course.value.modules.findIndex(m => m.lecons.some(l => l.id === activeLecon.value.id));
});

function onTimeUpdate(e) { currentTime.value = e.target.currentTime; }
function onLoadedMetadata(e) { duration.value = e.target.duration; }

function revokeMediaBlob() {
  if (mediaBlobUrl.value) { URL.revokeObjectURL(mediaBlobUrl.value); mediaBlobUrl.value = null; }
}

const inlineMediaSrc = computed(() => {
  const lecon = activeLecon.value;
  if (!lecon) return '';
  if (lecon.typeContenu === 'pdf' && mediaBlobUrl.value) return mediaBlobUrl.value;
  return lecon.url_contenu_formattee || lecon.urlContenu || '';
});

async function loadAuthenticatedMedia() {
  const myGen = ++mediaLoadGeneration;
  revokeMediaBlob();
  mediaError.value = '';
  const lecon = activeLecon.value;
  if (!lecon?.urlContenu || lecon.typeContenu !== 'pdf' || lecon.urlContenu.startsWith('http')) {
    mediaLoading.value = false; return;
  }

  mediaLoading.value = true;
  try {
    const res = await api.get(`/lessons/${lecon.id}/download`, { responseType: 'blob' });
    if (myGen === mediaLoadGeneration) mediaBlobUrl.value = URL.createObjectURL(res.data);
  } catch {
    if (myGen === mediaLoadGeneration) mediaError.value = 'Network error.';
  } finally {
    if (myGen === mediaLoadGeneration) mediaLoading.value = false;
  }
}

watch(() => [activeLecon.value?.id, activeLecon.value?.urlContenu], () => loadAuthenticatedMedia(), { immediate: true });
onBeforeUnmount(() => { mediaLoadGeneration++; revokeMediaBlob(); });

const allLecons = computed(() => course.value?.modules?.flatMap(m => m.lecons) || []);
const prevLecon = computed(() => allLecons.value[currentLessonIndex.value - 1] || null);
const nextLecon = computed(() => allLecons.value[currentLessonIndex.value + 1] || null);

function typeIcon(type) { return { video: 'mdi-play-circle-outline', pdf: 'mdi-file-pdf-box', image: 'mdi-image-outline', texte: 'mdi-text-box-outline' }[type] || 'mdi-file'; }
function iconColor(type) { return { video: '#4f7d84', pdf: '#8a6d3b', image: '#57745e', texte: '#5c6b7a' }[type] || '#6f7a70'; }

function isLocked(lecon) {
  if (!lecon || authStore.isAdmin || authStore.isFormateur) return false;
  if (completedIds.value.has(lecon.id)) return false;
  const idx = allLecons.value.findIndex(l => l.id === lecon.id);
  if (idx === 0) return false;
  return !completedIds.value.has(allLecons.value[idx - 1].id);
}

function selectLecon(lecon) { activeLecon.value = lecon; mediaError.value = ''; }

async function markComplete() {
  if (!activeLecon.value || completing.value) return;
  completing.value = true;
  try {
    const { data } = await api.post(`/lessons/${activeLecon.value.id}/complete`);
    if (data.completed_ids) completedIds.value = new Set(data.completed_ids.map(Number));
    progression.value = data.progression;
    if (nextLecon.value) setTimeout(() => selectLecon(nextLecon.value), 700);
  } catch (e) {
    showErrorToast(e, 'Could not mark this lesson as complete.');
  }
  finally { completing.value = false; }
}

async function unmarkComplete() {
  if (!activeLecon.value || uncompleting.value) return;
  uncompleting.value = true;
  try {
    const { data } = await api.post(`/lessons/${activeLecon.value.id}/uncomplete`);
    if (data.completed_ids) completedIds.value = new Set(data.completed_ids.map(Number));
    progression.value = data.progression;
    reloadMedia();
  } catch (e) {
    showErrorToast(e, 'Could not undo this lesson.');
  } finally {
    uncompleting.value = false;
  }
}

function reloadMedia() {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = 0;
    videoPlayer.value.play();
  } else {
    loadAuthenticatedMedia();
  }
}

async function downloadLecon() {
  const lecon = activeLecon.value;
  if (!lecon) return;
  try {
    const res = await api.get(`/lessons/${lecon.id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;

    let ext = 'file';
    if (lecon.urlContenu && lecon.urlContenu.includes('.')) {
      ext = lecon.urlContenu.split('.').pop();
    }

    a.download = `${lecon.titre}.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (e) {
    showErrorToast(e, 'Could not download this resource.');
  }
}

async function initHub() {
  try {
    const { data } = await api.get(`/cours/${route.params.id}`);
    course.value = data;
    const { data: prog } = await api.get(`/progress/${route.params.id}`);
    progression.value = prog.progression || 0;
    if (prog.completed_ids) completedIds.value = new Set(prog.completed_ids.map(Number));
    const firstUn = allLecons.value.find(l => !completedIds.value.has(l.id));
    activeLecon.value = firstUn || allLecons.value[0];
  } catch (e) {
    if (e.response?.status === 403) {
      router.push(`/cours/${route.params.id}`);
      showToast('You need to enrol to access this course.', 'warning');
    } else {
      showErrorToast(e, 'Could not load this course hub.');
    }
  }
}

onMounted(initHub);
watch(() => route.params.id, initHub);
</script>

<style scoped>
.learn-page {
  height: calc(100vh - var(--el-app-bar-h, 72px));
  background: #fbfaf6;
  color: #28382e;
}
.learn-layout { display: flex; height: 100%; }

/* ── Main ──────────────────────────────────────────────── */
.lesson-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}
.learn-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 26px;
  border-bottom: 1px solid #e7e8e1;
  background: #fbfaf6;
}
.header-left { display: flex; align-items: center; gap: 10px; }
.lesson-counter { color: #686f68; font-size: 11px; font-weight: 700; letter-spacing: .1em; }

.content-scroll { flex: 1; overflow-y: auto; padding: 34px 26px 60px; }
.content-max { max-width: 1040px; margin: 0 auto; }

/* ── Lesson header ─────────────────────────────────────── */
.lesson-head { margin-bottom: 26px; }
.lesson-tags { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.type-chip {
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .05em;
  text-transform: uppercase;
}
.type-video { background: #e6eef0; color: #487278; }
.type-pdf { background: #f1ebe0; color: #816738; }
.type-image { background: #e7eee6; color: #55725c; }
.type-texte { background: #eceef1; color: #5c6b7a; }
.type-td { background: #eceef1; color: #5c6b7a; }
.module-label-text { color: #59715e; font-size: 10px; font-weight: 700; letter-spacing: .12em; }
.lesson-head h1 {
  margin: 0;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -.035em;
}

/* ── Player ────────────────────────────────────────────── */
.player-surface {
  overflow: hidden;
  border: 1px solid #e5e7df;
  border-radius: 10px;
  background: #fff;
}
.video-stage { height: 58vh; display: flex; align-items: center; justify-content: center; background: #0b0f0c; }
.stage-media { width: 100%; height: 100%; object-fit: contain; }
.pdf-stage { height: 58vh; display: flex; align-items: center; justify-content: center; background: #f6f7f3; }
.stage-frame { width: 100%; height: 100%; border: 0; }
.image-stage { display: flex; align-items: center; justify-content: center; padding: 24px; background: #f6f7f3; }
.stage-center { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%; }
.stage-copy { gap: 8px; text-align: center; color: #686f68; }
.stage-copy h3 {
  margin: 6px 0 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
}
.stage-copy p { margin: 0; font-size: 13px; }
.stage-icon { color: #686f67; }
.stage-note { color: #6b6e69; font-size: 12px; }
.doc-stage { padding: 60px 24px; }
.text-stage { padding: 44px 48px; background: #fff; }
.text-content-rich { color: #3a4a3f; font-size: 16px; line-height: 1.8; }
.text-content-rich :deep(h1),
.text-content-rich :deep(h2),
.text-content-rich :deep(h3) { font-family: 'Iowan Old Style', Georgia, serif; font-weight: 400; letter-spacing: -.02em; color: #28382e; }
.text-content-rich :deep(a) { color: #55735c; }
.text-content-rich :deep(img) { max-width: 100%; border-radius: 8px; }

/* ── Command dock ──────────────────────────────────────── */
.command-dock {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: 22px;
  padding: 14px 16px;
  border: 1px solid #e5e7df;
  border-radius: 12px;
  background: #fff;
}
.dock-left, .dock-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.completed-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border-radius: 20px;
  background: #e8f0e7;
  color: #46704f;
  font-size: 12px;
  font-weight: 650;
}

/* ── Sidebar ───────────────────────────────────────────── */
.sidebar-panel {
  display: flex;
  flex-direction: column;
  width: 360px;
  flex: 0 0 360px;
  border-left: 1px solid #e5e7df;
  background: #faf9f5;
}
.sidebar-top { padding: 24px 22px 20px; border-bottom: 1px solid #eceee7; }
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
.progress-head { display: flex; align-items: baseline; justify-content: space-between; margin: 12px 0 12px; }
.progress-head h3 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.progress-value { color: #46704f; font-family: 'Iowan Old Style', Georgia, serif; font-size: 24px; }
.progress-track { height: 5px; overflow: hidden; border-radius: 4px; background: #eef0eb; }
.progress-track span { display: block; height: 100%; border-radius: 4px; background: #5f7e66; transition: width .4s ease; }
.progress-foot { display: block; margin-top: 10px; color: #686f68; font-size: 10px; font-weight: 700; letter-spacing: .1em; }

.sidebar-scroll { flex: 1; overflow-y: auto; padding: 20px 14px 40px; }
.module-group { margin-bottom: 26px; }
.module-label {
  padding: 0 10px 10px;
  color: #686f68;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
}
.module-label.is-quiz { color: #846936; }
.lesson-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 6px;
  padding: 11px 12px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: #5f6c62;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease;
}
.lesson-btn:hover:not(:disabled) { background: #f1f4ee; }
.lib-active { background: #eef4ec !important; border-color: #cfe0cd !important; }
.lib-locked { opacity: .5; cursor: not-allowed; }
.lib-completed { color: #46704f; }
.lib-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #f1f3ee;
}
.lib-lock { color: #6a6e6a; }
.lib-copy { display: grid; gap: 3px; min-width: 0; }
.lib-title { overflow: hidden; color: #33473a; font-size: 13px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.lib-type { color: #696e68; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }

/* ── Empty / loading ───────────────────────────────────── */
.empty-state { padding: 100px 20px; text-align: center; }
.empty-symbol {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: #edf1e9;
  color: #59715e;
  font-size: 24px;
}
.empty-state h2 {
  margin: 0;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 26px;
  font-weight: 400;
}
.empty-state p { margin: 8px 0 0; color: #686f68; font-size: 13px; }
.learn-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 18px;
}
.learn-loading p { color: #686f68; font-size: 13px; }

/* ── Buttons ───────────────────────────────────────────── */
.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
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
.zen-btn:disabled { opacity: .55; cursor: default; }
.zen-btn-quiet { background: #fff; color: #55735c; border: 1px solid #dfe5db; }
.zen-btn-quiet:hover:not(:disabled) { background: #f4f6f1; border-color: #c3cfc1; }
.zen-btn-success { background: #46704f; }
.zen-btn-success:hover:not(:disabled) { background: #3b5f43; }
.quiet-btn {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #dfe5db;
  border-radius: 7px;
  background: #fff;
  color: #55735c;
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  text-decoration: none;
  transition: background .18s ease, border-color .18s ease;
}
.quiet-btn:hover { background: #f4f6f1; border-color: #c3cfc1; }
.icon-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e4e7df;
  border-radius: 8px;
  background: #fff;
  color: #55735c;
  cursor: pointer;
  transition: background .16s ease, border-color .16s ease;
}
.icon-btn:hover:not(:disabled) { background: #f2f5ef; border-color: #c3cfc1; }
.icon-btn:disabled { opacity: .55; cursor: default; }
.mt-4 { margin-top: 14px; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 960px) {
  .learn-layout { position: relative; }
  .sidebar-panel {
    position: fixed;
    top: var(--el-app-bar-h, 72px);
    right: 0;
    bottom: 0;
    z-index: 30;
    width: min(360px, 88vw);
    box-shadow: -20px 0 50px rgba(40, 60, 44, .12);
  }
  .content-scroll { padding: 26px 18px 50px; }
  .learn-header { padding: 14px 18px; }
  .text-stage { padding: 30px 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .learn-page *, .learn-page *::before, .learn-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
