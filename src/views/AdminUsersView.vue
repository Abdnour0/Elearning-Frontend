<template>
  <div class="people-page">
    <div class="people-inner">
      <!-- Header -->
      <header class="page-head">
        <div>
          <RouterLink class="back-link" to="/admin">← Back to dashboard</RouterLink>
          <span class="eyebrow"><i class="focus-dot" /> PEOPLE</span>
          <h1>Manage your<br><em>community.</em></h1>
          <p class="page-lede">{{ filteredUsers.length }} registered user(s)</p>
        </div>
        <button class="zen-btn" @click="showToast('Creating users is coming soon.', 'info')">
          New user <span aria-hidden="true">→</span>
        </button>
      </header>

      <!-- Filters -->
      <section class="filter-bar">
        <label class="search-field">
          <span aria-hidden="true">⌕</span>
          <input v-model="search" type="search" placeholder="Search by name or email" aria-label="Search users" @input="debouncedFetchUsers">
        </label>
        <select v-model="roleFilter" class="role-select" aria-label="Filter by role" @change="fetchUsers">
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="formateur">Instructor</option>
          <option value="apprenant">Learner</option>
        </select>
        <button class="icon-btn" aria-label="Refresh" @click="fetchUsers">
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
                <th>USER</th>
                <th>ROLE</th>
                <th class="col-center">STATUS</th>
                <th>JOINED</th>
                <th class="col-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredUsers.length === 0 && !loading">
                <td colspan="5" class="empty-cell">
                  <span class="empty-symbol">✳</span>
                  <span>No users found</span>
                </td>
              </tr>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="user-cell">
                    <span class="avatar">{{ initials(user.name) }}</span>
                    <div class="user-copy">
                      <span class="user-name">{{ user.name }}</span>
                      <span class="user-email">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <v-menu location="bottom start" transition="scale-transition">
                    <template #activator="{ props }">
                      <button v-bind="props" class="role-pill" :class="`role-${user.role}`">
                        <span class="role-dot" />{{ roleLabel(user.role) }}
                        <v-icon size="14">mdi-chevron-down</v-icon>
                      </button>
                    </template>
                    <v-list density="compact" class="role-menu pa-1">
                      <v-list-item v-for="r in ['admin', 'formateur', 'apprenant']" :key="r" class="rounded-lg" @click="changeRole(user, r)">
                        <v-list-item-title class="text-capitalize">{{ roleLabel(r) }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td>
                <td class="col-center">
                  <v-switch
                    :model-value="user.is_active"
                    color="success" density="compact" hide-details inset
                    class="status-switch"
                    @update:model-value="toggleActive(user)"
                  />
                </td>
                <td class="cell-muted">{{ formatDate(user.created_at) }}</td>
                <td class="col-center">
                  <button class="icon-btn icon-btn-danger" :aria-label="`Delete ${user.name}`" @click="confirmDelete(user)">
                    <v-icon size="18">mdi-delete-outline</v-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div v-if="totalPages > 1" class="pagination-wrap">
        <button class="page-btn" :disabled="currentPage <= 1" @click="currentPage--; fetchUsers()">← Previous</button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="currentPage++; fetchUsers()">Next →</button>
      </div>
    </div>

    <!-- Delete dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="zen-dialog pa-6" elevation="0" rounded="lg">
        <h3>Delete this user?</h3>
        <p class="dialog-lede">
          <strong>{{ deletingUser?.name }}</strong> and all associated data will be permanently removed. This can't be undone.
        </p>
        <div class="dialog-actions">
          <button class="zen-btn zen-btn-quiet" @click="deleteDialog = false">Cancel</button>
          <button class="zen-btn zen-btn-danger" :disabled="deleting" @click="deleteUser">{{ deleting ? 'Deleting…' : 'Delete user' }}</button>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import api from '../axios';
import { showErrorToast, showToast } from '../composables/useToast.js';
import { useViewLoadState } from '../composables/useViewLoadState.js';

const users = ref([]);
const { isLoading: loading, markLoading, markLoaded } = useViewLoadState();
const search = ref('');
const roleFilter = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const deleteDialog = ref(false);
const deletingUser = ref(null);
const deleting = ref(false);

const filteredUsers = computed(() => users.value);

const roleLabels = { admin: 'Admin', formateur: 'Instructor', apprenant: 'Learner' };
function roleLabel(role) { return roleLabels[role] || role; }

let searchDebounceId = null;

function debouncedFetchUsers() {
  window.clearTimeout(searchDebounceId);
  searchDebounceId = window.setTimeout(fetchUsers, 350);
}

function initials(name) {
  return (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}

async function fetchUsers() {
  markLoading();
  try {
    const params = {};
    if (search.value) params.search = search.value;
    if (roleFilter.value) params.role = roleFilter.value;
    params.page = currentPage.value;
    const { data } = await api.get('/admin/users', { params });
    users.value = data?.data || [];
    totalPages.value = data?.last_page || 1;
  } catch(e) {
    showErrorToast(e, 'Could not load users.');
  }
  finally { markLoaded(); }
}

async function changeRole(user, newRole) {
  if (user.role === newRole) return;
  try {
    await api.put(`/admin/users/${user.id}`, { role: newRole });
    user.role = newRole;
    showToast('Role updated.', 'success');
  } catch(e) {
    showErrorToast(e, 'Could not update the role.');
  }
}

async function toggleActive(user) {
  try {
    await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active });
    user.is_active = !user.is_active;
  } catch(e) {
    showErrorToast(e, 'Could not change the user status.');
  }
}

