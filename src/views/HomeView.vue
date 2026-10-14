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
              size="small"
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
            >
              <span class="emoji mr-2">✨</span>Excellence en E-Learning
            </v-chip>

            <h1 v-motion class="hero-title" :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 300 } }">
              Propulsez votre <br class="d-none d-md-block">
              carrière vers <br class="d-none d-md-block">
              <span class="hero-highlight">le futur.</span>
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
                class="rounded-pill font-weight-black hero-btn-primary px-10"
                height="62"
                append-icon="mdi-arrow-right"
              >
                Explorer le catalogue
              </v-btn>
              <v-btn
                variant="outlined" color="primary" size="x-large" to="/register"
                class="rounded-pill font-weight-bold hero-btn-secondary px-8"
                height="62"
              >
                Devenir formateur
              </v-btn>
            </div>

            <!-- Quick Stats -->
            <div v-motion class="hero-stats d-flex align-center gap-8 mt-12 justify-center justify-md-start" :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { duration: 1000, delay: 1200 } }">
              <div class="hero-stat">
                <div class="text-h4 font-weight-black text-white"><CountUp :to="4.9" :decimals="1" />/5</div>
                <div class="d-flex align-center gap-1 mt-1">
                  <v-rating :model-value="5" color="warning" size="small" density="compact" readonly />
                  <span class="text-caption text-grey ml-1">Avis certifiés</span>
                </div>
              </div>
              <div class="divider-vertical" />
              <div class="hero-stat">
                <div class="text-h4 font-weight-black text-white"><CountUp :to="10" prefix="+" suffix="k" /></div>
                <div class="text-caption text-grey mt-1">Apprenants actifs</div>
              </div>
            </div>
          </v-col>

          <!-- Right: Visual Composition -->
          <v-col cols="12" md="6" class="d-none d-md-block position-relative h-100">
            <div v-motion class="hero-composition" :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 1200, delay: 400 } }">
              <!-- Main card -->
              <div v-tilt="{ max: 4, scale: 1.005 }" class="glass-card-main">
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

    <!-- ── Trust / Partner Logo Cloud + Stats ──────────────────── -->
    <section class="trust-section">
      <v-container>
        <div v-reveal class="trust-head">
          <span class="trust-kicker">Ils nous font confiance pour leur formation entreprise</span>
        </div>
      </v-container>

      <div v-reveal class="marquee-wrapper">
        <div class="marquee-content">
          <!-- Duplicated for a seamless loop -->
          <template v-for="i in 2" :key="i">
            <div
              v-for="partner in partners"
              :key="`${i}-${partner.name}`"
              class="brand-chip has-sheen"
            >
              <span class="brand-chip-icon">
                <v-icon size="20">{{ partner.icon }}</v-icon>
              </span>
              <span class="brand-chip-name">{{ partner.name }}</span>
            </div>
          </template>
        </div>
      </div>

      <v-container>
        <div v-reveal class="stats-band">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <div class="stat-value">
              <CountUp :to="stat.value" :decimals="stat.decimals || 0" :prefix="stat.prefix || ''" :suffix="stat.suffix || ''" />
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Solutions / Categories Section -->
    <section class="solutions-section py-16">
      <v-container>
        <div v-reveal class="text-center mb-16 section-head">
          <v-chip color="secondary" variant="outlined" size="small" class="mb-4 text-uppercase font-weight-bold">Nos Solutions</v-chip>
          <h2 class="text-h3 font-weight-black text-white">Domaines d'expertise</h2>
          <p class="text-body-1 mt-4 text-grey-lighten-1 mx-auto" style="max-width: 600px;">
            Des parcours de formation conçus pour répondre aux défis technologiques et métiers de demain.
          </p>
        </div>

        <v-row class="align-stretch">
          <v-col v-for="(sol, index) in solutions" :key="sol.title" cols="12" sm="6" md="4" class="d-flex" v-reveal="index * 70">
            <div
              v-tilt="{ max: 5, scale: 1.02 }"
              class="solution-card has-sheen h-100 pa-8 rounded-xl d-flex flex-column w-100"
            >
              <div class="icon-box mb-6" :style="{ background: sol.color }">
                <span class="emoji" style="font-size: 1.9rem;">{{ sol.emoji }}</span>
              </div>
              <h3 class="text-h5 font-weight-bold mb-3 text-white">{{ sol.title }}</h3>
              <p class="text-grey-lighten-1 mb-0 line-height-relaxed flex-grow-1">{{ sol.desc }}</p>
              <div class="solution-more mt-6">
                <span>Découvrir</span>
                <v-icon size="18">mdi-arrow-right</v-icon>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Featured Courses Showcase -->
    <v-container class="py-16 courses-section">
      <div v-reveal class="d-flex justify-space-between align-end flex-wrap gap-4 mb-12">
        <div>
          <h2 class="text-h3 font-weight-black text-white">Cours à la une</h2>
          <p class="text-body-1 mt-2 text-grey-lighten-1 mb-0">Formations intensives dispensées par des experts du secteur.</p>
        </div>
        <v-btn variant="text" color="primary" to="/catalogue" class="d-none d-sm-flex font-weight-bold" append-icon="mdi-chevron-right">
          Voir tout
        </v-btn>
      </div>

      <v-row class="align-stretch">
        <v-col v-for="(course, index) in featuredCourses" :key="course.id" cols="12" sm="6" md="4" class="d-flex" v-reveal="index * 100">
          <v-card
            v-tilt="{ max: 4, scale: 1.015 }"
            class="course-card surface-card has-sheen d-flex flex-column rounded-xl w-100"
            elevation="0"
            @click="goToCourse(course.id)"
          >
              <div class="course-img-wrap overflow-hidden">
                <div class="course-placeholder" :style="{ background: course.gradient }">
                  <v-icon size="80" class="course-icon">{{ course.icon }}</v-icon>
                </div>
                <v-chip v-if="course.tag" class="course-ribbon" color="primary" variant="flat" size="small">
                  {{ course.tag }}
                </v-chip>
                <v-chip class="course-badge glass-chip" :color="categoryColor(course.categorie)" variant="tonal" size="small">
                  {{ course.categorie }}
                </v-chip>
              </div>

              <div class="pa-6 d-flex flex-column flex-grow-1">
                <div class="d-flex align-center mb-3">
                  <v-rating :model-value="course.rating || 4.8" color="warning" density="compact" size="small" readonly half-increments />
                  <span class="text-caption text-grey ml-2">({{ course.reviews || 124 }} avis)</span>
                </div>

                <h3 class="font-weight-bold text-h6 mb-2 line-clamp-2">{{ course.titre }}</h3>

                <v-card-text class="text-grey-lighten-1 text-body-2 pa-0 line-clamp-2">
                  {{ course.description || 'Maîtrisez les compétences indispensables de ce domaine avec notre formation complète.' }}
                </v-card-text>

                <div class="course-meta d-flex gap-2 flex-wrap my-4">
                  <span class="meta-chip"><v-icon size="14">mdi-play-circle-outline</v-icon>{{ course.lessons || 24 }} leçons</span>
                  <span class="meta-chip"><v-icon size="14">mdi-clock-outline</v-icon>{{ course.hours || 8 }}h</span>
                  <span class="meta-chip"><v-icon size="14">mdi-signal</v-icon>{{ course.level || 'Tous niveaux' }}</span>
                </div>

                <div class="d-flex align-center justify-space-between mt-auto pt-4 course-foot">
                  <div class="d-flex align-center">
                    <v-avatar size="32" color="surface-variant" class="mr-3 border-subtle">
                      <v-icon size="16">mdi-account-tie</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-caption font-weight-bold">{{ course.formateur?.name || 'Expert Formateur' }}</div>
                      <div class="text-caption text-grey" style="font-size: 0.7rem;">Formateur senior</div>
                    </div>
                  </div>
                  <span class="course-go"><v-icon size="20">mdi-arrow-right</v-icon></span>
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
    <section class="steps-section section-dark py-16">
      <v-container>
        <v-row class="align-center">
          <v-col v-reveal cols="12" md="6">
            <p class="text-caption text-primary text-uppercase tracking-widest font-weight-bold mb-3"><span class="emoji mr-2">🧭</span>Notre méthode</p>
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
          <v-col v-reveal="150" cols="12" md="6" class="text-center position-relative">
            <v-img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" cover class="rounded-xl step-img mx-auto" max-width="500"
              height="600">
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

    <!-- ── FAQ ────────────────────────────────────────────────── -->
    <section class="faq-section py-16 border-y-subtle">
      <v-container>
        <div v-reveal class="text-center mb-12">
          <p class="text-caption text-primary text-uppercase tracking-widest font-weight-bold mb-3"><span class="emoji mr-2">🙋</span>Questions fréquentes</p>
          <h2 class="text-h3 font-weight-black text-white">Tout ce qu'il faut savoir</h2>
        </div>

        <v-expansion-panels variant="accordion" flat class="faq-panels mx-auto" style="max-width: 820px;">
          <v-expansion-panel v-for="(faq, i) in faqs" :key="i" class="faq-panel">
            <v-expansion-panel-title class="text-body-1 font-weight-medium">
              {{ faq.q }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="text-body-2 text-grey-lighten-1 mb-0 line-height-relaxed">{{ faq.a }}</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
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
        <div v-reveal class="cta-content-inner mx-auto" style="max-width: 900px;">
          <v-chip
            color="primary"
            variant="tonal"
            class="mb-8 px-6 font-weight-bold text-uppercase tracking-widest premium-badge"
            size="large"
          >
            <span class="emoji mr-2">🚀</span>Prêt pour le niveau supérieur ?
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
              class="cta-btn-main el-cta-glow px-12 py-4 rounded-pill font-weight-black"
              height="68"
            >
              Commencer l'aventure
            </v-btn>

            <v-btn
              variant="outlined"
              color="primary"
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
import CountUp from '../components/CountUp.vue';

const router = useRouter();
const featuredCourses = ref([]);

const partners = [
  { name: 'TECHCORP', icon: 'mdi-hexagon-multiple-outline' },
  { name: 'GLOBALDATA', icon: 'mdi-database-outline' },
  { name: 'SECURENET', icon: 'mdi-shield-lock-outline' },
  { name: 'CLOUDWISE', icon: 'mdi-cloud-outline' },
  { name: 'DIGITALHUB', icon: 'mdi-earth' },
  { name: 'INNOVISION', icon: 'mdi-lightbulb-on-outline' },
  { name: 'NEXUSTECH', icon: 'mdi-atom' },
];

const stats = [
  { value: 10, prefix: '', suffix: 'k+', label: 'Apprenants actifs' },
  { value: 240, prefix: '', suffix: '+', label: 'Cours experts' },
  { value: 85, prefix: '', suffix: '+', label: 'Formateurs certifiés' },
  { value: 4.9, decimals: 1, prefix: '', suffix: '/5', label: 'Note moyenne' },
];

const solutions = [
  { icon: 'mdi-code-braces', emoji: '💻', title: 'Développement Logiciel', desc: 'Formations Full-Stack, DevOps et Architecture pour vos équipes techniques.', color: 'var(--el-accent-soft)', themeColor: 'primary' },
  { icon: 'mdi-database-search', emoji: '🤖', title: 'Data & IA', desc: 'Maîtrisez la science des données, le Machine Learning et l\'analyse prédictive.', color: 'var(--el-accent-soft)', themeColor: 'secondary' },
  { icon: 'mdi-shield-lock', emoji: '🔐', title: 'Cybersécurité', desc: 'Sécurisez vos infrastructures et formez vos équipes aux meilleures pratiques.', color: 'var(--el-accent-soft)', themeColor: 'accent' },
  { icon: 'mdi-cloud-sync', emoji: '☁️', title: 'Cloud Computing', desc: 'Déployez, gérez et scalez vos applications sur les principaux providers cloud.', color: 'var(--el-accent-soft)', themeColor: 'info' },
  { icon: 'mdi-bullhorn', emoji: '📣', title: 'Marketing Digital', desc: 'Optimisez votre visibilité et convertissez vos prospects avec des stratégies data-driven.', color: 'var(--el-accent-soft)', themeColor: 'error' },
  { icon: 'mdi-palette-swatch', emoji: '🎨', title: 'Design UI/UX', desc: 'Créez des expériences utilisateur mémorables et des interfaces produit d\'exception.', color: 'var(--el-accent-soft)', themeColor: 'success' },
  { icon: 'mdi-lightbulb-on', emoji: '💡', title: 'Product Management', desc: 'Pilotez la création de produits innovants et maîtrisez les méthodes agiles.', color: 'var(--el-accent-soft)', themeColor: 'warning' },
  { icon: 'mdi-link-variant', emoji: '🔗', title: 'Blockchain & Web3', desc: 'Découvrez les contrats intelligents et le développement d\'applications décentralisées.', color: 'var(--el-accent-soft)', themeColor: 'primary' },
  { icon: 'mdi-chart-line', emoji: '📈', title: 'Business & Finance', desc: 'Développez vos compétences en stratégie d\'entreprise, finance et gestion de projets.', color: 'var(--el-accent-soft)', themeColor: 'success' },
];

const steps = [
  { title: 'Évaluation des besoins', desc: 'Nous analysons les compétences actuelles de votre équipe pour créer un parcours sur-mesure.' },
  { title: 'Apprentissage interactif', desc: 'Accès illimité à des modules vidéo, des quiz et des environnements de code réels.' },
  { title: 'Suivi et Certification', desc: 'Tableaux de bord analytiques pour suivre la progression et délivrance de certificats reconnus.' },
];

const faqs = [
  { q: 'Comment fonctionne la plateforme ?', a: 'Créez un compte, parcourez le catalogue et suivez les cours à votre rythme. Chaque module combine vidéos, supports et quiz pour valider vos acquis.' },
  { q: 'Les certificats sont-ils reconnus ?', a: 'Chaque parcours terminé délivre un certificat vérifiable, partageable sur LinkedIn et valorisable auprès de vos recruteurs.' },
  { q: 'Puis-je apprendre en équipe ?', a: 'Oui. Les offres entreprise incluent des tableaux de bord de progression, la gestion des accès et un accompagnement dédié.' },
  { q: 'Existe-t-il un essai gratuit ?', a: 'Vous bénéficiez de 14 jours d\'essai, sans engagement, avec un accès complet à l\'ensemble des formations et aux quiz.' },
];

const courseIcons = ['mdi-vuejs', 'mdi-language-python', 'mdi-docker'];
const courseGradients = [
  'linear-gradient(135deg, #ffe7de 0%, #f6d8c8 100%)',
  'linear-gradient(135deg, #e4edf6 0%, #d7e3ef 100%)',
  'linear-gradient(135deg, #e4eee0 0%, #d9e6cf 100%)',
];

// Curated showcase shown when the API is unavailable, so the landing always reads fully.
const showcaseCourses = [
  {
    id: 'showcase-1',
    titre: 'Vue.js 3 — De zéro à expert',
    description: 'Composition API, Pinia, routing et bonnes pratiques pour construire des applications modernes et performantes.',
    categorie: 'Développement Web',
    icon: 'mdi-vuejs',
    gradient: courseGradients[0],
    tag: 'Best-seller',
    rating: 4.9,
    reviews: 324,
    lessons: 48,
    hours: 12,
    level: 'Intermédiaire',
    formateur: { name: 'Sarah Benali' },
  },
  {
    id: 'showcase-2',
    titre: 'Python & Data Science appliquée',
    description: 'Analysez, visualisez et modélisez vos données avec Pandas, NumPy et Scikit-learn sur des cas concrets.',
    categorie: 'Data Science',
    icon: 'mdi-language-python',
    gradient: courseGradients[1],
    tag: 'Nouveau',
    rating: 4.8,
    reviews: 187,
    lessons: 36,
    hours: 9,
    level: 'Débutant',
    formateur: { name: 'Karim Haddad' },
  },
  {
    id: 'showcase-3',
    titre: 'DevOps & Containers avec Docker',
    description: 'Industrialisez vos déploiements : conteneurs, CI/CD et orchestration pour des releases fiables.',
    categorie: 'DevOps',
    icon: 'mdi-docker',
    gradient: courseGradients[2],
    tag: 'Certifiant',
    rating: 4.7,
    reviews: 142,
    lessons: 30,
    hours: 10,
    level: 'Avancé',
    formateur: { name: 'Lina Moreau' },
  },
];

function categoryColor(cat) {
  const map = { 'Développement Web': '#7ea6cf', 'Backend': '#d99a5f', 'Base de Données': '#ab9dd8', 'Data Science': '#86bd97', 'DevOps': '#8fb4bd' };
  return map[cat] || '#ff7448';
}

onMounted(async () => {
  try {
    const response = await api.get('/cours');
    const coursesData = response.data?.data || [];
    if (coursesData.length) {
      featuredCourses.value = coursesData.slice(0, 3).map((c, i) => ({
        ...c,
        icon: courseIcons[i % courseIcons.length],
        gradient: courseGradients[i % courseGradients.length],
      }));
    } else {
      featuredCourses.value = showcaseCourses;
    }
  } catch {
    // API unavailable — fall back to the curated showcase.
    featuredCourses.value = showcaseCourses;
  }
});

const goToCourse = (id) => router.push(`/cours/${id}`);
</script>

<style scoped>
.home-wrapper {
  overflow-x: hidden;
  background-color: var(--el-bg-0);
}

/* ── Premium Hero Section ────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: var(--el-app-bar-h);
  overflow: hidden;
  background-color: var(--el-bg-0);
}

/* Ambient Animated Background (kept off — no aurora blobs) */
.hero-ambient-bg { display: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; }
.hero-grid-overlay { display: none; }

/* Typography */
.hero-title {
  font-size: clamp(2.6rem, 5.4vw, 4.5rem);
  font-weight: 600;
  line-height: 1.03;
  color: var(--el-text);
  letter-spacing: -0.045em;
}
.hero-highlight {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}
.hero-highlight::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.05em;
  height: 0.1em;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--el-accent), var(--el-accent-strong));
  transform: scaleX(0);
  transform-origin: left center;
  animation: hero-underline 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.05s forwards;
}
@keyframes hero-underline { to { transform: scaleX(1); } }

