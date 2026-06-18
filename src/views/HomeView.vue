<template>
  <div class="home-wrapper">
    <!-- ── Premium Hero Section ──────────────────────────────── -->
    <section class="hero-section">
      <!-- Animated ambient background -->
      <div class="hero-ambient-bg">
        <div class="orb orb-1" />
        <div class="orb orb-2" />
        <div class="orb orb-3" />
      </div>
      <div class="hero-grid-overlay" />

      <v-container class="h-100 position-relative z-1">
        <v-row class="h-100 align-center">
<!-- Left: Content -->
          <v-col cols="12" md="6" class="hero-content pr-md-10 text-center text-md-left">
            <v-chip 
              v-motion 
              color="primary" 
              variant="flat" 
              class="mb-6 font-weight-bold premium-hero-chip px-5 py-2 text-uppercase tracking-widest"
              prepend-icon="mdi-star-four-points"
              size="small"
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
            >
              Excellence en E-Learning
            </v-chip>
            
            <h1 v-motion class="hero-title" :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 300 } }">
              Propulsez votre <br class="d-none d-md-block">
              carrière vers <br class="d-none d-md-block">
              <span class="text-gradient-shimmer">le futur.</span>
            </h1>
            
            <p v-motion class="hero-subtitle mt-6 mb-10 mx-auto mx-md-0" :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { duration: 1000, delay: 600 } }">
              Une plateforme conçue pour l'élite. Maîtrisez les technologies de pointe grâce à nos parcours immersifs et rejoignez le top 1% de l'industrie.
            </p>
            
            <div 
              v-motion
              class="d-flex gap-4 flex-wrap justify-center justify-md-start"
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 800 } }"
            >
              <v-btn
                color="primary" size="x-large" to="/catalogue"
                class="rounded-pill font-weight-black hero-btn-primary px-12"
                height="64"
                append-icon="mdi-arrow-right"
              >
                Explorer le catalogue
              </v-btn>
            </div>
            
            <!-- Quick Stats -->
            <div v-motion class="d-flex align-center gap-8 mt-12 justify-center justify-md-start" :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { duration: 1000, delay: 1200 } }">
              <div>
                <div class="text-h4 font-weight-black text-white">4.9/5</div>
                <div class="d-flex align-center gap-1 mt-1">
                  <v-rating :model-value="5" color="warning" size="small" density="compact" readonly />
                  <span class="text-caption text-grey ml-1">Avis certifiés</span>
                </div>
              </div>
              <div class="divider-vertical" />
              <div>
                <div class="text-h4 font-weight-black text-white">+10k</div>
                <div class="text-caption text-grey mt-1">Apprenants actifs</div>
              </div>
            </div>
          </v-col>
          
          <!-- Right: Visual Composition -->
          <v-col cols="12" md="6" class="d-none d-md-block position-relative h-100">
             <div v-motion class="hero-composition" :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 1200, delay: 400 } }">
<!-- Main Glass Card -->
                <div class="glass-card-main">
                  <div class="glass-header d-flex gap-2 pa-4 border-b-subtle">
                    <div class="mac-dot red" /><div class="mac-dot yellow" /><div class="mac-dot green" />
                  </div>
                  <div class="pa-6">
                    <div class="d-flex align-center justify-space-between mb-6">
                      <div>
                        <div class="text-h6 font-weight-bold text-white mb-1">Architecture Avancée</div>
                        <div class="text-caption text-primary font-weight-bold">Module en cours</div>
                      </div>
                      <v-progress-circular model-value="75" color="primary" size="48" width="4" class="font-weight-bold">75%</v-progress-circular>
                    </div>
                    <!-- Skeleton code blocks -->
                    <div class="skeleton-block code-line mb-3" style="width: 80%;" />
                    <div class="skeleton-block code-line mb-3 ml-6" style="width: 60%;" />
                    <div class="skeleton-block code-line mb-3 ml-6" style="width: 70%;" />
                    <div class="skeleton-block code-line mb-6" style="width: 40%;" />
                    
                    <v-btn block color="primary" variant="flat" class="rounded-lg text-none font-weight-bold" height="44">Reprendre le cours</v-btn>
                  </div>
                </div>

                <!-- Floating Element 1 -->
                <div v-motion class="float-card card-top-right" :initial="{ y: 0 }" :enter="{ y: 20, transition: { repeat: Infinity, repeatType: 'mirror', duration: 4000, ease: 'easeInOut' } }">
                  <div class="d-flex align-center gap-3">
                    <div class="icon-sq bg-success-light">
                      <v-icon color="success">mdi-check-decagram</v-icon>
                    </div>
                    <div>
                      <div class="text-caption text-grey">Certification</div>
                      <div class="text-body-2 font-weight-bold text-white">Obtenue avec succès</div>
                    </div>
                  </div>
                </div>

                <!-- Floating Element 2 -->
                <div v-motion class="float-card card-bottom-left" :initial="{ y: 0 }" :enter="{ y: -15, transition: { repeat: Infinity, repeatType: 'mirror', duration: 3500, delay: 500, ease: 'easeInOut' } }">
                  <div class="d-flex align-center gap-4">
                    <v-avatar size="40" image="https://i.pravatar.cc/100?img=3" />
                    <div>
                      <div class="text-body-2 font-weight-bold text-white">"La meilleure plateforme."</div>
                      <div class="text-caption text-primary">— Sarah, Développeuse Senior</div>
                    </div>
                  </div>
                </div>
