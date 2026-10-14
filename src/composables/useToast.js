import { ref } from 'vue';

// Global toast state — consumed by App.vue
export const toasts = ref([]);

let _nextId = 0;

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {number} duration ms before auto-dismiss (0 = no auto-dismiss)
 */
export function showToast(message, type = 'info', duration = 4000) {
  const id = ++_nextId;
  toasts.value.push({ id, message, type });

  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration);
  }
  return id;
}

export function dismissToast(id) {
  const index = toasts.value.findIndex((t) => t.id === id);
  if (index !== -1) toasts.value.splice(index, 1);
}

export function showErrorToast(error, fallback = 'Une erreur est survenue. Veuillez réessayer.') {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    fallback;

  showToast(message, 'error', 6000);
}
