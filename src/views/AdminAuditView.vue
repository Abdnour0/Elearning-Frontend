<template>
  <div class="audit-page">
    <div class="audit-inner">
      <!-- Header -->
      <header class="page-head">
        <div>
          <RouterLink class="back-link" to="/admin">← Back to dashboard</RouterLink>
          <span class="eyebrow"><i class="focus-dot" /> AUDIT TRAIL</span>
          <h1>Activity <em>log.</em></h1>
          <p class="page-lede">
            Every privileged action, in order. {{ total }} event{{ total === 1 ? '' : 's' }} recorded.
          </p>
        </div>
        <button class="zen-btn" :disabled="exporting" @click="exportCsv">
          <v-icon size="18">mdi-download-outline</v-icon>
          {{ exporting ? 'Preparing…' : 'Export CSV' }}
        </button>
      </header>

      <!-- Filters -->
      <section class="filter-bar">
        <label class="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            v-model="actionFilter"
            type="search"
            placeholder="Filter by action (e.g. user.deleted)"
            aria-label="Filter by action"
            @input="debouncedFetch"
          >
        </label>
        <button class="icon-btn" aria-label="Refresh" @click="fetchLogs">
          <v-icon size="18">mdi-refresh</v-icon>
        </button>
      </section>

      <!-- Table -->
      <section class="paper-card">
        <div v-if="loading" class="loading-bar" />
        <div class="table-wrap">
          <table class="zen-table">
            <thead>
              <tr>
                <th>WHEN</th>
                <th>ACTOR</th>
                <th>ACTION</th>
                <th>SUBJECT</th>
                <th>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="logs.length === 0 && !loading">
                <td colspan="5" class="empty-cell">
                  <span class="empty-symbol">✳</span>
                  <span>No activity recorded yet</span>
                </td>
              </tr>
              <tr v-for="log in logs" :key="log.id">
                <td class="cell-muted">{{ formatDateTime(log.created_at) }}</td>
                <td>
                  <div class="user-copy">
                    <span class="user-name">{{ log.actor?.name || '(deleted user)' }}</span>
                    <span class="user-email">{{ log.actor?.email || '—' }}</span>
                  </div>
                </td>
                <td><span class="action-pill">{{ actionLabel(log.action) }}</span></td>
                <td class="cell-muted">
                  <template v-if="log.subject_type">{{ subjectName(log.subject_type) }} #{{ log.subject_id }}</template>
                  <template v-else>—</template>
                </td>
                <td class="cell-details">{{ summarize(log.changes) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="totalPages > 1" class="pagination-wrap">
        <button class="page-btn" :disabled="currentPage <= 1" @click="currentPage--; fetchLogs()">← Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="currentPage++; fetchLogs()">Next →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../axios';
import { showErrorToast, showToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const logs = ref([]);
const total = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const actionFilter = ref('');
const exporting = ref(false);
const { isLoading: loading, markLoading, markLoaded } = useViewLoadState();

const actionLabels = {
  'user.updated': 'User updated',
  'user.deleted': 'User deleted',
};
function actionLabel(action) { return actionLabels[action] || action; }

// App\Models\User -> User
function subjectName(type) { return (type || '').split('\\').pop(); }

function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// changes = { field: { from, to } } -> "role: apprenant → admin, is_active: true → false"
function summarize(changes) {
  if (!changes || typeof changes !== 'object') return '—';
  const parts = Object.entries(changes).map(([field, delta]) => {
    if (delta && typeof delta === 'object' && ('from' in delta || 'to' in delta)) {
      const from = delta.from === null || delta.from === undefined ? '—' : delta.from;
      const to   = delta.to   === null || delta.to   === undefined ? '—' : delta.to;
      return `${field}: ${from} → ${to}`;
    }
    return `${field}: ${JSON.stringify(delta)}`;
  });
  return parts.length ? parts.join(', ') : '—';
}

let debounceId = null;
function debouncedFetch() {
  window.clearTimeout(debounceId);
  debounceId = window.setTimeout(() => { currentPage.value = 1; fetchLogs(); }, 350);
}

async function fetchLogs() {
  markLoading();
  try {
    const params = { page: currentPage.value };
    if (actionFilter.value) params.action = actionFilter.value;
    const { data } = await api.get('/admin/audit-logs', { params });
    logs.value = data?.data || [];
    currentPage.value = data?.current_page || 1;
    totalPages.value = data?.last_page || 1;
    total.value = data?.total || 0;
  } catch (e) {
    showErrorToast(e, 'Could not load the activity log.');
  } finally {
    markLoaded();
  }
}

async function exportCsv() {
  exporting.value = true;
  try {
    const { data } = await api.get('/admin/export', {
      params: { type: 'audit', format: 'csv' },
      responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Activity log exported.', 'success');
  } catch (e) {
    showErrorToast(e, 'Could not export the activity log.');
  } finally {
    exporting.value = false;
  }
}

onMounted(fetchLogs);
onUnmounted(() => window.clearTimeout(debounceId));
</script>

<style scoped>
.audit-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 65px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.audit-inner { max-width: 1060px; margin: 0 auto; }

/* ── Head ──────────────────────────────────────────────── */
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #55735c;
  font-size: 12px;
  font-weight: 650;
  text-decoration: none;
}
.back-link:hover { color: #3f5f49; }
.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #59715e;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .13em;
}
.focus-dot { width: 7px; height: 7px; border-radius: 50%; background: #749578; }
.page-head h1 {
  margin: 14px 0 10px;
  font-family: 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
  font-size: clamp(34px, 4.3vw, 50px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -.04em;
}
.page-head h1 em { color: #52755d; }
.page-lede { margin: 0; color: #686f69; font-size: 13px; }

/* ── Filters ───────────────────────────────────────────── */
.filter-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.search-field {
  flex: 1;
  max-width: 460px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 14px;
  border: 1px solid #e4e7df;
  border-radius: 7px;
  background: #fff;
  color: #637065;
}
.search-field:focus-within { border-color: #84a087; box-shadow: 0 0 0 3px rgba(87, 124, 94, .1); }
.search-field > span { font-size: 20px; line-height: 1; }
.search-field input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #28382d;
  font: inherit;
  font-size: 13px;
}
.search-field input::placeholder { color: #6a6e69; }
.icon-btn {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid #e4e7df;
  border-radius: 7px;
  background: #fff;
  color: #55735c;
  cursor: pointer;
}
.icon-btn:hover { background: #f2f5ef; border-color: #c3cfc1; }

/* ── Table ─────────────────────────────────────────────── */
.paper-card {
  position: relative;
  border: 1px solid #e5e7df;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}
.loading-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #6f9276, transparent);
  animation: slide 1.2s ease-in-out infinite;
}
@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.table-wrap { overflow-x: auto; }
.zen-table { width: 100%; border-collapse: collapse; }
.zen-table th {
  padding: 14px 20px;
  border-bottom: 1px solid #e8e8df;
  background: #faf9f5;
  color: #696e68;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .1em;
  text-align: left;
  white-space: nowrap;
}
.zen-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #eff0ea;
  color: #5f6c62;
  font-size: 13px;
  vertical-align: middle;
}
.zen-table tbody tr:last-child td { border-bottom: 0; }
.zen-table tbody tr:hover td { background: #fafbf8; }
.cell-muted { color: #686f68; font-variant-numeric: tabular-nums; white-space: nowrap; }
.cell-details { max-width: 320px; color: #5f6c62; font-size: 12px; word-break: break-word; }

.user-copy { display: grid; gap: 2px; }
.user-name { color: #33473a; font-size: 13px; font-weight: 650; white-space: nowrap; }
.user-email { color: #686f68; font-size: 11px; }

.action-pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 20px;
  background: #eef4ec;
  color: #3f5f49;
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

.empty-cell { padding: 54px 20px !important; text-align: center; color: #686f68; }
.empty-cell .empty-symbol {
  display: block;
  width: 42px;
  height: 42px;
  margin: 0 auto 10px;
  border-radius: 50%;
  background: #edf1e9;
  color: #59715e;
  font-size: 22px;
  line-height: 42px;
}

/* ── Pagination ────────────────────────────────────────── */
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 26px;
  color: #686f68;
  font-size: 12px;
}
.page-btn {
  padding: 9px 14px;
  border: 1px solid #e2e6de;
  border-radius: 6px;
  background: #fff;
  color: #546b57;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.page-btn:hover:not(:disabled) { background: #f2f5ef; border-color: #c3cfc1; }
.page-btn:disabled { color: #6b6e6a; cursor: default; }

/* ── Buttons ───────────────────────────────────────────── */
.zen-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 20px;
  border: 0;
  border-radius: 7px;
  background: #537a62;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
  cursor: pointer;
  transition: background .18s ease, transform .18s ease;
}
.zen-btn:hover:not(:disabled) { background: #456c54; transform: translateY(-1px); }
.zen-btn:disabled { opacity: .6; cursor: default; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 720px) {
  .page-head { flex-direction: column; align-items: flex-start; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .search-field { max-width: none; }
  .audit-page { padding: 50px 20px 72px; }
}
@media (prefers-reduced-motion: reduce) {
  .audit-page *, .audit-page *::before, .audit-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