function confirmDelete(user) {
  deletingUser.value = user;
  deleteDialog.value = true;
}

async function deleteUser() {
  deleting.value = true;
  try {
    await api.delete(`/admin/users/${deletingUser.value.id}`);
    users.value = users.value.filter(u => u.id !== deletingUser.value.id);
    deleteDialog.value = false;
    showToast('User deleted.', 'success');
  } catch(e) {
    showErrorToast(e, 'Could not delete this user.');
  }
  finally { deleting.value = false; }
}

onMounted(fetchUsers);
onUnmounted(() => window.clearTimeout(searchDebounceId));
</script>

<style scoped>
.people-page {
  min-height: calc(100vh - var(--el-app-bar-h, 72px));
  padding: 65px 24px 100px;
  background: #fbfaf6;
  color: #28382e;
}
.people-inner { max-width: 1060px; margin: 0 auto; }

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
.role-select {
  height: 46px;
  padding: 0 34px 0 14px;
  border: 1px solid #e4e7df;
  border-radius: 7px;
  background: #fff;
  color: #3a4a3f;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
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
.icon-btn-danger { width: 34px; height: 34px; color: #934f47; }
.icon-btn-danger:hover { background: #f7efed; border-color: #e2c8c4; }

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
.col-center { text-align: center; }
.cell-muted { color: #686f68; font-variant-numeric: tabular-nums; }

.user-cell { display: flex; align-items: center; gap: 12px; }
.avatar {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e7eee5;
  color: #557258;
  font-size: 12px;
  font-weight: 700;
}
.user-copy { display: grid; gap: 2px; }
.user-name { color: #33473a; font-size: 13px; font-weight: 650; }
.user-email { color: #686f68; font-size: 11px; }

.role-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 11px;
  border-radius: 20px;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;
}
.role-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.role-admin { background: #f3e8e6; color: #934f47; }
.role-formateur { background: #f1ebe0; color: #816738; }
.role-apprenant { background: #e8f0e7; color: #46704f; }

.status-switch { display: inline-flex; }

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
.zen-btn-quiet { background: #fff; color: #55735c; border: 1px solid #dfe5db; }
.zen-btn-quiet:hover { background: #f4f6f1; border-color: #c3cfc1; }
.zen-btn-danger { background: #a4574f; }
.zen-btn-danger:hover:not(:disabled) { background: #8f4a43; }

/* ── Dialog ────────────────────────────────────────────── */
.zen-dialog { background: #fff !important; border: 1px solid #e7e8e1; }
.zen-dialog h3 {
  margin: 0 0 8px;
  font-family: 'Iowan Old Style', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.02em;
}
.dialog-lede { margin: 0 0 22px; color: #657066; font-size: 13px; line-height: 1.6; }
.dialog-lede strong { color: #33473a; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 720px) {
  .page-head { flex-direction: column; align-items: flex-start; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .search-field { max-width: none; }
  .people-page { padding: 50px 20px 72px; }
}
@media (prefers-reduced-motion: reduce) {
  .people-page *, .people-page *::before, .people-page *::after {
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
  }
}
</style>
