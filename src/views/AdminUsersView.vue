<template>
  <v-container fluid class="py-6 px-lg-8 admin-bg min-vh-100 position-relative">
    <div class="admin-hero-glow" />
    <!-- Header -->
    <v-row class="mb-6 align-end justify-space-between">
      <v-col cols="12" md="6">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-2 px-0 text-medium-emphasis" to="/admin">Retour au Dashboard</v-btn>
        <h1 class="text-h4 font-weight-black text-white" style="letter-spacing: -0.02em">Utilisateurs</h1>
        <p class="text-grey-lighten-1 mt-1 mb-0">{{ filteredUsers.length }} utilisateur(s) enregistré(s)</p>
      </v-col>
      <v-col cols="12" md="auto" class="d-flex gap-3">
        <v-btn color="primary" variant="flat" class="rounded-lg font-weight-bold btn-glow" prepend-icon="mdi-account-plus" height="44">
          Nouvel Utilisateur
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filters Bar -->
    <v-card class="dashboard-panel rounded-xl pa-4 mb-6 d-flex flex-wrap gap-4 align-center" theme="dark">
      <div style="flex: 1; min-width: 250px;">
        <v-text-field
          v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Rechercher par nom ou email..."
          variant="outlined" density="comfortable" color="primary" bg-color="rgba(0,0,0,0.2)"
          hide-details class="rounded-lg border-subtle"
          @update:model-value="debouncedFetchUsers"
        />
      </div>
      <div style="width: 200px;">
        <v-select
          v-model="roleFilter"
          :items="[{ title: 'Tous les rôles', value: '' }, { title: 'Admin', value: 'admin' }, { title: 'Formateur', value: 'formateur' }, { title: 'Apprenant', value: 'apprenant' }]"
          variant="outlined" density="comfortable" color="primary" bg-color="rgba(0,0,0,0.2)"
          hide-details class="rounded-lg border-subtle"
          @update:model-value="fetchUsers"
        >
          <template #selection="{ item }">
            <div class="d-flex align-center gap-2">
              <div v-if="item.value" class="role-dot" :style="{ background: roleColors[item.value] || '#888' }" />
              <span>{{ item.title }}</span>
            </div>
          </template>
        </v-select>
      </div>
      <v-btn color="surface-variant" variant="flat" class="rounded-lg border-subtle text-none font-weight-medium" height="48" @click="fetchUsers">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-card>

    <!-- Data Table -->
    <v-card class="dashboard-panel rounded-xl overflow-hidden" theme="dark">
      <v-progress-linear v-if="loading" indeterminate color="primary" class="position-absolute w-100" style="top:0; z-index: 10;" />
      
      <div class="table-container custom-scrollbar">
        <v-table theme="dark" class="glass-table dense-table">
          <thead class="sticky-header">
            <tr>
              <th class="text-left text-caption font-weight-black text-grey-lighten-1 text-uppercase tracking-widest px-6 py-4">Utilisateur</th>
              <th class="text-left text-caption font-weight-black text-grey-lighten-1 text-uppercase tracking-widest py-4">Rôle</th>
              <th class="text-center text-caption font-weight-black text-grey-lighten-1 text-uppercase tracking-widest py-4">Statut</th>
              <th class="text-left text-caption font-weight-black text-grey-lighten-1 text-uppercase tracking-widest py-4">Inscription</th>
              <th class="text-right text-caption font-weight-black text-grey-lighten-1 text-uppercase tracking-widest px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0 && !loading">
              <td colspan="5" class="text-center text-grey py-10">
                <v-icon size="48" color="rgba(255,255,255,0.1)" class="mb-4">mdi-account-search</v-icon>
                <div>Aucun utilisateur trouvé</div>
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id" class="user-row hover-bg transition-colors">
              <td class="px-6 py-3">
                <div class="d-flex align-center gap-4">
                  <v-avatar :color="avatarColor(user.id)" size="40" class="elevation-2 text-white font-weight-bold">
                    {{ initials(user.name) }}
                  </v-avatar>
                  <div>
                    <p class="text-body-2 font-weight-bold text-white mb-0">{{ user.name }}</p>
                    <p class="text-caption text-grey mb-0">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-3">
                <!-- Role Badge with Menu -->
                <v-menu location="bottom start" transition="scale-transition">
                  <template #activator="{ props }">
                    <v-chip
                      v-bind="props"
                      size="small"
                      :color="roleColorMap[user.role]"
                      variant="tonal"
                      class="font-weight-bold cursor-pointer"
                      append-icon="mdi-chevron-down"
                    >
                      {{ user.role }}
                    </v-chip>
                  </template>
                  <v-list density="compact" bg-color="surface" class="border-subtle mt-1 rounded-lg pa-1">
                    <v-list-item v-for="r in ['admin', 'formateur', 'apprenant']" :key="r" class="rounded-md hover-bg" @click="changeRole(user, r)">
                      <v-list-item-title class="text-caption text-capitalize" :class="user.role === r ? `text-${roleColorMap[r]}` : ''">
                        {{ r }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
              <td class="text-center py-3">
                <v-switch
                  :model-value="user.is_active"
                  color="success" density="compact" hide-details inset
                  class="d-inline-flex align-center justify-center m-0"
                  @update:model-value="toggleActive(user)"
                />
              </td>
              <td class="text-caption text-grey tabular-nums py-3">{{ formatDate(user.created_at) }}</td>
              <td class="text-right px-6 py-3">
                <!-- Action Menu -->
                <v-menu location="bottom end" transition="slide-y-transition">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-dots-vertical" variant="text" size="small" color="grey-lighten-1" class="hover-icon" />
                  </template>
                  <v-card class="action-menu-card rounded-xl pa-2" width="180" theme="dark">
                    <v-list density="compact" bg-color="transparent" class="pa-0">
                      <v-list-item prepend-icon="mdi-pencil" title="Modifier" class="rounded-lg premium-menu-item text-caption font-weight-medium mb-1 transition-all" />
                      <v-divider class="my-1 opacity-10 border-white" />
                      <v-list-item prepend-icon="mdi-delete" title="Supprimer" base-color="error" class="rounded-lg premium-logout text-caption font-weight-bold transition-all" @click="confirmDelete(user)" />
                    </v-list>
                  </v-card>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card>

    <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        color="primary"
        @update:model-value="fetchUsers"
      />
    </div>

    <!-- Delete dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card class="dashboard-panel rounded-xl pa-6 text-center" theme="dark">
        <div class="mx-auto mb-4 d-flex align-center justify-center" style="width:64px; height:64px; border-radius:50%; background:rgba(239,68,68,0.1)">
          <v-icon color="error" size="32">mdi-alert</v-icon>
        </div>
        <h3 class="text-h6 font-weight-bold mb-2">Supprimer l'utilisateur ?</h3>
        <p class="text-grey-lighten-1 text-body-2 mb-6">
          L'utilisateur <strong class="text-white">{{ deletingUser?.name }}</strong> et toutes ses données associées seront définitivement supprimés.
        </p>
        <div class="d-flex gap-3">
          <v-btn variant="tonal" color="grey" class="flex-grow-1 rounded-lg text-none" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" class="flex-grow-1 rounded-lg text-none" :loading="deleting" @click="deleteUser">Supprimer</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
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

const roleColors = { admin: '#ef4444', formateur: '#f97316', apprenant: '#3b82f6' };
const roleColorMap = { admin: 'error', formateur: 'secondary', apprenant: 'primary' };
const avatarColors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4'];

function avatarColor(id) {
  return avatarColors[id % avatarColors.length] || avatarColors[0];
}

let searchDebounceId = null;

function debouncedFetchUsers() {
  window.clearTimeout(searchDebounceId);
  searchDebounceId = window.setTimeout(fetchUsers, 350);
}

function initials(name) {
  return (name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
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
    showErrorToast(e, 'Impossible de charger les utilisateurs.');
  }
  finally { markLoaded(); }
}

async function changeRole(user, newRole) {
  if (user.role === newRole) return;
  try {
    await api.put(`/admin/users/${user.id}`, { role: newRole });
    user.role = newRole;
    showToast('Rôle mis à jour.', 'success');
  } catch(e) {
    showErrorToast(e, 'Impossible de mettre à jour le rôle.');
  }
}

async function toggleActive(user) {
  try {
    await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active });
    user.is_active = !user.is_active;
  } catch(e) {
    showErrorToast(e, 'Impossible de changer le statut utilisateur.');
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
    showToast('Utilisateur supprimé.', 'success');
  } catch(e) {
    showErrorToast(e, 'Impossible de supprimer cet utilisateur.');
  }
  finally { deleting.value = false; }
}

