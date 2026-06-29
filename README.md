# Mini E-Learning Platform — Frontend

**Context**: 2nd year (2024), end-of-module project for Web Development at EMSI.

**Problem**: EMSI students had no centralized platform to access course materials, track progress, or interact with content online. Materials were scattered across email, WhatsApp, and USB drives.

**Role**: Solo — full-stack design, development, and deployment.

## Tech Stack

- **Frontend**: Vue.js 3 SPA (Vuetify 3, Pinia, Vue Router) with lazy-loaded routes and manual Vite chunk splitting for sub-500kB bundles
- **Backend repo**: Laravel (PHP 8.2, MySQL 8, Redis 7) with RESTful API under `/api/v1/*`
- **Infrastructure**: Docker Compose with multi-stage builds, MySQL 8 + Redis 7, Nginx with gzip and immutable asset caching
- **Analytics**: Chart.js for enrollment/quiz charts, jsPDF for exports

## Architecture

Decoupled frontend and backend from day one so a future mobile app could reuse the same API without a rewrite.

## Authentication

Laravel Sanctum with cookie-based sessions. Axios interceptor queues failed requests during token refresh and retries transparently, preserving the learner's view state.

## RBAC

Three roles — `apprenant`, `formateur`, `admin`. Enforced via Laravel gates, route middleware, and Vue router guards with role-based redirects. Lesson content URLs are stripped from API responses for unenrolled users.

## UX

- Shared `useViewLoadState` composable (initial → loading → loaded) across all views
- Global toast system for all API errors
- Axios interceptor handles 401, 419 (CSRF retry), 403/429/500
- Catalog search debounced at 350ms
- Skeleton loaders on all major views
- Confetti animation on lesson completion and quiz passing
- Course learn hub with sidebar curriculum, progress tracking, content player
- Admin dashboard with KPI cards, bar/doughnut/line charts

## Testing

7 Vitest component tests covering CatalogView, DashboardView, QuizView + 3 auth store tests.

## Deployment

Frontend hosted on Vercel at [elearning-frontend-five-olive.vercel.app](https://elearning-frontend-five-olive.vercel.app).

## Features

- Course catalog browsing with category/search filtering
- User enrollment with one-click registration
- Lesson viewing (video, PDF, image, text)
- Timed quizzes with instant scoring and corrections
- Dashboard with progression tracking
- Formateur course management (create, edit, publish, unpublish)
- Admin analytics with CSV/PDF exports

## Reflection

- Would design RBAC from day one (did — it was the best architectural decision)
- Would write integration tests before the first deploy instead of retrofitting them afterward
- Most proud of the clean API contract — it made the mobile app pivot trivial
- Biggest lesson: CORS, environment chaining, and zero-downtime deployment are architecture decisions, not "ops problems"

## Links

- **Live**: https://elearning-frontend-five-olive.vercel.app
- **Backend repo**: https://github.com/Abdnour0/Elearning-Backend
