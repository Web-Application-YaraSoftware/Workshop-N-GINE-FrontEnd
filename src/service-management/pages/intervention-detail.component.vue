<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {InterventionState} from "../model/intervention-state.enum.js";
import {InterventionsService} from "../../cmr/services/intervention.service.js";
import {PersonnelService} from "../services/personnel.service.js";
import {VehicleService} from "../../cmr/services/vehicles.service.js";
import {TasksService} from "../services/tasks.service.js";
import {ClientsService} from "../../cmr/services/clients.service.js";
import {Intervention} from "../model/intervention.entity.js";
import {useToast} from 'primevue/usetoast';
import {Mechanic} from '../model/mechanic.entity.js';
import {Vehicle} from "../../cmr/model/vehicles.entity.js";
import {Client} from "../../cmr/model/client.entity.js";
import {Task} from '../model/task.entity.js';
import GeneralInformation from "../components/general-information.component.vue";
import InterventionSummary from "../components/intervention-summary.component.vue";
import {useWorkshopStore} from "../services/workshop-store.js";

const route = useRoute();
const toast = useToast();

const intervention = ref(new Intervention());
const client = ref();
const mechanics = ref([]);
const vehicles = ref([]);
const tasks = ref([]);
const currentView = ref('generalInformation');

const interventionsService = new InterventionsService();
const personnelService = new PersonnelService();
const clientService = new ClientsService();
const vehicleService = new VehicleService();
const taskService = new TasksService();

const workshopStore = useWorkshopStore();

const isDialogVisible = ref(false);
const interventionToUpdate = ref(null);

function loadIntervention() {
  const interventionId = route.params.id || '';
  interventionsService.getById(interventionId)
      .then(response => {
        intervention.value = new Intervention(response.data);
        loadVehicles(intervention.value.clientId);
        loadClient(intervention.value.clientId);
        showGeneralInformation();
      })
      .catch(err => {
        toast.add({severity: 'error', summary: 'Error loading intervention', detail: err.message});
      });
}

function loadClient(clientId) {
  clientService.getById(clientId)
      .then(
          (response) => {
            client.value = buildClientFromResponseData(response.data);
          },
          (error) => {
            console.error(error);
          }
      );
}

function buildClientFromResponseData(data) {
  return new Client(data);
}

function loadPersonnel() {
  personnelService.getAllPersonnel(workshopStore.workshop?.id)
      .then(response => {
        mechanics.value = response.data.map(mechanic => new Mechanic(mechanic));
      })
      .catch(err => {
        toast.add({severity: 'error', summary: 'Error loading personnel', detail: err.message});
      });
}

function loadVehicles(clientId) {
  vehicleService.getByClientId(clientId)
      .then(response => {
        vehicles.value = response.data.map(vehicle => new Vehicle(vehicle));
      })
      .catch(err => {
        toast.add({severity: 'error', summary: 'Error loading vehicles', detail: err.message});
      });
}

function loadTasks() {
  const interventionId = route.params.id || '';
  taskService.getAllByInterventionId(interventionId)
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

  interventionsService.putIntervention(interventionToUpdate.value.id, interventionToUpdate.value)
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
            {{ InterventionState.getName(intervention.state) }}
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
}

.intervention-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #f0f4f8;
  border-bottom: 2px solid #1e90ff;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.p-button {
  margin-right: 10px;
}

.intervention-details {
  padding: 20px;
  background-color: #e7f0fa;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.main-content {
  width: 100%;
}

.information-container {
  margin-top: 20px;
}
</style>