</div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- ── Enterprise Logo Cloud ──────────────────────────────── -->
    <section class="enterprise-section py-12 border-y-subtle overflow-hidden">
      <v-container>
        <p class="text-center text-caption text-primary mb-10 text-uppercase tracking-widest font-weight-bold">Ils nous font confiance pour leur formation entreprise</p>
      </v-container>
      
      <div class="marquee-wrapper">
        <div class="marquee-content">
          <!-- Duplicated for seamless loop -->
          <template v-for="i in 2" :key="i">
            <div v-for="brand in ['TECHCORP', 'GLOBALDATA', 'SECURENET', 'CLOUDWISE', 'DIGITALHUB', 'INNOVISION', 'NEXUSTECH']" :key="`${i}-${brand}`" class="brand-item d-flex align-center gap-2 px-8 mx-4">
              <v-icon size="28" color="primary" class="brand-icon">mdi-hexagon-multiple-outline</v-icon>
              <span class="text-h5 font-weight-black tracking-tighter brand-text">{{ brand }}</span>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Solutions / Categories Section -->
    <section class="solutions-section py-16">
      <v-container>
        <div v-motion class="text-center mb-16" :initial="{ opacity: 0, y: 30 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 800 } }">
          <v-chip color="secondary" variant="outlined" size="small" class="mb-4 text-uppercase font-weight-bold">Nos Solutions</v-chip>
          <h2 class="text-h3 font-weight-black text-white">Domaines d'expertise</h2>
          <p class="text-body-1 mt-4 text-grey-lighten-1 mx-auto" style="max-width: 600px;">
            Des parcours de formation conçus pour répondre aux défis technologiques et métiers de demain.
          </p>
        </div>

        <v-row class="align-stretch">
          <v-col v-for="(sol, index) in solutions" :key="sol.title" cols="12" sm="6" md="4" class="d-flex">
            <div 
              v-motion
              class="solution-card h-100 pa-8 rounded-xl d-flex flex-column"
              :initial="{ opacity: 0, y: 40 }"
              :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 200 } }"
            >
              <div class="icon-box mb-6" :style="{ background: sol.color }">
                <v-icon size="36" color="white">{{ sol.icon }}</v-icon>
              </div>
              <h3 class="text-h5 font-weight-bold mb-3 text-white">{{ sol.title }}</h3>
              <p class="text-grey-lighten-1 mb-0 line-height-relaxed flex-grow-1">{{ sol.desc }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Featured Courses Showcase -->
    <v-container class="py-16 courses-section">
      <div v-motion class="d-flex justify-space-between align-end mb-12" :initial="{ opacity: 0 }" :visibleOnce="{ opacity: 1, transition: { duration: 800 } }">
        <div>
          <h2 class="text-h3 font-weight-black text-white">Cours à la une</h2>
          <p class="text-body-1 mt-2 text-grey-lighten-1">Formations intensives dispensées par des experts du secteur.</p>
        </div>
        <v-btn variant="text" color="primary" to="/catalogue" class="d-none d-sm-flex font-weight-bold" append-icon="mdi-chevron-right">
          Voir tout
        </v-btn>
      </div>

      <v-row>
        <v-col v-for="(course, index) in featuredCourses" :key="course.id" cols="12" sm="6" md="4">
          <v-card 
            v-motion 
            class="course-card surface-card h-100 d-flex flex-column rounded-xl" 
            theme="dark"
            :initial="{ opacity: 0, scale: 0.95 }"
            :visible-once="{ opacity: 1, scale: 1, transition: { duration: 700, delay: index * 150 } }"
            @click="goToCourse(course.id)"
          >
            <div class="course-img-wrap overflow-hidden">
              <div class="course-placeholder transition-transform" :style="{ background: course.gradient }">
                <v-icon size="80" color="white" class="course-icon">{{ course.icon }}</v-icon>
              </div>
              <div class="course-overlay" />
              <v-chip class="course-badge glass-chip" :color="categoryColor(course.categorie)" size="small">
                {{ course.categorie }}
              </v-chip>
            </div>
            
            <div class="pa-6 d-flex flex-column flex-grow-1">
              <div class="d-flex align-center mb-3">
                <v-rating :model-value="4.8" color="warning" density="compact" size="small" readonly half-increments />
                <span class="text-caption text-grey ml-2">(124 avis)</span>
              </div>
              
              <h3 class="font-weight-bold text-h6 mb-2 line-clamp-2">{{ course.titre }}</h3>
              
              <v-card-text class="text-grey-lighten-1 text-body-2 pa-0 flex-grow-1 line-clamp-3">
                {{ course.description || 'Maîtrisez les compétences indispensables de ce domaine avec notre formation complète. Accédez à des ressources exclusives et un suivi personnalisé.' }}
              </v-card-text>
              
              <v-divider class="my-4 border-opacity-25" />
              
              <div class="d-flex align-center justify-space-between mt-auto">
                <div class="d-flex align-center">
                  <v-avatar size="32" color="surface-variant" class="mr-3 border-subtle">
                    <v-icon size="16">mdi-account-tie</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-caption font-weight-bold">{{ course.formateur?.name || 'Expert Formateur' }}</div>
                    <div class="text-caption text-grey" style="font-size: 0.7rem;">Senior Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-btn variant="outlined" color="primary" block to="/catalogue" class="d-sm-none mt-6 font-weight-bold rounded-lg">
        Voir tout le catalogue
      </v-btn>
    </v-container>

    <!-- How it works (Interactive Steps) -->
    <section class="steps-section py-16">
      <v-container>
        <v-row class="align-center">
          <v-col v-motion cols="12" md="6" :initial="{ opacity: 0, x: -40 }" :visible-once="{ opacity: 1, x: 0, transition: { duration: 800 } }">
            <h2 class="text-h3 font-weight-black text-white mb-6">Une méthodologie éprouvée</h2>
            <p class="text-body-1 text-grey-lighten-1 mb-8">Notre approche pédagogique combine théorie pointue et pratique intensive pour garantir l'acquisition réelle de compétences.</p>
            
            <div class="timeline-container">
              <div v-for="(step, i) in steps" :key="i" class="timeline-item d-flex mb-8">
                <div class="timeline-indicator">
                  <div class="indicator-circle">{{ i + 1 }}</div>
                  <div v-if="i < steps.length - 1" class="indicator-line" />
                </div>
                <div class="timeline-content ml-6">
                  <h4 class="text-h6 font-weight-bold text-white mb-2">{{ step.title }}</h4>
                  <p class="text-grey-lighten-1 text-body-2">{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-center position-relative">
            <div class="glow-bg absolute-center w-100 h-100 opacity-20" />
            <v-img v-motion src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" cover class="rounded-xl elevation-24 step-img mx-auto" max-width="500"
              height="600" :initial="{ opacity: 0, scale: 0.9 }" :visible-once="{ opacity: 1, scale: 1, transition: { duration: 1000 } }">
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height bg-surface-variant">
                  <v-progress-circular indeterminate color="primary" />
                </div>
              </template>
            </v-img>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="cta-section py-24 position-relative overflow-hidden text-center">
      <!-- Ambient Visuals -->
      <div class="cta-visuals">
        <div class="cta-orb cta-orb-1" />
        <div class="cta-orb cta-orb-2" />
        <div class="cta-orb cta-orb-3" />
        <div class="cta-grid" />
      </div>

      <v-container class="position-relative z-1">
        <div v-motion class="cta-content-inner mx-auto" style="max-width: 900px;" :initial="{ opacity: 0, y: 40 }" :visibleOnce="{ opacity: 1, y: 0, transition: { duration: 1000 } }">
          <v-chip 
            color="primary" 
            variant="tonal" 
            class="mb-8 px-6 font-weight-bold text-uppercase tracking-widest premium-badge"
            prepend-icon="mdi-rocket-launch"
            size="large"
          >
            Prêt pour le niveau supérieur ?
          </v-chip>

          <h2 class="cta-title mb-8">
            Prêt à propulser vos <br class="d-none d-md-block"> 
            <span class="text-gradient-premium">équipes vers l'élite ?</span>
          </h2>

          <p class="cta-subtitle mb-12 opacity-80 line-height-relaxed mx-auto" style="max-width: 750px;">
            Rejoignez les leaders de l'industrie qui transforment leur capital humain. 
            Une plateforme conçue pour l'excellence, la performance et l'innovation continue.
          </p>

          <div class="d-flex flex-column flex-sm-row align-center justify-center gap-8 mb-12">
            <v-btn 
              color="primary" 
              size="x-large" 
              to="/register"
              class="cta-btn-main px-12 py-4 rounded-pill font-weight-black"
              height="68"
              elevation="24"
            >
              Commencer l'aventure
            </v-btn>
            
            <v-btn 
              variant="outlined" 
              color="white" 
              size="x-large" 
              class="rounded-pill px-12 border-opacity-30 hover-glow"
              height="68"
            >
              Contacter un expert
            </v-btn>
          </div>

          <v-row class="justify-center mt-4">
            <v-col v-for="(benefit, b) in ['14 jours d\'essai gratuit', 'Sans engagement', 'Support 24/7']" :key="b" cols="auto" class="px-4">
              <div class="d-flex align-center gap-2 benefit-item">
                <v-icon color="primary" size="22">mdi-check-decagram</v-icon>
                <span class="text-body-2 text-grey-lighten-2 font-weight-medium">{{ benefit }}</span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../axios';

const router = useRouter();
const featuredCourses = ref([]);

const solutions = [
  { icon: 'mdi-code-braces', title: 'Développement Logiciel', desc: 'Formations Full-Stack, DevOps et Architecture pour vos équipes techniques.', color: 'linear-gradient(135deg, #3b82f6, #2563eb)', themeColor: 'primary' },
  { icon: 'mdi-database-search', title: 'Data & IA', desc: 'Maîtrisez la science des données, le Machine Learning et l\'analyse prédictive.', color: 'linear-gradient(135deg, #f97316, #ea580c)', themeColor: 'secondary' },
  { icon: 'mdi-shield-lock', title: 'Cybersécurité', desc: 'Sécurisez vos infrastructures et formez vos équipes aux meilleures pratiques.', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', themeColor: 'accent' },
  { icon: 'mdi-cloud-sync', title: 'Cloud Computing', desc: 'Déployez, gérez et scalez vos applications sur les principaux providers cloud.', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', themeColor: 'info' },
  { icon: 'mdi-bullhorn', title: 'Marketing Digital', desc: 'Optimisez votre visibilité et convertissez vos prospects avec des stratégies data-driven.', color: 'linear-gradient(135deg, #ec4899, #db2777)', themeColor: 'error' },
  { icon: 'mdi-palette-swatch', title: 'Design UI/UX', desc: 'Créez des expériences utilisateur mémorables et des interfaces produit d\'exception.', color: 'linear-gradient(135deg, #10b981, #059669)', themeColor: 'success' },
  { icon: 'mdi-lightbulb-on', title: 'Product Management', desc: 'Pilotez la création de produits innovants et maîtrisez les méthodes agiles.', color: 'linear-gradient(135deg, #eab308, #ca8a04)', themeColor: 'warning' },
  { icon: 'mdi-link-variant', title: 'Blockchain & Web3', desc: 'Découvrez les contrats intelligents et le développement d\'applications décentralisées.', color: 'linear-gradient(135deg, #6366f1, #4f46e5)', themeColor: 'primary' },
  { icon: 'mdi-chart-line', title: 'Business & Finance', desc: 'Développez vos compétences en stratégie d\'entreprise, finance et gestion de projets.', color: 'linear-gradient(135deg, #14b8a6, #0d9488)', themeColor: 'success' },
];

const steps = [
  { title: 'Évaluation des besoins', desc: 'Nous analysons les compétences actuelles de votre équipe pour créer un parcours sur-mesure.' },
  { title: 'Apprentissage interactif', desc: 'Accès illimité à des modules vidéo, des quiz et des environnements de code réels.' },
  { title: 'Suivi et Certification', desc: 'Tableaux de bord analytiques pour suivre la progression et délivrance de certificats reconnus.' },
];

const courseIcons = ['mdi-vuejs', 'mdi-language-python', 'mdi-docker'];
const courseGradients = [
  'linear-gradient(135deg, #0f172a, #1e293b)',
  'linear-gradient(135deg, #0a0f1c, #111827)',
  'linear-gradient(135deg, #0f172a, #3b82f6)',
];

function categoryColor(cat) {
  const map = { 'Développement Web': 'primary', 'Backend': 'secondary', 'Base de Données': 'warning', 'Data Science': 'info' };
  return map[cat] || 'primary';
}

onMounted(async () => {
  try {
    const response = await api.get('/cours');
    const coursesData = response.data?.data || [];
    if (coursesData.length > 0) {
      featuredCourses.value = coursesData.slice(0, 3).map((c, i) => ({
        ...c,
        icon: courseIcons[i % courseIcons.length],
        gradient: courseGradients[i % courseGradients.length],
      }));
    } else {
      featuredCourses.value = [1,2,3].map((_, i) => ({
        id: i, titre: `Formation Avancée ${i+1}`, categorie: 'Développement Web',
        icon: courseIcons[i], gradient: courseGradients[i], formateur: { name: 'Expert IT' }
      }));
    }
  } catch {
    featuredCourses.value = [1,2,3].map((_, i) => ({
      id: i, titre: `Formation Avancée ${i+1}`, categorie: 'Développement Web',
      icon: courseIcons[i], gradient: courseGradients[i], formateur: { name: 'Expert IT' }
    }));
  }
});

const goToCourse = (id) => router.push(`/cours/${id}`);
</script>

<style scoped>
.home-wrapper {
  overflow-x: hidden;
  background-color: var(--v-theme-background);
}

/* ── Premium Hero Section ────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: var(--el-app-bar-h);
  overflow: hidden;
  background-color: #05070a;
}

/* Ambient Animated Background */
.hero-ambient-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: floatOrb 20s infinite alternate ease-in-out;
}
.orb-1 {
  width: 600px; height: 600px;
  background: rgba(59, 130, 246, 0.2);
  top: -100px; left: -100px;
}
.orb-2 {
  width: 500px; height: 500px;
  background: rgba(139, 92, 246, 0.15);
  bottom: -100px; right: -100px;
  animation-delay: -5s;
}
.orb-3 {
  width: 400px; height: 400px;
  background: rgba(16, 185, 129, 0.1);
  top: 40%; left: 40%;
  animation-delay: -10s;
}
@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(100px, 50px) scale(1.2); }
}

/* Perspective Grid */
.hero-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg) translateY(-100px) scale(3);
  transform-origin: top center;
  opacity: 0.4;
  z-index: 0;
}