.hero-subtitle {
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  color: var(--el-text-muted);
  max-width: 480px;
  line-height: 1.6;
}

.hero-stats .hero-stat { transition: transform 0.25s var(--el-ease); }
.hero-stats .hero-stat:hover { transform: translateY(-2px); }

/* Buttons */
.hero-btn-primary {
  background: var(--el-accent) !important;
  box-shadow: var(--el-shadow-accent) !important;
  transition: transform 0.22s var(--el-ease), box-shadow 0.22s var(--el-ease) !important;
}
.hero-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 44px -16px rgba(241, 63, 7, 0.6) !important;
}
.hero-btn-secondary {
  border: 1px solid var(--el-border-strong) !important;
  background: var(--el-surface) !important;
  backdrop-filter: none;
  color: var(--el-text) !important;
  box-shadow: var(--el-shadow-xs) !important;
  transition: border-color 0.15s ease, box-shadow 0.25s var(--el-ease), transform 0.22s var(--el-ease) !important;
}
.hero-btn-secondary:hover {
  background: var(--el-surface) !important;
  border-color: var(--el-border-strong) !important;
  box-shadow: var(--el-shadow-sm) !important;
  transform: translateY(-3px);
}
.premium-hero-chip {
  background: var(--el-accent-soft) !important;
  color: var(--el-accent) !important;
  border: 1px solid var(--el-border-strong);
}
.divider-vertical {
  width: 1px; height: 40px;
  background: var(--el-border);
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
  background: var(--el-surface);
  backdrop-filter: none;
  border: 1px solid var(--el-border);
  border-radius: var(--el-radius-lg);
  box-shadow: var(--el-shadow-lg);
}
.mac-dot { width: 12px; height: 12px; border-radius: 50%; }
.mac-dot.red { background: #ff5f56; }
.mac-dot.yellow { background: #ffbd2e; }
.mac-dot.green { background: #27c93f; }
.border-b-subtle { border-bottom: 1px solid var(--el-border); }
.skeleton-block { height: 12px; border-radius: 6px; background: var(--el-surface-2); }

/* Floating Elements */
.float-card {
  position: absolute;
  background: var(--el-surface);
  backdrop-filter: none;
  border: 1px solid var(--el-border);
  padding: 16px 24px;
  border-radius: var(--el-radius);
  box-shadow: var(--el-shadow-md);
}
.card-top-right { top: 15%; right: 0; transform: translateZ(50px); }
.card-bottom-left { bottom: 20%; left: -10%; transform: translateZ(80px); }
.icon-sq {
  width: 40px; height: 40px; border-radius: var(--el-radius-sm);
  display: flex; align-items: center; justify-content: center;
}
.bg-success-light { background: rgba(63, 166, 106, 0.15); }

/* ── Trust / partner section ─────────────────────────────── */
.trust-section {
  padding: 3.25rem 0 3.75rem;
  background: var(--el-bg-1);
  border-top: 1px solid var(--el-border);
  border-bottom: 1px solid var(--el-border);
}
.trust-head { text-align: center; margin-bottom: 2.25rem; }
.trust-kicker {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--el-accent);
  padding: 0.4rem 1rem;
  border: 1px solid var(--el-border-strong);
  border-radius: 999px;
  background: var(--el-surface);
}

.border-y-subtle { border-top: 1px solid var(--el-border); border-bottom: 1px solid var(--el-border); }
.tracking-widest { letter-spacing: 0.1em; }

.marquee-wrapper {
  position: relative;
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
  padding: 6px 0 14px;
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
}
.marquee-content {
  display: flex;
  width: fit-content;
  align-items: center;
  animation: marquee 42s linear infinite;
}
.marquee-content:hover { animation-play-state: paused; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.brand-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0 12px;
  padding: 0.65rem 1.25rem 0.65rem 0.7rem;
  background: var(--el-surface);
  border: 1px solid var(--el-border);
  border-radius: var(--el-radius-pill);
  box-shadow: var(--el-shadow-xs);
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.3s var(--el-ease), box-shadow 0.3s var(--el-ease), border-color 0.3s var(--el-ease);
}
.brand-chip:hover {
  transform: translateY(-3px);
  box-shadow: var(--el-shadow-md);
  border-color: var(--el-border-strong);
}
.brand-chip-icon {
  width: 34px; height: 34px;
  border-radius: 11px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--el-accent-soft);
  color: var(--el-accent);
  flex: 0 0 auto;
}
.brand-chip-name {
  font-weight: 600;
  letter-spacing: -0.01em;
  font-size: 0.95rem;
  color: var(--el-text-muted);
  transition: color 0.3s var(--el-ease);
}
.brand-chip:hover .brand-chip-name { color: var(--el-text); }

/* Stats band */
.stats-band {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--el-surface);
  border: 1px solid var(--el-border);
  border-radius: var(--el-radius-lg);
  box-shadow: var(--el-shadow);
  overflow: hidden;
}
.stat-card {
  position: relative;
  padding: 1.7rem 1.2rem;
  text-align: center;
  transition: background 0.25s var(--el-ease), transform 0.25s var(--el-ease);
}
.stat-card:hover { background: var(--el-bg-1); }
.stat-card + .stat-card::before {
  content: '';
  position: absolute;
  left: 0; top: 22%; bottom: 22%;
  width: 1px;
  background: var(--el-border);
}
.stat-value {
  font-family: var(--el-font-display);
  font-weight: 600;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--el-text);
}
.stat-label {
  margin-top: 0.45rem;
  font-size: 0.82rem;
  color: var(--el-text-muted);
}

