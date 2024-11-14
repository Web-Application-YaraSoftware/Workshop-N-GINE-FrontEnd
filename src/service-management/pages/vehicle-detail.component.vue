<script setup>
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {Vehicle} from "../model/vehicle.entity.js";
import {VehicleService} from "../services/vehicle.service.js";
import {InterventionsService} from "../services/interventions.service.js";
import {Intervention} from "../model/intervention.entity.js";
import {IotDevicesService} from "../services/iot-devices.service.js";
import {IoTDevice} from "../model/iot-device.entity.js";
import IotInformation from "../components/iot-information.component.vue";
import {useToast} from 'primevue/usetoast';
import RegisterInterventions from "../components/register-interventions.component.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const vehicleService = new VehicleService();
const interventionsService = new InterventionsService();
const iotDevicesService = new IotDevicesService();

const registerInterventions = ref([]);
const vehicleId = ref(0);
const vehicle = ref({});
const iotDevice = ref({});
const currentView = ref('activityLog');
const dialogVisible = ref(false);

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

function getIotDevice() {
  iotDevicesService.getAllByVehicleId(vehicleId.value)
      .then(
          (response) => {
            iotDevice.value = buildIotDeviceFromResponseData(response.data);
          },
          (error) => {
            console.error(error);
          }
      );
}

function buildInterventionFromResponseData(data) {
  return data.map((intervention) => new Intervention(intervention));
}

function buildIotDeviceFromResponseData(data) {
  return new IoTDevice(data);
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

function confirmDeleteVehicle() {
  dialogVisible.value = true;
}

function deleteVehicle() {
  vehicleService.deleteVehicle(vehicleId.value)
      .then(() => {
        toast.add({severity: 'success', summary: 'Success', detail: 'Vehicle deleted successfully', life: 3000});
        router.push(`/clients/${vehicle.value.userId}`);
      })
      .catch(error => {
        console.error(error);
        toast.add({severity: 'error', summary: 'Error', detail: 'Failed to delete vehicle', life: 3000});
      });
}

onMounted(() => {
  loadVehicleIdFromRoute();
  loadVehicleData();
  getRegisterInterventions();
  getIotDevice();
});
</script>

<template>
  <main>
    <div class="vehicle-header">
      <h1>{{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.licensePlate }})</h1>
      <pv-toolbar class="toolbar">
        <template #start>
          <pv-button label="Activity log" class="p-button" @click="showActivityLog" />
          <pv-button label="IoT Information" class="p-button" @click="showIotInformation" />
        </template>
        <template #end>
          <pv-button icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteVehicle" />
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
          <iot-information
              v-if="currentView === 'iotInformation'"
              :iotInformation="iotDevice"
          />
        </div>
      </div>
    </div>
    <pv-dialog header="Confirm Deletion" :visible="dialogVisible" modal @hide="dialogVisible = false">
      <p>Are you sure you want to delete this vehicle?</p>
      <template #footer>
        <pv-button label="Yes" icon="pi pi-check" class="p-button-danger" @click="deleteVehicle" />
        <pv-button label="No" icon="pi pi-times" class="p-button-secondary" @click="dialogVisible = false" />
      </template>
    </pv-dialog>
  </main>
</template>

<style scoped>
.vehicle-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #F3F9FF;
  border-bottom: 2px solid #A0CFFF;
}

.toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.p-button {
  margin-right: 1rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
}

.p-button:hover {
  background-color: #A0CFFF;
  transition: background-color 0.3s ease;
}

.p-button-danger {
  background-color: #FF6B6B;
  color: white;
}

.p-button-danger:hover {
  background-color: #FF4C4C;
}

.p-button-secondary {
  background-color: #E0E0E0;
  color: #003C6E;
}

.vehicle-header h1 {
  margin: 0;
  font-size: 2.4rem;
  color: #003C6E;
  font-weight: 600;
}

.vehicle-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  background-color: #F3F9FF;
}

.main-content {
  width: 100%;
  max-width: 900px;
  align-items: center;
  border: 2px solid #A0CFFF;
  padding: 1rem;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 75, 134, 0.1);
}

.information-container {
  margin-top: 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .datatable-container {
    overflow-x: auto;
  }
}

.pv-dialog .p-button-danger {
  background-color: #FF6B6B;
}

.pv-dialog .p-button-danger:hover {
  background-color: #FF4C4C;
}

.pv-dialog .p-button-secondary {
  background-color: #E0E0E0;
  color: #003C6E;
}

.pv-dialog .p-button-secondary:hover {
  background-color: #D1D1D1;
}

@media (max-width: 768px) {
  .vehicle-header h1 {
    font-size: 1.8rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-content {
    padding: 1rem;
  }

  .information-container {
    max-height: 50vh;
  }
}
</style>

