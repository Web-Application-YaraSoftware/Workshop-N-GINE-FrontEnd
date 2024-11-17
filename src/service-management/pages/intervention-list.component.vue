<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { InterventionsService } from '../services/interventions.service.js';
import { ProfilesService } from '../../profile-management/services/profiles.service.js';
import { VehicleService } from '../services/vehicle.service.js';
import { WorkshopService } from '../services/workshop.service.js';
import { Profile } from '../../profile-management/model/profile.entity.js';
import { Vehicle } from '../model/vehicle.entity.js';
import { Intervention } from '../model/intervention.entity.js';
import { InterventionState } from '../model/intervention-state.enum.js';
import { InterventionType } from '../model/intervention-type.enum.js';
import NewInterventionDialog from '../components/new-intervention-dialog.component.vue';
import { useAuthStore } from "../../iam/services/auth-store.js";

const router = useRouter();
const interventionsService = new InterventionsService();
const profilesService = new ProfilesService();
const vehiclesService = new VehicleService();
const workshopService = new WorkshopService();
const authStore = useAuthStore();

const interventions = ref([]);
const noInterventions = ref(false);
const filters = ref({ global: { value: '' } });
const selectedStatus = ref('All');
const loading = ref(false);
const isDialogVisible = ref(false);
const isTableView = ref(true);

const createProfile = (profileData) => new Profile(profileData);
const createVehicle = (vehicleData) => new Vehicle(vehicleData);

const getProfileByVehicleId = (vehicleId) => {
  return vehiclesService.getById(vehicleId)
      .then(response => profilesService.getById(response.data.userId))
      .then(response => createProfile(response.data));
};

const getVehicle = (vehicleId) => {
  return vehiclesService.getById(vehicleId)
      .then(response => createVehicle(response.data));
};

const getPersonnel = (workshopId) => {
  return workshopService.getMechanicsUserIdByWorkshopId(workshopId)
      .then(response => response.data.map(mechanic => ({
        id: mechanic.id,
        fullName: mechanic.fullName
      })));
};

const enrichInterventionData = (intervention, client, vehicle, mechanicLeader, mechanics) => {
  const mechanic = mechanics.find(m => m.id === intervention.mechanicLeaderId);
  return {
    ...intervention,
    client,
    vehicle,
    mechanicLeader,
    mechanic: mechanic ? mechanic.fullName : 'N/A',
    interventionTypeName: InterventionType.getName(intervention.type),
    stateName: InterventionState.getName(intervention.status)
  };
};

const getAndEnrichIntervention = (interventionData, mechanics) => {
  const intervention = new Intervention(interventionData);

  return Promise.all([
    getProfileByVehicleId(intervention.vehicleId),
    getVehicle(intervention.vehicleId),
    getPersonnel(authStore.user?.workshopId)
  ])
      .then(([client, vehicle, mechanicLeader]) => enrichInterventionData(intervention, client, vehicle, mechanicLeader, mechanics));
};

const getInterventions = () => {
  loading.value = true;
  const workshopId = authStore.user.workshopId;
  console.log('workshopId', workshopId);
  workshopService.getAllInterventionsByWorkshopId(workshopId)
      .then(response => {
        const interventionData = response.data;

        if (interventionData.length === 0) {
          noInterventions.value = true;
        } else {
          noInterventions.value = false;

          getPersonnel(workshopId).then(mechanics => {
            const populatedInterventionsPromises = interventionData.map(intervention => getAndEnrichIntervention(intervention, mechanics));

            Promise.all(populatedInterventionsPromises)
                .then(populatedInterventions => {
                  interventions.value = populatedInterventions;
                });
          });
        }
      })
      .finally(() => {
        loading.value = false;
      });
};

onMounted(() => {
  getInterventions();
});

const openDialog = () => {
  isDialogVisible.value = true;
};

const closeDialog = () => {
  isDialogVisible.value = false;
};

const submitIntervention = async (interventionData) => {
  try {
    await interventionsService.post(interventionData);
    getInterventions();
  } catch (error) {
    console.error('Error submitting intervention:', error);
  }
  closeDialog();
};

const filteredInterventions = computed(() => {
  if (selectedStatus.value === 'All') {
    return interventions.value;
  }
  return interventions.value.filter((intervention) => intervention.stateName === selectedStatus.value);
});

const filterByStatus = (status) => {
  selectedStatus.value = status;
};

const isActiveFilter = (status) => {
  return selectedStatus.value === status;
};

const toggleView = () => {
  isTableView.value = !isTableView.value;
};

const getStatusSeverity = (stateName) => {
  switch (stateName) {
    case 'Pending':
      return 'warn';
    case 'In Progress':
      return 'info';
    case 'Completed':
      return 'success';
    default:
      return 'secondary';
  }
};

const goToInterventionDetail = (id) => {
  router.push(`/interventions/${id}`);
};
</script>