/* Solutions */
.solution-card {
  position: relative;
  background: var(--el-surface);
  border: 1px solid var(--el-border);
  box-shadow: var(--el-shadow-sm);
  transition: transform 0.3s var(--el-ease), border-color 0.3s var(--el-ease), box-shadow 0.3s var(--el-ease);
  cursor: pointer;
}
.solution-card:hover {
  background: var(--el-surface);
  border-color: var(--el-border-strong);
  box-shadow: var(--el-shadow-md);
}
.icon-box {
  width: 64px; height: 64px;
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.solution-more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--el-accent);
  font-weight: 600;
  font-size: 0.9rem;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.3s var(--el-ease), transform 0.3s var(--el-ease);
}
.solution-card:hover .solution-more { opacity: 1; transform: none; }

/* Courses */
.course-card {
  border: 1px solid var(--el-border);
  box-shadow: var(--el-shadow-sm);
  transition: transform 0.3s var(--el-ease), border-color 0.3s var(--el-ease), box-shadow 0.3s var(--el-ease);
  cursor: pointer;
}
.course-card:hover {
  border-color: var(--el-border-strong);
  box-shadow: var(--el-shadow-md);
}
.course-img-wrap { position: relative; height: 190px; }
.course-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.5s var(--el-ease);
}
.course-card:hover .course-placeholder { transform: scale(1.06); }
.course-icon { color: var(--el-accent); opacity: 0.92; }
.course-ribbon {
  position: absolute; top: 12px; right: 12px; z-index: 2;
  font-weight: 700 !important;
  box-shadow: var(--el-shadow-accent);
}
.glass-chip {
  position: absolute; bottom: 12px; left: 16px; z-index: 2;
  backdrop-filter: none; border: 1px solid var(--el-border);
}
.course-meta { min-height: 0; }
.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  padding: 0.3rem 0.6rem;
  border-radius: 9px;
  background: var(--el-bg-1);
  border: 1px solid var(--el-border);
  font-size: 0.74rem;
  font-weight: 500;
  color: var(--el-text-muted);
}
.course-foot { border-top: 1px solid var(--el-border); }
.course-go {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--el-accent-soft);
  color: var(--el-accent);
  transition: transform 0.3s var(--el-ease), background 0.3s var(--el-ease), color 0.3s var(--el-ease);
}
.course-card:hover .course-go {
  background: var(--el-accent);
  color: #fff9f6;
  transform: translateX(4px);
}
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.border-subtle { border: 1px solid var(--el-border); }

