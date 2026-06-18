import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../src/stores/auth';

vi.mock('../src/axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

function createLocalStorageMock() {
  let store = {};

  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
}

describe('Auth Store', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createLocalStorageMock(),
      configurable: true,
      writable: true,
    });

    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('initializes with null user', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('persists user correctly', () => {
    const store = useAuthStore();
    const mockUser = { id: 1, name: 'Admin User', role: 'admin' };
    
    store._persist(mockUser);
    
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(store.isAdmin).toBe(true);
    expect(store.isApprenant).toBe(false);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
  });

  it('clears data on logout', async () => {
    const store = useAuthStore();
    store._persist({ id: 1, name: 'Test', role: 'apprenant' });
    
    // Mock the api post so it doesn't fail
    // In a real scenario you would use vi.mock for axios
    await store.logout();
    
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('user')).toBeNull();
  });
});
