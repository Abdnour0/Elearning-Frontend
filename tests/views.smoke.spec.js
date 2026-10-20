import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { mountView } from './test-utils.js';
import { useAuthStore } from '../src/stores/auth';

// ── Views under test ─────────────────────────────────────────────
import HomeView from '../src/views/HomeView.vue';
import CatalogView from '../src/views/CatalogView.vue';
import CourseDetailView from '../src/views/CourseDetailView.vue';
import LoginView from '../src/views/LoginView.vue';
import RegisterView from '../src/views/RegisterView.vue';
import DashboardView from '../src/views/DashboardView.vue';
import CourseLearnView from '../src/views/CourseLearnView.vue';
import QuizView from '../src/views/QuizView.vue';
import QuizResultsView from '../src/views/QuizResultsView.vue';
import ProfileView from '../src/views/ProfileView.vue';
import FormateurDashboard from '../src/views/FormateurDashboard.vue';
import CourseCreateView from '../src/views/CourseCreateView.vue';
import CourseStatsView from '../src/views/CourseStatsView.vue';
import AdminDashboard from '../src/views/AdminDashboard.vue';
import AdminUsersView from '../src/views/AdminUsersView.vue';
import AdminAuditView from '../src/views/AdminAuditView.vue';

// ── Mocks ────────────────────────────────────────────────────────
const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('../src/axios', () => ({
  default: { get: mockGet, post: mockPost, put: mockPut, delete: mockDelete },
}));

vi.mock('../src/composables/useToast.js', () => ({
  showErrorToast: vi.fn(),
  showToast: vi.fn(),
}));

// Charts need a canvas; stub them out for jsdom.
vi.mock('vue-chartjs', () => ({
  Bar: { name: 'Bar', template: '<div class="chart-bar-stub" />' },
  Doughnut: { name: 'Doughnut', template: '<div class="chart-doughnut-stub" />' },
  Line: { name: 'Line', template: '<div class="chart-line-stub" />' },
}));

vi.mock('jspdf', () => ({
  default: vi.fn(() => ({ text: vi.fn(), save: vi.fn(), autoTable: vi.fn() })),
}));
vi.mock('jspdf-autotable', () => ({}));

const VIEWS = [
  { name: 'HomeView', component: HomeView, path: '/', role: null },
  { name: 'CatalogView', component: CatalogView, path: '/catalogue', role: null },
  { name: 'CourseDetailView', component: CourseDetailView, path: '/cours/1', role: null },
  { name: 'LoginView', component: LoginView, path: '/login', role: null },
  { name: 'RegisterView', component: RegisterView, path: '/register', role: null },
  { name: 'DashboardView', component: DashboardView, path: '/dashboard', role: 'apprenant' },
  { name: 'CourseLearnView', component: CourseLearnView, path: '/cours/1/apprendre', role: 'apprenant' },
  { name: 'QuizView', component: QuizView, path: '/quiz/1', role: 'apprenant' },
  { name: 'QuizResultsView', component: QuizResultsView, path: '/quiz/1/resultats', role: 'apprenant' },
  { name: 'ProfileView', component: ProfileView, path: '/profil', role: 'apprenant' },
  { name: 'FormateurDashboard', component: FormateurDashboard, path: '/formateur', role: 'formateur' },
  { name: 'CourseCreateView', component: CourseCreateView, path: '/formateur/cours/creer', role: 'formateur' },
  { name: 'CourseStatsView', component: CourseStatsView, path: '/formateur/cours/1/stats', role: 'formateur' },
  { name: 'AdminDashboard', component: AdminDashboard, path: '/admin', role: 'admin' },
  { name: 'AdminUsersView', component: AdminUsersView, path: '/admin/users', role: 'admin' },
  { name: 'AdminAuditView', component: AdminAuditView, path: '/admin/audit', role: 'admin' },
];

function makeRouter(component, path) {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path, component },
      { path: '/:pathMatch(.*)*', component: { template: '<div />' } },
    ],
  });
}

describe('View smoke tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Universal payload: an array that also exposes pagination fields, so views
    // that expect a plain array AND views that expect { data, last_page } both work.
    const payload = Object.assign([], { data: [], last_page: 1 });
    mockGet.mockResolvedValue({ data: payload });
    mockPost.mockResolvedValue({ data: {} });
    mockPut.mockResolvedValue({ data: {} });
    mockDelete.mockResolvedValue({ data: {} });
  });

  for (const view of VIEWS) {
    it(`${view.name} mounts and renders without throwing`, async () => {
      const pinia = createPinia();
      setActivePinia(pinia);

      const authStore = useAuthStore();
      authStore.$patch({
        user: view.role
          ? { id: 1, name: 'Test User', email: 'test@example.com', role: view.role }
          : null,
      });

      const router = makeRouter(view.component, view.path);
      await router.push(view.path);
      await router.isReady();

      const wrapper = mountView(view.component, {
        global: { plugins: [pinia, router] },
      });

      await flushPromises();

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html().length).toBeGreaterThan(0);

      wrapper.unmount();
    });
  }
});

// ── I-2 regression guard ─────────────────────────────────────────
// Both views previously jumped from <h2>/<h3> with no page <h1> at all, which
// fails heading-order checks and leaves the page title out of the a11y tree.
// The h1 is visually hidden (the designs have no title slot), so assert both
// that it exists once and that it carries the .sr-only class.
describe('Page heading present (I-2)', () => {
  it.each([
    ['ProfileView', ProfileView, '/profil'],
    ['QuizResultsView', QuizResultsView, '/quiz/1/resultats'],
  ])('%s exposes exactly one <h1>', async (_name, component, path) => {
    const pinia = createPinia();
    setActivePinia(pinia);
    useAuthStore().$patch({
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'apprenant' },
    });

    const router = makeRouter(component, path);
    await router.push(path);
    await router.isReady();

    const wrapper = mountView(component, { global: { plugins: [pinia, router] } });
    await flushPromises();

    const h1s = wrapper.findAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0].classes()).toContain('sr-only');
    expect(h1s[0].text().length).toBeGreaterThan(0);

    wrapper.unmount();
  });
});
