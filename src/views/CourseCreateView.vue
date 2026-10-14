<template>
  <div class="create-page">
    <div class="create-inner">
      <!-- Header -->
      <header class="page-head">
        <span class="eyebrow"><i class="focus-dot" /> COURSE BUILDER</span>
        <h1>{{ isEdit ? 'Edit your course' : 'Create a new course' }}</h1>
        <p class="page-lede">Step {{ step }} of {{ totalSteps }}</p>
      </header>

      <!-- Step bar -->
      <div class="step-bar">
        <span
          v-for="n in totalSteps" :key="n"
          class="step-dot"
          :class="{ 'step-active': n === step, 'step-done': n < step }"
        />
      </div>

      <!-- Step 1: Course info -->
      <section v-if="step === 1" class="paper-card">
        <h2 class="card-title"><v-icon color="primary" size="20">mdi-information-outline</v-icon> Course information</h2>
        <v-text-field v-model="form.titre" label="Course title *" variant="outlined" color="primary" class="mb-4 zen-input" :error-messages="errors.titre" />
        <v-select v-model="form.categorie" label="Category *" variant="outlined" color="primary" class="mb-4 zen-input" :items="categories" :error-messages="errors.categorie" />
        <v-textarea v-model="form.description" label="Description *" variant="outlined" color="primary" rows="4" class="zen-input" :error-messages="errors.description" />
        <div class="card-actions end">
          <button class="zen-btn" :disabled="!step1Valid" @click="step++">Next <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <!-- Step 2: Modules -->
      <section v-else-if="step === 2" class="paper-card">
        <div class="card-head">
          <h2 class="card-title"><v-icon color="primary" size="20">mdi-layers-outline</v-icon> Modules</h2>
          <button class="zen-btn zen-btn-quiet" @click="addModule">+ Add module</button>
        </div>

        <div v-if="form.modules.length === 0" class="empty-inline">
          <span class="empty-symbol">✳</span>
          <p>Add at least one module to structure your course.</p>
        </div>

        <div v-for="(mod, idx) in form.modules" :key="idx" class="module-row">
          <span class="index-badge">{{ idx + 1 }}</span>
          <v-text-field v-model="mod.titre" :label="`Module ${idx + 1}`" variant="outlined" density="compact" color="primary" hide-details class="flex-grow-1 zen-input" />
          <button class="icon-btn is-danger" aria-label="Delete module" @click="deleteModule(idx)"><v-icon size="18">mdi-delete-outline</v-icon></button>
        </div>

        <div class="card-actions">
          <button class="zen-btn zen-btn-quiet" @click="step--">← Previous</button>
          <button class="zen-btn" :disabled="form.modules.length === 0" @click="step++">Next <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <!-- Step 3: Lessons -->
      <section v-else-if="step === 3" class="paper-card">
        <h2 class="card-title"><v-icon color="primary" size="20">mdi-book-open-variant</v-icon> Lessons</h2>

        <details v-for="(mod, mIdx) in form.modules" :key="mIdx" class="module-block" open>
          <summary>
            <span class="module-block-title">Module {{ mIdx + 1 }}: {{ mod.titre }}</span>
            <span class="module-chevron"><v-icon size="18">mdi-chevron-down</v-icon></span>
          </summary>

          <div class="module-block-body">
            <div v-for="(lecon, lIdx) in mod.lecons" :key="lIdx" class="lesson-row">
              <div class="lesson-grid">
                <v-text-field v-model="lecon.titre" :label="`Lesson ${lIdx + 1}`" variant="outlined" density="compact" color="primary" hide-details class="zen-input" />
                <v-select v-model="lecon.typeContenu" :items="['video','pdf','image','texte','td']" label="Type" variant="outlined" density="compact" color="primary" hide-details class="zen-input" />
                <div>
                  <div v-if="lecon.typeContenu !== 'texte'" class="file-cell">
                    <v-file-input
                      label="Attach a file"
                      variant="outlined" density="compact" color="primary" hide-details
                      prepend-icon="" prepend-inner-icon="mdi-cloud-upload"
                      :loading="lecon.uploading"
                      @change="(file) => handleFileUpload(file, lecon)"
                    />
                  </div>
                  <v-text-field v-else v-model="lecon.urlContenu" label="Text content" variant="outlined" density="compact" color="primary" hide-details class="zen-input" />
                </div>
                <button class="icon-btn is-danger" aria-label="Delete lesson" @click="deleteLesson(mod, lIdx)"><v-icon size="18">mdi-delete-outline</v-icon></button>
              </div>
              <p v-if="lecon.urlContenu && lecon.typeContenu !== 'texte'" class="file-ready">
                <v-icon size="14" color="success">mdi-check-circle</v-icon> File ready: {{ lecon.urlContenu.split('/').pop() }}
              </p>
            </div>

            <button class="zen-btn zen-btn-quiet sm" @click="mod.lecons.push({ titre:'', typeContenu:'texte', ordre: (mod.lecons?.length||0)+1 })">+ Add a lesson</button>
          </div>
        </details>

        <div class="card-actions">
          <button class="zen-btn zen-btn-quiet" @click="step--">← Previous</button>
          <button class="zen-btn" @click="step++">Next <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <!-- Step 4: Quiz -->
      <section v-else-if="step === 4" class="paper-card">
        <div class="card-head">
          <h2 class="card-title"><v-icon color="primary" size="20">mdi-head-question-outline</v-icon> Quiz (optional)</h2>
          <v-switch v-model="form.hasQuiz" color="primary" hide-details class="zen-switch" />
        </div>

        <template v-if="form.hasQuiz">
          <div class="quiz-meta-grid">
            <v-text-field v-model="form.quiz.titre" label="Quiz title" variant="outlined" color="primary" class="zen-input" />
            <v-text-field v-model.number="form.quiz.dureeSecondes" label="Duration (sec)" type="number" variant="outlined" color="primary" class="zen-input" />
            <v-text-field v-model.number="form.quiz.scoreMinimal" label="Minimum score (%)" type="number" variant="outlined" color="primary" class="zen-input" />
          </div>

          <div v-for="(q, idx) in form.quiz.questions" :key="idx" class="question-block">
            <div class="question-head">
              <span class="index-badge">{{ idx + 1 }}</span>
              <span class="question-title">Question {{ idx + 1 }}</span>
              <button class="icon-btn is-danger ml-auto" aria-label="Delete question" @click="form.quiz.questions.splice(idx,1)"><v-icon size="18">mdi-delete-outline</v-icon></button>
            </div>
            <v-textarea v-model="q.contenu" label="Prompt" rows="2" variant="outlined" density="compact" color="primary" class="mb-3 zen-input" hide-details />
            <div class="question-grid">
              <v-select v-model="q.type" :items="['qcm','vrai_faux','libre']" label="Type" variant="outlined" density="compact" color="primary" hide-details class="zen-input" />
              <v-text-field v-model="q.bonneReponse" label="Correct answer" variant="outlined" density="compact" color="primary" hide-details class="zen-input" />
              <v-text-field v-model.number="q.points" label="Points" type="number" variant="outlined" density="compact" color="primary" hide-details class="zen-input" />
            </div>
            <v-text-field v-if="q.type==='qcm'" v-model="q.choixStr" class="mt-3 zen-input" label="Choices (separated by ;)" variant="outlined" density="compact" color="primary" hide-details />
          </div>

          <button class="zen-btn zen-btn-quiet sm" @click="form.quiz.questions.push({ contenu:'', type:'qcm', bonneReponse:'', choixStr:'', ordre:form.quiz.questions.length+1, points:2 })">+ Add a question</button>
        </template>

        <div class="card-actions">
          <button class="zen-btn zen-btn-quiet" @click="step--">← Previous</button>
          <button class="zen-btn" @click="step++">Next <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <!-- Step 5: Review -->
      <section v-else-if="step === 5" class="paper-card">
        <h2 class="card-title"><v-icon color="primary" size="20">mdi-check-all</v-icon> Review &amp; save</h2>

        <v-alert v-if="globalError" type="error" variant="tonal" class="mb-6" rounded="lg" closable @click:close="globalError = ''">
          {{ globalError }}
        </v-alert>

        <div class="review-row"><span>Title</span><strong>{{ form.titre }}</strong></div>
        <div class="review-row"><span>Category</span><strong>{{ form.categorie }}</strong></div>
        <div class="review-row"><span>Modules</span><strong>{{ form.modules.length }} modules / {{ totalLessons }} lessons</strong></div>
        <div class="review-row"><span>Quiz</span><strong>{{ form.hasQuiz ? form.quiz.titre + ' (' + form.quiz.questions.length + ' questions)' : 'None' }}</strong></div>

        <p class="review-note">
          The course will be created as a <strong>draft</strong>. Publish it from your dashboard when it's ready.
        </p>

        <div class="card-actions">
          <button class="zen-btn zen-btn-quiet" @click="step--">← Previous</button>
          <button class="zen-btn" :disabled="saving" @click="saveCourse">
            <v-icon size="18">mdi-check</v-icon>{{ saving ? 'Saving…' : (isEdit ? 'Update course' : 'Create course') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../axios';
import { showErrorToast } from '../composables/useToast.js';

const route  = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id && route.path.includes('edit'));

const step       = ref(1);
const totalSteps = 5;
const saving     = ref(false);
const errors     = ref({});
const globalError = ref('');
const categories = ['Développement Web', 'Backend', 'Base de Données', 'Data Science', 'DevOps', 'Design', 'Business'];

const form = ref({
  titre: '', categorie: '', description: '',
  modules: [],
  hasQuiz: false,
  quiz: { titre: 'Course quiz', dureeSecondes: 600, scoreMinimal: 60, questions: [] },
});

const step1Valid   = computed(() => form.value.titre && form.value.categorie && form.value.description);
const totalLessons = computed(() => form.value.modules.reduce((a, m) => a + (m.lecons?.length || 0), 0));

const deletedModules = ref([]);
const deletedLecons = ref([]);

function addModule() {
  form.value.modules.push({ titre: `Module ${form.value.modules.length + 1}`, lecons: [] });
}

function deleteModule(mIdx) {
  const mod = form.value.modules[mIdx];
  if (mod.id) deletedModules.value.push(mod.id);
  form.value.modules.splice(mIdx, 1);
}

function deleteLesson(mod, lIdx) {
  const l = mod.lecons[lIdx];
  if (l.id) deletedLecons.value.push(l.id);
  mod.lecons.splice(lIdx, 1);
}

function handleFileUpload(file, lecon) {
  if (file) {
    lecon.file = file;
    lecon.urlContenu = file.name;
  } else {
    lecon.file = null;
    lecon.urlContenu = '';
  }
}

async function saveCourse() {
  saving.value = true;
  globalError.value = '';
  errors.value = {};
  try {
    let courseId = route.params.id;
    if (isEdit.value) {
      await api.put(`/cours/${courseId}`, { titre: form.value.titre, description: form.value.description, categorie: form.value.categorie });
    } else {
      const { data } = await api.post('/cours', { titre: form.value.titre, description: form.value.description, categorie: form.value.categorie });
      courseId = data.id;
    }
    for (let mIdx = 0; mIdx < form.value.modules.length; mIdx++) {
      const mod = form.value.modules[mIdx];
      let mData = { id: mod.id };

      if (mod.id) {
        await api.put(`/modules/${mod.id}`, { titre: mod.titre, ordre: mIdx + 1 });
      } else {
        const { data: resData } = await api.post(`/cours/${courseId}/modules`, { titre: mod.titre, ordre: mIdx + 1 });
        mData.id = resData.id;
      }

      for (let lIdx = 0; lIdx < (mod.lecons || []).length; lIdx++) {
        const l = mod.lecons[lIdx];
        const payload = { titre: l.titre, typeContenu: l.typeContenu, ordre: lIdx + 1 };

        if (l.typeContenu === 'texte') {
          payload.urlContenu = l.urlContenu;
        }

        let lData = { id: l.id };
        if (l.id) {
          await api.put(`/lecons/${l.id}`, payload);
        } else {
          const { data: resData } = await api.post(`/modules/${mData.id}/lecons`, payload);
          lData.id = resData.id;
        }

        if (l.file && l.typeContenu !== 'texte') {
          l.uploading = true;
          try {
            const formData = new FormData();
            formData.append('fichier', l.file);
            await api.post(`/lecons/${lData.id}/upload`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } finally {
            l.uploading = false;
          }
        }
      }
    }

    for (const id of deletedLecons.value) await api.delete(`/lecons/${id}`);
    for (const id of deletedModules.value) await api.delete(`/modules/${id}`);
    if (form.value.hasQuiz && form.value.quiz.titre) {
      const { data: qData } = await api.post(`/cours/${courseId}/quizzes`, {
        titre: form.value.quiz.titre, dureeSecondes: form.value.quiz.dureeSecondes, scoreMinimal: form.value.quiz.scoreMinimal,
      });
      for (const q of form.value.quiz.questions) {
        await api.post(`/quizzes/${qData.id}/questions`, {
          contenu: q.contenu, type: q.type, bonneReponse: q.bonneReponse,
          choix: q.choixStr ? q.choixStr.split(';').map(s => s.trim()) : [],
          ordre: q.ordre, points: q.points,
        });
      }
    }
    router.push('/formateur');
  } catch(e) {
    globalError.value = e.response?.data?.message || 'Something went wrong while saving the course. Please check the information you entered.';
    if (e.response?.data?.errors) errors.value = e.response.data.errors;
  } finally { saving.value = false; }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await api.get(`/cours/${route.params.id}`);
      form.value.titre = data.titre;
      form.value.description = data.description;
      form.value.categorie = data.categorie;
      form.value.modules = data.modules?.map(m => ({
        id: m.id, titre: m.titre,
        lecons: m.lecons?.map(l => ({ id: l.id, titre: l.titre, typeContenu: l.typeContenu, urlContenu: l.urlContenu, ordre: l.ordre })) || [],
      })) || [];
    } catch(e) {
      showErrorToast(e, 'Could not load this course for editing.');
    }
  }
});
</script>