/* Timeline */
.timeline-item { position: relative; }
.timeline-indicator { display: flex; flex-direction: column; align-items: center; }
.indicator-circle {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--el-accent-soft); border: 1px solid var(--el-accent);
  display: flex; align-items: center; justify-content: center;
  color: var(--el-accent); font-weight: 600; font-size: 1rem;
  animation: pulse-ring 2.8s ease-in-out infinite;
}
@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 116, 72, 0.35); }
  50%      { box-shadow: 0 0 0 9px rgba(255, 116, 72, 0); }
}
.indicator-line { width: 2px; flex-grow: 1; background: var(--el-border); margin-top: 8px; min-height: 40px; }
.step-img { border: 1px solid var(--el-border); box-shadow: var(--el-shadow-lg); }

/* Dark-ink methodology section (nomu alternation) */
.steps-section.section-dark { background: var(--el-ink); }
.steps-section.section-dark .indicator-circle {
  background: rgba(255, 116, 72, 0.16);
  border-color: var(--el-accent);
  color: var(--el-accent);
  animation: pulse-ring-dark 2.8s ease-in-out infinite;
}
@keyframes pulse-ring-dark {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 116, 72, 0.45); }
  50%      { box-shadow: 0 0 0 9px rgba(255, 116, 72, 0); }
}
.steps-section.section-dark .indicator-line { background: rgba(255, 255, 255, 0.14); }
.steps-section.section-dark .step-img {
  border-color: var(--el-ink-border);
  box-shadow: 0 30px 60px -24px rgba(0, 0, 0, 0.7);
}

