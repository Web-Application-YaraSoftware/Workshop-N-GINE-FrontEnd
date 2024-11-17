<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {ProfilesService} from "../../profile-management/services/profiles.service.js";
import {VehicleService} from "../services/vehicle.service.js";
import ConfirmationDialog from "../../shared/components/confirmation-dialog.component.vue";
import NewVehicleDialog from "../components/new-vehicle-dialog.component.vue";
import VehicleItem from "../components/vehicle-item.component.vue";
import {Vehicle} from "../model/vehicle.entity.js";
import {Profile} from "../../profile-management/model/profile.entity.js";
import {useAuthStore} from "../../iam/services/auth-store.js";

//Router and services
const router = useRouter();
const profileService = new ProfilesService();
const vehicleService = new VehicleService();
const authenticationStore = useAuthStore();

//Reactive state
const userId = ref(0);
const workshopClient = ref(new Profile());
const vehicles = ref([]);

//Dialog states
const confirmationMessage = ref('');
const showConfirmationDialog = ref(false);
const onConfirmAction = ref(() => {
});
const showNewVehicleDialog = ref(false);
const newVehicle = ref(new Vehicle());

function loadClientData() {
  if (authenticationStore.user.id) {
    return profileService.getProfileByUserId(authenticationStore.user.id).then(client => {
      workshopClient.value = new Profile(client.data);
    });
  }
}

function loadVehiclesData() {
  return vehicleService.getByUserId(workshopClient.value.id).then(response => {
    const vehiclesData = response.data;
    vehicles.value = createVehicleListFromResponseData(vehiclesData);
  }).catch(error => {
    console.error('Error loading vehicles:', error);
  });
}

function createVehicleListFromResponseData(vehiclesData) {
  return vehiclesData.map(vehicleData => new Vehicle(vehicleData));
}

function startVehicleRegistration() {
  newVehicle.value = new Vehicle();
  showNewVehicleDialog.value = true;
}

function registerNewVehicle(vehicle) {
  vehicle.userId = userId.value;
  vehicleService.postVehicle(vehicle).then(() => {
    loadVehiclesData();
    showNewVehicleDialog.value = false;
  }).catch(error => {
    console.error('Error creating vehicle:', error);
  });
}

function onConfirm() {
  showConfirmationDialog.value = false;
  if (typeof onConfirmAction.value === 'function') {
    onConfirmAction.value();
  }
}

function onDismiss() {
  showConfirmationDialog.value = false;
}

function viewVehicleDetail(vehicle) {
  router.push(`/vehicle/${vehicle.id}`);
}

onMounted(async () => {
  try {
    await loadClientData();
    await loadVehiclesData();
  } catch (error) {
    console.error("Error loading data:", error);
    toast.add({
      severity: 'error', summary: 'Data loading failed', detail: 'An error occurred while loading data', life: 3000 });
  } finally {}
});
</script>

<template>
  <main>
    <div class="section-header">
      <h2 class="section-title">Vehicles:</h2>
      <pv-button label="+ New vehicle" @click="startVehicleRegistration"/>
    </div>

    <div class="client-cars-container">
      <vehicle-item v-for="(vehicle, index) in vehicles" :key="vehicle.id" :vehicle="vehicle" :index="index + 1"
                    @selectedVehicle="viewVehicleDetail(vehicle)"/>
    </div>

    <ConfirmationDialog v-if="showConfirmationDialog" :message="confirmationMessage" @confirm="onConfirm"
                        @dismiss="onDismiss"/>

    <NewVehicleDialog v-if="showNewVehicleDialog" @save="registerNewVehicle" @cancel="showNewVehicleDialog = false"/>
  </main>
</template>

<style scoped>
.client-info-fields {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 3rem;
}

.full-width {
  width: 100%;
  font-size: 1.3rem;
  color: #004B86;
}

label {
  font-size: 1.4rem;
  color: #004B86;
}

.section-title {
  font-size: 2.7rem;
  font-weight: 500;
  margin-left: 2rem;
  color: #004B86;
}

.section-header {
  margin: 2rem 2rem;
  display: flex;
  justify-content: space-between;
}

.client-cars-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1.5rem;
  padding: 1rem;
  border: 2px solid #78B4FF;
  background-color: #EBF7FF;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 75, 134, 0.1);
}

.client-info-actions {
  display: flex;
  justify-content: space-around;
  max-height: 50px;
}

.button {
  min-width: 50px;
  min-height: 50px;
  transition: background-color 0.3s ease;
}

.button.p-button-primary {
  background-color: #006DFF;
  color: white;
  border-radius: 30px;
}

.button.p-button-primary:hover {
  background-color: #004B86;
}

.button.p-button-danger {
  background-color: #FF6F6F;
  color: white;
  border-radius: 30px;
}

.button.p-button-danger:hover {
  background-color: #FF4C4C;
}

@media (max-width: 768px) {
  .client-info-container {
    grid-template-columns: 1fr;
  }

  .client-info-fields {
    grid-template-columns: 1fr;
  }

  .client-cars-container {
    grid-template-columns: 1fr;
  }
}
</style>