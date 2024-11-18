<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {VehicleService} from "../services/vehicle.service.js";
import ConfirmationDialog from "../../shared/components/confirmation-dialog.component.vue";
import NewVehicleDialog from "../components/new-vehicle-dialog.component.vue";
import VehicleItem from "../components/vehicle-item.component.vue";
import {Vehicle} from "../model/vehicle.entity.js";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {useToast} from "primevue/usetoast";

//Router and services
const router = useRouter();
const vehicleService = new VehicleService();
const authenticationStore = useAuthStore();
const toast = useToast();

//Reactive state
const userId = authenticationStore.user.id;

const vehicles = ref([]);

//Dialog states
const confirmationMessage = ref('');
const showConfirmationDialog = ref(false);
const onConfirmAction = ref(() => {
});
const showNewVehicleDialog = ref(false);
const newVehicle = ref(new Vehicle());


function getVehicles() {
  return vehicleService.getByUserId(userId).then(response => {
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
  const newImage = setRandomImage();
  const response = {
    'licensePlate': vehicle.licensePlate,
    'brand': vehicle.brand,
    'model': vehicle.model,
    'image': newImage,
    "userId": userId
  }
  vehicleService.postVehicle(response)
      .then(() => {
        getVehicles();
        showNewVehicleDialog.value = false;
        toast.add({severity: 'success', summary: 'Vehicle registered', detail: 'The vehicle was successfully registered', life: 3000 });
  })
      .catch(error => {
        console.error('Error registering vehicle:', error);
        toast.add({severity: 'error', summary: 'Vehicle registration failed', detail: 'An error occurred while registering the vehicle', life: 3000 });
  });
}

function setRandomImage(){
  const images = [
      'https://img.freepik.com/vector-premium/dibujos-animados-cabriolet-rojo-coche-verano-moda-techo-plano_151150-4733.jpg',
      'https://img.freepik.com/vector-premium/dibujos-animados-elegante-cabriolet-coche-verano-estilo-objeto-color-plano-techo-vehiculo-personal-moda-aislado-sobre-fondo-blanco-vista-lateral-lujoso-automovil-nuevo_151150-4632.jpg',
      'https://img.freepik.com/vector-premium/ilustracion-dibujos-animados-cabriolet-blanco-coche-verano-elegante-objeto-color-techo-vehiculo-transporte-lujo-automovil-personal-estilo-sobre-fondo-blanco_151150-2408.jpg',
      'https://img.freepik.com/vector-premium/vista-lateral-coche-azul-puerta-abierta-nuevo-automovil-moderno-automovil-puerta-trasera-vehiculo-carretera-ilustracion-vector-dibujos-animados-planos-transporte-motor-aislado-sobre-fondo-blanco_198278-13750.jpg?w=360'
  ];
  return images[Math.floor(Math.random() * images.length)];
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

onMounted(() => {
  getVehicles();
});
</script>

<template>
  <main>
    <pv-toast/>
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