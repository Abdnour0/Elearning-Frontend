import { afterEach, vi, beforeEach } from 'vitest';
import { config } from '@vue/test-utils';

// Ensure native localStorage is always available (prevent leak from auth.spec.js mock)
beforeEach(() => {
  if (!window.localStorage || typeof window.localStorage.getItem !== 'function') {
    const store = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => store[key] ?? null),
        setItem: vi.fn((key, value) => { store[key] = String(value); }),
        removeItem: vi.fn((key) => { delete store[key]; }),
        clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
        get length() { return Object.keys(store).length; },
        key: vi.fn((i) => Object.keys(store)[i] ?? null),
      },
      configurable: true,
      writable: true,
    });
  }
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverMock;
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = IntersectionObserverMock;
}

if (!window.scrollTo) {
  window.scrollTo = vi.fn();
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id) => clearTimeout(id);
}

config.global.directives = {
  ...config.global.directives,
  motion: {
    mounted() {},
    updated() {},
  },
};

config.global.stubs = {
  ...config.global.stubs,
  transition: false,
  'transition-group': false,
};

afterEach(() => {
  document.body.innerHTML = '';
});
