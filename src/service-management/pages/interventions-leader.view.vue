<script setup>
import {useToast} from "primevue/usetoast";
import {computed, onMounted, ref} from "vue";
import {FilterMatchMode} from '@primevue/core/api';
import {InterventionsService} from "../services/interventions.service.js";
import {ClientsService} from "../../cmr/services/clients.service.js";
import {Intervention} from "../model/intervention.entity.js";
import {Client} from "../../cmr/model/client.entity.js";
import {InterventionType} from "../model/intervention-type.enum.js";
import {InterventionState} from "../model/intervention-state.enum.js";
import {useWorkshopStore} from "../../shared/services/workshop-store.js";
import {useRouter} from "vue-router";

// Services
const workshopStore = useWorkshopStore();
const interventionService = new InterventionsService();
const clientService = new ClientsService();
const router = useRouter();
const toast = useToast();
// Table configuration
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'id': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'vehicle.owner.firstName': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'vehicle.licensePlate': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'registrationDate': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'interventionType': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'state': {value: null, matchMode: FilterMatchMode.EQUALS },
});
const loading = ref(true);
const getStatusSeverity = (status) => {
  switch (status) {
    case InterventionState.PENDING:
      return 'warn';
    case InterventionState.IN_PROGRESS:
      return 'info';
    case InterventionState.COMPLETED:
      return 'success';
    default:
      return null;
  }
};
const statusOptions = [
  { label: InterventionState.getName(0), value: 0 },
  { label: InterventionState.getName(1), value: 1 },
  { label: InterventionState.getName(2), value: 2 }
]
// Data
const interventions = ref([]);
const interventionWithClientName = computed(() => {
  return interventions.value.map(intervention => {
    const client = clients.value.find(client => client?.id === intervention?.clientId);
    return {
      ...intervention,
      client: client ? client?.fullName : 'Unknown'
    }
  });
});
const clients = ref([]);

onMounted(() => {
  getInterventions();
  getClients();
});

// Methods
function getInterventions() {
  const userId = workshopStore.user.id;
  interventionService.getAllByMechanicLeaderId(userId)
      .then(
          (response) => {
            interventions.value = buildDataFromResponseData(response.data);
            loading.value = false;
          },
          () => {
            toast.add({ severity: 'error', summary: 'Interventions not loaded', detail: 'An error occurred while loading interventions data', life: 3000 });
            loading.value = false;
          }
      );
}

function buildDataFromResponseData(interventions){
  return interventions.map(intervention => {
    return new Intervention(intervention);
  });
}

function getClients(){
  clientService.getAllByWorkshop(workshopStore.workshop.id)
      .then(
          (response) =>
          {
            clients.value = buildClientsDataFromResponseData(response.data);
          },
          () =>
          {
            toast.add({ severity: 'error', summary: 'Clients not loaded', detail: 'An error occurred while loading clients data', life: 3000 })
          }
      );
}

function buildClientsDataFromResponseData(clients){
  return clients.map(client => new Client(client));
}

// Events
function onRowSelect(data){
  workshopStore.setLeader();
  router.push({name: 'activity-details', params: {id: data.id}});
}

</script>

<template>
  <section class="assistants">
    <pv-datatable
        :value="interventionWithClientName"
        removableSort
        v-model:filters="filters"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5,10,20]"
        dataKey="id"
        filterDisplay="menu"
        :loading="loading"
        selectionMode="single"
        :metaKeySelection="false"
        @rowSelect="onRowSelect($event.data)"
    >
      <template #header>
        <div class="flex justify-end">
          <pv-iconfield>
            <pv-inputicon>
              <i class="pi pi-search" />
            </pv-inputicon>
            <pv-inputtext v-model="filters['global'].value" placeholder="Keyword Search" />
          </pv-iconfield>
        </div>
      </template>
      <template #empty>
        <div class="empty">
          <i class="pi pi-search" style="font-size: 3rem"></i>
          <div>No interventions found</div>
        </div>
      </template>
      <template #loading> Loading interventions data. Please wait. </template>
      <pv-column field="id" filterField="id" header="ID" sortable>
        <template #body="{ data }">
          {{data.id}}
        </template>
      </pv-column>
      <pv-column field="client" filterField="client" header="Client" sortable>
        <template #body="{ data }">
          {{ data.client }}
        </template>
      </pv-column>
      <pv-column field="registrationDate" filterField="registrationDate" header="Date" sortable>
        <template #body="{ data }">
          {{data.registrationDate.toLocaleDateString()}}
        </template>
      </pv-column>
      <pv-column field="interventionType" filterField="interventionType" header="Type" sortable>
        <template #body="{ data }">
          {{InterventionType.getName(data.interventionType)}}
        </template>
      </pv-column>
      <pv-column field="state" filterField="state" header="Status">
        <template #body="{ data }">
          <pv-tag :severity="getStatusSeverity(data.state)">
            {{ InterventionState.getName(data.state) }}
          </pv-tag>
        </template>
        <template #filter="{ filterModel }">
          <pv-select
              v-model="filterModel.value"
              :options="statusOptions"
              placeholder="Select One"
              option-label="label"
              option-value="value"
          >
            <template #option="slotProps">
              <pv-tag :value="slotProps?.option.label" :severity="getStatusSeverity(slotProps?.option.value)" />
            </template>
          </pv-select>
        </template>
      </pv-column>
    </pv-datatable>
    <pv-toast/>
  </section>
</template>

<style scoped>
.empty{
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>