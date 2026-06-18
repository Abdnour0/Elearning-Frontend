import { computed, ref } from 'vue';

export const VIEW_LOAD_STATES = Object.freeze({
  INITIAL: 'initial',
  LOADING: 'loading',
  LOADED: 'loaded',
});

export function useViewLoadState(initialState = VIEW_LOAD_STATES.INITIAL) {
  const loadState = ref(initialState);

  const isInitial = computed(() => loadState.value === VIEW_LOAD_STATES.INITIAL);
  const isLoading = computed(() => loadState.value === VIEW_LOAD_STATES.LOADING);
  const isLoaded = computed(() => loadState.value === VIEW_LOAD_STATES.LOADED);

  function markInitial() {
    loadState.value = VIEW_LOAD_STATES.INITIAL;
  }

  function markLoading() {
    loadState.value = VIEW_LOAD_STATES.LOADING;
  }

  function markLoaded() {
    loadState.value = VIEW_LOAD_STATES.LOADED;
  }

  return {
    loadState,
    isInitial,
    isLoading,
    isLoaded,
    markInitial,
    markLoading,
    markLoaded,
  };
}
