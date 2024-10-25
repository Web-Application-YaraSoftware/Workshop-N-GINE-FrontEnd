<script setup>
import { ref, watch } from 'vue';
import { useToast } from "primevue/usetoast";
import { InterventionState } from "../model/intervention-state.enum.js";
import {Intervention} from "../model/intervention.entity.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
  },
  mechanics: {
    type: Array,
    required: false,
  },
  vehicles: {
    type: Array,
    required: false,
  },
  isOwner: Boolean,
});

const emit = defineEmits(['updateIntervention']);
const toast = useToast();

const formValues = ref({
  dni: '',
  firstName: '',
  lastName: '',
  licensePlate: '',
  brand: '',
  model: '',
  modality: '',
  scheduledDate: null,
  leadMechanic: '',
  description: ''
});

const errors = ref({});

const MAX_CHARACTERS = {
  licensePlate: 10,
  brand: 30,
  model: 30,
  description: 200
};

const updateBrandAndModel = (licensePlate) => {
  const selectedVehicle = props.vehicles.find(vehicle => vehicle.licensePlate === licensePlate);
  if (selectedVehicle) {
    formValues.value.brand = selectedVehicle.brand;
    formValues.value.model = selectedVehicle.model;
  }
};

watch(() => formValues.value.licensePlate, updateBrandAndModel);

watch(() => props.intervention, (newValue) => {
  if (newValue) {
    const leadMechanic = props.mechanics.find(m => m.id === newValue.mechanicLeaderId);
    formValues.value = {
      dni: newValue?.vehicle?.owner?.dni || '',
      firstName: newValue?.vehicle?.owner?.firstName || '',
      lastName: newValue?.vehicle?.owner?.lastName || '',
      licensePlate: newValue?.vehicle?.licensePlate || '',
      brand: newValue?.vehicle?.brand || '',
      model: newValue?.vehicle?.model || '',
      modality: newValue?.interventionType || '',
      scheduledDate: newValue?.registrationDate ? new Date(newValue.registrationDate) : null,
      leadMechanic: leadMechanic ? leadMechanic.id : '',
      description: newValue?.description || '',
    };
  }
}, {immediate: true});

const validateForm = () => {
  let valid = true;
  errors.value = {};

  if (!formValues.value.licensePlate || formValues.value.licensePlate.length > MAX_CHARACTERS.licensePlate) {
    errors.value.licensePlate = `License Plate must be less than ${MAX_CHARACTERS.licensePlate} characters`;
    valid = false;
  }

  if (!formValues.value.brand) {
    errors.value.brand = 'Brand is required';
    valid = false;
  }

  if (!formValues.value.model) {
    errors.value.model = 'Model is required';
    valid = false;
  }

  if (!formValues.value.modality) {
    errors.value.modality = 'Modality is required';
    valid = false;
  }

  if (!formValues.value.scheduledDate) {
    errors.value.scheduledDate = 'Scheduled Date is required';
    valid = false;
  }

  if (!formValues.value.leadMechanic) {
    errors.value.leadMechanic = 'Lead Mechanic is required';
    valid = false;
  }

  if (!formValues.value.description || formValues.value.description.length > MAX_CHARACTERS.description) {
    errors.value.description = `Description must be less than ${MAX_CHARACTERS.description} characters`;
    valid = false;
  }

  return valid;
};

const updateInterventionInformation = () => {
  if (!validateForm()) {
    showToast('Please fill all required fields correctly.', 'warn');
    return;
  }

  if (props.intervention?.state === InterventionState.PENDING) {
    const updatedIntervention = {
      ...props.intervention,
      vehicle: {
        ...props.intervention?.vehicle,
        licensePlate: formValues.value.licensePlate,
        brand: formValues.value.brand,
        model: formValues.value.model,
        owner: {
          ...props.intervention?.vehicle.owner,
          dni: formValues.value.dni,
          firstName: formValues.value.firstName,
          lastName: formValues.value.lastName,
        },
      },
      interventionType: formValues.value.modality,
      registrationDate: formValues.value.scheduledDate,
      description: formValues.value.description,
      mechanicLeaderId: formValues.value.leadMechanic,
    };
    emit('updateIntervention', updatedIntervention);
  } else {
    showToast('Cannot update an intervention that is not in PENDING state.', 'warn');
  }
};

const showToast = (message, severity = 'info') => {
  toast.add({
    severity,
    summary: message,
    life: 4000,
  });
};
</script>

<template>
  <div class="center-form-container">
    <pv-toast></pv-toast>
    <form @submit.prevent="updateInterventionInformation" class="intervention-form">
      <div class="inputs-container">
        <pv-floatlabel v-if="isOwner" class="form-field">
          <pv-inputtext id="dni" v-model="formValues.dni" disabled/>
          <label for="dni">DNI</label>
        </pv-floatlabel>

        <pv-floatlabel v-if="isOwner" class="form-field">
          <pv-inputtext id="firstName" v-model="formValues.firstName" disabled/>
          <label for="firstName">First Name</label>
        </pv-floatlabel>

        <pv-floatlabel v-if="isOwner" class="form-field">
          <pv-inputtext id="lastName" v-model="formValues.lastName" disabled/>
          <label for="lastName">Last Name</label>
        </pv-floatlabel>

        <pv-floatlabel v-if="isOwner" class="form-field">
          <pv-select id="licensePlate" v-model="formValues.licensePlate"
                     :options="vehicles.map(vehicle => vehicle.licensePlate)"/>
          <label for="licensePlate">License Plate</label>
        </pv-floatlabel>

        <pv-floatlabel v-if="isOwner" class="form-field">
          <pv-inputtext id="brand" v-model="formValues.brand"/>
          <label for="brand">Brand</label>
        </pv-floatlabel>

        <pv-floatlabel v-if="isOwner" class="form-field">
          <pv-inputtext id="model" v-model="formValues.model"/>
          <label for="model">Model</label>
        </pv-floatlabel>

        <pv-floatlabel class="form-field">
          <pv-select id="modality" v-model="formValues.modality" :options="['Reparation', 'Maintenance']"/>
          <label for="modality">Modality</label>
        </pv-floatlabel>

        <pv-floatlabel class="form-field">
          <pv-datepicker id="scheduledDate" v-model="formValues.scheduledDate" dateFormat="yy-mm-dd" showIcon/>
          <label for="scheduledDate">Scheduled Date</label>
        </pv-floatlabel>

        <pv-floatlabel class="form-field">
          <pv-select id="leadMechanic" v-model="formValues.leadMechanic"
                     :options="mechanics.map(mechanic => ({ label: mechanic.firstName + ' ' + mechanic.lastName, value: mechanic.id }))"
                     option-label="label" option-value="value"/>
          <label for="leadMechanic">Lead Mechanic</label>
        </pv-floatlabel>

        <pv-floatlabel class="form-field">
          <pv-textarea id="description" v-model="formValues.description" rows="4"/>
          <label for="description">Description</label>
        </pv-floatlabel>
      </div>

      <div class="button-container">
        <pv-button label="Save" icon="pi pi-save" type="submit" class="p-button-rounded p-button-primary"></pv-button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.intervention-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  width: 100%;
  margin: auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.inputs-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-field {
  width: 100%;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.p-button-rounded {
  padding: 10px 20px;
  font-size: 1.2rem;
}

.center-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .inputs-container {
    grid-template-columns: 1fr;
  }
}
</style>
