<template>
  <main class="home-page">
    <section class="home-hero">
      <div class="hero-copy">
        <span class="eyebrow"><span class="focus-dot" /> A quieter way to move forward</span>
        <h1>Make room for<br>your <em>next skill.</em></h1>
        <p>Build the skills that move your work forward—with expert-led learning designed to fit real life.</p>
        <div class="hero-actions">
          <RouterLink class="button button-primary" to="/catalogue">Explore courses <span aria-hidden="true">↗</span></RouterLink>
          <a class="text-link" href="#how-it-works">How it works <span aria-hidden="true">↓</span></a>
        </div>
        <div class="hero-proof"><span class="avatar-stack" aria-hidden="true"><i>J</i><i>M</i><i>A</i></span><span><strong>10,000+</strong> learners finding their focus</span></div>
      </div>
      <div class="learning-preview" aria-label="Preview of a learner dashboard">
        <div class="preview-topline"><span class="preview-mark"><span>e</span> E-Learning Hub</span><span class="preview-date">YOUR LEARNING, IN FOCUS</span></div>
        <div class="preview-welcome"><div><span class="preview-label">MONDAY, OCTOBER 13</span><h2>Good afternoon, Alex.</h2></div><span class="focus-pill"><i /> Today’s focus</span></div>
        <article class="now-card">
          <div class="now-thumb"><span class="play-button">▶</span><span class="thumb-caption">MODULE 04 · 12 MIN</span></div>
          <div class="now-details"><div class="now-heading"><span class="preview-label">PICK UP WHERE YOU LEFT OFF</span><span class="course-progress">62%</span></div><h3>Designing with data</h3><p>Build a story around the numbers that matter.</p><div class="progress-track"><span style="width:62%" /></div><a href="/dashboard" class="resume-link">Continue learning <span>→</span></a></div>
        </article>
        <div class="preview-bottom"><div><span class="preview-label">THIS WEEK</span><strong>2h 40m</strong><small>of intentional learning</small></div><div class="week-dots"><span class="done">M</span><span class="done">T</span><span>W</span><span>T</span><span>F</span></div></div>
        <div class="preview-note"><span>✦</span> A little progress, made consistently.</div>
      </div>
      <span class="hero-orbit orbit-one" /><span class="hero-orbit orbit-two" />
    </section>

    <section class="trust-section" aria-label="Trusted by learners and teams">
      <p>Learning alongside teams at</p><div class="trust-logos"><span>Northstar</span><span>◈ orbit</span><span>meridian</span><span>FIELDWORK</span><span>nōva</span></div>
    </section>

    <section class="section-block expertise-section">
      <div class="section-intro"><div><span class="eyebrow">Learn what moves you</span><h2>Skills for the work<br>ahead.</h2></div><p>Practical knowledge, taught by the people doing the work. Start with a subject, then make it your own.</p></div>
      <div class="expertise-list">
        <RouterLink v-for="(area, index) in expertise" :key="area.name" class="expertise-item" :to="{ path: '/catalogue', query: { category: area.category } }"><span class="expertise-index">0{{ index + 1 }}</span><span class="expertise-icon">{{ area.icon }}</span><span class="expertise-name">{{ area.name }}</span><span class="expertise-meta">{{ area.note }}</span><span class="expertise-arrow">↗</span></RouterLink>
      </div>
      <RouterLink class="text-link all-skills" to="/catalogue">Browse all learning paths <span>→</span></RouterLink>
    </section>

    <section class="featured-section">
      <div class="section-block featured-inner">
        <div class="section-intro"><div><span class="eyebrow">Selected for you</span><h2>Good places to begin.</h2></div><RouterLink class="text-link" to="/catalogue">View all courses <span>→</span></RouterLink></div>
        <div class="course-grid">
          <article v-for="(course, index) in displayedCourses" :key="course.id || course.title" class="home-course-card" :role="course.id ? 'link' : undefined" :tabindex="course.id ? 0 : undefined" @click="course.id && goToCourse(course.id)" @keydown.enter="course.id && goToCourse(course.id)">
            <div class="course-art" :class="`art-${index + 1}`"><span class="art-label">{{ course.category || course.categorie || 'LEARNING PATH' }}</span><div class="art-symbol">{{ course.symbol || ['◒', '⌘', '↗'][index % 3] }}</div><span class="art-note">{{ course.duration || ['6 weeks', '4.5 hours', '8 modules'][index % 3] }}</span></div>
            <div class="home-course-body"><div class="course-meta"><span>{{ course.level || ['FOUNDATION', 'INTERMEDIATE', 'PRACTICAL'][index % 3] }}</span><span class="rating">★ {{ course.rating || '4.9' }}</span></div><h3>{{ course.title || course.titre }}</h3><p>{{ course.description || 'Learn a practical skill you can put to work right away.' }}</p><div class="course-instructor"><span class="instructor-avatar">{{ (course.instructor || course.formateur?.name || ['AR', 'MK', 'JL'][index % 3]).slice(0, 1) }}</span><span>{{ course.instructor || course.formateur?.name || ['Alex Rivera', 'Mina Kwon', 'Jordan Lee'][index % 3] }}</span><span class="course-link">↗</span></div></div>
          </article>
        </div>
        <p v-if="!featuredCourses.length" class="course-fallback-note">A few thoughtful places to begin—more expert-led courses are waiting in the catalogue.</p>
      </div>
    </section>

    <section id="how-it-works" class="section-block method-section">
      <div class="method-copy"><span class="eyebrow">A steady path, not a sprint</span><h2>Learn a little.<br><em>Use a lot.</em></h2><p>Build lasting skills through focused lessons, useful practice, and progress you can actually see.</p><RouterLink class="button button-dark" to="/register">Find your learning path <span>↗</span></RouterLink></div>
      <div class="method-steps"><article v-for="(step, index) in steps" :key="step.title"><span class="step-number">0{{ index + 1 }}</span><div><h3>{{ step.title }}</h3><p>{{ step.desc }}</p></div></article><div class="certificate-note"><span>✳</span><div><strong>Make it count.</strong><p>Finish with a certificate that shows what you can do.</p></div></div></div>
    </section>

    <section class="audiences-section"><div class="section-block"><div class="section-intro"><div><span class="eyebrow">Built for your next chapter</span><h2>One place to grow.<br>Room for everyone.</h2></div></div><div class="audience-grid"><RouterLink to="/register" class="audience-card"><span class="audience-icon">↗</span><span class="eyebrow">FOR INDIVIDUALS</span><h3>Take your next step.</h3><p>Learn on your own terms, keep your momentum, and take new skills into your work.</p><span class="audience-link">Start learning →</span></RouterLink><RouterLink to="/register" class="audience-card audience-sage"><span class="audience-icon">✳</span><span class="eyebrow">FOR INSTRUCTORS</span><h3>Teach what you know.</h3><p>Share your expertise with learners ready to put it into practice.</p><span class="audience-link">Teach with us →</span></RouterLink><a href="mailto:teams@elearninghub.example" class="audience-card"><span class="audience-icon">◫</span><span class="eyebrow">FOR TEAMS</span><h3>Grow, together.</h3><p>Give your people a shared space to build skills and make progress visible.</p><span class="audience-link">Explore team learning →</span></a></div></div></section>

    <section class="faq-section section-block"><div class="faq-heading"><span class="eyebrow">A few good questions</span><h2>Before you begin.</h2><p>Clear answers, so you can focus on the learning.</p></div><div class="faq-list"><details v-for="item in faqs" :key="item.question"><summary>{{ item.question }}<span>+</span></summary><p>{{ item.answer }}</p></details></div></section>
    <section class="final-cta"><div><span class="eyebrow">Your next chapter starts small</span><h2>Choose one skill.<br><em>See where it takes you.</em></h2></div><RouterLink class="button button-primary" to="/catalogue">Find your first course <span>↗</span></RouterLink></section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../axios';

