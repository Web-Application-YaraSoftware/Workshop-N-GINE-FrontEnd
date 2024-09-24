<script setup>
import {ClientService} from "../services/client.service.js";
import {onMounted, ref} from "vue";
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import {User} from "../model/user.entity.js";

const clientItem = ref({});
const clients = ref();
const selectedClients = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const deleteClientsDialog = ref(false);

const clientService = new ClientService();

function getClients(){
  clientService.getAllByWorkshop(1)
      .then(response => {
        clients.value = buildClientListFromResponseData(response.data);
      });
}

function buildClientListFromResponseData(clients){
  return clients.map(client => {
    const auxClient = new User(client);
    auxClient.state = client.state;
    auxClient.userType = client.user_type;
    return auxClient;
  });
}

function confirmDeleteSelected(client){
  let deleteClientDialog;
  deleteClientDialog.value = true;
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
          <pv-button label="New" icon="pi pi-plus" severity="success" class="mr-2" />
<!--TODO: @click="openNew"-->
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
        <pv-column field="firstName" header="Name" sortable style="width: fit-content"></pv-column>
        <pv-column field="lastName" header="Last name" sortable style="width: fit-content"></pv-column>
        <pv-column field="dni" header="N° document" sortable style="width: fit-content"></pv-column>
        <pv-column field="email" header="email" sortable style="width: fit-content"></pv-column>
        <pv-column :exportable="false" style="width: min-content">
          <template #body="slotProps">
            <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" />
<!--            @click="editProduct(slotProps.data)"-->
            <pv-button icon="pi pi-trash" outlined rounded severity="danger" />
<!--            @click="confirmDeleteProduct(slotProps.data)"-->
          </template>
        </pv-column>
      </pv-datatable>
    </section>
  </div>
</template>

<style scoped>
  .clients {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .table-container {
    width: 100%;
    overflow-x: auto;
  }
  .table {
    min-width: fit-content;
  }
</style>