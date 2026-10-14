import { flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import DashboardView from '../src/views/DashboardView.vue';
import { useAuthStore } from '../src/stores/auth';
import { mountView } from './test-utils.js';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('../src/axios', () => ({
  default: {
    get: mockGet,
  },
}));

vi.mock('../src/composables/useToast.js', () => ({
  showErrorToast: vi.fn(),
}));

describe('DashboardView', () => {
  let pinia;
  let router;
  let authStore;

  async function mountDashboard() {
    await router.push('/dashboard');
    await router.isReady();

    return mountView(DashboardView, {
      global: {
        plugins: [pinia, router],
      },
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();

    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/dashboard', component: DashboardView },
        { path: '/cours/:id/apprendre', component: { template: '<div />' } },
      ],
    });

    authStore = useAuthStore();
    authStore._persist({ id: 1, name: 'Test User', role: 'apprenant' });

    mockGet.mockResolvedValue({
      data: [
        {
          cours: {
            id: 1,
            titre: 'Course 1',
            categorie: 'Développement Web',
            formateur: { name: 'Expert' },
            quizzes: [],
          },
          inscription: {
            cours_id: 1,
            pourcentageProgression: 50,
          },
        },
      ],
    });
  });

  it('renders loading skeleton initially', async () => {
    const wrapper = await mountDashboard();

    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);
  });

  it('shows enrolled courses after load', async () => {
    const wrapper = await mountDashboard();

    await flushPromises();

    expect(wrapper.text()).toContain('Course 1');
    expect(wrapper.find('.resume-hero-panel').exists()).toBe(true);
  });

  it('shows empty state when no courses', async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const wrapper = await mountDashboard();
    await flushPromises();

    expect(wrapper.find('.empty-state-card').exists()).toBe(true);
    expect(wrapper.text()).toContain('Aucune formation en cours');
  });
});
