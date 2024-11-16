<script setup>
import { ref, watch } from 'vue';
import { ClientsService } from '../../cmr/services/clients.service.js';
import { VehiclesService } from '../../cmr/services/vehicles.service.js';

const visible = ref(false);
const clientsService = new ClientsService();
const vehiclesService = new VehiclesService();
const newIntervention = ref({
  clientId: null,
  vehicleId: null,
  mechanicLeaderId: null,
  registrationDate: '',
  modality: '',
  description: ''
});

const clientVehicles = ref([]);
const clientDni = ref('');
const mechanicOptions = ref([
  {id: 1, name: 'Mechanic A'},
  {id: 2, name: 'Mechanic B'}
]);

const emit = defineEmits(['close', 'submit']);

// Watch for visibility prop from parent
watch(() => visible, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

// Close the dialog
const closeDialog = () => {
  emit('close');
};

// Submit the form
const submitForm = () => {
  emit('submit', newIntervention.value);
  resetForm();
};

// Fetch client data by DNI
const fetchClientByDni = async () => {
  if (clientDni.value) {
    try {
      const clientResponse = await clientsService.getByDocument(clientDni.value);
      const client = clientResponse.data[0];
      newIntervention.value.clientId = client.id;

      // Fetch the vehicles owned by this client
      const vehiclesResponse = await vehiclesService.getByUserId(client.id);
      clientVehicles.value = vehiclesResponse.data;
    } catch (error) {
      console.error('Error fetching client or vehicles:', error);
      clientVehicles.value = [];
    }
  }
};

// Reset the form to default state
const resetForm = () => {
  newIntervention.value = {
    clientId: null,
    vehicleId: null,
    mechanicLeaderId: null,
    registrationDate: '',
    modality: '',
    description: ''
  };
  clientVehicles.value = [];
  clientDni.value = '';
};
</script>

<template>
  <pv-dialog class="new-intervention-dialog" v-model:visible="visible" header="New Intervention" :modal="true" :closable="true" @hide="closeDialog">
    <section class="form">
      <pv-inputtext v-model="clientDni" placeholder="Client document No" @blur="fetchClientByDni" required/>
      <pv-select v-model="newIntervention.vehicleId" :options="clientVehicles" optionLabel="license_plate"
                 placeholder="License plate" required/>
      <pv-inputtext v-model="newIntervention.modality" placeholder="Modality" required/>
      <pv-datepicker v-model="newIntervention.registrationDate" placeholder="Select Date" required/>
      <pv-select v-model="newIntervention.mechanicLeaderId" :options="mechanicOptions" optionLabel="name"
                 placeholder="Mechanic leader" required/>
      <pv-textarea v-model="newIntervention.description" placeholder="Description" required/>
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