/* ── Premium CTA Section ────────────────────────────────── */
.cta-section {
  background: var(--el-bg-1);
  position: relative;
  border-top: 1px solid var(--el-border);
}
.cta-visuals { display: none; }
.cta-orb { display: none; }
.cta-grid { display: none; }

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.08;
  color: var(--el-text);
  letter-spacing: -0.03em;
}
.text-gradient-premium { color: var(--el-text); }
.cta-subtitle {
  font-size: clamp(1.15rem, 1.6vw, 1.35rem);
  color: var(--el-text-muted);
  font-weight: 400;
}
.cta-btn-main {
  background: var(--el-accent) !important;
  box-shadow: var(--el-shadow-accent) !important;
  transition: transform 0.22s var(--el-ease), box-shadow 0.22s var(--el-ease) !important;
}
.cta-btn-main:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 48px -16px rgba(241, 63, 7, 0.6) !important;
}
.hover-glow:hover {
  background: var(--el-surface-2) !important;
  border-color: var(--el-border-strong) !important;
  box-shadow: var(--el-shadow-sm);
}
.premium-badge {
  background: var(--el-accent-soft) !important;
  border: 1px solid var(--el-border-strong);
  backdrop-filter: none;
}
.benefit-item { transition: transform 0.22s var(--el-ease); }
.benefit-item:hover { transform: translateY(-2px); }

/* FAQ */
.faq-section { background: var(--el-bg-0); }
.faq-panels { background: transparent !important; }
.faq-panel {
  background: var(--el-surface) !important;
  border: 1px solid var(--el-border) !important;
  border-radius: var(--el-radius) !important;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: var(--el-shadow-xs) !important;
  transition: border-color 0.2s var(--el-ease), box-shadow 0.2s var(--el-ease);
}
.faq-panel:hover { border-color: var(--el-border-strong) !important; box-shadow: var(--el-shadow-sm) !important; }
.faq-panel.v-expansion-panel--active { border-color: var(--el-accent) !important; box-shadow: var(--el-shadow) !important; }

.z-1 { z-index: 1; }
.hover-opacity-100:hover { opacity: 1 !important; }

@media (max-width: 700px) {
  .stats-band { grid-template-columns: repeat(2, 1fr); }
  .stat-card:nth-child(odd)::before { display: none; }
  .stat-card:nth-child(n + 3) { border-top: 1px solid var(--el-border); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-highlight::after { transform: scaleX(1); animation: none; }
  .indicator-circle,
  .steps-section.section-dark .indicator-circle { animation: none; }
}
</style>
