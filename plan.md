# E-Learning Hub — Implementation and Design Plan

## Product scope

Refine the selected Vue 3/Vite/Vuetify application into a calm, task-first E-Learning Hub. Preserve its Laravel API contract, Pinia authentication/role model, Vue Router URLs and existing learning workflows rather than replacing working product behavior with static mock screens. Prioritize the public home and course discovery flow, the learner's next action, and a coherent shared shell; role-specific instructor/admin, lesson, quiz, results, profile and auth destinations remain connected through the existing routes.

## Implementation approach

- Keep Vue 3 Composition API, Vuetify 3, Pinia, Vue Router, Axios, and the existing API-backed data fetching. Avoid new runtime dependencies.
- Rework the shared application theme and navigation from dark/glass/animated to warm, high-contrast light surfaces, focused controls, quiet borders and restrained motion.
- Refactor the public homepage into a clear product story: hero with one primary action, social proof, expertise paths, API-backed featured courses, a short learning sequence, learner/instructor/team paths, FAQ, and final CTA.
- Simplify catalogue presentation around search, scannable filters/results and course details. Retain existing search debounce, pagination, enrollment, authentication redirect and API behavior.
- Restyle the learner dashboard around resume-learning first, meaningful progress, enrolled courses and an intentional empty state; retain role auth, API loading/errors, lesson, quiz and catalogue links.
- Preserve all existing route patterns and the existing instructor, admin, quiz/results, course detail/player, registration/login and profile functionality.
- Add/update `public/manus-routes.json` to reflect actual source routes before starting the Vite server. Keep labels/head metadata consistent with the redesigned home.

## Project structure

- `src/App.vue`: shared navigation, authenticated-role links, footer and route outlet.
- `src/main.js`: Vuetify theme and app/plugin setup.
- `src/assets/app.css`: shared palette, typography, layout primitives, focus states and reduced-motion behavior.
- `src/views/HomeView.vue`: public marketing homepage and API-backed featured courses.
- `src/views/CatalogView.vue`: search/filter/pagination/enrollment catalogue.
- `src/views/DashboardView.vue`: learner progress and resume-learning dashboard.
- `src/views/*`: existing course, lesson, quiz, instructor, admin, auth and profile workflows.
- `src/router/index.js`, `src/stores/`, `src/composables/`, `src/axios.js`: established routes, RBAC, state and API behavior to preserve.
- `public/manus-routes.json`: static route declaration synchronized with `src/router/index.js`.

## Design system

- **Design Movement:** Quiet editorial product design with Swiss-influenced information hierarchy and a soft, nature-inspired modern workspace.
- **Core Principles:** 1) One obvious next step; 2) information density follows learner intent; 3) calm whitespace, clear grouping, no visual noise; 4) progress is visible without gamification pressure.
- **Color Philosophy:** Warm ivory canvas reduces glare; deep ink gives excellent reading contrast; muted sage is the ownable action/progress hue; clay/sand surfaces make the product feel human. Reserve saturated color for state, focus and meaningful actions, not decoration.
- **Layout Paradigm:** Left-aligned editorial content, readable constrained text measure, asymmetric feature split, and spacious vertical rhythm. Dashboards use a clear primary learning rail with supporting context rather than a dense centered grid.
- **Signature Elements:** A small sage “focus” marker beside the current next action; compact linear progress tracks; soft-paper cards with hairline borders.
- **Interaction Philosophy:** Stable and direct; keep focus visible, make whole cards keyboard reachable only where genuinely actionable, use plain labels, show loading/error states, and avoid surprise motion or decorative hover effects.
- **Animation:** No ambient loops or parallax. Use short opacity/translate transitions only for route/section entry; respect `prefers-reduced-motion`; state transitions remain understandable when motion is disabled.
- **Typography System:** Plus Jakarta Sans for product UI, with a restrained editorial display scale; 15–17px body text, strong sentence-case headings, tabular figures for metrics, and no all-caps tracking-heavy body labels.
- **Brand Essence:** A quiet, practical learning workspace for people and teams building future-ready skills. Personality: **clear, steady, capable**.
- **Brand Voice:** Specific, encouraging, never inflated. Example: “Make room for your next skill.” / “Pick up where you left off.”
- **Wordmark & Logo:** A distinctive open-book/forward-path mark paired with the “E-Learning Hub” wordmark; use the existing icon system as a simple consistent mark rather than introducing image dependencies.
- **Signature Brand Color:** Muted sage `#537a62`.

## User requirements retained

E-Learning Hub is an online learning platform for in-demand technology and business skills through immersive expert-led courses. Its mission is to help learners propel their careers into the future and reach the top 1%. It serves individual learners, certified instructors publishing courses, and companies training teams at scale. Product capabilities include video lessons, quizzes, progress tracking, verifiable certificates, and enterprise learning dashboards. Existing public marketing, catalogue, course details, learner/instructor/admin dashboards, quizzes and results remain reachable.
