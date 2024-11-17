<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { Intervention } from "../model/intervention.entity.js";
import { Profile } from "../../profile-management/model/profile.entity.js";
import { InterventionType } from "../model/intervention-type.enum.js";
import { Role } from "../../iam/model/role.enum.js";
import { useAuthStore } from "../../iam/services/auth-store.js";

const props = defineProps({
  intervention: {
    type: Intervention,
    required: true,
    default: new Intervention()
  },
  client: {
    type: Profile,
    required: true,
    default: new Profile()
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
const authStore = useAuthStore();
const isNotAvailable = ref(false);
const areThereChanges = computed(() => {
  return props.intervention?.vehicleId !== currentVehicleId.value ||
      props.intervention?.scheduledDate.getTime() !== currentScheduledDate.value.getTime() ||
      props.intervention?.type !== currentInterventionType.value ||
      props.intervention?.mechanicLeaderId !== currentMechanicId.value ||
      props.intervention?.description !== currentDescription.value;
});
const minDate = new Date();
const currentVehicle = ref();
const currentVehicleId = ref();
const currentScheduledDate = ref();
const currentInterventionType = ref();
const currentMechanicId = ref();
const currentDescription = ref();
const interventionTypes = ref([
  { value: InterventionType.MAINTENANCE, label: InterventionType.getName(InterventionType.MAINTENANCE) },
  { value: InterventionType.REPARATION, label: InterventionType.getName(InterventionType.REPARATION) },
]);

onMounted(() => {
  verifyRole();
});

watchEffect(() => {
  if (props.intervention && props.clientVehicles) {
    currentVehicle.value = props.clientVehicles.find(vehicle => vehicle.id === props.intervention?.vehicleId);
  }
  if (props.intervention) {
    currentInterventionType.value = props.intervention?.type;
    currentScheduledDate.value = new Date(props.intervention?.scheduledDate);
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
    vehicleId: currentVehicleId.value,
    mechanicLeaderId: currentMechanicId.value,
    description: currentDescription.value,
    type: InterventionType[currentInterventionType.value],
    scheduledAt: currentScheduledDate.value.toISOString()
  };

  emit('update:intervention', updatedIntervention);
}

function verifyRole() {
  isNotAvailable.value = authStore.user.roleId === Role.WORKSHOP_OWNER;
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
          <pv-inputtext :value="`${currentVehicle?.brand} ${currentVehicle?.model}`" disabled/>
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
              v-model="currentScheduledDate"
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
  padding: 20px;
  background-color: #f9fafe;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

  .form-submit {
    justify-content: center;
  }
}

.pv-inputgroup {
  display: flex;
  flex-direction: column;
}

.pv-inputgroupaddon {
  font-size: 0.9rem;
  font-weight: bold;
  color: #555;
}

.pv-inputtext,
.pv-select,
.pv-datepicker,
.pv-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.pv-inputtext:disabled,
.pv-select:disabled,
.pv-datepicker:disabled,
.pv-textarea:disabled {
  background-color: #f0f0f0;
  color: #888;
  cursor: not-allowed;
}

.pv-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.pv-button:hover {
  background-color: #0056b3;
}

.pv-button:disabled {
  background-color: #ccc;
  color: #888;
  cursor: not-allowed;
}
</style>
