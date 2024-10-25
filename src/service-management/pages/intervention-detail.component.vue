<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { InterventionsService } from "../../cmr/services/intervention.service.js";
import { PersonnelService } from "../services/personnel.service.js";
import { VehicleService } from "../../cmr/services/vehicle.service.js";
import { useToast } from 'primevue/usetoast';
import { Mechanic } from '../model/mechanic.entity.js';
import { Vehicle } from '../model/vehicle.entity.js';
import GeneralInformation from "../components/general-information.component.vue";

const route = useRoute();
const toast = useToast();

const intervention = ref({});
const mechanics = ref([]);
const vehicles = ref([]);
const isOwner = ref(true);
const currentView = ref('generalInformation');

const interventionsService = new InterventionsService();
const personnelService = new PersonnelService();
const vehicleService = new VehicleService();

function loadIntervention() {
  const interventionId = route.params.id || '';
  interventionsService.getById(interventionId)
      .then(response => {
        intervention.value = response.data;
        loadVehicles(intervention.value.vehicle.owner.dni); // Load vehicles after intervention
        showGeneralInformation();
      })
      .catch(err => {
        toast.add({ severity: 'error', summary: 'Error loading intervention', detail: err.message });
      });
}

function loadPersonnel() {
  personnelService.getAllPersonnelByWorkshopId(1)
      .then(response => {
        mechanics.value = response.data.map(mechanic => new Mechanic(mechanic));
      })
      .catch(err => {
        toast.add({ severity: 'error', summary: 'Error loading personnel', detail: err.message });
      });
}

function loadVehicles(clientDni) {
  vehicleService.getByClientDni(clientDni)
      .then(response => {
        vehicles.value = response.data.map(vehicle => new Vehicle(vehicle));
      })
      .catch(err => {
        toast.add({ severity: 'error', summary: 'Error loading vehicles', detail: err.message });
      });
}

function showGeneralInformation() {
  currentView.value = 'generalInformation';
}

onMounted(() => {
  loadIntervention();
  loadPersonnel();
});
</script>

<template>
  <section class="intervention-section">
    <div class="intervention-header">
      <h1>Intervention No. {{ intervention.id }}</h1>
      <pv-toolbar class="toolbar">
        <template #start>
          <pv-button label="General Information" class="p-button" @click="showGeneralInformation"/>
        </template>
        <template #end>
          <pv-button class="p-button-secondary">
            {{ intervention.state }}
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
              :mechanics="mechanics"
              :vehicles="vehicles"
              :isOwner="isOwner"
          />
        </div>
      </div>
    </div>
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
