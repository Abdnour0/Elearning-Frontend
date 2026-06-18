<template>
  <v-container class="py-8">
    <div class="create-hero-glow" />
    <v-row class="mb-6 position-relative z-1" align="center">
      <v-col>
        <h1 class="text-h4 font-weight-black text-white">{{ isEdit ? 'Modifier le cours' : 'Créer un cours' }}</h1>
        <p class="text-grey-lighten-1 mt-1">Étape {{ step }} / {{ totalSteps }}</p>
      </v-col>
    </v-row>

    <!-- Step indicators -->
    <div class="d-flex gap-2 mb-8">
      <div
        v-for="n in totalSteps" :key="n"
        class="step-dot"
        :class="{ 'step-active': n === step, 'step-done': n < step }"
      />
    </div>

    <!-- Step 1: Course Info -->
    <v-card v-if="step === 1" class="glass-card rounded-xl pa-6" theme="dark">
      <h2 class="text-h6 font-weight-bold mb-6">
        <v-icon color="primary" class="mr-2">mdi-information</v-icon>Informations du cours
      </h2>
      <v-text-field v-model="form.titre" label="Titre du cours *" variant="outlined" color="primary" class="mb-4" :error-messages="errors.titre" />
      <v-select v-model="form.categorie" label="Catégorie *" variant="outlined" color="primary" class="mb-4" :items="categories" :error-messages="errors.categorie" />
      <v-textarea v-model="form.description" label="Description *" variant="outlined" color="primary" rows="4" :error-messages="errors.description" />
      <div class="d-flex justify-end mt-4">
        <v-btn color="primary" variant="flat" class="rounded-pill" :disabled="!step1Valid" @click="step++">Suivant <v-icon end>mdi-arrow-right</v-icon></v-btn>
      </div>
    </v-card>

    <!-- Step 2: Modules -->
    <v-card v-else-if="step === 2" class="glass-card rounded-xl pa-6" theme="dark">
      <div class="d-flex align-center mb-6">
        <h2 class="text-h6 font-weight-bold"><v-icon color="primary" class="mr-2">mdi-layers</v-icon>Modules</h2>
        <v-spacer />
        <v-btn color="secondary" variant="tonal" class="rounded-pill" prepend-icon="mdi-plus" @click="addModule">Ajouter</v-btn>
      </div>
      <div v-if="form.modules.length === 0" class="text-center py-8 text-grey">
        <v-icon size="48" color="grey-darken-1">mdi-layers-plus</v-icon>
        <p class="mt-3">Ajoutez au moins un module</p>
      </div>
      <div v-for="(mod, idx) in form.modules" :key="idx" class="d-flex gap-3 mb-3 align-center">
        <v-avatar color="primary" size="28"><span class="text-caption font-weight-black">{{ idx + 1 }}</span></v-avatar>
        <v-text-field v-model="mod.titre" :label="`Module ${idx + 1}`" variant="outlined" density="compact" color="primary" hide-details class="flex-grow-1" />
        <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteModule(idx)" />
      </div>
      <div class="d-flex justify-space-between mt-6">
        <v-btn variant="outlined" class="rounded-pill" @click="step--"><v-icon start>mdi-arrow-left</v-icon>Précédent</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-pill" :disabled="form.modules.length === 0" @click="step++">Suivant <v-icon end>mdi-arrow-right</v-icon></v-btn>
      </div>
    </v-card>

    <!-- Step 3: Lessons -->
    <v-card v-else-if="step === 3" class="glass-card rounded-xl pa-6" theme="dark">
      <h2 class="text-h6 font-weight-bold mb-6"><v-icon color="primary" class="mr-2">mdi-book-open-variant</v-icon>Leçons</h2>
      <v-expansion-panels variant="popout" class="custom-panels">
        <v-expansion-panel v-for="(mod, mIdx) in form.modules" :key="mIdx" class="glass-panel mb-3 rounded-xl border-subtle" elevation="0" bg-color="transparent">
          <v-expansion-panel-title class="font-weight-bold py-4">
            Module {{ mIdx + 1 }}: {{ mod.titre }}
            <v-chip class="ml-3" size="x-small">{{ mod.lecons?.length || 0 }} leçons</v-chip>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-for="(lecon, lIdx) in mod.lecons" :key="lIdx" class="lesson-row rounded-lg pa-4 mb-4 border-subtle bg-surface-light">
              <v-row align="center" no-gutters>
                <v-col cols="12" md="4" class="pr-md-2 mb-2 mb-md-0">
                  <v-text-field v-model="lecon.titre" :label="`Leçon ${lIdx+1}`" variant="outlined" density="compact" color="primary" hide-details />
                </v-col>
                <v-col cols="12" md="2" class="px-md-2 mb-2 mb-md-0">
                  <v-select v-model="lecon.typeContenu" :items="['video','pdf','image','texte','td']" label="Type" variant="outlined" density="compact" color="primary" hide-details />
                </v-col>
                <v-col cols="12" md="5" class="px-md-2 mb-2 mb-md-0">
                  <!-- File Upload Placeholder/Indicator -->
                  <div v-if="lecon.typeContenu !== 'texte'" class="d-flex align-center gap-2">
                    <v-file-input
                      label="Joindre un fichier"
                      variant="outlined"
                      density="compact"
                      color="primary"
                      hide-details
                      prepend-icon=""
                      prepend-inner-icon="mdi-cloud-upload"
                      :loading="lecon.uploading"
                      :success="!!lecon.urlContenu"
                      @change="(e) => handleFileUpload(e, lecon)"
                    />
                  </div>
                  <v-text-field v-else v-model="lecon.urlContenu" label="Contenu texte" variant="outlined" density="compact" color="primary" hide-details />
                </v-col>
                <v-col cols="12" md="1" class="text-right">
                  <v-btn icon="mdi-delete-outline" size="small" variant="text" color="error" @click="deleteLesson(mod, lIdx)" />
                </v-col>
              </v-row>
              <div v-if="lecon.urlContenu && lecon.typeContenu !== 'texte'" class="text-caption text-success mt-1 d-flex align-center">
                <v-icon size="14" class="mr-1">mdi-check-circle</v-icon> Fichier prêt : {{ lecon.urlContenu.split('/').pop() }}
              </div>
            </div>
            <v-btn size="small" variant="tonal" color="secondary" prepend-icon="mdi-plus" @click="mod.lecons.push({ titre:'', typeContenu:'texte', ordre: (mod.lecons?.length||0)+1 })">Ajouter une leçon</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="mt-4">
        <v-btn v-if="form.modules.length > 0" size="small" variant="text" color="error" class="mb-4" prepend-icon="mdi-delete" @click="deleteModule(form.modules.length - 1)">Supprimer le dernier module</v-btn>
      </div>
      <div class="d-flex justify-space-between mt-6">
        <v-btn variant="outlined" class="rounded-pill" @click="step--"><v-icon start>mdi-arrow-left</v-icon>Précédent</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-pill" @click="step++">Suivant <v-icon end>mdi-arrow-right</v-icon></v-btn>
      </div>
    </v-card>

    <!-- Step 4: Quiz -->
    <v-card v-else-if="step === 4" class="glass-card rounded-xl pa-6" theme="dark">
      <div class="d-flex align-center mb-4">
        <h2 class="text-h6 font-weight-bold"><v-icon color="primary" class="mr-2">mdi-head-question</v-icon>Quiz (optionnel)</h2>
        <v-switch v-model="form.hasQuiz" color="primary" class="ml-4" hide-details />
      </div>
      <template v-if="form.hasQuiz">
        <v-row>
          <v-col cols="12" md="6"><v-text-field v-model="form.quiz.titre" label="Titre du quiz" variant="outlined" color="primary" /></v-col>
          <v-col cols="6" md="3"><v-text-field v-model.number="form.quiz.dureeSecondes" label="Durée (sec)" type="number" variant="outlined" color="primary" /></v-col>
          <v-col cols="6" md="3"><v-text-field v-model.number="form.quiz.scoreMinimal" label="Score min (%)" type="number" variant="outlined" color="primary" /></v-col>
        </v-row>
        <div v-for="(q, idx) in form.quiz.questions" :key="idx" class="question-block rounded-lg pa-4 mb-4">
          <div class="d-flex align-center gap-2 mb-3">
            <v-avatar color="primary" size="24"><span class="text-caption">{{ idx+1 }}</span></v-avatar>
            <span class="font-weight-bold text-white">Question {{ idx+1 }}</span>
            <v-spacer />
            <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click="form.quiz.questions.splice(idx,1)" />
          </div>
          <v-textarea v-model="q.contenu" label="Énoncé" rows="2" variant="outlined" density="compact" color="primary" class="mb-3" hide-details />
          <v-row>
            <v-col cols="4"><v-select v-model="q.type" :items="['qcm','vrai_faux','libre']" label="Type" variant="outlined" density="compact" color="primary" hide-details /></v-col>
            <v-col cols="4"><v-text-field v-model="q.bonneReponse" label="Bonne réponse" variant="outlined" density="compact" color="primary" hide-details /></v-col>
            <v-col cols="4"><v-text-field v-model.number="q.points" label="Points" type="number" variant="outlined" density="compact" color="primary" hide-details /></v-col>
          </v-row>
          <v-text-field v-if="q.type==='qcm'" v-model="q.choixStr" class="mt-3" label="Choix (séparés par ;)" variant="outlined" density="compact" color="primary" hide-details />
        </div>
        <v-btn variant="tonal" color="primary" prepend-icon="mdi-plus" @click="form.quiz.questions.push({ contenu:'', type:'qcm', bonneReponse:'', choixStr:'', ordre:form.quiz.questions.length+1, points:2 })">Ajouter une question</v-btn>
      </template>
      <div class="d-flex justify-space-between mt-6">
        <v-btn variant="outlined" class="rounded-pill" @click="step--"><v-icon start>mdi-arrow-left</v-icon>Précédent</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-pill" @click="step++">Suivant <v-icon end>mdi-arrow-right</v-icon></v-btn>
      </div>
    </v-card>

    <!-- Step 5: Review & Save -->
    <v-card v-else-if="step === 5" class="glass-card rounded-xl pa-6" theme="dark">
      <h2 class="text-h6 font-weight-bold mb-6"><v-icon color="primary" class="mr-2">mdi-check-all</v-icon>Récapitulatif</h2>
      <v-alert v-if="globalError" type="error" variant="tonal" class="mb-6" rounded="lg" closable @click:close="globalError = ''">
        {{ globalError }}
      </v-alert>
      <div class="review-row"><span class="text-grey-lighten-1">Titre</span><span class="font-weight-bold text-white">{{ form.titre }}</span></div>
      <div class="review-row"><span class="text-grey-lighten-1">Catégorie</span><span class="font-weight-bold text-white">{{ form.categorie }}</span></div>
      <div class="review-row"><span class="text-grey-lighten-1">Modules</span><span class="font-weight-bold text-white">{{ form.modules.length }} modules / {{ totalLessons }} leçons</span></div>
      <div class="review-row mb-6"><span class="text-grey-lighten-1">Quiz</span><span class="font-weight-bold text-white">{{ form.hasQuiz ? form.quiz.titre + ' (' + form.quiz.questions.length + ' questions)' : 'Aucun' }}</span></div>
      <v-alert type="info" variant="tonal" class="mb-6" rounded="lg">Le cours sera créé en <strong>brouillon</strong>. Publiez-le depuis votre tableau de bord quand il est prêt.</v-alert>
      <div class="d-flex justify-space-between">
        <v-btn variant="outlined" class="rounded-pill" @click="step--"><v-icon start>mdi-arrow-left</v-icon>Précédent</v-btn>
        <v-btn color="primary" variant="flat" class="rounded-pill font-weight-bold btn-glow" :loading="saving" @click="saveCourse">
          <v-icon start>mdi-check</v-icon>{{ isEdit ? 'Mettre à jour' : 'Créer le cours' }}
        </v-btn>
      </div>
    </v-card>
  </v-container>
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
  quiz: { titre: 'Quiz du cours', dureeSecondes: 600, scoreMinimal: 60, questions: [] },
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