const router = useRouter();
const featuredCourses = ref([]);
const expertise = [
  { name: 'Technology & code', category: 'Développement Web', icon: '⌘', note: 'Build what’s next' },
  { name: 'Data & AI', category: 'Data Science', icon: '◉', note: 'Find the signal' },
  { name: 'Product & design', category: 'Design', icon: '◌', note: 'Make it useful' },
  { name: 'Business & leadership', category: 'Business', icon: '↗', note: 'Move work forward' },
];
const steps = [
  { title: 'Choose your direction', desc: 'Find a course that fits your goals, your starting point, and the time you have.' },
  { title: 'Learn in focused sessions', desc: 'Watch expert lessons, practice with short quizzes, and pick up right where you paused.' },
  { title: 'Show what you can do', desc: 'Track steady progress, finish your path, and earn a certificate you can share.' },
];
const faqs = [
  { question: 'How do I choose the right course?', answer: 'Start with the skill you want to use in your work. Each course shows what you will learn, the expected level, and who is teaching it, so you can choose with confidence.' },
  { question: 'Can I learn at my own pace?', answer: 'Yes. Lessons are available when you are, and your progress is saved so you can return whenever it suits you.' },
  { question: 'Do courses include certificates?', answer: 'Courses with a certificate award one when you complete the required lessons and assessments. You can revisit your learning progress from your dashboard.' },
  { question: 'Can my team learn together?', answer: 'E-Learning Hub supports team learning with shared progress and learning dashboards. Get in touch to explore a path for your organization.' },
];
const fallbackCourses = [
  { title: 'The essentials of product thinking', category: 'PRODUCT & DESIGN', description: 'Turn ambiguous problems into work worth doing.', symbol: '◒', duration: '6 weeks', level: 'FOUNDATION', rating: '4.9', instructor: 'Alex Rivera' },
  { title: 'Data storytelling for better decisions', category: 'DATA & AI', description: 'Make complex information clear and actionable.', symbol: '⌘', duration: '4.5 hours', level: 'INTERMEDIATE', rating: '4.8', instructor: 'Mina Kwon' },
  { title: 'Build with modern web tools', category: 'TECHNOLOGY', description: 'Create useful, accessible digital experiences.', symbol: '↗', duration: '8 modules', level: 'PRACTICAL', rating: '4.9', instructor: 'Jordan Lee' },
];
const displayedCourses = computed(() => featuredCourses.value.length ? featuredCourses.value : fallbackCourses);
const courseSymbols = ['◒', '⌘', '↗'];
const courseDurations = ['6 weeks', '4.5 hours', '8 modules'];
onMounted(async () => {
  try {
    const response = await api.get('/cours');
    featuredCourses.value = (response.data?.data || []).slice(0, 3).map((course, index) => ({ ...course, symbol: courseSymbols[index % courseSymbols.length], duration: courseDurations[index % courseDurations.length] }));
  } catch {
    // Curated illustrative course cards keep the public landing page useful while the API is offline.
  }
});
function goToCourse(id) { router.push(`/cours/${id}`); }
</script>

