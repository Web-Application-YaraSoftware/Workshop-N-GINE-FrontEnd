<script setup>
import {onMounted, ref, watch} from 'vue';
import {VehiclesService} from '../../cmr/services/vehicles.service.js';
import {ProfilesService} from "../../profile-management/services/profiles.service.js";
import {WorkshopService} from "../services/workshop.service.js";
import {Vehicle} from "../model/vehicle.entity.js";
import {useAuthStore} from "../../iam/services/auth-store.js";
import {Profile} from "../../profile-management/model/profile.entity.js";

const vehiclesService = new VehiclesService();
const profilesService = new ProfilesService();
const workshopService = new WorkshopService();
const authStore = useAuthStore();

const minDate = ref(new Date());
const visible = ref(false);
const newIntervention = ref({
  vehicleId: null,
  mechanicLeaderId: null,
  scheduledAt: '',
  description: '',
  workshopId: null
});
const clientDni = ref(0);
const userId = ref(0);
const vehicles = ref([]);
const mechanics = ref([]);

const selectedVehicle = ref(null);
const selectedMechanic = ref(null);
const selectedDate = ref(null);
const description = ref(null);

const emit = defineEmits(['close', 'submit']);

onMounted(() => {
  getMechanics();
});

watch(clientDni, (newValue) => {
  if (newValue) {
    getClientByDni();
  }
}, {immediate: false});

watch(userId, (newValue) => {
  if (newValue) {
    getVehicles();
  }
}, {immediate: false});

watch(() => visible, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

function getVehicles(){
  if(!userId.value) return;
  vehiclesService.getByUserId(userId.value)
      .then(response => {
        if (response.data) {
          vehicles.value = buildVehicleFromResponseData(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching client vehicles:', error);
      });
}

function buildVehicleFromResponseData(data){
  return data.map(vehicle => new Vehicle(vehicle));
}

function getClientByDni(){
  if(!isValidDNINumber(clientDni.value)) return;
  profilesService.getByDNI(clientDni.value)
      .then(response => {
        if (response.data) {
          userId.value = response.data.userId;
        }
      })
      .catch(error => {
        console.error('Error fetching client by DNI:', error);
      });
}

function isValidDNINumber(dni){
  return dni.length === 8;
}

function getMechanics(){
  workshopService.getMechanicsUserIdByWorkshopId(authStore.user.workshopId)
      .then(response => {
        if (response.data) {
          getMechanicsProfiles(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching mechanics user ids:', error);
      });
}

function getMechanicsProfiles(userIds){
  const profilePromises = userIds.map(userId => profilesService.getProfileByUserId(userId));
  Promise.all(profilePromises)
      .then(profiles => {
        mechanics.value = profiles.map(profile => mechanicFromResponseData(profile.data));
      })
      .catch(error => {
        console.error('Error fetching mechanics profiles:', error);
      });
}

function mechanicFromResponseData(data){
  return new Profile(data);
}

const closeDialog = () => {emit('close');};

const submitForm = () => {
  if (!isValidForm()) return;
  setInterventionData();
  console.log(newIntervention.value);
  emit('submit', newIntervention.value);
  resetForm();
};

function setInterventionData(){
  newIntervention.value.vehicleId = selectedVehicle.value.id;
  newIntervention.value.mechanicLeaderId = selectedMechanic.value.userId;
  newIntervention.value.scheduledAt = selectedDate.value.toISOString();
  newIntervention.value.description = description.value;
  newIntervention.value.workshopId = authStore.user.workshopId;
}

const resetForm = () => {
  clientDni.value = 0;
  selectedVehicle.value = null;
  selectedMechanic.value = null;
  selectedDate.value = null;
  description.value = null;
  newIntervention.value = {
    vehicleId: null,
    mechanicLeaderId: null,
    scheduledAt: '',
    description: ''
  };
  vehicles.value = [];
};

function isValidForm(){
  return selectedVehicle && selectedMechanic && selectedDate && description;
}
</script>

<template>
  <pv-dialog class="new-intervention-dialog" v-model:visible="visible" header="New Intervention" :modal="true" :closable="true" @hide="closeDialog">
    <section class="form">
      <pv-inputtext v-model="clientDni" type="number" placeholder="Client document No"/>
      <pv-select v-model="selectedVehicle" :options="vehicles" optionLabel="licensePlate" placeholder="License plate"/>
      <pv-datepicker v-model="selectedDate" placeholder="Select Date" showTime hourFormat="12" fluid :minDate="minDate" showButtonBar/>
      <pv-select v-model="selectedMechanic" :options="mechanics" optionLabel="fullName" placeholder="Mechanic leader" required/>
      <pv-textarea v-model="description" placeholder="Description" required/>
    </section>
    <template #footer>
      <section class="footer">
        <pv-button label="Schedule" icon="pi pi-check" @click="submitForm"/>
        <pv-button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="closeDialog"/>
      </section>
    </template>
  </pv-dialog>
</template>

<style scoped>
.form {
  width: 250px;
  font-size: 1rem;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