/* Typography */
.hero-title {
  font-size: clamp(3rem, 5.5vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  color: #ffffff;
  letter-spacing: -0.04em;
}
.text-gradient-shimmer {
  background: linear-gradient(to right, #3b82f6, #8b5cf6, #3b82f6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer {
  to { background-position: 200% center; }
}
.hero-subtitle {
  font-size: clamp(1.1rem, 1.5vw, 1.25rem);
  color: #9ca3af;
  max-width: 480px;
  line-height: 1.6;
}

/* Buttons */
.hero-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2) !important;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1) !important;
}
.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.6), inset 0 1px 0 rgba(255,255,255,0.2) !important;
}
.hero-btn-secondary {
  border: 1px solid rgba(255,255,255,0.15) !important;
  background: rgba(255,255,255,0.03) !important;
  backdrop-filter: blur(10px);
  color: white !important;
  transition: all 0.3s ease !important;
}
.hero-btn-secondary:hover {
  background: rgba(255,255,255,0.08) !important;
  border-color: rgba(255,255,255,0.3) !important;
}
.premium-hero-chip {
  background: rgba(59, 130, 246, 0.15) !important;
  color: #60a5fa !important;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
.divider-vertical {
  width: 1px; height: 40px;
  background: rgba(255,255,255,0.15);
}

/* Hero Visual Composition */
.hero-composition {
  position: relative;
  width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
  perspective: 1000px;
}
.glass-card-main {
  width: 420px;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.1);
  transform: rotateY(-15deg) rotateX(10deg);
  transition: transform 0.5s ease;
}
.glass-card-main:hover {
  transform: rotateY(-5deg) rotateX(5deg);
}
.mac-dot { width: 12px; height: 12px; border-radius: 50%; }
.mac-dot.red { background: #ff5f56; }
.mac-dot.yellow { background: #ffbd2e; }
.mac-dot.green { background: #27c93f; }
.border-b-subtle { border-bottom: 1px solid rgba(255,255,255,0.05); }
.skeleton-block { height: 12px; border-radius: 6px; background: rgba(255,255,255,0.05); }

/* Floating Elements */
.float-card {
  position: absolute;
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 16px 24px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.card-top-right {
  top: 15%; right: 0;
  transform: translateZ(50px);
}
.card-bottom-left {
  bottom: 20%; left: -10%;
  transform: translateZ(80px);
}
.icon-sq {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.bg-success-light { background: rgba(34, 197, 94, 0.15); }

/* Marquee */
.border-y-subtle { border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
.tracking-widest { letter-spacing: 0.1em; }
.marquee-wrapper {
  position: relative;
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
  padding: 20px 0;
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
.marquee-content {
  display: flex;
  width: fit-content;
  animation: marquee 40s linear infinite;
}
.marquee-content:hover {
  animation-play-state: paused;
}
.brand-item {
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  filter: grayscale(100%);
}
.brand-item:hover {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.05);
}
.brand-icon {
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0));
  transition: all 0.3s ease;
}
.brand-item:hover .brand-icon {
  filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.5));
}
.brand-text {
  background: linear-gradient(135deg, #ffffff 30%, #9ca3af 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(255,255,255,0);
  transition: text-shadow 0.3s ease;
}
.brand-item:hover .brand-text {
  text-shadow: 0 4px 20px rgba(255,255,255,0.2);
}
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* Solutions */
.solution-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}
.solution-card:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.icon-box {
  width: 64px; height: 64px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
}

/* Courses */
.course-card {
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.course-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
.course-img-wrap { position: relative; height: 200px; }
.course-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.course-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(10, 15, 28, 0.95) 100%);
  z-index: 1;
}
.course-icon { opacity: 0.5; transition: transform 0.4s ease; }
.course-card:hover .course-icon { transform: scale(1.1); opacity: 0.8; }
.glass-chip {
  position: absolute; bottom: 12px; left: 16px; z-index: 2;
  backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);
}
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.border-subtle { border: 1px solid rgba(255,255,255,0.1); }