<style scoped>
.home-page { --ink: #23332a; --muted: #778078; --sage: #537a62; --paper: #fbfaf6; --line: #e8e8df; --serif: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif; color: var(--ink); background: var(--paper); }
.home-page a { color: inherit; text-decoration: none; }
.home-hero { min-height: 670px; position: relative; overflow: hidden; display: grid; grid-template-columns: minmax(0, .96fr) minmax(400px, 1fr); gap: clamp(42px, 7vw, 110px); align-items: center; max-width: 1320px; margin: auto; padding: 92px 8vw 94px; }
.hero-copy { position: relative; z-index: 1; max-width: 510px; }
.eyebrow { display: inline-flex; align-items: center; gap: 10px; color: var(--sage); font-size: 11px; letter-spacing: .12em; font-weight: 700; text-transform: uppercase; }
.focus-dot, .focus-pill i { width: 7px; height: 7px; border-radius: 50%; background: #709277; display: inline-block; }
.hero-copy h1, .section-intro h2, .method-copy h2, .faq-heading h2, .final-cta h2 { font-family: var(--serif); font-size: clamp(48px, 5.3vw, 72px); font-weight: 400; line-height: .99; letter-spacing: -.045em; margin: 24px 0; }
.hero-copy h1 em, .method-copy h2 em, .final-cta h2 em { font-weight: 400; color: var(--sage); }
.hero-copy > p, .method-copy > p { max-width: 425px; color: #737c75; line-height: 1.8; font-size: 16px; }
.hero-actions { display: flex; align-items: center; gap: 28px; margin-top: 32px; }
.button { min-height: 48px; border-radius: 6px; padding: 0 21px; display: inline-flex; align-items: center; gap: 20px; font-size: 13px; font-weight: 650; transition: background .18s ease, transform .18s ease; }
.button:hover { transform: translateY(-1px); }
.button-primary { color: #fff !important; background: #537a62; }
.button-primary:hover { background: #456c54; }
.button-dark { background: #26372d; color: white !important; }
.text-link { color: #4b6554 !important; font-size: 13px; font-weight: 650; }
.text-link span { margin-left: 8px; }
.hero-proof { display: flex; align-items: center; gap: 12px; color: #7b837d; font-size: 11px; margin-top: 48px; }
.hero-proof strong { color: #33473a; }
.avatar-stack { display: flex; padding-left: 4px; }
.avatar-stack i { display: grid; place-items: center; width: 25px; height: 25px; margin-left: -4px; border-radius: 50%; border: 2px solid var(--paper); background: #d9c7ad; color: #564736; font-style: normal; font-size: 9px; }
.avatar-stack i:nth-child(2) { background: #d0ddd1; }.avatar-stack i:nth-child(3) { background: #e5d8c9; }
.learning-preview { position: relative; z-index: 1; width: min(100%, 530px); justify-self: end; padding: 26px 30px 20px; border: 1px solid #e6e7de; border-radius: 12px; background: rgba(255,255,255,.83); box-shadow: 0 26px 80px rgba(61,73,59,.10); }
.preview-topline, .preview-welcome, .now-heading, .preview-bottom { display: flex; align-items: center; justify-content: space-between; }
.preview-topline { padding-bottom: 22px; border-bottom: 1px solid #efefe9; }
.preview-mark { font-size: 12px; font-weight: 700; color: #405446; }.preview-mark span { display: inline-grid; place-items: center; width: 20px; height: 20px; margin-right: 6px; border-radius: 6px 6px 6px 2px; background: #dce8dc; color: #537a62; }
.preview-date, .preview-label { color: #939a91; font-size: 8px; font-weight: 700; letter-spacing: .12em; }
.preview-welcome { margin: 24px 0 18px; align-items: flex-end; }.preview-welcome h2 { font-family: var(--serif); font-weight: 400; margin: 6px 0 0; font-size: 24px; letter-spacing: -.03em; }
.focus-pill { display: inline-flex; align-items: center; gap: 6px; border-radius: 20px; padding: 7px 9px; background: #f1f4ed; color: #5e725e; font-size: 9px; }
.now-card { overflow: hidden; border: 1px solid #eaebe4; border-radius: 8px; background: #fff; }
.now-thumb { min-height: 133px; display: flex; align-items: center; justify-content: center; position: relative; background: linear-gradient(115deg, #dce7dd 0%, #c7d7cd 42%, #e9e6d9 100%); }
.now-thumb::before, .now-thumb::after { content: ''; position: absolute; border: 1px solid rgba(73,100,76,.22); border-radius: 50%; width: 200px; height: 80px; transform: rotate(-18deg); }.now-thumb::after { width: 130px; height: 50px; transform: rotate(24deg); }
.play-button { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; color: #fff; background: rgba(45,67,49,.75); font-size: 11px; padding-left: 2px; }
.thumb-caption { position: absolute; left: 13px; bottom: 11px; color: #596b5c; font-size: 8px; font-weight: 700; letter-spacing: .1em; }
.now-details { padding: 16px 17px 14px; }.course-progress { color: #52775c; font-size: 10px; font-weight: 700; }.now-details h3 { margin: 8px 0 3px; font-size: 15px; letter-spacing: -.02em; }.now-details p { margin: 0; color: #838a83; font-size: 10px; }
.progress-track { height: 4px; margin: 14px 0 10px; overflow: hidden; border-radius: 4px; background: #eef0eb; }.progress-track span { height: 100%; display: block; border-radius: 4px; background: #6f9276; }
.resume-link { display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #506d57 !important; font-weight: 700; }
.preview-bottom { justify-content: flex-start; gap: 22px; padding: 19px 4px 4px; }.preview-bottom > div:first-child { display: grid; gap: 4px; }.preview-bottom strong { font-family: var(--serif); font-size: 21px; font-weight: 400; }.preview-bottom small { color: #858d85; font-size: 9px; }
.week-dots { display: flex; gap: 6px; margin-left: auto; }.week-dots span { width: 23px; height: 23px; border: 1px solid #e9eae3; color: #9b9f98; border-radius: 50%; display: grid; place-items: center; font-size: 8px; }.week-dots span.done { background: #e7eee5; border-color: #e7eee5; color: #557258; }
.preview-note { margin-top: 18px; border-top: 1px solid #efefe9; padding-top: 13px; color: #808780; font-size: 9px; }.preview-note span { color: #9a9c74; margin-right: 5px; }
.hero-orbit { position: absolute; z-index: 0; pointer-events: none; border: 1px solid rgba(138,158,129,.14); border-radius: 50%; }.orbit-one { width: 470px; height: 470px; top: 4%; right: -2%; }.orbit-two { width: 590px; height: 590px; top: -5%; right: -7%; }
.trust-section { padding: 30px 8vw 35px; text-align: center; border-block: 1px solid var(--line); background: #f7f6f0; }.trust-section p { color: #91978e; font-size: 10px; text-transform: uppercase; letter-spacing: .12em; }.trust-logos { display: flex; align-items: center; justify-content: center; gap: clamp(25px, 6vw, 84px); flex-wrap: wrap; margin-top: 23px; color: #858c83; }.trust-logos span { font-family: var(--serif); font-size: 17px; letter-spacing: .015em; }
.section-block { max-width: 1160px; margin: 0 auto; padding: 105px 32px; }.section-intro { display: flex; align-items: end; justify-content: space-between; gap: 36px; margin-bottom: 40px; }.section-intro h2, .faq-heading h2 { margin: 15px 0 0; font-size: clamp(38px, 4vw, 52px); line-height: 1.06; }.section-intro > p { max-width: 380px; color: #7b837c; line-height: 1.75; font-size: 13px; }
.expertise-list { border-top: 1px solid var(--line); }.expertise-item { display: grid; grid-template-columns: 48px 48px minmax(200px,1fr) 1fr 20px; align-items: center; gap: 12px; min-height: 73px; padding: 0 10px; border-bottom: 1px solid var(--line); transition: background .18s ease, padding .18s ease; }.expertise-item:hover { padding-inline: 17px; background: #f4f4ed; }.expertise-index { color: #a1a79f; font-size: 10px; }.expertise-icon { color: #62806a; font-size: 18px; }.expertise-name { font-family: var(--serif); font-size: 18px; }.expertise-meta { color: #899188; font-size: 11px; }.expertise-arrow { justify-self: end; color: #6d8570; }.all-skills { display: inline-block; margin-top: 22px; }
.featured-section { background: #f3f3ed; }.featured-inner { padding-block: 98px; }.featured-inner .section-intro { margin-bottom: 31px; }.featured-inner .section-intro h2 { font-size: clamp(36px, 4vw, 48px); }.course-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px; }.home-course-card { overflow: hidden; border: 1px solid #e4e6dd; border-radius: 8px; background: #fff; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease; }.home-course-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(40,60,44,.08); }.course-art { min-height: 150px; display: flex; position: relative; align-items: center; justify-content: center; overflow: hidden; background: #dfe8df; }.art-2 { background: #e8e1d4; }.art-3 { background: #dfe4e8; }.art-label, .art-note { position: absolute; font-size: 8px; letter-spacing: .12em; font-weight: 700; color: #5b6f5e; }.art-label { top: 14px; left: 15px; }.art-note { right: 15px; bottom: 13px; }.art-symbol { font-family: var(--serif); font-size: 75px; line-height: 1; color: rgba(72,101,76,.68); transform: rotate(-10deg); }.art-2 .art-symbol { color: rgba(143,107,70,.64); transform: rotate(10deg); }.art-3 .art-symbol { color: rgba(74,101,121,.65); }.home-course-body { padding: 17px; }.course-meta { display: flex; justify-content: space-between; color: #90988f; font-size: 8px; letter-spacing: .1em; font-weight: 700; }.rating { color: #8b7b4d; font-size: 10px; letter-spacing: 0; }.home-course-body h3 { min-height: 44px; margin: 12px 0 6px; font-family: var(--serif); font-weight: 400; font-size: 20px; line-height: 1.15; }.home-course-body > p { min-height: 34px; color: #7e877f; font-size: 11px; line-height: 1.55; }.course-instructor { display: flex; align-items: center; gap: 8px; margin-top: 17px; padding-top: 13px; border-top: 1px solid #eeefe9; color: #737d73; font-size: 10px; }.instructor-avatar { display: grid; place-items: center; width: 25px; height: 25px; border-radius: 50%; background: #e8eee6; color: #557259; font-size: 10px; }.course-link { margin-left: auto; color: #56725c; }.course-fallback-note { color: #838b83; font-size: 11px; margin: 15px 0 0; }
.method-section { display: grid; grid-template-columns: .88fr 1fr; gap: clamp(50px, 10vw, 140px); align-items: center; }.method-copy h2 { font-size: clamp(42px, 4.3vw, 57px); }.method-copy .button { margin-top: 20px; }.method-steps article { display: grid; grid-template-columns: 48px 1fr; gap: 15px; padding: 20px 0; border-bottom: 1px solid var(--line); }.step-number { color: #8c9b8a; font-size: 10px; padding-top: 4px; }.method-steps h3 { font-size: 13px; margin: 0 0 6px; }.method-steps article p, .certificate-note p { margin: 0; color: #7e877e; font-size: 11px; line-height: 1.65; }.certificate-note { margin-top: 17px; display: flex; gap: 13px; padding: 17px; border-radius: 6px; background: #f2f4ed; color: #68816b; }.certificate-note strong { display: block; margin-bottom: 4px; font-size: 11px; color: #445b48; }
.audiences-section { background: #f3f3ed; }.audience-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; }.audience-card { display: flex; flex-direction: column; min-height: 260px; padding: 23px; border: 1px solid #e3e5dc; border-radius: 7px; background: var(--paper); transition: transform .2s ease, border-color .2s ease; }.audience-card:hover { transform: translateY(-2px); border-color: #aabca9; }.audience-sage { background: #e8ede5; }.audience-icon { align-self: flex-end; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(99,129,103,.12); color: #57745e; margin-bottom: 25px; }.audience-card .eyebrow { font-size: 9px; }.audience-card h3 { margin: 10px 0; font-family: var(--serif); font-size: 23px; font-weight: 400; }.audience-card p { color: #7c857c; font-size: 11px; line-height: 1.7; }.audience-link { margin-top: auto; padding-top: 19px; color: #55735c; font-size: 11px; font-weight: 700; }
.faq-section { display: grid; grid-template-columns: .78fr 1fr; gap: 80px; }.faq-heading h2 { margin-bottom: 12px; }.faq-heading > p { color: #808980; font-size: 12px; }.faq-list details { padding: 18px 0; border-bottom: 1px solid var(--line); }.faq-list details:first-child { border-top: 1px solid var(--line); }.faq-list summary { display: flex; justify-content: space-between; gap: 20px; cursor: pointer; list-style: none; font-size: 13px; font-weight: 600; }.faq-list summary::-webkit-details-marker { display: none; }.faq-list summary span { color: #658069; font-size: 18px; font-weight: 400; transition: transform .18s ease; }.faq-list details[open] summary span { transform: rotate(45deg); }.faq-list details p { max-width: 570px; margin: 12px 28px 2px 0; color: #778078; font-size: 12px; line-height: 1.7; }
.final-cta { display: flex; justify-content: space-between; align-items: center; gap: 40px; padding: 70px max(8vw, calc((100vw - 1160px)/2)); background: #e8eee7; }.final-cta h2 { font-size: clamp(36px, 4vw, 50px); margin: 14px 0 0; }
@media (max-width: 880px) { .home-hero { grid-template-columns: 1fr; padding: 78px 7vw 68px; gap: 45px; }.hero-copy { max-width: 620px; }.learning-preview { justify-self: center; }.hero-orbit { right: -30%; }.section-block { padding: 78px 6vw; }.method-section, .faq-section { grid-template-columns: 1fr; gap: 35px; }.audience-grid { grid-template-columns: 1fr 1fr; }.audience-card:last-child { grid-column: span 2; } }
@media (max-width: 600px) { .home-hero { padding: 68px 22px 52px; }.hero-copy h1 { font-size: 52px; }.hero-actions { gap: 18px; flex-wrap: wrap; }.hero-proof { margin-top: 32px; }.learning-preview { padding: 19px 17px 15px; }.preview-date { display: none; }.preview-welcome h2 { font-size: 20px; }.trust-section { padding-inline: 18px; }.trust-logos { gap: 18px 25px; }.trust-logos span { font-size: 14px; }.section-block, .featured-inner { padding: 68px 22px; }.section-intro { align-items: flex-start; flex-direction: column; gap: 15px; }.section-intro h2 { font-size: 39px; }.expertise-item { grid-template-columns: 24px 28px minmax(0,1fr) 18px; gap: 8px; min-height: 67px; }.expertise-meta { display: none; }.expertise-name { font-size: 16px; }.course-grid { grid-template-columns: 1fr; }.course-art { min-height: 140px; }.audience-grid { grid-template-columns: 1fr; }.audience-card:last-child { grid-column: auto; }.audience-card { min-height: 225px; }.final-cta { align-items: flex-start; flex-direction: column; padding: 54px 22px; }.final-cta h2 { font-size: 38px; } }
@media (prefers-reduced-motion: reduce) { .home-page *, .home-page *::before, .home-page *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
</style>