<style scoped>
.create-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 65px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.create-inner { max-width: 860px; margin: 0 auto; }

/* ── Head ──────────────────────────────────────────────── */
.page-head { margin-bottom: 26px; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #648069;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .13em;
}
.focus-dot { width: 7px; height: 7px; border-radius: 50%; background: #749578; }
.page-head h1 {
  margin: 14px 0 10px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(34px, 4.3vw, 48px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -.04em;
}
.page-lede { margin: 0; color: #7d867e; font-size: 13px; }

/* ── Step bar ──────────────────────────────────────────── */
.step-bar { display: flex; gap: 8px; margin-bottom: 30px; }
.step-dot {
  flex: 1;
  height: 5px;
  border-radius: 4px;
  background: #e7e9e2;
  transition: background .3s ease;
}
.step-active { background: #9db99f; }
.step-done { background: #6f9276; }

/* ── Cards ─────────────────────────────────────────────── */
.paper-card {
  padding: 28px;
  border: 1px solid #e5e7df;
  border-radius: 10px;
  background: #fff;
}
.card-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; }
.card-title {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 22px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.card-head .card-title { margin: 0; }
.card-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 26px; }
.card-actions.end { justify-content: flex-end; }

.zen-input :deep(.v-field) { border-radius: 8px; }
.zen-switch { flex: 0 0 auto; }

/* ── Modules ───────────────────────────────────────────── */
.empty-inline { padding: 34px 0; text-align: center; }
.empty-symbol {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin: 0 auto 10px;
  border-radius: 50%;
  background: #edf1e9;
  color: #65816a;
  font-size: 22px;
}
.empty-inline p { margin: 0; color: #828a82; font-size: 13px; }

.module-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.index-badge {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #e7eee5;
  color: #46704f;
  font-size: 12px;
  font-weight: 700;
}

/* ── Lesson modules (details) ──────────────────────────── */
.module-block {
  margin-bottom: 14px;
  border: 1px solid #e5e7df;
  border-radius: 9px;
  background: #fcfcfa;
}
.module-block > summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 15px 18px;
  cursor: pointer;
  list-style: none;
}
.module-block > summary::-webkit-details-marker { display: none; }
.module-block-title { color: #33473a; font-size: 14px; font-weight: 650; }
.module-chevron { color: #8b938b; transition: transform .2s ease; }
.module-block[open] .module-chevron { transform: rotate(180deg); }
.module-block-body { padding: 4px 18px 18px; }

.lesson-row { padding: 14px; margin-bottom: 12px; border: 1px solid #eceee7; border-radius: 8px; background: #fff; }
.lesson-grid { display: grid; grid-template-columns: 1.2fr 0.7fr 1.6fr 40px; gap: 10px; align-items: start; }
.file-ready { display: flex; align-items: center; gap: 5px; margin: 8px 0 0; color: #46704f; font-size: 11px; }

/* ── Quiz ──────────────────────────────────────────────── */
.quiz-meta-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; margin-bottom: 22px; }
.question-block { padding: 18px; margin-bottom: 14px; border: 1px solid #eceee7; border-radius: 9px; background: #fcfcfa; }
.question-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.question-title { color: #33473a; font-size: 14px; font-weight: 650; }
.question-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.ml-auto { margin-left: auto; }

/* ── Review ────────────────────────────────────────────── */
.review-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 0;
  border-bottom: 1px solid #eff0ea;
}
.review-row span { color: #7d867d; font-size: 13px; }
.review-row strong { color: #28382e; font-size: 13px; font-weight: 650; text-align: right; }
.review-note {
  margin: 22px 0 0;
  padding: 14px 16px;
  border: 1px solid #e2e8dd;
  border-radius: 8px;
  background: #f3f6f0;
  color: #55735c;
  font-size: 12px;
  line-height: 1.6;
}
.review-note strong { color: #3f5f49; }

/* ── Buttons ───────────────────────────────────────────── */
.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border: 0;
  border-radius: 7px;
  background: #537a62;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  cursor: pointer;
  transition: background .18s ease, transform .18s ease;
}
.zen-btn:hover:not(:disabled) { background: #456c54; transform: translateY(-1px); }
.zen-btn:disabled { opacity: .55; cursor: default; }
.zen-btn.sm { min-height: 40px; padding: 0 16px; font-size: 12px; }
.zen-btn-quiet { background: #fff; color: #55735c; border: 1px solid #dfe5db; }
.zen-btn-quiet:hover:not(:disabled) { background: #f4f6f1; border-color: #c3cfc1; }
.icon-btn {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid #e4e7df;
  border-radius: 8px;
  background: #fff;
  color: #55735c;
  cursor: pointer;
  transition: background .16s ease, border-color .16s ease;
}
.icon-btn:hover { background: #f2f5ef; border-color: #c3cfc1; }
.icon-btn.is-danger { color: #a4574f; }
.icon-btn.is-danger:hover { background: #f7efed; border-color: #e0c9c4; }
.flex-grow-1 { flex: 1 1 auto; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 720px) {
  .create-page { padding: 50px 18px 72px; }
  .paper-card { padding: 20px; }
  .card-actions { flex-direction: column-reverse; align-items: stretch; }
  .card-actions .zen-btn { width: 100%; }
  .lesson-grid { grid-template-columns: 1fr; }
  .quiz-meta-grid { grid-template-columns: 1fr; }
  .question-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .create-page *, .create-page *::before, .create-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
