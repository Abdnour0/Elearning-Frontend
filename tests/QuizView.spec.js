import { flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import QuizView from '../src/views/QuizView.vue';
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
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const MOCK_QUIZ = {
  quiz: { id: 1, titre: 'Test Quiz', minuterie: null },
  questions: [
    { id: 1, contenu: 'Question 1?', type: 'qcm', choix: ['A', 'B', 'C'] },
    { id: 2, contenu: 'Question 2?', type: 'vrai_faux', choix: ['Vrai', 'Faux'] },
    { id: 3, contenu: 'Question 3?', type: 'texte' },
  ],
};

describe('QuizView', () => {
  let pinia;
  let router;

  async function mountQuiz(routeParams = { id: '1' }) {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/quiz/:id',
          component: QuizView,
        },
      ],
    });

    router.push(`/quiz/${routeParams.id}`);
    await router.isReady();

    return mountView(QuizView, {
      global: {
        plugins: [pinia, router],
      },
    });
  }

  beforeEach(() => {
    vi.clearAllMocks();

    pinia = createPinia();
    setActivePinia(pinia);

    mockGet.mockResolvedValue({ data: MOCK_QUIZ });
    mockPost.mockResolvedValue({
      data: {
        score: 80,
        reussi: true,
        corrections: [
          { question_id: 1, est_correct: true, reponse_soumise: 'B', bonneReponse: 'B' },
          { question_id: 2, est_correct: false, reponse_soumise: 'Vrai', bonneReponse: 'Faux' },
          { question_id: 3, est_correct: true, reponse_soumise: 'Answer', bonneReponse: 'Answer' },
        ],
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders loading spinner initially', async () => {
    const wrapper = await mountQuiz();

    expect(wrapper.find('.v-progress-circular').exists()).toBe(true);
    expect(wrapper.text()).toContain('Chargement du quiz');
  });

  it('shows quiz questions after load', async () => {
    const wrapper = await mountQuiz();
    await flushPromises();

    expect(wrapper.text()).toContain('Test Quiz');
    expect(wrapper.text()).toContain('Question 1 sur 3');
    expect(wrapper.text()).toContain('Question 1?');
    expect(wrapper.findAll('.choice-btn').length).toBe(3);
  });

  it('navigates between questions', async () => {
    const wrapper = await mountQuiz();
    await flushPromises();

    expect(wrapper.vm.currentIndex).toBe(0);

    const nextBtn = wrapper.findAll('button').filter(b => b.text().includes('Suivant'));
    if (nextBtn.length) {
      await nextBtn[0].trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.currentIndex).toBe(1);
    }

    const prevBtn = wrapper.findAll('button').filter(b => b.text().includes('Précédent'));
    if (prevBtn.length) {
      await prevBtn[0].trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.currentIndex).toBe(0);
    }
  });

  it('selects an answer choice', async () => {
    const wrapper = await mountQuiz();
    await flushPromises();

    const choiceBtns = wrapper.findAll('.choice-btn');
    expect(choiceBtns.length).toBeGreaterThan(0);

    await choiceBtns[1].trigger('click');
    expect(wrapper.vm.answers[MOCK_QUIZ.questions[0].id]).toBe('B');
  });

  it('submits quiz and shows results', async () => {
    const wrapper = await mountQuiz();
    await flushPromises();

    wrapper.vm.answers = {
      [MOCK_QUIZ.questions[0].id]: 'B',
      [MOCK_QUIZ.questions[1].id]: 'Faux',
      [MOCK_QUIZ.questions[2].id]: 'Answer',
    };

    const terminers = wrapper.findAll('button').filter(b => b.text().includes('Terminer'));
    if (terminers.length) {
      await terminers[0].trigger('click');
      await flushPromises();

      expect(mockPost).toHaveBeenCalledWith('/quiz/1/soumettre', {
        reponses: wrapper.vm.answers,
      });

      expect(wrapper.text()).toContain('80');
      expect(wrapper.text()).toContain('Félicitations');
      expect(wrapper.text()).toContain('Correctes');
      expect(wrapper.text()).toContain('Incorrectes');
    }
  });

  it('shows error state when quiz fails to load', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));

    const wrapper = await mountQuiz();
    await flushPromises();

    expect(wrapper.text()).toContain('Impossible de charger ce quiz');
  });

  it('displays timer when quiz has minuterie', async () => {
    const quizWithTimer = {
      ...MOCK_QUIZ,
      minuterie: 300,
    };
    mockGet.mockResolvedValueOnce({ data: quizWithTimer });

    const wrapper = await mountQuiz();
    await flushPromises();

    expect(wrapper.vm.quizData.minuterie).toBe(300);
    expect(wrapper.text()).toContain('05:00');
  });
});