onMounted(fetchUsers);
onUnmounted(() => window.clearTimeout(searchDebounceId));
</script>

<style scoped>
.admin-bg { background-color: var(--v-theme-background); }
.min-vh-100 { min-height: 100vh; }
.admin-hero-glow {
  position: absolute; top: -150px; left: 50%;
  transform: translateX(-50%);
  width: 700px; height: 400px;
  background: radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%);
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}
.tracking-wide { letter-spacing: 0.05em; }
.tabular-nums { font-variant-numeric: tabular-nums; }
.border-subtle { border: 1px solid rgba(255,255,255,0.08) !important; }
.border-bottom-subtle { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
.hover-bg:hover { background: rgba(255,255,255,0.05); }
.transition-colors { transition: background-color 0.2s ease; }
.btn-glow { box-shadow: 0 4px 20px rgba(59,130,246,0.35) !important; }

.dashboard-panel {
  background: rgba(17, 24, 39, 0.6) !important;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2) !important;
  backdrop-filter: blur(10px);
}

.role-dot { width: 8px; height: 8px; border-radius: 50%; }

.table-container {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

.glass-table { background: transparent !important; }
.glass-table th { 
  background: rgba(15, 20, 35, 0.9) !important; 
  backdrop-filter: blur(12px); 
  border-bottom: 1px solid rgba(255,255,255,0.08) !important; 
}
.glass-table td { border-bottom: 1px solid rgba(255,255,255,0.03) !important; transition: all 0.2s ease; }

.dense-table td { height: 68px !important; }

.user-row:hover td { 
  background: rgba(59, 130, 246, 0.04) !important; 
}

.sticky-header {
  position: sticky; top: 0; z-index: 5;
}

.action-menu-card {
  background: rgba(15, 20, 35, 0.95) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
}

.premium-menu-item { padding: 8px 12px !important; min-height: 38px !important; }
.premium-menu-item:hover { background: rgba(255, 255, 255, 0.05) !important; color: #3b82f6 !important; }
.premium-menu-item:hover .v-icon { color: #3b82f6 !important; transform: translateX(2px); opacity: 1 !important; }

.premium-logout:hover { background: rgba(239, 68, 68, 0.1) !important; color: #ef4444 !important; }
.premium-logout:hover .v-icon { color: #ef4444 !important; transform: translateX(2px); }

.hover-icon:hover { color: #fff !important; background: rgba(255,255,255,0.1); }

.tracking-widest { letter-spacing: 0.1em; }

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
</style>
