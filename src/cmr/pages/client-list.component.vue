<script setup>
import NewClientDialog from "../components/new-client-dialog.component.vue";
import ModelMessageDialog from "../../shared/components/model-message-dialog.component.vue";
import {ClientService} from "../services/client.service.js";
import {onMounted, ref, provide} from "vue";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import {User} from "../model/user.entity.js";
import {useWorkshopStore} from "../../shared/services/workshop-store.js";

//Clients
const clientItem = ref({});
const clients = ref();
const selectedClients = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

//Dialogs
const clientDialog = ref(false);
const messageDialog = ref(false);
const messageClientsDialog = ref(false);

//Provides
provide('dialogVisibility',{
  clientDialog
});

//Services
const workshopStore = useWorkshopStore();
const clientService = new ClientService();
const toast = useToast();

//Api Requests
function getClients(){
  clientService.getAllByWorkshop(1)
      .then(response => {
        clients.value = buildClientListFromResponseData(response.data);
      });
}

//Methods
function openNew(){
  clientItem.value = {};
  clientDialog.value = true;
}

function buildClientListFromResponseData(clients){
  return clients.map(client => {
    const auxClient = new User(client);
    auxClient.state = client.state;
    auxClient.userType = client.user_type;
    return auxClient;
  });
}

function buildClientFromResponseData(client){
  return {
    id: client.id,
    workshopID: client.workshop_id,
    firstName: client.first_name,
    lastName: client.last_name,
    dni: client.dni,
    email: client.email,
    password: client.dni,
    image: client.image,
    state: client.state,
    userType: client.user_type
  };

}

function confirmDeleteSelected(client){
  messageClientsDialog.value = true;
}

function onAcceptedDeleteSelectedClients(){
  messageClientsDialog.value = false;
  deleteSelectedClients();
}

function onRejectedDeleteSelectedClients(){
  messageClientsDialog.value = false;
}

function deleteSelectedClients(){
  clients.value = clients.value.filter(
      client => {
        if(selectedClients.value.includes(client)){
          clientService.delete(client.id).then(
              response => {
                toast.add({severity:'success', summary: 'Successful', detail: 'Clients deleted', life: 3000});
              }
          );
          return false;
        }
        return true;
      }
  );
}

function onCreateClient(client){
  const {firstName, lastName, dni, email} = client;
  const random = (Math.floor(Math.random() * 2));
  const imageRandom = random === 1? 'https://xsgames.co/randomusers/avatar.php?g=male': 'https://xsgames.co/randomusers/avatar.php?g=female';
  const newClient = {
    id: Math.floor(Math.random() * 1000),
    workshop_id: workshopStore.workshop?.id,
    first_name: firstName,
    last_name: lastName,
    dni: dni,
    email: email,
    password: dni,
    image: imageRandom,
    state: {
      id: 1,
      name: 'ACTIVE'
    },
    user_type: {
      id: 1,
      name: 'workshop_client'
    }
  };
  console.log(newClient);
  clientService.create(newClient)
    .then(response => {
      clients.value = [buildClientFromResponseData(response.data), ...clients.value];
      toast.add({severity:'success', summary: 'Successful', detail: 'Client registered', life: 3000});
    });
}

function confirmDeleteClient(client){
  clientItem.value = client;
  messageDialog.value = true;
}

function onAcceptDeleteClient(){
  messageDialog.value = false;
  deleteClient();
}

function onRejectDeleteClient(){
  messageDialog.value = false;
}

function deleteClient(){
  clientService.delete(clientItem.value.id)
    .then(response => {
      clients.value = clients.value.filter(c => c.id !== clientItem.value.id);
      toast.add({severity:'success', summary: 'Successful', detail: 'Client deleted', life: 3000})
    });
}

onMounted(() => {
  getClients();
});

</script>

<template>
  <div class="clients">
    <h2>Clients</h2>
    <section class="w-full flex flex-wrap gap-2 items-center justify-between">
      <pv-toolbar class="w-full">
        <template #start>
          <pv-iconfield>
            <pv-inputicon>
              <i class="pi pi-search" />
            </pv-inputicon>
            <pv-inputtext v-model="filters['global'].value" placeholder="Search..." />
          </pv-iconfield>
        </template>
        <template #end>
          <pv-button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew"/>
          <pv-button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedClients || !selectedClients.length"/>
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
          <template #body="slotProps">
            <router-link
                :to="{ name: 'client-details', params: { id: slotProps.data.id } }"
                class="ml-2 text-white no-underline hover:underline">
              {{slotProps.data.firstName}} {{slotProps.data.lastName}}
            </router-link>
          </template>
        </pv-column>
        <pv-column field="dni" header="N° document" sortable style="width: fit-content"></pv-column>
        <pv-column field="email" header="Email" sortable style="width: fit-content"></pv-column>
        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">
            <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteClient(slotProps.data)"/>
          </template>
        </pv-column>
      </pv-datatable>
    </section>
    <new-client-dialog @acceptRegister="onCreateClient"/>
    <model-message-dialog
        :visible="messageDialog"
        @confirm="onAcceptDeleteClient"
        @reject="onRejectDeleteClient"
        @update:visible="($event)=> messageDialog = $event"
    />
    <model-message-dialog
        :visible="messageClientsDialog"
        @confirm="onAcceptedDeleteSelectedClients"
        @reject="onRejectedDeleteSelectedClients"
        @update:visible="($event)=> messageClientsDialog = $event"
    />
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
  .table-container {
    width: 100%;
  }
  .table {
    min-width: fit-content;
  }
</style>