/* Timeline */
.timeline-item { position: relative; }
.timeline-indicator { display: flex; flex-direction: column; align-items: center; }
.indicator-circle {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6;
  display: flex; align-items: center; justify-content: center;
  color: #3b82f6; font-weight: bold; font-size: 1.1rem;
}
.indicator-line { width: 2px; flex-grow: 1; background: rgba(255,255,255,0.1); margin-top: 8px; min-height: 40px; }
.step-img { border: 1px solid rgba(255,255,255,0.1); }

/* ── Premium CTA Section ────────────────────────────────── */
.cta-section {
  background: #05070a;
  position: relative;
  border-top: 1px solid rgba(255,255,255,0.03);
}

.cta-visuals {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.cta-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.4;
  animation: orbPulse 15s infinite alternate ease-in-out;
}

.cta-orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
  top: -200px; left: -100px;
}

.cta-orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent);
  bottom: -150px; right: -50px;
  animation-delay: -5s;
}

.cta-orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent);
  top: 20%; right: 10%;
  animation-delay: -10s;
}

@keyframes orbPulse {
  0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  100% { transform: translate(50px, 30px) scale(1.1); opacity: 0.5; }
}

.cta-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(circle at center, black, transparent 90%);
}

.cta-title {
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1.05;
  color: white;
  letter-spacing: -0.04em;
}

.text-gradient-premium {
  background: linear-gradient(135deg, #60a5fa, #c084fc, #3b82f6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 5s linear infinite;
}

.cta-subtitle {
  font-size: clamp(1.2rem, 1.8vw, 1.5rem);
  color: #9ca3af;
  font-weight: 400;
}

.cta-btn-main {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  box-shadow: 0 15px 45px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.3) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.cta-btn-main:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 25px 60px rgba(59, 130, 246, 0.7), inset 0 1px 0 rgba(255,255,255,0.3) !important;
}

.hover-glow:hover {
  background: rgba(255,255,255,0.05) !important;
  border-color: rgba(255,255,255,0.6) !important;
  box-shadow: 0 0 30px rgba(255,255,255,0.1);
}

.premium-badge {
  background: rgba(59, 130, 246, 0.1) !important;
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(10px);
}

.benefit-item {
  transition: transform 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-2px);
}

.z-1 { z-index: 1; }

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.brand-item {
  cursor: pointer;
}
</style>
