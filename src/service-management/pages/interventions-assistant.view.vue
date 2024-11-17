<script setup>
import {useToast} from "primevue/usetoast";
import {onMounted, ref, watchEffect} from "vue";
import {FilterMatchMode} from '@primevue/core/api';
import {Intervention} from "../model/intervention.entity.js";
import {InterventionState} from "../model/intervention-state.enum.js";
import {useWorkshopStore} from "../services/workshop-store.js";
import {useRouter} from "vue-router";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {WorkshopService} from "../services/workshop.service.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";
import {VehiclesService} from "../../cmr/services/vehicles.service.js";
import {Profile} from "../../profile-management/model/profile.entity.js";
import {Vehicle} from "../model/vehicle.entity.js";
import {formatDate} from "../../shared/services/date.service.js";

// Services
const authenticationStore = useAuthStore();
const workshopStore = useWorkshopStore();
const workshopService = new WorkshopService();
const profileService = new ProfilesService();
const vehicleService = new VehiclesService();
const router = useRouter();
const toast = useToast();

// Table configuration
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'id': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'client': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'scheduledDate': {value: null, matchMode: FilterMatchMode.EQUALS},
  'type': {value: null, matchMode: FilterMatchMode.EQUALS},
  'state': {value: null, matchMode: FilterMatchMode.EQUALS },
});
const loading = ref(true);
const getStatusSeverity = (status) => {
  switch (status) {
    case 'Pending':
      return 'warn';
    case 'InProgress':
      return 'info';
    case 'Completed':
      return 'success';
    default:
      return null;
  }
};
const statusOptions = [
  { label: InterventionState.getName(1), value: 1 },
  { label: InterventionState.getName(2), value: 2 },
  { label: InterventionState.getName(3), value: 3 },
  { label: InterventionState.getName(4), value: 4 },
]
// Data
const interventions = ref([]);
const interventionsData = ref([]);

onMounted(() => {
  getInterventions();
});

watchEffect( async ()=>{
  interventionsData.value = await Promise.all(interventions.value.map(async intervention => {
    const vehicle = await getVehicleById(intervention?.vehicleId);
    const client = await getProfileByUserId(vehicle?.userId);
    return {
      ...intervention,
      client: client.fullName
    };
  }));
})

async function getInterventions() {
  const userId = authenticationStore.user.id;
  const workshopId = authenticationStore.user.workshopId;
  try {
    let response = await workshopService.getAllInterventionsByMechanicAssistantId(workshopId, userId);
    interventions.value = buildDataFromResponseData(response.data);
    loading.value = false;
  } catch (e) {
    loading.value = false;
    toast.add({
      severity: 'error',
      summary: 'Interventions not loaded',
      detail: 'An error occurred while loading interventions data',
      life: 3000
    });
  }
}

function buildDataFromResponseData(interventions){
  return interventions.map(intervention => {
    return new Intervention(intervention);
  });
}

async function getProfileByUserId(userId) {
  let response = await profileService.getProfileByUserId(userId);
  return new Profile(response.data);
}

async function getVehicleById(id) {
  let response = await vehicleService.getById(id);
  return new Vehicle(response.data);
}

// Events
function onRowSelect(data){
  workshopStore.setAssistant();
  router.push({name: 'activity-details', params: {id: data.id}});
}

</script>

<template>
  <section class="assistants">
    <pv-datatable
      :value="interventionsData"
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
        <template #body="data">
          {{data.data.id}}
        </template>
      </pv-column>
      <pv-column field="client" filterField="client" header="Client" sortable>
        <template #body="data">
          {{ data.data.client }}
        </template>
      </pv-column>
      <pv-column field="registrationDate" filterField="scheduledDate" header="Date" sortable>
        <template #body="data">
          {{formatDate(data.data.scheduledDate)}}
        </template>
      </pv-column>
      <pv-column field="interventionType" filterField="type" header="Type" sortable>
        <template #body="data">
          {{data.data.type}}
        </template>
      </pv-column>
      <pv-column field="state" filterField="status" header="Status">
        <template #body="data">
          <pv-tag :severity="getStatusSeverity(data.data.status)">
            {{ data.data.status }}
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