function handleFileUpload(e, lecon) {
  const file = e.target.files?.[0];
  if (file) {
    lecon.file = file;
    lecon.urlContenu = file.name; // Temporary display name
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

        // If a file was selected, upload it immediately
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
    
    // Process deletions
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
    globalError.value = e.response?.data?.message || "Une erreur est survenue lors de l'enregistrement du cours. Veuillez vérifier les informations saisies.";
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
      showErrorToast(e, 'Impossible de charger ce cours pour modification.');
    }
  }
});
</script>

<style scoped>
/* Hero Header */
.create-hero-glow {
  position: absolute;
  top: -100px; left: 50%;
  transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}
.z-1 { position: relative; z-index: 1; }

/* Timeline Indicators */
.step-dot {
  flex-grow: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.step-active {
  background: rgba(99,102,241,0.2);
  box-shadow: 0 0 10px rgba(99,102,241,0.3);
}
.step-active::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  animation: pulse-width 2s infinite alternate ease-in-out;
}
.step-done {
  background: linear-gradient(90deg, #10b981, #34d399);
  box-shadow: 0 0 10px rgba(16,185,129,0.3);
}

@keyframes pulse-width {
  0% { width: 40%; }
  100% { width: 100%; }
}

/* Form Elements */
.question-block {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99,102,241,0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.question-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.3);
}

.review-row {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
  transition: background 0.3s ease;
}
.review-row:hover {
  background: rgba(255,255,255,0.02);
  border-radius: 8px;
  padding: 16px 8px;
  margin: 0 -8px;
}

/* Custom Vuetify Overrides */
:deep(.v-field) {
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
:deep(.v-field--focused) {
  border-color: rgba(99,102,241,0.5);
  box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
}

/* ── Custom Expansion Panels ────────────────── */
.custom-panels { background: transparent !important; }
.glass-panel {
  background: rgba(17, 24, 39, 0.4) !important;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}
.glass-panel:hover {
  border-color: rgba(59, 130, 246, 0.3) !important;
}
.glass-panel:deep(.v-expansion-panel-title--active) {
  background: rgba(59, 130, 246, 0.05);
}
</style>
