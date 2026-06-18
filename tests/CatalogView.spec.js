import { flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import CatalogView from '../src/views/CatalogView.vue';
import { useAuthStore } from '../src/stores/auth';
import { mountView } from './test-utils.js';

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('../src/axios', () => ({
  default: {
    get: mockGet,
    post: mockPost,
  },
}));

vi.mock('../src/composables/useToast.js', () => ({
  showErrorToast: vi.fn(),
  showToast: vi.fn(),
}));

describe('CatalogView', () => {
  let pinia;
  let router;
  let authStore;

  async function mountCatalog() {
    await router.push('/catalogue');
    await router.isReady();

    return mountView(CatalogView, {
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
      routes: [{ path: '/catalogue', component: CatalogView }],
    });

    authStore = useAuthStore();
    authStore.$reset();

    mockGet.mockResolvedValue({
      data: {
        data: [
          {
            id: 1,
            titre: 'Test Course',
            categorie: 'Développement Web',
            description: 'Desc',
            formateur: { name: 'Expert' },
          },
        ],
        last_page: 1,
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders loading skeleton initially', async () => {
    const wrapper = await mountCatalog();

    expect(wrapper.find('.skeleton-card').exists()).toBe(true);
  });

  it('shows courses after load', async () => {
    const wrapper = await mountCatalog();

    await flushPromises();

    expect(wrapper.find('.premium-course-card').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test Course');
  });

  it('debounces search input', async () => {
    vi.useFakeTimers();
    const wrapper = await mountCatalog();

    await flushPromises();
    expect(mockGet).toHaveBeenCalledTimes(1);

    const input = wrapper.find('input');
    await input.setValue('test');

    expect(mockGet).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(350);
    await flushPromises();

    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet.mock.calls[1][1]).toMatchObject({
      params: expect.objectContaining({
        search: 'test',
        page: 1,
      }),
    });
  });

  it('shows empty state when no courses', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        data: [],
        last_page: 1,
      },
    });

    const wrapper = await mountCatalog();
    await flushPromises();

    expect(wrapper.find('.empty-icon').exists()).toBe(true);
    expect(wrapper.text()).toContain('Aucun résultat');
  });
});
