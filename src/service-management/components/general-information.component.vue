<script setup>
import {computed, onMounted, ref, watch, watchEffect} from 'vue';
import {useWorkshopStore} from "../../shared/services/workshop-store.js";
import { Intervention } from "../model/intervention.entity.js";
import {Client} from "../../cmr/model/client.entity.js";
import {InterventionType} from "../model/intervention-type.enum.js";
import {Role} from "../../iam/model/role.enum.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  },
  client: {
    type: Client,
    required: true,
    default: new Client()
  },
  mechanics: {
    type: Array,
    required: true,
    default: [],
  },
  clientVehicles: {
    type: Array,
    required: true,
    default: [],
  }
});
const emit = defineEmits(['update:intervention']);
const workshopStore = useWorkshopStore();
const isNotAvailable = ref(false);
const areThereChanges = computed(() => {
  return props.intervention?.vehicleId !== currentVehicleId.value ||
      props.intervention?.registrationDate !== currentRegistrationDate.value ||
      props.intervention?.interventionType !== currentInterventionType.value ||
      props.intervention?.mechanicLeaderId !== currentMechanicId.value ||
      props.intervention?.description !== currentDescription.value
});
const minDate = new Date(new Date());
const currentVehicle = ref();
const currentVehicleId = ref();
const currentRegistrationDate = ref();
const currentInterventionType = ref();
const currentMechanicId = ref();
const currentDescription = ref();
const interventionTypes = ref([
  {value: InterventionType.MAINTENANCE, label: InterventionType.getName(InterventionType.MAINTENANCE)},
  {value: InterventionType.REPARATION, label: InterventionType.getName(InterventionType.REPARATION)},
]);

onMounted(() => {
  verifyRole();
});

watchEffect(() => {
  if (props.intervention && props.clientVehicles) {
    currentVehicle.value = props.clientVehicles.find(vehicle => vehicle.id === props.intervention?.vehicleId);
  }
  if (props.intervention) {
    currentInterventionType.value = props.intervention?.interventionType;
    currentRegistrationDate.value = props.intervention?.registrationDate;
    currentMechanicId.value = props.intervention?.mechanicLeaderId;
    currentDescription.value = props.intervention?.description;
  }
});

watch(() => currentVehicle.value, (newValue) => {
  if (newValue) {
    currentVehicleId.value = newValue.id;
  }
});

watch(() => currentVehicleId.value, (newValue) => {
  if (newValue) {
    currentVehicle.value = props.clientVehicles.find(vehicle => vehicle.id === newValue);
  }
});

function onSubmit() {
  const updatedIntervention = {
    ...props.intervention,
    vehicleId: currentVehicleId.value,
    registrationDate: currentRegistrationDate.value,
    interventionType: currentInterventionType.value,
    mechanicLeaderId: currentMechanicId.value,
    description: currentDescription.value,
  };
  emit('update:intervention', updatedIntervention);
}

function verifyRole() {
  isNotAvailable.value = workshopStore.role !== Role.WORKSHOP_OWNER;
}

</script>

<template>
  <div>
    <pv-toast/>
    <form class="form" @submit.prevent="onSubmit">
      <div class="form-content">
        <pv-inputgroup>
          <pv-inputgroupaddon>DNI</pv-inputgroupaddon>
          <pv-inputtext :value="client.dni" disabled/>
        </pv-inputgroup>
        <pv-inputgroup>
          <pv-inputgroupaddon>Full name</pv-inputgroupaddon>
          <pv-inputtext :value="client.fullName" disabled/>
        </pv-inputgroup>
        <pv-inputgroup>
          <pv-inputgroupaddon>License Plate</pv-inputgroupaddon>
          <pv-select
              v-model="currentVehicleId"
              :options="clientVehicles"
              optionLabel="licensePlate"
              optionValue="id"
              :disabled="isNotAvailable"
          >
            <template #option="{ option }">
              <span>{{ option.licensePlate }}</span>
            </template>
          </pv-select>
        </pv-inputgroup>
        <pv-inputgroup>
          <pv-inputgroupaddon>Brand and Model</pv-inputgroupaddon>
          <pv-inputtext :value="currentVehicle?.fullName" disabled/>
        </pv-inputgroup>
        <pv-inputgroup>
          <pv-inputgroupaddon>Intervention Type</pv-inputgroupaddon>
          <pv-select
              v-model="currentInterventionType"
              :options="interventionTypes"
              optionLabel="label"
              optionValue="value"
              :disabled="isNotAvailable"/>
        </pv-inputgroup>
        <pv-inputgroup>
          <pv-inputgroupaddon>Scheduled Date</pv-inputgroupaddon>
          <pv-datepicker
              v-model="currentRegistrationDate"
              :minDate="minDate"
              showButtonBar
              showIcon
              iconDisplay="input"
              showTime
              hourFormat="12"
              fluid
              :disabled="isNotAvailable"/>
        </pv-inputgroup>
        <pv-inputgroup>
          <pv-inputgroupaddon>Lead Mechanic</pv-inputgroupaddon>
          <pv-select
              v-model="currentMechanicId"
              :options="mechanics"
              optionValue="id"
              showClear
              filter
              optionLabel="fullName"
              placeholder="Select a mechanic"
              :disabled="isNotAvailable"
          >
            <template #option="slotPros">
              {{ slotPros.option.fullName }}
            </template>
          </pv-select>
        </pv-inputgroup>
        <pv-inputgroup>
          <pv-inputgroupaddon>Description</pv-inputgroupaddon>
          <pv-textarea
              style="width: 100%;"
              v-model="currentDescription"
              rows="1"
              :disabled="isNotAvailable"/>
        </pv-inputgroup>
      </div>
      <div class="form-submit" v-if="!isNotAvailable && areThereChanges">
        <pv-button label="Save" icon="pi pi-save" type="submit"/>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form {
  display: grid;
  gap: 20px;
}

.form-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-submit {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .form-content {
    grid-template-columns: 1fr;
  }
}
</style>