<template>
  <section class="intervention-container p-4">
    <section class="header mb-4">
      <h2 class="font-bold">Interventions</h2>
    </section>

    <section class="disposition-modes mb-4 flex gap-4">
      <pv-button icon="pi pi-list" @click="toggleView" class="p-button-rounded p-button-text custom-size-button"/>
      <pv-button icon="pi pi-table" @click="toggleView" class="p-button-rounded p-button-text custom-size-button"/>
    </section>

    <section class="w-full flex items-center justify-between mb-4">
      <pv-toolbar class="w-full">
        <template #start>
          <pv-iconfield>
            <pv-inputicon>
              <i class="pi pi-search"/>
            </pv-inputicon>
            <pv-inputtext class="custom-size-button" v-model="filters['global'].value" placeholder="Keyword"/>
          </pv-iconfield>
        </template>
        <template #end>
          <pv-button class="custom-size-button" label="Schedule intervention" icon="pi pi-plus" severity="success"
                     @click="openDialog"/>
        </template>
      </pv-toolbar>
    </section>

    <section class="filters mb-4 flex gap-4">
      <pv-button
          label="Pending"
          :class="{ 'p-button-active': isActiveFilter('Pending') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('Pending')"
      />
      <pv-button
          label="In Progress"
          :class="{ 'p-button-active': isActiveFilter('In Progress') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('In Progress')"
      />
      <pv-button
          label="Completed"
          :class="{ 'p-button-active': isActiveFilter('Completed') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('Completed')"
      />
      <pv-button
          label="All"
          :class="{ 'p-button-active': isActiveFilter('All') }"
          class="p-button-outlined custom-size-button"
          @click="filterByStatus('All')"
      />
    </section>

    <section v-if="isTableView" class="interventions-table">
      <pv-datatable
          :value="filteredInterventions"
          class="table"
          :paginator="true"
          :rows="10"
          dataKey="id"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} interventions"
          responsiveLayout="scroll"
      >
        <pv-column field="client.firstName" header="Client First Name" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.client.firstName }}
            </span>
          </template>
        </pv-column>
        <pv-column field="client.lastName" header="Client Last Name" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.client.lastName }}
            </span>
          </template>
        </pv-column>
        <pv-column field="vehicle.licensePlate" header="Vehicle License Plate" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.vehicle.licensePlate }}
            </span>
          </template>
        </pv-column>
        <pv-column field="vehicle.model" header="Vehicle Model" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.vehicle.model }}
            </span>
          </template>
        </pv-column>
        <pv-column field="mechanic" header="Mechanic Leader" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.mechanic }}
            </span>
          </template>
        </pv-column>
        <pv-column field="interventionTypeName" header="Intervention Type" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.type }}
            </span>
          </template>
        </pv-column>
        <pv-column field="registrationDate" header="Registration Date" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.registrationDate }}
            </span>
          </template>
        </pv-column>
        <pv-column field="completionDate" header="Completion Date" sortable>
          <template #body="slotProps">
            <span @click="goToInterventionDetail(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.completionDate || 'N/A' }}
            </span>
          </template>
        </pv-column>
        <pv-column field="stateName" header="Status" sortable>
          <template #body="slotProps">
            <pv-button
                @click="goToInterventionDetail(slotProps.data.id)"
                :severity="getStatusSeverity(slotProps.data.stateName)"
                :label="slotProps.data.stateName"
                class="cursor-pointer custom-status-button"
            />
          </template>
        </pv-column>
      </pv-datatable>

      <div v-if="loading" class="loading-indicator">Loading interventions...</div>
      <div v-if="noInterventions" class="no-interventions">No interventions found.</div>
    </section>

    <section v-else class="cards-view">
      <pv-card v-for="intervention in filteredInterventions" :key="intervention.id" class="intervention-card"
               @click="goToInterventionDetail(intervention.id)">
        <template #header>
          <div class="card-header">
            <h3>{{ intervention.client.firstName }} {{ intervention.client.lastName }}</h3>
            <pv-button
                :severity="getStatusSeverity(intervention.stateName)"
                :label="intervention.stateName"
                class="status-button"
            />
          </div>
        </template>
        <template #content class="card-content">
          <p><strong>Vehicle:</strong> {{ intervention.vehicle.licensePlate }} - {{ intervention.vehicle.model }}</p>
          <p><strong>Mechanic Leader:</strong> {{ intervention.mechanic }}</p>
          <p><strong>Intervention Type:</strong> {{ intervention.interventionTypeName }}</p>
          <p><strong>Registration Date:</strong> {{ intervention.registrationDate }}</p>
          <p><strong>Completion Date:</strong> {{ intervention.completionDate || 'N/A' }}</p>
        </template>
      </pv-card>
    </section>

    <new-intervention-dialog :visible="isDialogVisible" @close="closeDialog" @submit="submitIntervention"/>
  </section>
</template>

<style scoped>
.intervention-container {
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  height: calc(100vh - 40px);
  overflow-x: auto;
  overflow-y: auto;
}

.header h2 {
  font-size: 4rem;
  font-weight: bold;
}

.disposition-modes {
  display: flex;
  justify-content: flex-start;
}

.custom-size-button {
  font-size: 1.3rem;
  padding: 0.75rem 1.5rem;
}

.p-button-active {
  background-color: #007ad9 !important;
  color: white !important;
}

.p-button-outlined {
  border: 2px solid #007ad9;
}

.interventions-table,
.cards-view {
  margin-top: 20px;
}

.cards-view {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.intervention-card {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.intervention-card:hover {
  transform: scale(1.02);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #007ad9;
}

.card-content {
  font-size: 1rem;
  color: #333;
}

.loading-indicator,
.no-interventions {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
}

.table {
  min-width: fit-content;
  width: 100%;
  font-size: 1.2rem;
}
</style>