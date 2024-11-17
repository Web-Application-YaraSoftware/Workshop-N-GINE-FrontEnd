<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {InterventionsService} from "../services/interventions.service.js";
import {VehicleService} from "../services/vehicle.service.js";
import {Intervention} from "../model/intervention.entity.js";
import {useToast} from 'primevue/usetoast';
import {Vehicle} from "../model/vehicle.entity.js";
import {Task} from '../model/task.entity.js';
import GeneralInformation from "../components/general-information.component.vue";
import InterventionSummary from "../components/intervention-summary.component.vue";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {Profile} from "../../profile-management/model/profile.entity.js";
import {ProfilesService} from "../../profile-management/services/profiles.service.js";
import {WorkshopService} from "../services/workshop.service.js";

const route = useRoute();
const toast = useToast();

const intervention = ref(new Intervention());
const client = ref(new Profile());
const mechanics = ref([]);
const vehicles = ref([]);
const tasks = ref([]);
const currentView = ref('generalInformation');

const interventionsService = new InterventionsService();
const workshopService = new WorkshopService();
const vehicleService = new VehicleService();
const profilesService = new ProfilesService();

const workshopId = useAuthStore().user.workshopId;

const isDialogVisible = ref(false);
const interventionToUpdate = ref(null);


function loadIntervention() {
  const interventionId = route.params.id || '';
  const clientId = ref(0);
  interventionsService.getById(interventionId)
      .then(response => {
        intervention.value = new Intervention(response.data);
        vehicleService.getById(intervention.value.vehicleId)
            .then(response => {
              clientId.value = response.data.userId;
              loadClient(clientId.value);
              loadVehicles(clientId.value);
            })
            .catch(err => {
              toast.add({severity: 'error', summary: 'Error loading client and vehicles', detail: err.message});
            });
      })
      .catch(err => {
        toast.add({severity: 'error', summary: 'Error loading intervention', detail: err.message});
      });
}

function loadClient(clientId) {
  profilesService.getProfileByUserId(clientId)
      .then(response => {
        client.value = buildClientFromResponseData(response.data);
      })
      .catch(err => {
        toast.add({severity: 'error', summary: 'Error loading client', detail: err.message});
      });
}

function buildClientFromResponseData(data) {
  return new Profile(data);
}

function loadPersonnel() {
  fetchPersonnelUserId()
      .then(userIds => {
        if (!Array.isArray(userIds)) {
          throw new Error('Invalid response format');
        }
        const profilePromises = userIds.map(userId => profilesService.getProfileByUserId(userId));
        return Promise.all(profilePromises);
      })
      .then(profiles => {
        mechanics.value = profiles.map(profile => mechanicFromResponseData(profile.data));
      })
      .catch(error => {
        console.error('Error fetching mechanics:', error);
      });
}

function fetchPersonnelUserId() {
  return workshopService.getMechanicsUserIdByWorkshopId(workshopId)
      .then(response => {
        if (typeof response.data !== 'object' || response.data === null) {
          throw new Error('Invalid response format');
        }
        return response.data;
      })
      .catch(error => {
        console.error('Error fetching mechanics user IDs:', error);
        return [];
      });
}

function mechanicFromResponseData(data) {
  return new Profile(data);
}

function loadVehicles(clientId) {
  vehicleService.getByUserId(clientId)
      .then(response => {
        vehicles.value = response.data.map(vehicle => new Vehicle(vehicle));
      })
      .catch(err => {
        toast.add({severity: 'error', summary: 'Error loading vehicles', detail: err.message});
      });
}

function loadTasks() {
  const interventionId = route.params.id || '';
  interventionsService.getAllTasksByInterventionId(interventionId)
      .then(response => {
        tasks.value = response.data.map(t => new Task(t));
      })
      .catch(err => {
        toast.add({severity: 'error', summary: 'Error loading tasks', detail: err.message});
      });
}

function showGeneralInformation() {
  currentView.value = 'generalInformation';
}

function showInterventionSummary() {
  currentView.value = 'interventionSummary';
}

function updateIntervention(updatedIntervention) {
  interventionToUpdate.value = updatedIntervention;
  isDialogVisible.value = true;
}

function confirmUpdate() {
  if (!interventionToUpdate.value) return;
  console.log('Updating intervention:', interventionToUpdate.value);
  interventionsService.put(intervention.value.id, interventionToUpdate.value)
      .then(() => {
        toast.add({severity: 'success', summary: 'Success', detail: 'Intervention updated', life: 4000});
        isDialogVisible.value = false;
      })
}

onMounted(() => {
  loadIntervention();
  loadPersonnel();
  loadTasks();
});
</script>

<template>
  <section class="intervention-section">
    <div class="intervention-header">
      <h1>Intervention No. {{ intervention.id }}</h1>
      <pv-toolbar class="toolbar">
        <template #start>
          <pv-button label="General Information" class="p-button" @click="showGeneralInformation"/>
          <pv-button label="Intervention Summary" class="p-button" @click="showInterventionSummary"/>
        </template>
        <template #end>
          <pv-button class="p-button-secondary">
            {{ intervention.status}}
          </pv-button>
        </template>
      </pv-toolbar>
    </div>

    <div class="intervention-details">
      <div class="main-content">
        <div class="information-container">
          <general-information
              v-if="currentView === 'generalInformation'"
              :intervention="intervention"
              :client="client"
              :clientVehicles="vehicles"
              :mechanics="mechanics"
              @update:intervention="updateIntervention"
          />
          <intervention-summary
              v-if="currentView === 'interventionSummary'"
              :tasks="tasks"
              :intervention="intervention"
          />
        </div>
      </div>
    </div>

    <pv-dialog v-model:visible="isDialogVisible" header="Confirm Update" :modal="true" :closable="false">
      <p>Are you sure you want to update this intervention?</p>
      <template #footer>
        <pv-button label="No" icon="pi pi-times" @click="isDialogVisible = false" class="p-button-text"/>
        <pv-button label="Yes" icon="pi pi-check" @click="confirmUpdate" class="p-button-text"/>
      </template>
    </pv-dialog>
  </section>
</template>

<style scoped>
.intervention-section {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.intervention-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #f7faff;
  border-bottom: 3px solid #007bff;
  border-radius: 8px 8px 0 0;
}

.intervention-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #0056b3;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}

.p-button {
  margin-right: 10px;
  font-size: 0.9rem;
  font-weight: bold;
}

.p-button-secondary {
  background-color: #e9ecef;
  color: #495057;
  border: none;
  font-weight: bold;
}

.intervention-details {
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.main-content {
  width: 100%;
}

.information-container {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.pv-dialog {
  text-align: center;
}

.pv-dialog p {
  font-size: 1rem;
  color: #555;
}

.pv-dialog .p-button-text {
  font-size: 0.9rem;
}

.pv-dialog .p-button:first-of-type {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .intervention-header {
    align-items: center;
    text-align: center;
  }

  .toolbar {
    flex-direction: column;
    align-items: center;
  }

  .p-button {
    margin: 5px 0;
  }
}
</style>
