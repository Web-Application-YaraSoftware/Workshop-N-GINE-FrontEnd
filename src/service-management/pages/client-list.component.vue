<script setup>
import NewClientDialog from "../components/new-client-dialog.component.vue";
import ModelMessageDialog from "../../shared/components/model-message-dialog.component.vue";
import { onMounted, ref, provide } from "vue";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { useWorkshopStore } from "../../shared/services/workshop-store.js";
import { WorkshopService } from "../../service-management/services/workshop.service.js";
import { ProfilesService } from "../../profile-management/services/profiles.service.js";
import { Profile } from "../../profile-management/model/profile.entity.js";

// Clients
const clientItem = ref({});
const clients = ref([]);
const selectedClients = ref([]);
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Dialogs
const clientDialog = ref(false);
const messageDialog = ref(false);
const messageClientsDialog = ref(false);

// Provides
provide('dialogVisibility', {
  clientDialog
});

// Services
const workshopStore = useWorkshopStore();
const workshopService = new WorkshopService();
const profilesService = new ProfilesService();
const toast = useToast();

// Api Requests
async function getClients() {
  try {
    const response = await workshopService.getClientsUserIdByWorkShopId(workshopStore.workshop?.id);
    const userIds = response.data;
    const profilePromises = userIds.map(userId => profilesService.getProfileByUserId(userId));
    const profiles = await Promise.all(profilePromises);
    clients.value = profiles.map(profileResponse => new Profile(profileResponse.data));
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
}

// Methods
function openNew() {
  clientItem.value = {};
  clientDialog.value = true;
}

function buildClientFromResponseData(client) {
  const profile = new Profile(client);
  profile.setFullName(`${profile.firstName} ${profile.lastName}`)
  return profile;
}

function confirmDeleteSelected() {
  messageClientsDialog.value = true;
}

function onAcceptedDeleteSelectedClients() {
  messageClientsDialog.value = false;
  deleteSelectedClients();
}

function onRejectedDeleteSelectedClients() {
  messageClientsDialog.value = false;
}

function deleteSelectedClients() {
  //TODO: Implement bulk delete
  clients.value = clients.value.filter(
    client => {
      if (selectedClients.value.includes(client)) {
        profilesService.delete(client.id).then(
          response => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Clients deleted', life: 3000 });
          }
        );
        return false;
      }
      return true;
    }
  );
}

function onCreateClient(client) {
  const { firstName, lastName, dni, email, age, location } = client;
  const newClient = {
    firstName,
    lastName,
    dni,
    email,
    age,
    location
  };
  workshopService.postClientToWorkshop(workshopStore.workshop?.id, newClient)
    .then(response => {
      clients.value = [buildClientFromResponseData(response.data), ...clients.value];
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Client registered', life: 3000 });
    });
}

function confirmDeleteClient(client) {
  clientItem.value = client;
  messageDialog.value = true;
}

function onAcceptDeleteClient() {
  messageDialog.value = false;
  deleteClient();
}

function onRejectDeleteClient() {
  messageDialog.value = false;
}

function deleteClient() {
  //TODO: Implement delete
  profilesService.delete(clientItem.value.id)
    .then(response => {
      clients.value = clients.value.filter(c => c.id !== clientItem.value.id);
      toast.add({ severity: 'success', summary: 'Successful', detail: 'Client deleted', life: 3000 });
    });
}

onMounted(() => {
  getClients();
});

</script>
<template>
  <div class="clients">
    <h2 class="header">Clients</h2>
    <section class="controls w-full flex flex-wrap gap-2 items-center justify-between">
      <pv-toolbar class="toolbar w-full">
        <template #start>
          <pv-iconfield>
            <pv-inputicon>
              <i class="pi pi-search icon" />
            </pv-inputicon>
            <pv-inputtext v-model="filters['global'].value" placeholder="Search..." class="search-input" />
          </pv-iconfield>
        </template>
        <template #end>
          <pv-button label="New" icon="pi pi-plus" severity="success" class="new-button mr-2" @click="openNew" />
          <pv-button label="Delete" icon="pi pi-trash" severity="danger" class="delete-button" @click="confirmDeleteSelected" :disabled="!selectedClients || !selectedClients.length" />
        </template>
      </pv-toolbar>
    </section>
    <section class="table-container">
      <pv-datatable
          class="table"
          ref="dt"
          v-model:selection="selectedClients"
          :value="clients"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
      >
        <pv-column selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
        <pv-column field="fullName" header="Full name" sortable style="width: fit-content">
        </pv-column>
        <pv-column field="dni" header="N° document" sortable style="width: fit-content"></pv-column>
        <pv-column field="email" header="Email" sortable style="width: fit-content"></pv-column>
        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">
            <pv-button icon="pi pi-trash" outlined rounded severity="danger" class="delete-icon" @click="confirmDeleteClient(slotProps.data)" />
          </template>
        </pv-column>
      </pv-datatable>
    </section>
    <new-client-dialog @acceptRegister="onCreateClient" />
    <model-message-dialog :visible="messageDialog" @confirm="onAcceptDeleteClient" @reject="onRejectDeleteClient" @update:visible="($event)=> messageDialog = $event" />
    <model-message-dialog :visible="messageClientsDialog" @confirm="onAcceptedDeleteSelectedClients" @reject="onRejectedDeleteSelectedClients" @update:visible="($event)=> messageClientsDialog = $event" />
  </div>
</template>

<style scoped>
.clients {
  width: 100%;
  height: calc(100vh - 40px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  font-size: 2.5rem;
  color: #004B86;
  margin-bottom: 1rem;
}

.controls {
  background-color: #EBF7FF;
  padding: 1rem;
  border-radius: 8px;
}

.toolbar {
  background-color: #A0CFFF;
  border-radius: 8px;
}

.icon {
  color: #004B86;
  font-size: 1rem;
}

.search-input {
  padding: 10px;
  border: 2px solid #78B4FF;
  background-color: #EBF7FF;
  color: #004B86;
  border-radius: 8px;
}

.search-input:focus {
  border-color: #006DFF;
  outline: none;
}

.new-button {
  background-color: #006DFF;
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  transition: background-color 0.3s ease;
}

.new-button:hover {
  background-color: #004B86;
}

.delete-button {
  background-color: #FF6F6F;
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #FF4C4C;
}

.table-container {
  width: 100%;
  background-color: #FFFFFF;
  box-shadow: 0 6px 15px rgba(120, 180, 255, 0.15);
  border: 2px solid #78B4FF;
  overflow-x: auto;
}

.table {
  min-width: 1000px;
  table-layout: auto;
}

.link {
  color: #004B86;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.delete-icon {
  color: #FF4C4C;
  transition: color 0.3s ease;
}

.delete-icon:hover {
  color: #FF6F6F;
}
</style>
