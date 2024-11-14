<script setup>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {Vehicle} from "../model/vehicle.entity.js";
import {VehicleService} from "../services/vehicle.service.js";
import {InterventionsService} from "../services/interventions.service.js";
import {Intervention} from "../model/intervention.entity.js";
import RegisterInterventions from "../components/register-interventions.component.vue";

const route = useRoute();
const vehicleService = new VehicleService();
const registerInterventions = ref([]);
const interventionsService = new InterventionsService();

const vehicleId = ref(0);
const vehicle = ref({});
const currentView = ref('activityLog');

function getRegisterInterventions() {
  interventionsService.getAllByVehicleId(vehicleId.value)
      .then(
          (response) => {
            registerInterventions.value = buildInterventionFromResponseData(response.data);
          },
          (error) => {
            console.error(error);
          }
      );
}

function buildInterventionFromResponseData(data) {
  return data.map((intervention) => new Intervention(intervention));
}


function loadVehicleIdFromRoute() {
  vehicleId.value = route.params.carId || 0;
}

function loadVehicleData() {
  vehicleService.getById(vehicleId.value).then(fetchedVehicle => {
    vehicle.value = new Vehicle(fetchedVehicle.data);
    showActivityLog();
  });
}


function showActivityLog() {
  currentView.value = 'activityLog';
}

function showIotInformation() {
  currentView.value = 'iotInformation';
}

onMounted(() => {
  loadVehicleIdFromRoute();
  loadVehicleData();
  getRegisterInterventions();
});
</script>

<template>
  <main>
    <div class="vehicle-header">
      <h1>{{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.licensePlate }})</h1>
      <pv-toolbar class="toolbar">
        <template #start>
          <pv-button label="Activity log" class="p-button" @click="showActivityLog"/>
          <pv-button label="IoT Information" class="p-button" @click="showIotInformation"/>
        </template>
        <template #end>
          <pv-button icon="pi pi-trash" class="p-button-danger"/>
        </template>
      </pv-toolbar>
    </div>
    <div class="vehicle-details">
      <div class="main-content">
        <div class="information-container">
          <register-interventions
              v-if="currentView === 'activityLog'"
              :interventions="registerInterventions"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.vehicle-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.p-button {
  margin-right: 10px;
}

.vehicle-header h1 {
  margin: 0;
  font-size: 2rem;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}

.main-content {
  width: 100%;
  align-items: center;
  border: 2px solid #ccc;
  padding: 0 20px;
  box-sizing: border-box;
  border-radius: 15px;
}

.information-container {
  margin-top: 20px;
  max-height: 69vh;
  max-width: 800px;
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
}

</style>
